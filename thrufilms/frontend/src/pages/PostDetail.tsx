import { useEffect, useState, type FormEvent } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import api from "../api/axios";
import type { Post } from "../types";
import { useAuthStore } from "../store/authStore";
import MapDisplay from "../components/MapDisplay";
import CommentSection from "../components/CommentSection";

const budgetLabels: Record<string, string> = {
  paid: "Paid Job",
  unpaid: "Unpaid / Experience",
  collaboration: "Collaboration",
};

const budgetIcons: Record<string, string> = {
  paid: "💰",
  unpaid: "🎓",
  collaboration: "🤝 .",
};

export default function PostDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user, isAuthenticated } = useAuthStore();
  const [post, setPost] = useState<Post | null>(null);
  const [loading, setLoading] = useState(true);
  const [applyMsg, setApplyMsg] = useState("");
  const [applying, setApplying] = useState(false);
  const [applied, setApplied] = useState(false);
  const [applyError, setApplyError] = useState("");
  const [deleting, setDeleting] = useState(false);

  const isOwner = user?.id === post?.user_id;

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await api.get<Post>(`/posts/${id}`);
        setPost(res.data);
      } catch {
        navigate("/");
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [id, navigate]);

  const handleApply = async (e: FormEvent) => {
    e.preventDefault();
    setApplyError("");
    setApplying(true);
    try {
      await api.post(`/posts/${id}/apply`, { message: applyMsg });
      setApplied(true);
    } catch (err: unknown) {
      const msg = (err as { response?: { data?: { detail?: string } } })?.response?.data?.detail;
      setApplyError(msg || "Failed to submit application.");
    } finally {
      setApplying(false);
    }
  };

  const handleDelete = async () => {
    if (!confirm("Delete this job posting? This cannot be undone.")) return;
    setDeleting(true);
    try {
      await api.delete(`/posts/${id}`);
      navigate("/dashboard");
    } catch {
      alert("Failed to delete post.");
      setDeleting(false);
    }
  };

  if (loading) {
    return (
      <div className="page-container sidebar-layout animate-pulse">
        <div className="main-column space-y-6">
          <div className="card p-8 h-48" />
          <div className="card p-8 h-64" />
        </div>
        <div className="sidebar-column">
          <div className="card p-6 h-64" />
          <div className="card p-6 h-32" />
        </div>
      </div>
    );
  }

  if (!post) return null;

  const castingDetails = [
    { label: "Gender", value: post.gender, icon: "👤" },
    { label: "Age Range", value: post.age_range, icon: "📅" },
    { label: "Shoot Dates", value: post.shoot_dates, icon: "🎬" },
    { label: "Compensation", value: post.compensation_details, icon: "💵" },
  ].filter((d) => d.value);

  return (
    <div className="page-container sidebar-layout animate-fade-in">
      
      {/* ─── Main Content ─── */}
      <div className="main-column space-y-6">
        {/* Header */}
        <div>
          <button onClick={() => navigate(-1)} className="btn-ghost pl-0 mb-4 text-[#5e6c84]">
            ← Back to Jobs
          </button>
          
          <div className="flex flex-wrap items-center gap-2 sm:gap-3 mb-4">
            <span className="badge badge-primary text-xs sm:text-sm">{post.role_needed}</span>
            <span className="badge badge-success text-xs sm:text-sm">
              {budgetIcons[post.budget_type]} {budgetLabels[post.budget_type]}
            </span>
          </div>

          <h1 className="font-display text-2xl sm:text-3xl font-bold text-[#172b4d] leading-tight mb-4">
            {post.title}
          </h1>

          <div className="flex flex-wrap items-center gap-4 sm:gap-6 text-xs sm:text-sm font-semibold text-[#5e6c84]">
            <div className="flex items-center gap-1.5">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} className="w-4 h-4">
                <path strokeLinecap="round" strokeLinejoin="round" d="M17.657 16.657L13.414 20.9a2 2 0 01-2.828 0L6.343 16.657A8 8 0 1117.657 16.657z" />
              </svg>
              {post.location}
            </div>
            <div className="flex items-center gap-1.5">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} className="w-4 h-4">
                <path strokeLinecap="round" strokeLinejoin="round" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              Posted {new Date(post.created_at).toLocaleDateString(undefined, { month: "short", day: "numeric", year: "numeric" })}
            </div>
            <div className="flex items-center gap-1.5">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} className="w-4 h-4">
                <path strokeLinecap="round" strokeLinejoin="round" d="M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z" />
              </svg>
              {post.comment_count} Comments
            </div>
          </div>
        </div>

        {/* Casting Details Grid */}
        {castingDetails.length > 0 && (
          <div className="card p-6 sm:p-8 bg-gradient-to-r from-[#f4f5f7] to-white border-l-4 border-[#0052cc]">
            <h2 className="text-sm font-bold text-[#5e6c84] uppercase tracking-wider mb-4">Casting Requirements</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {castingDetails.map((d) => (
                <div key={d.label} className="flex items-start gap-3 bg-white rounded-lg p-3 border border-[#dfe1e6]">
                  <span className="text-xl">{d.icon}</span>
                  <div>
                    <span className="block text-xs font-bold text-[#5e6c84] uppercase tracking-wider">{d.label}</span>
                    <span className="text-sm text-[#172b4d] font-semibold">{d.value}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Description */}
        <div className="card p-6 sm:p-8">
          <h2 className="text-lg font-bold text-[#172b4d] mb-4">Job Description</h2>
          <div className="text-[#172b4d] leading-relaxed whitespace-pre-wrap text-[15px]">
            {post.description}
          </div>
        </div>

        {/* Map */}
        {post.lat && post.lng && (
          <div className="card p-6 sm:p-8">
            <h2 className="text-lg font-bold text-[#172b4d] mb-4 flex items-center gap-2">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} className="w-5 h-5 text-[#0052cc]">
                <path strokeLinecap="round" strokeLinejoin="round" d="M17.657 16.657L13.414 20.9a2 2 0 01-2.828 0L6.343 16.657A8 8 0 1117.657 16.657z" />
                <path strokeLinecap="round" strokeLinejoin="round" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
              Shooting Location
            </h2>
            <MapDisplay lat={post.lat} lng={post.lng} />
          </div>
        )}

        {/* Comments */}
        <CommentSection postId={post.id} />
      </div>

      {/* ─── Right Sidebar ─── */}
      <aside className="sidebar-column">
        
        {/* Application Card */}
        <div className="card p-6 border-t-4 border-t-[#0052cc]">
          {isOwner ? (
            <div className="space-y-4">
              <h3 className="font-bold text-[#172b4d]">Manage Listing</h3>
              <Link to="/dashboard" className="btn-secondary w-full">
                View Applications
              </Link>
              <button
                onClick={handleDelete}
                disabled={deleting}
                className="btn-outline border-[#bf2600] text-[#bf2600] hover:bg-[#ffebe6] w-full"
              >
                {deleting ? "Removing..." : "Delete Listing"}
              </button>
            </div>
          ) : !isAuthenticated ? (
            <div className="text-center space-y-4">
              <h3 className="font-bold text-[#172b4d]">Apply for this Role</h3>
              <p className="text-sm text-[#5e6c84]">Sign in to your talent profile to submit your application directly to the casting director.</p>
              <Link to="/login" className="btn-primary w-full text-base py-3">Log In to Apply</Link>
            </div>
          ) : applied ? (
            <div className="text-center space-y-3">
              <div className="text-3xl">✅</div>
              <h3 className="font-bold text-[#006644]">Application Submitted</h3>
              <p className="text-sm text-[#5e6c84]">Your profile has been sent to the casting director. They will contact you directly if there is a match.</p>
            </div>
          ) : (
            <div>
              <h3 className="font-bold text-[#172b4d] mb-4">Submit Application</h3>
              <form onSubmit={handleApply} className="space-y-4">
                {applyError && <div className="alert-error">{applyError}</div>}
                <div>
                  <label className="input-label">Cover Note (Optional)</label>
                  <textarea
                    value={applyMsg}
                    onChange={(e) => setApplyMsg(e.target.value)}
                    rows={4}
                    className="textarea-field text-sm"
                    placeholder="Briefly mention your availability and why you're a fit..."
                  />
                </div>
                <button type="submit" disabled={applying} className="btn-primary w-full text-base py-3">
                  {applying ? "Submitting..." : "Submit Application"}
                </button>
              </form>
            </div>
          )}
        </div>

        {/* Quick Info Card */}
        <div className="card p-6">
          <h3 className="text-sm font-bold text-[#5e6c84] uppercase tracking-wider mb-4">Quick Info</h3>
          <div className="space-y-3 text-sm">
            <div className="flex justify-between">
              <span className="text-[#5e6c84]">Role</span>
              <span className="font-bold text-[#172b4d]">{post.role_needed}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-[#5e6c84]">Location</span>
              <span className="font-bold text-[#172b4d]">{post.location}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-[#5e6c84]">Compensation</span>
              <span className="font-bold text-[#172b4d]">{budgetLabels[post.budget_type]}</span>
            </div>
            {post.shoot_dates && (
              <div className="flex justify-between">
                <span className="text-[#5e6c84]">Dates</span>
                <span className="font-bold text-[#172b4d]">{post.shoot_dates}</span>
              </div>
            )}
          </div>
        </div>

        {/* Creator Info */}
        <div className="card p-6">
          <h3 className="text-sm font-bold text-[#5e6c84] uppercase tracking-wider mb-4">Casting Director</h3>
          <div className="flex items-center gap-4">
            <Link to={`/profile/${post.user_id}`}>
              <img
                src={post.owner_image || `https://api.dicebear.com/7.x/initials/svg?seed=${post.user_id}&backgroundColor=172b4d`}
                alt="Creator"
                className="w-14 h-14 rounded-full object-cover border-2 border-[#dfe1e6]"
              />
            </Link>
            <div>
              <Link to={`/profile/${post.user_id}`} className="font-bold text-[#172b4d] hover:text-[#0052cc]">
                {post.owner_name || "Confidential Casting"}
              </Link>
              {post.contact && (
                <a href={`mailto:${post.contact}`} className="text-sm text-[#0052cc] hover:underline block mt-1">
                  Contact Directly
                </a>
              )}
            </div>
          </div>
        </div>

        {/* Share Card */}
        <div className="card p-6 bg-[#f4f5f7]">
          <h3 className="text-sm font-bold text-[#5e6c84] uppercase tracking-wider mb-3">Share this Job</h3>
          <button
            onClick={() => {
              navigator.clipboard.writeText(window.location.href);
              alert("Link copied to clipboard!");
            }}
            className="btn-secondary w-full text-sm"
          >
            📋 Copy Link
          </button>
        </div>

      </aside>
    </div>
  );
}
