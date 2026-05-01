import { useEffect, useState, type FormEvent } from "react";
import { Link } from "react-router-dom";
import api from "../api/axios";
import type { Comment } from "../types";
import { useAuthStore } from "../store/authStore";

interface CommentSectionProps {
  postId: number;
}

export default function CommentSection({ postId }: CommentSectionProps) {
  const { isAuthenticated } = useAuthStore();
  const [comments, setComments] = useState<Comment[]>([]);
  const [loading, setLoading] = useState(true);
  const [content, setContent] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  const fetchComments = async () => {
    try {
      const res = await api.get<Comment[]>(`/posts/${postId}/comments`);
      setComments(res.data);
    } catch {
      /* empty */
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchComments();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [postId]);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!content.trim()) return;
    setError("");
    setSubmitting(true);
    try {
      await api.post(`/posts/${postId}/comments`, { content: content.trim() });
      setContent("");
      await fetchComments();
    } catch (err: unknown) {
      const msg = (err as { response?: { data?: { detail?: string } } })?.response?.data?.detail;
      setError(msg || "Failed to post comment.");
    } finally {
      setSubmitting(false);
    }
  };

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

  return (
    <div className="card p-6 sm:p-8">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-lg font-bold text-[#172b4d]">
          Discussion
          <span className="text-sm font-semibold text-[#5e6c84] ml-2">({comments.length})</span>
        </h2>
      </div>

      {/* Comment Form */}
      {isAuthenticated ? (
        <form onSubmit={handleSubmit} className="mb-8">
          {error && <div className="alert-error mb-3">{error}</div>}
          <div className="flex gap-3">
            <div className="flex-1">
              <textarea
                value={content}
                onChange={(e) => setContent(e.target.value)}
                rows={3}
                className="textarea-field text-sm"
                placeholder="Share your thoughts, ask questions about this role..."
              />
            </div>
          </div>
          <div className="flex justify-end mt-3">
            <button
              type="submit"
              disabled={submitting || !content.trim()}
              className="btn-primary py-2 px-5 text-sm"
            >
              {submitting ? "Posting..." : "Post Comment"}
            </button>
          </div>
        </form>
      ) : (
        <div className="bg-[#f4f5f7] rounded-lg p-5 mb-8 text-center">
          <p className="text-sm text-[#5e6c84] mb-3">Join the conversation</p>
          <Link to="/login" className="btn-primary py-2 px-6 text-sm inline-flex">
            Log In to Comment
          </Link>
        </div>
      )}

      {/* Comments List */}
      {loading ? (
        <div className="space-y-4 animate-pulse">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="flex gap-3">
              <div className="w-10 h-10 bg-[#ebecf0] rounded-full flex-shrink-0" />
              <div className="flex-1 space-y-2">
                <div className="h-4 bg-[#ebecf0] rounded w-1/4" />
                <div className="h-3 bg-[#ebecf0] rounded w-3/4" />
              </div>
            </div>
          ))}
        </div>
      ) : comments.length === 0 ? (
        <div className="text-center py-10">
          <div className="text-4xl mb-3">💬</div>
          <p className="text-[#5e6c84] font-medium text-sm">No comments yet. Be the first to share your thoughts!</p>
        </div>
      ) : (
        <div className="space-y-0">
          {comments.map((c, idx) => (
            <div
              key={c.id}
              className={`flex gap-3 py-5 ${idx !== comments.length - 1 ? "border-b border-[#dfe1e6]" : ""}`}
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
                <p className="text-sm text-[#172b4d] leading-relaxed whitespace-pre-wrap">{c.content}</p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
