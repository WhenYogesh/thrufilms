import { INDIAN_CITIES, ROLES_NEEDED } from "../types";

interface FiltersProps {
  location: string;
  role: string;
  onLocationChange: (v: string) => void;
  onRoleChange: (v: string) => void;
  onClear: () => void;
  extraFilters?: React.ReactNode;
}

export default function Filters({
  location,
  role,
  onLocationChange,
  onRoleChange,
  onClear,
  extraFilters,
}: FiltersProps) {
  return (
    <div className="flex flex-wrap items-end gap-3">
      <div className="flex-1 min-w-[160px]">
        <label className="input-label">Location</label>
        <select
          value={location}
          onChange={(e) => onLocationChange(e.target.value)}
          className="select-field"
        >
          <option value="">All Cities</option>
          {INDIAN_CITIES.map((c) => (
            <option key={c} value={c}>{c}</option>
          ))}
        </select>
      </div>

      <div className="flex-1 min-w-[160px]">
        <label className="input-label">Role</label>
        <select
          value={role}
          onChange={(e) => onRoleChange(e.target.value)}
          className="select-field"
        >
          <option value="">All Roles</option>
          {ROLES_NEEDED.map((r) => (
            <option key={r} value={r}>{r}</option>
          ))}
        </select>
      </div>

      {extraFilters}

      {(location || role) && (
        <button
          onClick={onClear}
          className="text-sm text-red-500 hover:text-red-600 font-medium py-2.5"
        >
          Clear
        </button>
      )}
    </div>
  );
}
