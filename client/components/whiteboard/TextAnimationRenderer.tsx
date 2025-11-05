import { useState, useEffect, useRef } from "react";
import { WhiteboardElement } from "@/pages/Whiteboard";
import { Play, Pause, RotateCcw, X } from "lucide-react";
import { Button } from "@/components/ui/button";

interface TextAnimationRendererProps {
  element: WhiteboardElement;
}

export default function TextAnimationRenderer({
  element,
}: TextAnimationRendererProps) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [progress, setProgress] = useState(0);
  const animationRef = useRef<NodeJS.Timeout | null>(null);
  const startTimeRef = useRef<number>(0);
  const pathsRef = useRef<SVGPathElement[]>([]);

  const duration = (element.animation?.duration || 3) * 1000;
  const fontSize = element.fontSize || 16;
  const fontWeight = element.fontWeight || 400;
  const color = element.color || "#1f2937";

  // Create SVG paths for each character
  const createTextPath = (text: string, fontSize: number): string => {
    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");
    if (!ctx) return "";

    ctx.font = `${fontWeight} ${fontSize}px Inter, sans-serif`;
    const metrics = ctx.measureText(text);

    canvas.width = Math.ceil(metrics.width + 20);
    canvas.height = fontSize + 20;

    ctx.font = `${fontWeight} ${fontSize}px Inter, sans-serif`;
    ctx.fillStyle = color;
    ctx.fillText(text, 10, fontSize + 5);

    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    const data = imageData.data;

    const points: [number, number][] = [];
    for (let i = 0; i < data.length; i += 4) {
      if (data[i + 3] > 128) {
        const pixelIndex = i / 4;
        const x = pixelIndex % canvas.width;
        const y = Math.floor(pixelIndex / canvas.width);
        points.push([x, y]);
      }
    }

    if (points.length === 0) return "";

    // Create path from points
    let pathData = `M ${points[0][0]} ${points[0][1]}`;
    for (let i = 1; i < points.length; i++) {
      const dx = points[i][0] - points[i - 1][0];
      const dy = points[i][1] - points[i - 1][1];
      if (Math.abs(dx) < 5 && Math.abs(dy) < 5) {
        pathData += ` L ${points[i][0]} ${points[i][1]}`;
      }
    }

    return pathData;
  };

  useEffect(() => {
    if (!isPlaying || !showModal) {
      if (animationRef.current) {
        clearTimeout(animationRef.current);
      }
      return;
    }

    startTimeRef.current = Date.now();

    const updateAnimation = () => {
      const elapsed = Date.now() - startTimeRef.current;
      const newProgress = Math.min(elapsed / duration, 1);
      setProgress(newProgress);

      if (newProgress >= 1) {
        setIsPlaying(false);
      } else {
        animationRef.current = setTimeout(updateAnimation, 16);
      }
    };

    animationRef.current = setTimeout(updateAnimation, 16);

    return () => {
      if (animationRef.current) {
        clearTimeout(animationRef.current);
      }
    };
  }, [isPlaying, showModal, duration]);

  const handlePlay = () => {
    if (progress >= 1 || progress === 0) {
      setProgress(0);
      setShowModal(true);
    }
    setIsPlaying(!isPlaying);
    setShowModal(!showModal);
  };

  const handleReset = () => {
    setIsPlaying(false);
    setProgress(0);
  };

  const handleClose = () => {
    setShowModal(false);
    setIsPlaying(false);
    setProgress(0);
  };

  return (
    <div className="space-y-3">
      <div className="space-y-2">
        <div className="flex items-center gap-2">
          <div className="flex-1 bg-slate-700 h-1 rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-cyan-400 to-blue-500 transition-all"
              style={{ width: `${progress * 100}%` }}
            />
          </div>
          <span className="text-xs text-slate-400">
            {Math.round(progress * 100)}%
          </span>
        </div>

        <div className="flex gap-2">
          <Button
            size="sm"
            variant="outline"
            onClick={handlePlay}
            className="flex-1 flex items-center justify-center gap-1"
          >
            {isPlaying ? (
              <>
                <Pause className="h-3 w-3" />
                <span className="hidden sm:inline">Pause</span>
              </>
            ) : (
              <>
                <Play className="h-3 w-3" />
                <span className="hidden sm:inline">Play</span>
              </>
            )}
          </Button>
          <Button
            size="sm"
            variant="outline"
            onClick={handleReset}
            className="flex items-center gap-1"
          >
            <RotateCcw className="h-3 w-3" />
            <span className="hidden sm:inline">Reset</span>
          </Button>
        </div>
      </div>

      {/* Modal Popup */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-700 rounded-lg p-6 shadow-2xl max-w-2xl w-full">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-white">
                Text Animation Preview
              </h3>
              <button
                onClick={handleClose}
                className="text-slate-400 hover:text-white transition-colors"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="bg-slate-800/50 border border-slate-600 rounded p-8 flex items-center justify-center min-h-80">
              <svg
                width="100%"
                height="300"
                viewBox="0 0 600 300"
                className="drop-shadow-lg"
              >
                <defs>
                  <style>{`
                    .anim-text {
                      font-size: ${fontSize}px;
                      font-weight: ${fontWeight};
                      fill: none;
                      stroke: ${color};
                      stroke-width: 2;
                      stroke-linecap: round;
                      stroke-linejoin: round;
                      stroke-dasharray: 1000;
                      stroke-dashoffset: ${1000 - progress * 1000};
                      transition: stroke-dashoffset 0.016s linear;
                    }
                  `}</style>
                </defs>

                <text x="50" y="150" className="anim-text">
                  {element.content}
                </text>
              </svg>
            </div>

            <div className="mt-6 space-y-2">
              <div className="flex items-center gap-2">
                <div className="flex-1 bg-slate-700 h-2 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-cyan-400 to-blue-500 transition-all"
                    style={{ width: `${progress * 100}%` }}
                  />
                </div>
                <span className="text-sm text-slate-400 w-12 text-right">
                  {Math.round(progress * 100)}%
                </span>
              </div>

              <div className="flex gap-2 justify-center pt-2">
                <Button
                  size="sm"
                  onClick={handlePlay}
                  className="flex items-center gap-2"
                >
                  {isPlaying ? (
                    <>
                      <Pause className="h-4 w-4" />
                      Pause
                    </>
                  ) : (
                    <>
                      <Play className="h-4 w-4" />
                      Play
                    </>
                  )}
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={handleReset}
                  className="flex items-center gap-2"
                >
                  <RotateCcw className="h-4 w-4" />
                  Reset
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
