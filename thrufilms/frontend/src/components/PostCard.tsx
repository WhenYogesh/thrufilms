import { Link } from "react-router-dom";
import type { Post } from "../types";

interface PostCardProps {
  post: Post;
}

const budgetLabels: Record<string, string> = {
  paid: "Paid",
  unpaid: "Unpaid",
  collaboration: "Collaboration",
};

export default function PostCard({ post }: PostCardProps) {
  // Use a professional default image if none is provided
  const imageUrl = post.owner_image || `https://api.dicebear.com/7.x/initials/svg?seed=${post.user_id}&backgroundColor=172b4d`;

  return (
    <Link to={`/job/${post.id}`} className="casting-card block">
      {/* Left: Creator Image */}
      <div className="flex-shrink-0 hidden sm:block">
        <img
          src={imageUrl}
          alt={post.owner_name || "Creator"}
          className="w-16 h-16 rounded object-cover border border-[#dfe1e6]"
        />
      </div>

      {/* Middle: Content */}
      <div className="flex-1 min-w-0">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 mb-1">
          <h3 className="text-lg font-bold text-[#0052cc] hover:underline line-clamp-1">
            {post.title}
          </h3>
          <span className="text-xs font-semibold text-[#5e6c84] uppercase tracking-wider whitespace-nowrap hidden sm:inline-block">
            {new Date(post.created_at).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}
          </span>
        </div>

        <div className="flex flex-wrap items-center gap-2 mb-3">
          <span className="badge badge-primary">{post.role_needed}</span>
          <span className="badge badge-success">{budgetLabels[post.budget_type]}</span>
          <span className="text-sm font-semibold text-[#172b4d] flex items-center gap-1 before:content-['•'] before:text-[#dfe1e6] before:mx-1">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} className="w-4 h-4 text-[#5e6c84]">
              <path strokeLinecap="round" strokeLinejoin="round" d="M17.657 16.657L13.414 20.9a2 2 0 01-2.828 0L6.343 16.657A8 8 0 1117.657 16.657z" />
            </svg>
            {post.location}
          </span>
        </div>

        <p className="text-sm text-[#5e6c84] line-clamp-2 leading-relaxed">
          {post.description}
        </p>

        <div className="mt-4 flex items-center gap-4 text-xs font-semibold text-[#5e6c84]">
          <span>By {post.owner_name || "Anonymous"}</span>
          <span className="before:content-['•'] before:text-[#dfe1e6] before:mr-4">{post.comment_count} Comments</span>
        </div>
      </div>
      
      {/* Right: Action (Mobile only) */}
      <div className="sm:hidden mt-2 pt-3 border-t border-[#dfe1e6] flex justify-between items-center">
         <span className="text-xs font-semibold text-[#5e6c84] uppercase tracking-wider">
            {new Date(post.created_at).toLocaleDateString()}
          </span>
         <span className="text-sm font-bold text-[#0052cc]">View Job →</span>
      </div>
    </Link>
  );
}
