import { useEffect, useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import api from "../api/axios";
import type { User } from "../types";
import { useAuthStore } from "../store/authStore";

const roleLabels: Record<string, string> = {
  actor: "Actor / Performer",
  crew: "Film Crew",
  filmmaker: "Filmmaker",
};

export default function Profile() {
  const { id } = useParams<{ id: string }>();
  const { user: me } = useAuthStore();
  const navigate = useNavigate();
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const isOwn = me?.id === Number(id);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await api.get<User>(`/users/${id}`);
        setUser(res.data);
      } catch {
        setError("User not found.");
      } finally {
        setLoading(false);
      }
    };
    fetchUser();
  }, [id]);

  if (loading) {
    return (
      <div className="page-container sidebar-layout animate-pulse">
        <div className="sidebar-column">
          <div className="card p-6 h-96" />
        </div>
        <div className="main-column space-y-6">
          <div className="card p-6 h-64" />
        </div>
      </div>
    );
  }

  if (error || !user) {
    return (
      <div className="page-container text-center py-32">
        <div className="text-5xl mb-4">😔</div>
        <p className="text-[#5e6c84] font-medium">{error || "User not found."}</p>
        <button onClick={() => navigate(-1)} className="btn-secondary mt-6 mx-auto">Go Back</button>
      </div>
    );
  }

  const profile = user.profile;

  return (
    <div className="page-container sidebar-layout animate-fade-in">
      
      {/* ─── Left Sidebar: Headshot & Contact ─── */}
      <aside className="sidebar-column">
        <div className="card overflow-hidden">
          {/* Headshot */}
          <div className="w-full pt-[120%] relative bg-[#ebecf0]">
            <img
              src={
                profile?.profile_image_url ||
                `https://api.dicebear.com/7.x/initials/svg?seed=${profile?.name || user.id}&backgroundColor=172b4d`
              }
              alt={profile?.name || "User"}
              className="absolute inset-0 w-full h-full object-cover"
            />
          </div>

          <div className="p-5">
            {isOwn ? (
              <Link to="/profile/edit" className="btn-outline w-full mb-3">
                Edit Profile
              </Link>
            ) : profile ? (
              <a
                href={`https://wa.me/?text=Hi, I found your profile on ThruFilms!`}
                target="_blank"
                rel="noreferrer"
                className="btn-primary w-full mb-3"
              >
                Contact Me
              </a>
            ) : null}

            {!profile && isOwn && (
              <div className="bg-[#fffae6] border border-[#ff8b00] rounded p-3 mb-3">
                <p className="text-xs font-bold text-[#ff8b00] mb-2">Profile Incomplete</p>
                <Link to="/profile/edit" className="btn-primary w-full text-xs">Complete Profile</Link>
              </div>
            )}

            {/* Basic Stats */}
            <div className="space-y-3 mt-4 pt-4 border-t border-[#dfe1e6]">
              <div>
                <span className="block text-[10px] font-bold text-[#5e6c84] uppercase tracking-wider">Primary Role</span>
                <span className="text-sm font-semibold text-[#172b4d]">{roleLabels[user.role] || user.role}</span>
              </div>
              {profile?.location && (
                <div>
                  <span className="block text-[10px] font-bold text-[#5e6c84] uppercase tracking-wider">Location</span>
                  <span className="text-sm font-semibold text-[#172b4d]">{profile.location}</span>
                </div>
              )}
            </div>
          </div>
        </div>
      </aside>

      {/* ─── Main Column: Details ─── */}
      <div className="main-column space-y-6">
        
        {/* Header */}
        <div className="card p-8">
          <h1 className="font-display font-black text-4xl text-[#172b4d] mb-4">
            {profile?.name || "Anonymous User"}
          </h1>
          
          <h2 className="text-sm font-bold text-[#5e6c84] uppercase tracking-wider mb-2 border-b border-[#dfe1e6] pb-2">About Me</h2>
          {profile?.bio ? (
            <p className="text-[#172b4d] leading-relaxed whitespace-pre-wrap text-[15px]">
              {profile.bio}
            </p>
          ) : (
            <p className="text-[#97a0af] italic">No biography provided.</p>
          )}
        </div>

        {/* Skills */}
        {profile?.skills && profile.skills.length > 0 && (
          <div className="card p-8">
            <h2 className="text-sm font-bold text-[#5e6c84] uppercase tracking-wider mb-4 border-b border-[#dfe1e6] pb-2">Skills & Attributes</h2>
            <div className="flex flex-wrap gap-2">
              {profile.skills.map((skill) => (
                <span key={skill} className="bg-[#ebecf0] text-[#172b4d] font-semibold text-sm px-4 py-1.5 rounded">
                  {skill}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Portfolio */}
        {profile?.portfolio_urls && profile.portfolio_urls.length > 0 && (
          <div className="card p-8">
            <h2 className="text-sm font-bold text-[#5e6c84] uppercase tracking-wider mb-4 border-b border-[#dfe1e6] pb-2">Media & Portfolio</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {profile.portfolio_urls.map((url, i) => (
                <a key={i} href={url} target="_blank" rel="noreferrer" className="block group">
                  <div className="aspect-video bg-[#ebecf0] rounded overflow-hidden relative border border-[#dfe1e6] group-hover:border-[#0052cc] transition-colors">
                    <img
                      src={url}
                      alt={`Portfolio ${i + 1}`}
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        (e.target as HTMLImageElement).src = "https://via.placeholder.com/600x400/f4f5f7/5e6c84?text=External+Link";
                      }}
                    />
                    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors flex items-center justify-center">
                      <span className="opacity-0 group-hover:opacity-100 bg-white text-[#172b4d] font-bold text-xs px-3 py-1.5 rounded shadow-sm transition-opacity">View Work</span>
                    </div>
                  </div>
                </a>
              ))}
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
