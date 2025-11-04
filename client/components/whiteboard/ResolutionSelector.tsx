import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface ResolutionSelectorProps {
  resolution: string;
  onResolutionChange: (resolution: string) => void;
  resolutions: Record<
    string,
    { width: number; height: number; label: string }
  >;
}

export default function ResolutionSelector({
  resolution,
  onResolutionChange,
  resolutions,
}: ResolutionSelectorProps) {
  return (
    <div className="flex items-center gap-2">
      <label className="text-sm text-slate-300">Resolution:</label>
      <Select value={resolution} onValueChange={onResolutionChange}>
        <SelectTrigger className="w-48 bg-slate-800 border-slate-600 text-white">
          <SelectValue />
        </SelectTrigger>
        <SelectContent className="bg-slate-800 border-slate-600">
          {Object.entries(resolutions).map(([key, { label }]) => (
            <SelectItem key={key} value={key}>
              {label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}
