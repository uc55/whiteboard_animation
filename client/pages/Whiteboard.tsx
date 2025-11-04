import { useState, useRef, useCallback } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ChevronLeft, Plus, Trash2, Copy, Eye, EyeOff } from "lucide-react";
import DraggableElement from "@/components/whiteboard/DraggableElement";
import LayerPanel from "@/components/whiteboard/LayerPanel";
import ResolutionSelector from "@/components/whiteboard/ResolutionSelector";
import ElementToolbar from "@/components/whiteboard/ElementToolbar";

export interface WhiteboardElement {
  id: string;
  type: "text" | "heading" | "paragraph" | "checkbox" | "list";
  x: number;
  y: number;
  width: number;
  height: number;
  content: string;
  layerId: string;
  fontSize?: number;
  fontWeight?: number;
  color?: string;
  backgroundColor?: string;
  visible?: boolean;
}

export interface Layer {
  id: string;
  name: string;
  visible: boolean;
  locked?: boolean;
}

const DEFAULT_RESOLUTION = "landscape";

export default function Whiteboard() {
  const [elements, setElements] = useState<WhiteboardElement[]>([
    {
      id: "test-element",
      type: "text",
      x: 20,
      y: 20,
      width: 200,
      height: 40,
      content: "Test Element",
      layerId: "layer-2",
      fontSize: 16,
      fontWeight: 400,
      color: "#1f2937",
      backgroundColor: "#ffffff",
      visible: true,
    }
  ]);
  const [layers, setLayers] = useState<Layer[]>([
    { id: "layer-1", name: "Background", visible: true },
    { id: "layer-2", name: "Content", visible: true },
  ]);
  const [activeLayerId, setActiveLayerId] = useState("layer-2");
  const [selectedElementId, setSelectedElementId] = useState<string | null>(null);
  const [resolution, setResolution] = useState(DEFAULT_RESOLUTION);
  const canvasRef = useRef<HTMLDivElement>(null);

  const resolutions = {
    landscape: { width: 1280, height: 720, label: "Landscape (16:9)" },
    portrait: { width: 720, height: 1280, label: "Portrait (9:16)" },
    square: { width: 1024, height: 1024, label: "Square (1:1)" },
    "4k": { width: 3840, height: 2160, label: "4K (16:9)" },
    hd: { width: 1920, height: 1080, label: "HD (16:9)" },
  };

  const currentResolution = resolutions[resolution as keyof typeof resolutions] || resolutions.landscape;

  const addElement = (type: WhiteboardElement["type"]) => {
    const newElement: WhiteboardElement = {
      id: `element-${Date.now()}`,
      type,
      x: 10 + Math.random() * 60,
      y: 10 + Math.random() * 60,
      width: type === "heading" ? 300 : type === "list" ? 250 : 200,
      height: type === "paragraph" ? 120 : 40,
      content:
        type === "heading"
          ? "Heading Title"
          : type === "paragraph"
            ? "This is a paragraph with multiple lines of text that can be edited."
            : type === "list"
              ? "Item 1\nItem 2\nItem 3"
              : type === "checkbox"
                ? "Check this item"
                : "Edit this text",
      layerId: activeLayerId,
      fontSize: type === "heading" ? 28 : type === "paragraph" ? 14 : 16,
      fontWeight: type === "heading" ? 700 : 400,
      color: "#1f2937",
      backgroundColor: "#ffffff",
      visible: true,
    };
    setElements((prev) => [...prev, newElement]);
    setSelectedElementId(newElement.id);
  };

  const updateElement = useCallback((id: string, updates: Partial<WhiteboardElement>) => {
    setElements((prev) =>
      prev.map((el) => (el.id === id ? { ...el, ...updates } : el))
    );
  }, []);

  const deleteElement = useCallback((id: string) => {
    setElements((prev) => prev.filter((el) => el.id !== id));
    if (selectedElementId === id) setSelectedElementId(null);
  }, [selectedElementId]);

  const duplicateElement = useCallback((id: string) => {
    const element = elements.find((el) => el.id === id);
    if (element) {
      const newElement = {
        ...element,
        id: `element-${Date.now()}`,
        x: element.x + 20,
        y: element.y + 20,
      };
      setElements([...elements, newElement]);
      setSelectedElementId(newElement.id);
    }
  }, [elements]);

  const addLayer = useCallback(() => {
    const newLayer: Layer = {
      id: `layer-${Date.now()}`,
      name: `Layer ${layers.length + 1}`,
      visible: true,
    };
    setLayers([...layers, newLayer]);
    setActiveLayerId(newLayer.id);
  }, [layers]);

  const deleteLayer = useCallback((id: string) => {
    if (layers.length === 1) return;
    setLayers((prev) => prev.filter((l) => l.id !== id));
    setElements((prev) => prev.filter((el) => el.layerId !== id));
    if (activeLayerId === id) {
      setActiveLayerId(layers[0]?.id || "layer-1");
    }
  }, [layers, activeLayerId]);

  const toggleLayerVisibility = useCallback((id: string) => {
    setLayers((prev) =>
      prev.map((l) => (l.id === id ? { ...l, visible: !l.visible } : l))
    );
  }, []);

  const visibleElements = elements.filter((el) => {
    const layer = layers.find((l) => l.id === el.layerId);
    return layer?.visible && el.visible;
  });

  return (
    <div className="min-h-screen bg-slate-950 flex flex-col">
      {/* Header */}
      <header className="bg-slate-900/80 backdrop-blur border-b border-slate-700/50 px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link to="/">
              <Button variant="ghost" size="sm" className="text-slate-400 hover:text-white">
                <ChevronLeft className="h-4 w-4 mr-1" />
                Back
              </Button>
            </Link>
            <h1 className="text-xl font-bold text-white">Whiteboard Editor</h1>
          </div>
          <ResolutionSelector
            resolution={resolution}
            onResolutionChange={setResolution}
            resolutions={resolutions}
          />
        </div>
      </header>

      {/* Main Content */}
      <div className="flex-1 flex gap-4 p-4 overflow-hidden">
        {/* Left Sidebar - Tool Panel */}
        <div className="w-64 bg-slate-900/50 backdrop-blur border border-slate-700/50 rounded-lg p-4 overflow-y-auto flex flex-col gap-4">
          <ElementToolbar onAddElement={addElement} />

          <div className="border-t border-slate-700/50 pt-4">
            <h3 className="text-sm font-semibold text-white mb-3">Layers</h3>
            <LayerPanel
              layers={layers}
              activeLayerId={activeLayerId}
              onSelectLayer={setActiveLayerId}
              onAddLayer={addLayer}
              onDeleteLayer={deleteLayer}
              onToggleVisibility={toggleLayerVisibility}
              elementCount={(layerId) =>
                elements.filter((el) => el.layerId === layerId).length
              }
            />
          </div>

          {selectedElementId && (
            <div className="border-t border-slate-700/50 pt-4">
              <h3 className="text-sm font-semibold text-white mb-3">Element Actions</h3>
              <div className="flex flex-col gap-2">
                <Button
                  size="sm"
                  variant="outline"
                  className="justify-start"
                  onClick={() => duplicateElement(selectedElementId)}
                >
                  <Copy className="h-4 w-4 mr-2" />
                  Duplicate
                </Button>
                <Button
                  size="sm"
                  variant="destructive"
                  className="justify-start"
                  onClick={() => deleteElement(selectedElementId)}
                >
                  <Trash2 className="h-4 w-4 mr-2" />
                  Delete
                </Button>
              </div>
            </div>
          )}
        </div>

        {/* Canvas Area */}
        <div className="flex-1 flex items-center justify-center overflow-auto bg-gradient-to-br from-slate-900 to-slate-950">
          <div
            ref={canvasRef}
            className="relative bg-white shadow-2xl rounded-lg overflow-hidden"
            style={{
              width: `${currentResolution.width}px`,
              height: `${currentResolution.height}px`,
              minWidth: `${currentResolution.width}px`,
              minHeight: `${currentResolution.height}px`,
            }}
          >
            {visibleElements.map((element) => (
              <DraggableElement
                key={element.id}
                element={element}
                isSelected={selectedElementId === element.id}
                onSelect={() => setSelectedElementId(element.id)}
                onUpdate={updateElement}
                canvasRef={canvasRef}
              />
            ))}

            {visibleElements.length === 0 && (
              <div className="absolute inset-0 flex items-center justify-center text-slate-300">
                <div className="text-center">
                  <p className="mb-2">No elements on this canvas</p>
                  <p className="text-sm text-slate-400">Add elements from the left panel</p>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Right Sidebar - Properties */}
        {selectedElementId && (
          <div className="w-72 bg-slate-900/50 backdrop-blur border border-slate-700/50 rounded-lg p-4 overflow-y-auto">
            <ElementPropertyEditor
              element={elements.find((el) => el.id === selectedElementId)!}
              onUpdate={updateElement}
            />
          </div>
        )}
      </div>
    </div>
  );
}

function ElementPropertyEditor({
  element,
  onUpdate,
}: {
  element: WhiteboardElement;
  onUpdate: (id: string, updates: Partial<WhiteboardElement>) => void;
}) {
  return (
    <div className="space-y-4">
      <div>
        <h3 className="text-sm font-semibold text-white mb-2">Content</h3>
        <textarea
          value={element.content}
          onChange={(e) => onUpdate(element.id, { content: e.target.value })}
          className="w-full bg-slate-800 border border-slate-600 rounded px-3 py-2 text-white text-sm focus:outline-none focus:border-cyan-400"
          rows={3}
        />
      </div>

      {element.type !== "checkbox" && (
        <>
          <div>
            <label className="text-xs text-slate-400 block mb-2">Font Size</label>
            <input
              type="range"
              min="8"
              max="48"
              value={element.fontSize || 16}
              onChange={(e) => onUpdate(element.id, { fontSize: parseInt(e.target.value) })}
              className="w-full"
            />
            <span className="text-xs text-slate-400">{element.fontSize || 16}px</span>
          </div>

          <div>
            <label className="text-xs text-slate-400 block mb-2">Font Weight</label>
            <select
              value={element.fontWeight || 400}
              onChange={(e) => onUpdate(element.id, { fontWeight: parseInt(e.target.value) })}
              className="w-full bg-slate-800 border border-slate-600 rounded px-3 py-2 text-white text-sm"
            >
              <option value="400">Regular</option>
              <option value="600">Semibold</option>
              <option value="700">Bold</option>
            </select>
          </div>
        </>
      )}

      <div>
        <label className="text-xs text-slate-400 block mb-2">Text Color</label>
        <input
          type="color"
          value={element.color || "#1f2937"}
          onChange={(e) => onUpdate(element.id, { color: e.target.value })}
          className="w-full h-10 rounded cursor-pointer"
        />
      </div>

      <div>
        <label className="text-xs text-slate-400 block mb-2">Background Color</label>
        <input
          type="color"
          value={element.backgroundColor || "#ffffff"}
          onChange={(e) => onUpdate(element.id, { backgroundColor: e.target.value })}
          className="w-full h-10 rounded cursor-pointer"
        />
      </div>

      <div className="pt-2 border-t border-slate-700">
        <label className="flex items-center gap-2 text-sm text-slate-300 cursor-pointer">
          <input
            type="checkbox"
            checked={element.visible !== false}
            onChange={(e) => onUpdate(element.id, { visible: e.target.checked })}
            className="w-4 h-4"
          />
          Visible
        </label>
      </div>
    </div>
  );
}
