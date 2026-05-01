import { useState, useEffect, useCallback } from "react";
import api from "../api/axios";
import type { User } from "../types";
import UserCard from "../components/UserCard";
import { Link } from "react-router-dom";
import { useAuthStore } from "../store/authStore";
import { INDIAN_CITIES } from "../types";

export default function People() {
  const { isAuthenticated } = useAuthStore();
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [location, setLocation] = useState("");
  const [role, setRole] = useState("");

  const fetchUsers = useCallback(async () => {
    setLoading(true);
    try {
      const params: Record<string, string> = {};
      if (location) params.location = location;
      if (role) params.role = role.toLowerCase();
      const res = await api.get<User[]>("/users", { params });
      setUsers(res.data);
    } catch {
      setUsers([]);
    } finally {
      setLoading(false);
    }
  }, [location, role]);

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  const PEOPLE_ROLES = [
    { value: "actor", label: "Actors & Performers" },
    { value: "crew", label: "Production Crew" },
    { value: "filmmaker", label: "Filmmakers & Directors" },
  ];

  return (
    <div className="page-container sidebar-layout animate-fade-in">
      
      {/* ─── Left Sidebar: Filters ─── */}
      <aside className="sidebar-column">
        <div className="card p-5">
          <h2 className="font-display font-bold text-lg text-[#172b4d] mb-4">Talent Database</h2>
          
          <div className="space-y-4">
            <div>
              <label className="input-label">Talent Type</label>
              <select
                value={role}
                onChange={(e) => setRole(e.target.value)}
                className="select-field"
              >
                <option value="">All Talent</option>
                {PEOPLE_ROLES.map((r) => (
                  <option key={r.value} value={r.value}>{r.label}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="input-label">Location</label>
              <select
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                className="select-field"
              >
                <option value="">Any Location</option>
                {INDIAN_CITIES.map((c) => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </select>
            </div>

            {(location || role) && (
              <button
                onClick={() => { setLocation(""); setRole(""); }}
                className="text-sm text-[#0052cc] hover:text-[#0747a6] font-bold w-full text-center mt-2"
              >
                Clear all filters
              </button>
            )}
          </div>
        </div>

        {/* Promo Card */}
        <div className="card p-5 bg-[#172b4d] text-white">
          <h3 className="font-display font-bold text-lg mb-2">Create Your Profile</h3>
          <p className="text-sm text-[#97a0af] mb-4 leading-relaxed">
            Get discovered by casting directors and filmmakers. Showcase your reel and skills.
          </p>
          {isAuthenticated ? (
            <Link to="/profile/edit" className="btn-primary w-full">Edit Profile</Link>
          ) : (
            <Link to="/signup" className="btn-primary w-full">Join Free</Link>
          )}
        </div>
      </aside>

      {/* ─── Main Content: Talent Grid ─── */}
      <div className="main-column">
        <div className="flex items-center justify-between mb-4">
          <h1 className="section-heading">Discover Talent</h1>
          <span className="text-sm font-semibold text-[#5e6c84]">{users.length} Profiles</span>
        </div>

        {loading ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-5">
            {[...Array(8)].map((_, i) => (
              <div key={i} className="card animate-pulse h-64">
                <div className="w-full h-32 bg-[#ebecf0] mb-3" />
                <div className="p-3 space-y-2">
                  <div className="h-4 bg-[#ebecf0] rounded w-3/4" />
                  <div className="h-3 bg-[#ebecf0] rounded w-1/2" />
                </div>
              </div>
            ))}
          </div>
        ) : users.length === 0 ? (
          <div className="card text-center py-20 px-6">
            <div className="text-6xl mb-4">🎭</div>
            <h3 className="font-display font-bold text-xl text-[#172b4d] mb-2">No talent found</h3>
            <p className="text-[#5e6c84] mb-6">Try adjusting your filters.</p>
            {(location || role) && (
              <button onClick={() => { setLocation(""); setRole(""); }} className="btn-outline">
                Clear Filters
              </button>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-5">
            {users.map((user) => (
              <UserCard key={user.id} user={user} />
            ))}
          </div>
        )}
      </div>

    </div>
  );
}
