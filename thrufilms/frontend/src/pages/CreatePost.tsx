import { useState, type FormEvent } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/axios";
import { INDIAN_CITIES, ROLES_NEEDED } from "../types";
import LocationPicker from "../components/LocationPicker";

export default function CreatePost() {
  const navigate = useNavigate();
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [roleNeeded, setRoleNeeded] = useState("");
  const [location, setLocation] = useState("");
  const [budgetType, setBudgetType] = useState("paid");
  const [contact, setContact] = useState("");
  const [gender, setGender] = useState("");
  const [ageRange, setAgeRange] = useState("");
  const [shootDates, setShootDates] = useState("");
  const [compensationDetails, setCompensationDetails] = useState("");
  const [lat, setLat] = useState<number | null>(null);
  const [lng, setLng] = useState<number | null>(null);
  const [resolvedAddress, setResolvedAddress] = useState("");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError("");
    setSaving(true);
    try {
      const res = await api.post<{ id: number }>("/posts", {
        title,
        description,
        role_needed: roleNeeded,
        location,
        budget_type: budgetType,
        contact,
        gender: gender || undefined,
        age_range: ageRange || undefined,
        shoot_dates: shootDates || undefined,
        compensation_details: compensationDetails || undefined,
        lat: lat ?? undefined,
        lng: lng ?? undefined,
      });
      navigate(`/job/${res.data.id}`);
    } catch (err: unknown) {
      const msg = (err as { response?: { data?: { detail?: string } } })?.response?.data?.detail;
      setError(msg || "Failed to create listing.");
    } finally {
      setSaving(false);
    }
  };

  const BUDGET_OPTIONS = [
    { value: "paid", label: "Paid Job", desc: "You will compensate talent", icon: "💰" },
    { value: "unpaid", label: "Unpaid / Experience", desc: "Student or passion project", icon: "🎓" },
    { value: "collaboration", label: "Collaboration", desc: "Equal creative partnership", icon: "🤝" },
  ];

  const GENDER_OPTIONS = [
    { value: "", label: "Any / Open" },
    { value: "Male", label: "Male" },
    { value: "Female", label: "Female" },
    { value: "Non-Binary", label: "Non-Binary" },
    { value: "Transgender", label: "Transgender" },
  ];

  return (
    <div className="page-container max-w-[800px] animate-fade-in">
      <div className="mb-8">
        <button onClick={() => navigate(-1)} className="btn-ghost pl-0 mb-4 text-[#5e6c84]">
          ← Back
        </button>
        <h1 className="font-display font-black text-2xl sm:text-3xl text-[#172b4d] mb-2">Post a Casting Call or Job</h1>
        <p className="text-[#5e6c84] text-sm sm:text-base">Provide details about your project to attract the right talent.</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {error && <div className="alert-error">{error}</div>}

        {/* Section 1: Project Basics */}
        <div className="card p-6 sm:p-8 space-y-6 border-t-4 border-t-[#0052cc]">
          <h2 className="text-sm font-bold text-[#5e6c84] uppercase tracking-wider border-b border-[#dfe1e6] pb-2">Project Basics</h2>
          
          <div>
            <label className="input-label">Job Title *</label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="input-field"
              placeholder="e.g. Lead Actor needed for Short Drama Film"
              required
              maxLength={120}
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
            <div>
              <label className="input-label">Role Needed *</label>
              <select value={roleNeeded} onChange={(e) => setRoleNeeded(e.target.value)} className="select-field" required>
                <option value="">Select role type...</option>
                {ROLES_NEEDED.map((r) => (
                  <option key={r} value={r}>{r}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="input-label">Shooting Location *</label>
              <select value={location} onChange={(e) => setLocation(e.target.value)} className="select-field" required>
                <option value="">Select city...</option>
                {INDIAN_CITIES.map((c) => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Section 2: Casting Requirements */}
        <div className="card p-6 sm:p-8 space-y-6">
          <h2 className="text-sm font-bold text-[#5e6c84] uppercase tracking-wider border-b border-[#dfe1e6] pb-2">Casting Requirements</h2>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
            <div>
              <label className="input-label">Gender Requirement</label>
              <select value={gender} onChange={(e) => setGender(e.target.value)} className="select-field">
                {GENDER_OPTIONS.map((g) => (
                  <option key={g.value} value={g.value}>{g.label}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="input-label">Age Range</label>
              <input
                type="text"
                value={ageRange}
                onChange={(e) => setAgeRange(e.target.value)}
                className="input-field"
                placeholder="e.g. 18-25, 40+"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
            <div>
              <label className="input-label">Shoot Dates</label>
              <input
                type="text"
                value={shootDates}
                onChange={(e) => setShootDates(e.target.value)}
                className="input-field"
                placeholder="e.g. Aug 15 - Aug 20, 2026"
              />
            </div>
            <div>
              <label className="input-label">Specific Compensation Info</label>
              <input
                type="text"
                value={compensationDetails}
                onChange={(e) => setCompensationDetails(e.target.value)}
                className="input-field"
                placeholder="e.g. ₹5000/day + meals provided"
              />
            </div>
          </div>
        </div>

        {/* Section 3: Description & Compensation */}
        <div className="card p-6 sm:p-8 space-y-6">
          <h2 className="text-sm font-bold text-[#5e6c84] uppercase tracking-wider border-b border-[#dfe1e6] pb-2">Details & Compensation</h2>
          
          <div>
            <label className="input-label">Job Description *</label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={8}
              className="textarea-field"
              placeholder="Provide full details about the project, shooting dates, character descriptions, requirements, etc."
              required
            />
          </div>

          <div>
            <label className="input-label mb-3">Compensation Type *</label>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {BUDGET_OPTIONS.map((opt) => (
                <label
                  key={opt.value}
                  className={`flex flex-col items-start p-4 rounded-lg border-2 cursor-pointer transition-all duration-200 ${
                    budgetType === opt.value
                      ? "border-[#0052cc] bg-[#deebff]"
                      : "border-[#dfe1e6] bg-white hover:bg-[#fafbfc]"
                  }`}
                >
                  <div className="flex items-center gap-2 mb-1">
                    <input
                      type="radio"
                      name="budgetType"
                      value={opt.value}
                      checked={budgetType === opt.value}
                      onChange={(e) => setBudgetType(e.target.value)}
                      className="w-4 h-4 text-[#0052cc] focus:ring-[#0052cc]"
                    />
                    <span className="text-lg">{opt.icon}</span>
                    <span className="font-bold text-[#172b4d] text-sm">{opt.label}</span>
                  </div>
                  <span className="text-[11px] text-[#5e6c84] ml-8">{opt.desc}</span>
                </label>
              ))}
            </div>
          </div>

          <div>
            <label className="input-label">Direct Contact Info *</label>
            <input
              type="text"
              value={contact}
              onChange={(e) => setContact(e.target.value)}
              className="input-field"
              placeholder="Email or Phone Number"
              required
            />
            <p className="text-xs text-[#5e6c84] mt-1.5 font-medium">
              Applicants can see this to reach out. Your profile link will also be visible.
            </p>
          </div>
        </div>

        {/* Section 4: Map Location */}
        <div className="card p-6 sm:p-8 space-y-4">
          <h2 className="text-sm font-bold text-[#5e6c84] uppercase tracking-wider border-b border-[#dfe1e6] pb-2">Precise Location (Optional)</h2>
          <p className="text-sm text-[#5e6c84]">Search for an address or drop a pin on the map to show applicants the exact area of the shoot.</p>
          
          <LocationPicker 
            lat={lat} 
            lng={lng} 
            onChange={(newLat, newLng) => {
              setLat(newLat);
              setLng(newLng);
            }}
            onAddressResolved={(address) => setResolvedAddress(address)}
          />

          {resolvedAddress && (
            <div className="flex items-start gap-2 bg-[#e3fcef] border border-[#006644]/20 rounded-lg p-3">
              <span className="text-lg">📍</span>
              <div>
                <span className="text-xs font-bold text-[#006644] uppercase tracking-wider block mb-0.5">Resolved Address</span>
                <span className="text-sm text-[#172b4d] font-medium">{resolvedAddress}</span>
              </div>
            </div>
          )}
        </div>

        {/* Submit */}
        <div className="flex flex-col sm:flex-row gap-4 pt-2 pb-8">
          <button type="submit" disabled={saving} className="btn-primary flex-1 py-3 text-base">
            {saving ? "Publishing..." : "Publish Job Listing"}
          </button>
          <button type="button" onClick={() => navigate(-1)} className="btn-secondary py-3 text-base">
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
}
