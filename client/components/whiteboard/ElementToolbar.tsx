import { Button } from "@/components/ui/button";
import {
  Type,
  Heading1,
  FileText,
  CheckSquare,
  List,
} from "lucide-react";
import { WhiteboardElement } from "@/pages/Whiteboard";

interface ElementToolbarProps {
  onAddElement: (type: WhiteboardElement["type"]) => void;
}

const tools = [
  {
    type: "text" as const,
    label: "Text",
    icon: Type,
    description: "Add text",
  },
  {
    type: "heading" as const,
    label: "Heading",
    icon: Heading1,
    description: "Add heading",
  },
  {
    type: "paragraph" as const,
    label: "Paragraph",
    icon: FileText,
    description: "Add paragraph",
  },
  {
    type: "checkbox" as const,
    label: "Checkbox",
    icon: CheckSquare,
    description: "Add checkbox",
  },
  {
    type: "list" as const,
    label: "List",
    icon: List,
    description: "Add list",
  },
];

export default function ElementToolbar({ onAddElement }: ElementToolbarProps) {
  return (
    <div className="space-y-2">
      <h3 className="text-sm font-semibold text-white mb-3">Add Elements</h3>
      <div className="grid grid-cols-2 gap-2">
        {tools.map((tool) => {
          const Icon = tool.icon;
          return (
            <Button
              key={tool.type}
              variant="outline"
              size="sm"
              onClick={() => onAddElement(tool.type)}
              className="flex flex-col items-center gap-1 h-auto py-2"
              title={tool.description}
            >
              <Icon className="h-4 w-4" />
              <span className="text-xs">{tool.label}</span>
            </Button>
          );
        })}
      </div>
    </div>
  );
}
