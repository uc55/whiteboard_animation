import { Button } from "@/components/ui/button";
import { Plus, Eye, EyeOff, Trash2 } from "lucide-react";
import { Layer } from "@/pages/Whiteboard";

interface LayerPanelProps {
  layers: Layer[];
  activeLayerId: string;
  onSelectLayer: (id: string) => void;
  onAddLayer: () => void;
  onDeleteLayer: (id: string) => void;
  onToggleVisibility: (id: string) => void;
  elementCount: (layerId: string) => number;
}

export default function LayerPanel({
  layers,
  activeLayerId,
  onSelectLayer,
  onAddLayer,
  onDeleteLayer,
  onToggleVisibility,
  elementCount,
}: LayerPanelProps) {
  return (
    <div className="space-y-2">
      {layers.map((layer) => (
        <div
          key={layer.id}
          className={`p-2 rounded border cursor-pointer transition-colors ${
            activeLayerId === layer.id
              ? "bg-cyan-500/20 border-cyan-400"
              : "bg-slate-800/40 border-slate-600 hover:bg-slate-700/40"
          }`}
          onClick={() => onSelectLayer(layer.id)}
        >
          <div className="flex items-center justify-between gap-2">
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-white truncate">
                {layer.name}
              </p>
              <p className="text-xs text-slate-400">
                {elementCount(layer.id)} element{elementCount(layer.id) !== 1 ? "s" : ""}
              </p>
            </div>
            <div className="flex items-center gap-1">
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onToggleVisibility(layer.id);
                }}
                className="p-1 text-slate-400 hover:text-white transition-colors"
              >
                {layer.visible ? (
                  <Eye className="h-4 w-4" />
                ) : (
                  <EyeOff className="h-4 w-4" />
                )}
              </button>
              {layers.length > 1 && (
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onDeleteLayer(layer.id);
                  }}
                  className="p-1 text-slate-400 hover:text-red-400 transition-colors"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              )}
            </div>
          </div>
        </div>
      ))}

      <Button
        size="sm"
        variant="outline"
        className="w-full justify-center"
        onClick={onAddLayer}
      >
        <Plus className="h-4 w-4 mr-1" />
        Add Layer
      </Button>
    </div>
  );
}
