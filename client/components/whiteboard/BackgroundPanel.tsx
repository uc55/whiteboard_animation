import { CanvasBackground } from "@/pages/Whiteboard";

interface BackgroundPanelProps {
  background: CanvasBackground;
  onBackgroundChange: (background: CanvasBackground) => void;
}

export default function BackgroundPanel({
  background,
  onBackgroundChange,
}: BackgroundPanelProps) {
  return (
    <div className="space-y-4">
      <h3 className="text-sm font-semibold text-white mb-3">Canvas Background</h3>

      <div>
        <label className="text-xs text-slate-400 block mb-2">Type</label>
        <div className="flex gap-2">
          <button
            onClick={() =>
              onBackgroundChange({ ...background, type: "color" })
            }
            className={`flex-1 px-3 py-2 rounded text-sm font-medium transition-colors ${
              background.type === "color"
                ? "bg-cyan-500/20 border border-cyan-400 text-cyan-300"
                : "bg-slate-800 border border-slate-600 text-slate-300 hover:border-slate-500"
            }`}
          >
            Color
          </button>
          <button
            onClick={() =>
              onBackgroundChange({ ...background, type: "image" })
            }
            className={`flex-1 px-3 py-2 rounded text-sm font-medium transition-colors ${
              background.type === "image"
                ? "bg-cyan-500/20 border border-cyan-400 text-cyan-300"
                : "bg-slate-800 border border-slate-600 text-slate-300 hover:border-slate-500"
            }`}
          >
            Image
          </button>
        </div>
      </div>

      {background.type === "color" && (
        <div>
          <label className="text-xs text-slate-400 block mb-2">Color</label>
          <div className="flex gap-2">
            <input
              type="color"
              value={background.color || "#ffffff"}
              onChange={(e) =>
                onBackgroundChange({ ...background, color: e.target.value })
              }
              className="flex-1 h-10 rounded cursor-pointer"
            />
            <input
              type="text"
              value={background.color || "#ffffff"}
              onChange={(e) =>
                onBackgroundChange({ ...background, color: e.target.value })
              }
              className="flex-1 bg-slate-800 border border-slate-600 rounded px-3 py-2 text-white text-sm focus:outline-none focus:border-cyan-400"
              placeholder="#ffffff"
            />
          </div>
        </div>
      )}

      {background.type === "image" && (
        <div>
          <label className="text-xs text-slate-400 block mb-2">Image URL</label>
          <input
            type="text"
            value={background.imageUrl || ""}
            onChange={(e) =>
              onBackgroundChange({ ...background, imageUrl: e.target.value })
            }
            className="w-full bg-slate-800 border border-slate-600 rounded px-3 py-2 text-white text-sm focus:outline-none focus:border-cyan-400"
            placeholder="https://example.com/image.jpg"
          />
          <p className="text-xs text-slate-500 mt-2">
            Enter a valid image URL
          </p>
        </div>
      )}
    </div>
  );
}
