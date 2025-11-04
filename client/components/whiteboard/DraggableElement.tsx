import { useState, useRef, useEffect } from "react";
import { WhiteboardElement } from "@/pages/Whiteboard";

interface DraggableElementProps {
  element: WhiteboardElement;
  isSelected: boolean;
  onSelect: () => void;
  onUpdate: (id: string, updates: Partial<WhiteboardElement>) => void;
  canvasRef: React.RefObject<HTMLDivElement>;
}

export default function DraggableElement({
  element,
  isSelected,
  onSelect,
  onUpdate,
  canvasRef,
}: DraggableElementProps) {
  const [isDragging, setIsDragging] = useState(false);
  const [isResizing, setIsResizing] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [resizeStart, setResizeStart] = useState({ x: 0, y: 0 });
  const elementRef = useRef<HTMLDivElement>(null);

  const handleMouseDown = (e: React.MouseEvent) => {
    if ((e.target as HTMLElement).className.includes("resize-handle")) {
      setIsResizing(true);
      setResizeStart({ x: e.clientX, y: e.clientY });
    } else {
      setIsDragging(true);
      setDragStart({ x: e.clientX, y: e.clientY });
      onSelect();
    }
  };

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!canvasRef.current) return;

      const canvas = canvasRef.current;
      const canvasRect = canvas.getBoundingClientRect();

      if (isDragging) {
        const deltaX = e.clientX - dragStart.x;
        const deltaY = e.clientY - dragStart.y;

        let newX = element.x + (deltaX / canvasRect.width) * 100;
        let newY = element.y + (deltaY / canvasRect.height) * 100;

        newX = Math.max(0, Math.min(100, newX));
        newY = Math.max(0, Math.min(100, newY));

        onUpdate(element.id, { x: newX, y: newY });
        setDragStart({ x: e.clientX, y: e.clientY });
      }

      if (isResizing) {
        const deltaX = e.clientX - resizeStart.x;
        const deltaY = e.clientY - resizeStart.y;

        let newWidth = element.width + (deltaX / canvasRect.width) * 100;
        let newHeight = element.height + (deltaY / canvasRect.height) * 100;

        newWidth = Math.max(50, newWidth);
        newHeight = Math.max(30, newHeight);

        onUpdate(element.id, { width: newWidth, height: newHeight });
        setResizeStart({ x: e.clientX, y: e.clientY });
      }
    };

    const handleMouseUp = () => {
      setIsDragging(false);
      setIsResizing(false);
    };

    if (isDragging || isResizing) {
      document.addEventListener("mousemove", handleMouseMove);
      document.addEventListener("mouseup", handleMouseUp);
      return () => {
        document.removeEventListener("mousemove", handleMouseMove);
        document.removeEventListener("mouseup", handleMouseUp);
      };
    }
  }, [isDragging, isResizing, dragStart, resizeStart, element, onUpdate, canvasRef]);

  const renderContent = () => {
    switch (element.type) {
      case "heading":
        return (
          <h2
            className="w-full h-full p-2 focus:outline-none resize-none overflow-hidden"
            style={{
              fontSize: `${element.fontSize}px`,
              fontWeight: element.fontWeight,
              color: element.color,
              backgroundColor: element.backgroundColor,
            }}
          >
            {element.content}
          </h2>
        );
      case "paragraph":
        return (
          <p
            className="w-full h-full p-2 focus:outline-none resize-none overflow-hidden text-justify"
            style={{
              fontSize: `${element.fontSize}px`,
              fontWeight: element.fontWeight,
              color: element.color,
              backgroundColor: element.backgroundColor,
              whiteSpace: "pre-wrap",
              wordWrap: "break-word",
            }}
          >
            {element.content}
          </p>
        );
      case "checkbox":
        return (
          <label
            className="w-full h-full p-2 flex items-center gap-2 cursor-pointer"
            style={{
              backgroundColor: element.backgroundColor,
            }}
          >
            <input
              type="checkbox"
              className="w-4 h-4 cursor-pointer"
              defaultChecked={false}
            />
            <span
              style={{
                fontSize: `${element.fontSize}px`,
                color: element.color,
              }}
            >
              {element.content}
            </span>
          </label>
        );
      case "list":
        return (
          <ul
            className="w-full h-full p-3 overflow-hidden list-disc list-inside"
            style={{
              fontSize: `${element.fontSize}px`,
              fontWeight: element.fontWeight,
              color: element.color,
              backgroundColor: element.backgroundColor,
            }}
          >
            {element.content.split("\n").map((item, i) => (
              <li key={i} className="truncate">
                {item.trim()}
              </li>
            ))}
          </ul>
        );
      default:
        return (
          <div
            className="w-full h-full p-2 overflow-hidden"
            style={{
              fontSize: `${element.fontSize}px`,
              fontWeight: element.fontWeight,
              color: element.color,
              backgroundColor: element.backgroundColor,
            }}
          >
            {element.content}
          </div>
        );
    }
  };

  return (
    <div
      ref={elementRef}
      onMouseDown={handleMouseDown}
      className={`absolute cursor-move transition-shadow ${
        isSelected ? "shadow-lg" : "shadow"
      }`}
      style={{
        left: `${element.x}%`,
        top: `${element.y}%`,
        width: `${element.width}px`,
        height: `${element.height}px`,
        border: isSelected ? "2px solid #06b6d4" : "1px solid #e5e7eb",
        borderRadius: "6px",
        zIndex: isSelected ? 100 : 10,
      }}
    >
      {renderContent()}

      {isSelected && (
        <div
          className="resize-handle absolute bottom-0 right-0 w-4 h-4 bg-cyan-400 cursor-nwse-resize rounded-bl"
          style={{
            borderBottomLeftRadius: "6px",
          }}
        />
      )}
    </div>
  );
}
