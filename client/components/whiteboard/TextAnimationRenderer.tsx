import { useState, useEffect, useRef } from "react";
import { WhiteboardElement } from "@/pages/Whiteboard";
import { Play, Pause, RotateCcw } from "lucide-react";
import { Button } from "@/components/ui/button";

interface TextAnimationRendererProps {
  element: WhiteboardElement;
}

export default function TextAnimationRenderer({
  element,
}: TextAnimationRendererProps) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const animationRef = useRef<NodeJS.Timeout | null>(null);
  const svgRef = useRef<SVGTextElement>(null);
  const startTimeRef = useRef<number>(0);

  const duration = (element.animation?.duration || 3) * 1000;
  const fontSize = element.fontSize || 16;
  const fontWeight = element.fontWeight || 400;
  const color = element.color || "#1f2937";

  useEffect(() => {
    if (!isPlaying) {
      if (animationRef.current) {
        clearInterval(animationRef.current);
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
        clearInterval(animationRef.current);
      }
    };
  }, [isPlaying, duration]);

  const handlePlay = () => {
    if (progress >= 1) {
      setProgress(0);
    }
    setIsPlaying(!isPlaying);
  };

  const handleReset = () => {
    setIsPlaying(false);
    setProgress(0);
  };

  const getStrokeDashoffset = (charIndex: number) => {
    const totalChars = element.content.length;
    const charProgress = progress * totalChars;
    const isVisible = charIndex < charProgress;
    return isVisible ? 0 : 100;
  };

  const getOpacity = (charIndex: number) => {
    const totalChars = element.content.length;
    const charProgress = progress * totalChars;
    return charIndex < charProgress ? 1 : 0.1;
  };

  return (
    <div className="space-y-3">
      <div className="bg-slate-800/50 border border-slate-600 rounded p-4 flex flex-col items-center gap-4">
        <svg
          width={Math.min(element.width * 0.8, 300)}
          height={Math.min(element.height * 0.8, 150)}
          className="border border-dashed border-slate-500 rounded"
          viewBox={`0 0 ${Math.min(element.width * 0.8, 300)} ${Math.min(
            element.height * 0.8,
            150
          )}`}
        >
          <defs>
            <style>{`
              .animated-text {
                font-size: ${fontSize}px;
                font-weight: ${fontWeight};
                fill: none;
                stroke: ${color};
                stroke-width: 1.5;
                stroke-linecap: round;
                stroke-linejoin: round;
              }
            `}</style>
          </defs>

          {element.content.split("").map((char, index) => (
            <text
              key={index}
              x={50 + (index % 20) * 12}
              y={40 + Math.floor(index / 20) * 30}
              className="animated-text"
              opacity={getOpacity(index)}
            >
              {char}
            </text>
          ))}
        </svg>

        <div className="w-full space-y-2">
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

          <div className="flex gap-2 justify-center">
            <Button
              size="sm"
              variant="outline"
              onClick={handlePlay}
              className="flex items-center gap-1"
            >
              {isPlaying ? (
                <>
                  <Pause className="h-3 w-3" />
                  Pause
                </>
              ) : (
                <>
                  <Play className="h-3 w-3" />
                  Play
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
              Reset
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
