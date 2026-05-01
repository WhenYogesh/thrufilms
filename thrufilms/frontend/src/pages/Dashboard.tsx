import { useEffect, useState } from "react";
import api from "../api/axios";
import type { Post, Application, Comment } from "../types";
import { useAuthStore } from "../store/authStore";
import { Link } from "react-router-dom";

type TabType = "applicants" | "comments";

export default function Dashboard() {
  const { user } = useAuthStore();
  const [posts, setPosts] = useState<Post[]>([]);
  const [selectedPost, setSelectedPost] = useState<Post | null>(null);
  const [applicants, setApplicants] = useState<Application[]>([]);
  const [comments, setComments] = useState<Comment[]>([]);
  const [loadingPosts, setLoadingPosts] = useState(true);
  const [loadingContent, setLoadingContent] = useState(false);
  const [activeTab, setActiveTab] = useState<TabType>("applicants");
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const res = await api.get<{ posts: Post[]; total: number }>("/posts", { params: { per_page: 50 } });
        const myPosts = res.data.posts.filter((p) => p.user_id === user?.id);
        setPosts(myPosts);
        if (myPosts.length > 0) setSelectedPost(myPosts[0]);
      } finally {
        setLoadingPosts(false);
      }
    };
    fetchPosts();
  }, [user]);

  useEffect(() => {
    if (!selectedPost) return;
    const fetchContent = async () => {
      setLoadingContent(true);
      try {
        const [appRes, commentRes] = await Promise.all([
          api.get<Application[]>(`/posts/${selectedPost.id}/applicants`).catch(() => ({ data: [] as Application[] })),
          api.get<Comment[]>(`/posts/${selectedPost.id}/comments`).catch(() => ({ data: [] as Comment[] })),
        ]);
        setApplicants(appRes.data);
        setComments(commentRes.data);
      } finally {
        setLoadingContent(false);
      }
    };
    fetchContent();
  }, [selectedPost]);

  const timeAgo = (dateStr: string) => {
    const diff = Date.now() - new Date(dateStr).getTime();
    const mins = Math.floor(diff / 60000);
    if (mins < 1) return "just now";
    if (mins < 60) return `${mins}m ago`;
    const hours = Math.floor(mins / 60);
    if (hours < 24) return `${hours}h ago`;
    const days = Math.floor(hours / 24);
    if (days < 30) return `${days}d ago`;
    return new Date(dateStr).toLocaleDateString();
  };

  const handleSelectPost = (post: Post) => {
    setSelectedPost(post);
    setActiveTab("applicants");
    setMobileSidebarOpen(false);
  };

  return (
    <div className="page-container animate-fade-in">
      
      {/* Mobile: Post selector toggle */}
      <div className="lg:hidden mb-4">
        <button
          onClick={() => setMobileSidebarOpen(!mobileSidebarOpen)}
          className="btn-secondary w-full flex items-center justify-between"
        >
          <span className="font-bold">{selectedPost ? selectedPost.title : "Select a Job"}</span>
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} className={`w-4 h-4 transition-transform ${mobileSidebarOpen ? "rotate-180" : ""}`}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
          </svg>
        </button>
        {mobileSidebarOpen && (
          <div className="card mt-2 p-3 space-y-2 animate-fade-in">
            {posts.map((post) => (
              <div
                key={post.id}
                onClick={() => handleSelectPost(post)}
                className={`p-3 rounded cursor-pointer transition-colors ${
                  selectedPost?.id === post.id ? "bg-[#deebff] border border-[#0052cc]" : "hover:bg-[#f4f5f7] border border-transparent"
                }`}
              >
                <h3 className="font-bold text-sm text-[#172b4d] truncate">{post.title}</h3>
                <div className="flex gap-2 text-xs mt-1">
                  <span className="badge badge-warning text-[10px]">{post.role_needed}</span>
                  <span className="text-[#5e6c84]">{new Date(post.created_at).toLocaleDateString()}</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="sidebar-layout">
        {/* ─── Left Sidebar: Manage Posts (Desktop) ─── */}
        <aside className="sidebar-column hidden lg:block">
          <div className="flex items-center justify-between mb-4">
            <h1 className="font-display font-bold text-xl text-[#172b4d]">Your Jobs</h1>
            <Link to="/job/create" className="btn-primary text-xs py-1.5 px-3">+ New</Link>
          </div>

          {loadingPosts ? (
            <div className="card p-6 animate-pulse h-48" />
          ) : posts.length === 0 ? (
            <div className="card p-6 text-center">
              <p className="text-[#5e6c84] text-sm mb-4">You haven't posted any jobs yet.</p>
              <Link to="/job/create" className="btn-outline w-full">Post a Job</Link>
            </div>
          ) : (
            <div className="space-y-3">
              {posts.map((post) => (
                <div 
                  key={post.id} 
                  onClick={() => handleSelectPost(post)} 
                  className={`card p-4 cursor-pointer hover:-translate-y-0.5 transition-all ${selectedPost?.id === post.id ? "border-[#0052cc] bg-[#deebff]" : ""}`}
                >
                  <h3 className="font-bold text-[#172b4d] text-sm truncate mb-2">{post.title}</h3>
                  <div className="flex justify-between items-center text-xs">
                    <span className="badge badge-warning">{post.role_needed}</span>
                    <span className="text-[#5e6c84]">{new Date(post.created_at).toLocaleDateString()}</span>
                  </div>
                  <div className="flex gap-3 mt-2 text-xs text-[#5e6c84]">
                    <span>{post.comment_count || 0} 💬</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </aside>

        {/* ─── Main Column ─── */}
        <div className="main-column">
          {selectedPost ? (
            <div className="card min-h-[500px] sm:min-h-[600px]">
              {/* Header */}
              <div className="p-4 sm:p-6 border-b border-[#dfe1e6]">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div>
                    <h2 className="text-lg sm:text-xl font-bold text-[#172b4d] mb-1">
                      Dashboard
                    </h2>
                    <p className="text-sm text-[#5e6c84]">
                      For: <Link to={`/job/${selectedPost.id}`} className="text-[#0052cc] hover:underline font-medium">{selectedPost.title}</Link>
                    </p>
                  </div>
                  <Link to={`/job/${selectedPost.id}`} className="btn-secondary text-xs py-1.5 px-4 whitespace-nowrap self-start sm:self-center">
                    View Public Page →
                  </Link>
                </div>
              </div>

              {/* Tabs */}
              <div className="flex border-b border-[#dfe1e6]">
                <button
                  onClick={() => setActiveTab("applicants")}
                  className={`flex-1 sm:flex-none px-6 py-3 text-sm font-bold border-b-2 transition-colors ${
                    activeTab === "applicants"
                      ? "border-[#0052cc] text-[#0052cc]"
                      : "border-transparent text-[#5e6c84] hover:text-[#172b4d]"
                  }`}
                >
                  Applicants
                  <span className="ml-2 bg-[#ebecf0] text-[#5e6c84] text-xs px-2 py-0.5 rounded-full">{applicants.length}</span>
                </button>
                <button
                  onClick={() => setActiveTab("comments")}
                  className={`flex-1 sm:flex-none px-6 py-3 text-sm font-bold border-b-2 transition-colors ${
                    activeTab === "comments"
                      ? "border-[#0052cc] text-[#0052cc]"
                      : "border-transparent text-[#5e6c84] hover:text-[#172b4d]"
                  }`}
                >
                  Comments
                  <span className="ml-2 bg-[#ebecf0] text-[#5e6c84] text-xs px-2 py-0.5 rounded-full">{comments.length}</span>
                </button>
              </div>

              {/* Tab Content */}
              <div className="p-4 sm:p-6">
                {loadingContent ? (
                  <div className="animate-pulse space-y-4">
                    {[...Array(3)].map((_, i) => <div key={i} className="h-24 bg-[#ebecf0] rounded" />)}
                  </div>
                ) : activeTab === "applicants" ? (
                  /* Applicants Tab */
                  applicants.length === 0 ? (
                    <div className="text-center py-16">
                      <div className="text-4xl mb-3">📥</div>
                      <p className="text-[#5e6c84] font-medium">No applications received yet.</p>
                      <p className="text-xs text-[#97a0af] mt-2">Share your job link to attract more talent.</p>
                    </div>
                  ) : (
                    <div className="space-y-4 animate-fade-in">
                      {applicants.map((app) => (
                        <div key={app.id} className="p-4 border border-[#dfe1e6] rounded-lg bg-[#fafbfc] flex flex-col sm:flex-row items-start gap-4">
                          <Link to={`/profile/${app.applicant_id}`} className="flex-shrink-0">
                            <img
                              src={app.applicant_image || `https://api.dicebear.com/7.x/initials/svg?seed=${app.applicant_id}&backgroundColor=172b4d`}
                              alt=""
                              className="w-14 h-14 sm:w-16 sm:h-16 rounded-full object-cover border border-[#dfe1e6]"
                            />
                          </Link>
                          <div className="flex-1 min-w-0">
                            <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-1">
                              <Link to={`/profile/${app.applicant_id}`} className="font-bold text-base sm:text-lg text-[#0052cc] hover:underline">
                                {app.applicant_name || "Anonymous"}
                              </Link>
                              <span className="text-xs font-semibold text-[#5e6c84] uppercase tracking-wider whitespace-nowrap">{timeAgo(app.applied_at)}</span>
                            </div>
                            
                            <div className="flex flex-wrap gap-2 mt-1 mb-3">
                              {app.applicant_role && <span className="badge badge-primary text-[10px]">{app.applicant_role}</span>}
                              {app.applicant_location && <span className="text-xs text-[#5e6c84] flex items-center">📍 {app.applicant_location}</span>}
                            </div>

                            {app.message && (
                              <div className="bg-white border border-[#dfe1e6] p-3 rounded text-sm text-[#172b4d] italic">
                                "{app.message}"
                              </div>
                            )}
                          </div>
                          <Link to={`/profile/${app.applicant_id}`} className="btn-secondary whitespace-nowrap text-xs py-1.5 self-start">
                            View Profile
                          </Link>
                        </div>
                      ))}
                    </div>
                  )
                ) : (
                  /* Comments Tab */
                  comments.length === 0 ? (
                    <div className="text-center py-16">
                      <div className="text-4xl mb-3">💬</div>
                      <p className="text-[#5e6c84] font-medium">No comments yet.</p>
                      <p className="text-xs text-[#97a0af] mt-2">Comments from the public will appear here.</p>
                    </div>
                  ) : (
                    <div className="space-y-0 animate-fade-in">
                      {comments.map((c, idx) => (
                        <div
                          key={c.id}
                          className={`flex gap-3 py-4 ${idx !== comments.length - 1 ? "border-b border-[#dfe1e6]" : ""}`}
                        >
                          <Link to={`/profile/${c.user_id}`} className="flex-shrink-0">
                            <img
                              src={c.author_image || `https://api.dicebear.com/7.x/initials/svg?seed=${c.author_name || c.user_id}&backgroundColor=172b4d`}
                              alt=""
                              className="w-10 h-10 rounded-full object-cover border border-[#dfe1e6]"
                            />
                          </Link>
                          <div className="flex-1 min-w-0">
                            <div className="flex flex-wrap items-center gap-2 mb-1">
                              <Link to={`/profile/${c.user_id}`} className="font-bold text-sm text-[#172b4d] hover:text-[#0052cc]">
                                {c.author_name || "Anonymous"}
                              </Link>
                              {c.author_role && (
                                <span className="badge text-[10px] py-0.5 px-1.5">{c.author_role}</span>
                              )}
                              <span className="text-xs text-[#97a0af]">{timeAgo(c.created_at)}</span>
                            </div>
                            <p className="text-sm text-[#172b4d] leading-relaxed">{c.content}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  )
                )}
              </div>
            </div>
          ) : (
            <div className="card p-6 min-h-[500px] sm:min-h-[600px] flex items-center justify-center text-center">
              <div>
                <div className="text-5xl mb-4">📋</div>
                <p className="text-[#5e6c84] font-medium">Select a job listing to view applicants and comments.</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
