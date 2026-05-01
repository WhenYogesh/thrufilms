import { useState, useEffect, useCallback } from "react";
import api from "../api/axios";
import type { Post, PostListResponse } from "../types";
import PostCard from "../components/PostCard";
import { Link } from "react-router-dom";
import { useAuthStore } from "../store/authStore";
import { INDIAN_CITIES, ROLES_NEEDED } from "../types";

const STATS = [
  { label: "Active Casting Calls", value: "200+", icon: "🎬" },
  { label: "Registered Talent", value: "1,500+", icon: "🌟" },
  { label: "Indian Cities", value: "20+", icon: "📍" },
  { label: "Projects Cast", value: "500+", icon: "🎥" },
];

const HOW_IT_WORKS = [
  {
    step: "01",
    title: "Create Your Profile",
    desc: "Sign up free and build your talent card with headshots, reels, and skills.",
    icon: "👤",
  },
  {
    step: "02",
    title: "Browse Casting Calls",
    desc: "Filter by role, location, and budget. Find the perfect match for your talent.",
    icon: "🔍",
  },
  {
    step: "03",
    title: "Apply & Connect",
    desc: "Submit applications directly. Casting directors review your profile and reach out.",
    icon: "🤝",
  },
];

export default function Home() {
  const { isAuthenticated } = useAuthStore();
  const [posts, setPosts] = useState<Post[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [location, setLocation] = useState("");
  const [role, setRole] = useState("");
  const [budget, setBudget] = useState("");
  const PER_PAGE = 10;

  const fetchPosts = useCallback(async () => {
    setLoading(true);
    try {
      const params: Record<string, string | number> = { page, per_page: PER_PAGE };
      if (location) params.location = location;
      if (role) params.role_needed = role;
      if (budget) params.budget_type = budget;
      const res = await api.get<PostListResponse>("/posts", { params });
      setPosts(res.data.posts);
      setTotal(res.data.total);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  }, [page, location, role, budget]);

  useEffect(() => {
    setPage(1);
  }, [location, role, budget]);

  useEffect(() => {
    fetchPosts();
  }, [fetchPosts]);

  const totalPages = Math.ceil(total / PER_PAGE);
  const hasActiveFilters = !!(location || role || budget);

  return (
    <div className="animate-fade-in">
      
      {/* ─── Hero Banner ─── */}
      <div className="bg-gradient-to-br from-[#172b4d] via-[#0747a6] to-[#0052cc] text-white relative overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-10 left-10 w-72 h-72 bg-white rounded-full blur-3xl" />
          <div className="absolute bottom-10 right-10 w-96 h-96 bg-[#4c9aff] rounded-full blur-3xl" />
        </div>
        <div className="max-w-[1200px] mx-auto px-4 py-16 sm:py-20 relative z-10">
          <div className="max-w-2xl">
            <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm rounded-full px-4 py-1.5 mb-6">
              <span className="w-2 h-2 bg-[#36b37e] rounded-full animate-pulse" />
              <span className="text-xs font-bold tracking-wider uppercase text-white/90">India's Film Casting Network</span>
            </div>
            <h1 className="font-display text-3xl sm:text-4xl lg:text-5xl font-black leading-tight mb-5 tracking-tight">
              Where Local Films <br className="hidden sm:block" />
              Find Their <span className="text-[#4c9aff]">Perfect Cast</span>
            </h1>
            <p className="text-base sm:text-lg text-white/80 leading-relaxed mb-8 max-w-lg">
              Post casting calls, discover talent, and build your crew — all in one platform built for Indian independent filmmakers.
            </p>
            <div className="flex flex-col sm:flex-row gap-3">
              {isAuthenticated ? (
                <Link to="/job/create" className="bg-white text-[#0052cc] font-bold px-8 py-3.5 rounded text-base hover:bg-[#f4f5f7] transition-colors text-center">
                  Post a Casting Call
                </Link>
              ) : (
                <>
                  <Link to="/signup" className="bg-white text-[#0052cc] font-bold px-8 py-3.5 rounded text-base hover:bg-[#f4f5f7] transition-colors text-center">
                    Join Free — It's Fast
                  </Link>
                  <Link to="/talent" className="bg-white/10 backdrop-blur-sm text-white font-bold px-8 py-3.5 rounded text-base hover:bg-white/20 transition-colors text-center border border-white/20">
                    Browse Talent
                  </Link>
                </>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* ─── Stats Strip ─── */}
      <div className="bg-white border-b border-[#dfe1e6] shadow-sm">
        <div className="max-w-[1200px] mx-auto px-4 py-5">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 sm:gap-8">
            {STATS.map((s) => (
              <div key={s.label} className="text-center">
                <div className="text-2xl mb-1">{s.icon}</div>
                <div className="font-display font-black text-xl sm:text-2xl text-[#172b4d]">{s.value}</div>
                <div className="text-xs font-bold text-[#5e6c84] uppercase tracking-wider">{s.label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ─── Main Content: Job Board ─── */}
      <div className="page-container sidebar-layout">
        
        {/* Left Sidebar: Filters */}
        <aside className="sidebar-column">
          <div className="card p-5">
            <h2 className="font-display font-bold text-lg text-[#172b4d] mb-4">Find Jobs</h2>
            
            <div className="space-y-4">
              <div>
                <label className="input-label">Role</label>
                <select value={role} onChange={(e) => setRole(e.target.value)} className="select-field">
                  <option value="">Any Role</option>
                  {ROLES_NEEDED.map((r) => (
                    <option key={r} value={r}>{r}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="input-label">Location</label>
                <select value={location} onChange={(e) => setLocation(e.target.value)} className="select-field">
                  <option value="">Any Location</option>
                  {INDIAN_CITIES.map((c) => (
                    <option key={c} value={c}>{c}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="input-label">Pay / Compensation</label>
                <select value={budget} onChange={(e) => setBudget(e.target.value)} className="select-field">
                  <option value="">Any Budget</option>
                  <option value="paid">Paid Jobs</option>
                  <option value="unpaid">Unpaid / Experience</option>
                  <option value="collaboration">Collaboration</option>
                </select>
              </div>

              {hasActiveFilters && (
                <button
                  onClick={() => { setLocation(""); setRole(""); setBudget(""); }}
                  className="text-sm text-[#0052cc] hover:text-[#0747a6] font-bold w-full text-center mt-2"
                >
                  Clear all filters
                </button>
              )}
            </div>
          </div>

          {/* Promo Card */}
          <div className="card p-5 bg-gradient-to-br from-[#0052cc] to-[#0747a6] text-white">
            <h3 className="font-display font-bold text-lg mb-2">Casting a project?</h3>
            <p className="text-sm text-white/90 mb-4 leading-relaxed">
              Find the perfect actors and crew for your next film quickly and easily.
            </p>
            {isAuthenticated ? (
              <Link to="/job/create" className="btn-secondary w-full">Post a Job</Link>
            ) : (
              <Link to="/signup" className="btn-secondary w-full">Join Free</Link>
            )}
          </div>
        </aside>

        {/* Main Column */}
        <div className="main-column">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-4 gap-2">
            <h2 className="section-heading">Casting Calls & Auditions</h2>
            <span className="text-sm font-semibold text-[#5e6c84] bg-[#ebecf0] px-3 py-1 rounded-full">{total} Jobs</span>
          </div>

          <div className="card">
            {loading ? (
              <div className="divide-y divide-[#dfe1e6]">
                {[...Array(5)].map((_, i) => (
                  <div key={i} className="p-5 flex gap-4 animate-pulse">
                    <div className="w-16 h-16 bg-[#ebecf0] rounded hidden sm:block" />
                    <div className="flex-1 space-y-3">
                      <div className="h-5 bg-[#ebecf0] rounded w-1/2" />
                      <div className="flex gap-2">
                        <div className="h-4 bg-[#ebecf0] rounded w-16" />
                        <div className="h-4 bg-[#ebecf0] rounded w-16" />
                      </div>
                      <div className="h-3 bg-[#ebecf0] rounded w-3/4" />
                    </div>
                  </div>
                ))}
              </div>
            ) : posts.length === 0 ? (
              <div className="text-center py-20 px-6">
                <div className="text-6xl mb-4">🎬</div>
                <h3 className="font-display font-bold text-xl text-[#172b4d] mb-2">No jobs found</h3>
                <p className="text-[#5e6c84] mb-6">Try adjusting your filters or check back later.</p>
                {hasActiveFilters && (
                  <button onClick={() => { setLocation(""); setRole(""); setBudget(""); }} className="btn-outline">
                    Clear Filters
                  </button>
                )}
              </div>
            ) : (
              <div className="divide-y divide-[#dfe1e6]">
                {posts.map((post) => (
                  <PostCard key={post.id} post={post} />
                ))}
              </div>
            )}
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex justify-center items-center gap-4 mt-8">
              <button disabled={page === 1} onClick={() => setPage((p) => p - 1)} className="btn-secondary disabled:opacity-40">
                ← Previous
              </button>
              <span className="text-sm font-bold text-[#5e6c84]">
                Page {page} of {totalPages}
              </span>
              <button disabled={page === totalPages} onClick={() => setPage((p) => p + 1)} className="btn-secondary disabled:opacity-40">
                Next →
              </button>
            </div>
          )}
        </div>
      </div>

      {/* ─── How It Works ─── */}
      <div className="bg-white border-t border-[#dfe1e6]">
        <div className="max-w-[1200px] mx-auto px-4 py-16 sm:py-20">
          <div className="text-center mb-12">
            <h2 className="font-display text-2xl sm:text-3xl font-black text-[#172b4d] mb-3">How ThruFilms Works</h2>
            <p className="text-[#5e6c84] max-w-lg mx-auto">Simple steps to connect with your next film project or hire the talent you need.</p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-8">
            {HOW_IT_WORKS.map((item) => (
              <div key={item.step} className="text-center group">
                <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-[#deebff] flex items-center justify-center text-3xl group-hover:scale-110 transition-transform duration-300">
                  {item.icon}
                </div>
                <div className="text-xs font-black text-[#0052cc] uppercase tracking-widest mb-2">Step {item.step}</div>
                <h3 className="font-bold text-lg text-[#172b4d] mb-2">{item.title}</h3>
                <p className="text-sm text-[#5e6c84] leading-relaxed max-w-xs mx-auto">{item.desc}</p>
              </div>
            ))}
          </div>
          <div className="text-center mt-12">
            {!isAuthenticated && (
              <Link to="/signup" className="btn-primary py-3 px-10 text-base">
                Get Started — It's Free
              </Link>
            )}
          </div>
        </div>
      </div>

      {/* ─── CTA Banner ─── */}
      <div className="bg-[#172b4d]">
        <div className="max-w-[1200px] mx-auto px-4 py-14 sm:py-16 text-center">
          <h2 className="font-display text-2xl sm:text-3xl font-black text-white mb-4">Ready to find your next role?</h2>
          <p className="text-white/70 mb-8 max-w-md mx-auto">
            Whether you're an actor looking for auditions or a filmmaker assembling your crew, ThruFilms connects you instantly.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link to={isAuthenticated ? "/job/create" : "/signup"} className="bg-[#0052cc] hover:bg-[#0747a6] text-white font-bold px-8 py-3.5 rounded transition-colors text-center">
              {isAuthenticated ? "Post a Casting Call" : "Create Free Account"}
            </Link>
            <Link to="/talent" className="bg-white/10 text-white font-bold px-8 py-3.5 rounded hover:bg-white/20 transition-colors text-center border border-white/20">
              Explore Talent
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
