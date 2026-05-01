import { Link } from "react-router-dom";
import type { User } from "../types";

interface UserCardProps {
  user: User;
}

const roleColors: Record<string, string> = {
  actor: "badge-primary",
  crew: "badge-warning",
  filmmaker: "badge-success",
};

export default function UserCard({ user }: UserCardProps) {
  const profile = user.profile;

  return (
    <Link to={`/profile/${user.id}`} className="talent-card block flex flex-col h-full">
      {/* Avatar / Headshot */}
      <div className="w-full pt-[100%] relative bg-[#ebecf0]">
        <img
          src={
            profile?.profile_image_url ||
            `https://api.dicebear.com/7.x/initials/svg?seed=${profile?.name || user.id}&backgroundColor=172b4d`
          }
          alt={profile?.name || "User"}
          className="absolute inset-0 w-full h-full object-cover"
        />
      </div>

      {/* Info */}
      <div className="p-4 flex flex-col flex-1">
        <h3 className="font-bold text-[#172b4d] text-base truncate mb-1">
          {profile?.name || "Anonymous"}
        </h3>
        
        <div className="mb-2">
          <span className={`badge ${roleColors[user.role] || "badge-primary"}`}>
            {user.role}
          </span>
        </div>

        {profile?.location && (
          <p className="text-xs font-semibold text-[#5e6c84] mb-3 flex items-center gap-1 uppercase tracking-wide">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} className="w-3 h-3">
              <path strokeLinecap="round" strokeLinejoin="round" d="M17.657 16.657L13.414 20.9a2 2 0 01-2.828 0L6.343 16.657A8 8 0 1117.657 16.657z" />
            </svg>
            {profile.location}
          </p>
        )}

        <div className="flex-1" />

        {/* Skills preview */}
        {profile?.skills && profile.skills.length > 0 && (
          <div className="pt-3 border-t border-[#dfe1e6] flex gap-1 flex-wrap">
             {profile.skills.slice(0, 2).map(s => (
               <span key={s} className="text-[10px] font-bold text-[#5e6c84] bg-[#ebecf0] px-2 py-0.5 rounded">
                 {s}
               </span>
             ))}
             {profile.skills.length > 2 && (
                <span className="text-[10px] font-bold text-[#97a0af] px-1 py-0.5">
                  +{profile.skills.length - 2}
                </span>
             )}
          </div>
        )}
      </div>
    </Link>
  );
}
