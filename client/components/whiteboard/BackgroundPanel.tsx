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
          <div className="flex gap-2 relative z-50">
            <div className="relative flex-1">
              <input
                type="color"
                value={background.color || "#ffffff"}
                onChange={(e) =>
                  onBackgroundChange({ ...background, color: e.target.value })
                }
                className="w-full h-10 rounded cursor-pointer border-0 relative z-50"
                style={{
                  appearance: 'none',
                  WebkitAppearance: 'none'
                }}
              />
            </div>
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
          <label className="text-xs text-slate-400 block mb-2">Upload Image</label>
          <label className="block relative cursor-pointer">
            <div className="bg-slate-800 border border-slate-600 rounded px-4 py-3 text-center hover:border-cyan-400 transition-colors">
              <p className="text-sm text-slate-300 font-medium">
                {background.imageUrl ? "✓ Image uploaded" : "Click to select image"}
              </p>
              <p className="text-xs text-slate-500 mt-1">or drag and drop</p>
            </div>
            <input
              type="file"
              accept="image/*"
              onChange={(e) => {
                const file = e.target.files?.[0];
                if (file) {
                  const reader = new FileReader();
                  reader.onload = (event) => {
                    const imageUrl = event.target?.result as string;
                    onBackgroundChange({ ...background, imageUrl });
                  };
                  reader.readAsDataURL(file);
                }
              }}
              className="hidden"
            />
          </label>
        </div>
      )}
    </div>
  );
}
