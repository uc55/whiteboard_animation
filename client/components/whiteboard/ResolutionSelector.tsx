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
      <label className="text-xs md:text-sm text-slate-300 hidden sm:inline">Res:</label>
      <select
        value={resolution}
        onChange={(e) => onResolutionChange(e.target.value)}
        className="bg-slate-800 border border-slate-600 text-white rounded px-2 md:px-3 py-2 text-xs md:text-sm focus:outline-none focus:border-cyan-400"
      >
        {Object.entries(resolutions).map(([key, { label }]) => (
          <option key={key} value={key}>
            {label}
          </option>
        ))}
      </select>
    </div>
  );
}
