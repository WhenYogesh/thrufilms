import { useState, useEffect, type FormEvent, type ChangeEvent } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/axios";
import { useAuthStore } from "../store/authStore";
import { SKILLS, INDIAN_CITIES, type User } from "../types";

export default function EditProfile() {
  const navigate = useNavigate();
  const { user, updateUser } = useAuthStore();
  const [name, setName] = useState("");
  const [bio, setBio] = useState("");
  const [location, setLocation] = useState("");
  const [skills, setSkills] = useState<string[]>([]);
  const [portfolioInput, setPortfolioInput] = useState("");
  const [portfolioUrls, setPortfolioUrls] = useState<string[]>([]);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState("");
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  useEffect(() => {
    const fetchMe = async () => {
      setLoading(true);
      try {
        const res = await api.get<User>("/users/me");
        const p = res.data.profile;
        if (p) {
          setName(p.name || "");
          setBio(p.bio || "");
          setLocation(p.location || "");
          setSkills(p.skills || []);
          setPortfolioUrls(p.portfolio_urls || []);
          setImagePreview(p.profile_image_url || "");
        }
      } finally {
        setLoading(false);
      }
    };
    fetchMe();
  }, []);

  const toggleSkill = (skill: string) => {
    setSkills((prev) =>
      prev.includes(skill) ? prev.filter((s) => s !== skill) : [...prev, skill]
    );
  };

  const handleImageChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setImageFile(file);
    setImagePreview(URL.createObjectURL(file));
  };

  const addPortfolioUrl = () => {
    if (portfolioInput.trim() && !portfolioUrls.includes(portfolioInput.trim())) {
      setPortfolioUrls((prev) => [...prev, portfolioInput.trim()]);
      setPortfolioInput("");
    }
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    setSaving(true);
    try {
      let imageUrl = imagePreview;
      if (imageFile) {
        const fd = new FormData();
        fd.append("file", imageFile);
        const res = await api.post<{ url: string }>("/users/upload-image", fd, {
          headers: { "Content-Type": "multipart/form-data" },
        });
        imageUrl = res.data.url;
      }
      await api.put("/users/profile", { name, bio, location, skills, profile_image_url: imageUrl, portfolio_urls: portfolioUrls });
      const userRes = await api.get<User>("/users/me");
      updateUser(userRes.data);
      setSuccess("Profile saved!");
      setTimeout(() => navigate(`/profile/${user?.id}`), 1200);
    } catch (err: unknown) {
      const msg = (err as { response?: { data?: { detail?: string } } })?.response?.data?.detail;
      setError(msg || "Failed to save profile.");
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <div className="page-container"><div className="max-w-[800px] mx-auto card p-8 animate-pulse h-[600px]" /></div>;

  return (
    <div className="page-container max-w-[800px] animate-fade-in">
      <div className="mb-8">
        <h1 className="font-display font-black text-3xl text-[#172b4d] mb-2">Edit Talent Profile</h1>
        <p className="text-[#5e6c84]">Build your professional portfolio to attract the right roles.</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {error && <div className="alert-error">{error}</div>}
        {success && <div className="alert-success">{success}</div>}

        <div className="card p-8 border-t-4 border-t-[#0052cc]">
          <h2 className="text-sm font-bold text-[#5e6c84] uppercase tracking-wider mb-6 border-b border-[#dfe1e6] pb-2">Headshot</h2>
          <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6">
            <div className="w-32 pt-[100%] sm:w-32 sm:h-32 sm:pt-0 relative bg-[#ebecf0] rounded overflow-hidden flex-shrink-0 border border-[#dfe1e6]">
              <img 
                src={imagePreview || `https://api.dicebear.com/7.x/initials/svg?seed=${user?.id}&backgroundColor=172b4d`} 
                alt="Preview" 
                className="absolute inset-0 w-full h-full object-cover" 
              />
            </div>
            <div className="text-center sm:text-left flex-1">
              <label htmlFor="img-upload" className="btn-outline inline-block cursor-pointer mb-2">
                Upload Headshot
              </label>
              <input id="img-upload" type="file" accept="image/*" onChange={handleImageChange} className="hidden" />
              <p className="text-xs text-[#5e6c84] font-medium leading-relaxed max-w-sm">
                A professional headshot is critical for casting directors. JPG, PNG up to 5MB. Must be well-lit.
              </p>
            </div>
          </div>
        </div>

        <div className="card p-8 space-y-6">
          <h2 className="text-sm font-bold text-[#5e6c84] uppercase tracking-wider border-b border-[#dfe1e6] pb-2">Personal Details</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div>
              <label className="input-label">Full Legal Name *</label>
              <input type="text" value={name} onChange={(e) => setName(e.target.value)} className="input-field" required />
            </div>
            <div>
              <label className="input-label">Base City</label>
              <select value={location} onChange={(e) => setLocation(e.target.value)} className="select-field">
                <option value="">Select city</option>
                {INDIAN_CITIES.map((c) => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>
          </div>
          <div>
            <label className="input-label">Professional Biography</label>
            <textarea 
              value={bio} 
              onChange={(e) => setBio(e.target.value)} 
              rows={5} 
              className="textarea-field" 
              placeholder="Tell casting directors about your experience, training, representation, and notable work."
            />
          </div>
        </div>

        <div className="card p-8">
          <h2 className="text-sm font-bold text-[#5e6c84] uppercase tracking-wider mb-4 border-b border-[#dfe1e6] pb-2">Skills & Attributes</h2>
          <div className="flex flex-wrap gap-2">
            {SKILLS.map((skill) => (
              <button 
                key={skill} 
                type="button" 
                onClick={() => toggleSkill(skill)} 
                className={`text-sm font-semibold px-4 py-2 rounded border cursor-pointer transition-colors ${
                  skills.includes(skill) 
                    ? "bg-[#deebff] border-[#0052cc] text-[#0052cc]" 
                    : "bg-white border-[#dfe1e6] text-[#5e6c84] hover:bg-[#fafbfc]"
                }`}
              >
                {skills.includes(skill) ? "✓ " : ""}{skill}
              </button>
            ))}
          </div>
        </div>

        <div className="card p-8">
          <h2 className="text-sm font-bold text-[#5e6c84] uppercase tracking-wider mb-4 border-b border-[#dfe1e6] pb-2">Media & Reels</h2>
          <p className="text-sm text-[#5e6c84] mb-4">Add links to your showreels, IMDb, or other portfolio websites.</p>
          <div className="flex gap-3 mb-4">
            <input 
              type="url" 
              value={portfolioInput} 
              onChange={(e) => setPortfolioInput(e.target.value)} 
              onKeyDown={(e) => e.key === "Enter" && (e.preventDefault(), addPortfolioUrl())} 
              className="input-field flex-1" 
              placeholder="https://vimeo.com/your-reel" 
            />
            <button type="button" onClick={addPortfolioUrl} className="btn-secondary px-6">Add Link</button>
          </div>
          {portfolioUrls.map((url, i) => (
            <div key={i} className="flex items-center gap-3 text-sm p-3 border border-[#dfe1e6] rounded mb-2 bg-[#fafbfc]">
              <span className="flex-1 truncate text-[#172b4d] font-medium">{url}</span>
              <button type="button" onClick={() => setPortfolioUrls((p) => p.filter((_, idx) => idx !== i))} className="text-[#bf2600] font-bold hover:underline">Remove</button>
            </div>
          ))}
        </div>

        <div className="flex flex-col sm:flex-row gap-4 pt-4">
          <button type="submit" disabled={saving || !name} className="btn-primary flex-1 py-3 text-base">
            {saving ? "Saving Profile..." : "Save Profile"}
          </button>
          <button type="button" onClick={() => navigate(-1)} className="btn-secondary py-3 text-base">
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
}
