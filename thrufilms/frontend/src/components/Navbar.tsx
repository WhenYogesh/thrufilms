import { Link, useNavigate, useLocation } from "react-router-dom";
import { useAuthStore } from "../store/authStore";
import { useState } from "react";

export default function Navbar() {
  const { isAuthenticated, user, logout } = useAuthStore();
  const navigate = useNavigate();
  const location = useLocation();
  const [menuOpen, setMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate("/");
    setMenuOpen(false);
  };

  const navLink = (to: string, label: string) => {
    const active = location.pathname === to || (to === "/" && location.pathname.startsWith("/job"));
    return (
      <Link
        to={to}
        onClick={() => setMenuOpen(false)}
        className={`px-1 py-5 text-sm font-bold tracking-wide transition-colors border-b-2 ${
          active
            ? "border-[#0052cc] text-[#0052cc]"
            : "border-transparent text-[#172b4d] hover:text-[#0052cc]"
        }`}
      >
        {label}
      </Link>
    );
  };

  return (
    <nav className="sticky top-0 z-50 bg-white border-b border-[#dfe1e6] shadow-sm">
      <div className="max-w-[1400px] mx-auto px-4">
        <div className="flex items-center justify-between">
          
          {/* Logo & Main Nav */}
          <div className="flex items-center gap-8">
            <Link to="/" className="flex items-center gap-2 py-4" onClick={() => setMenuOpen(false)}>
              <span className="font-display font-black text-2xl tracking-tighter text-[#172b4d] hover:text-[#0052cc] transition-colors">
                THRUFILMS.
              </span>
            </Link>

            {/* Desktop Nav */}
            <div className="hidden md:flex items-center gap-6">
              {navLink("/", "Casting Calls")}
              {navLink("/talent", "Talent Database")}
            </div>
          </div>

          {/* Spacer */}
          <div className="flex-1" />

          {/* Desktop Auth */}
          <div className="hidden md:flex items-center gap-4 py-3">
            {isAuthenticated ? (
              <>
                <Link to="/job/create" className="btn-primary py-2 px-5">
                  Post a Job
                </Link>
                <Link to="/dashboard" className="text-sm font-bold text-[#172b4d] hover:text-[#0052cc] transition-colors">
                  Dashboard
                </Link>
                <div className="relative group">
                  <Link to={`/profile/${user?.id}`} className="flex items-center gap-2 ml-2">
                    <img
                      src={user?.profile?.profile_image_url || `https://api.dicebear.com/7.x/initials/svg?seed=${user?.id}`}
                      alt="avatar"
                      className="w-9 h-9 rounded-full object-cover border border-[#dfe1e6]"
                    />
                  </Link>
                  <div className="absolute right-0 top-full mt-1 w-48 bg-white border border-[#dfe1e6] rounded shadow-card hidden group-hover:block">
                    <Link to={`/profile/${user?.id}`} className="block px-4 py-2 text-sm font-semibold text-[#172b4d] hover:bg-[#f4f5f7]">My Profile</Link>
                    <Link to="/profile/edit" className="block px-4 py-2 text-sm font-semibold text-[#172b4d] hover:bg-[#f4f5f7]">Edit Profile</Link>
                    <button onClick={handleLogout} className="block w-full text-left px-4 py-2 text-sm font-semibold text-[#bf2600] hover:bg-[#ffebe6]">Log Out</button>
                  </div>
                </div>
              </>
            ) : (
              <>
                <Link to="/login" className="text-sm font-bold text-[#172b4d] hover:text-[#0052cc] transition-colors">
                  Log In
                </Link>
                <Link to="/signup" className="btn-primary py-2 px-6">
                  Join Free
                </Link>
              </>
            )}
          </div>

          {/* Mobile Hamburger */}
          <button
            className="md:hidden text-[#172b4d] p-3"
            onClick={() => setMenuOpen(!menuOpen)}
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5} className="w-6 h-6">
              {menuOpen ? (
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {menuOpen && (
        <div className="md:hidden bg-white border-t border-[#dfe1e6] px-4 py-4 flex flex-col gap-4 animate-fade-in shadow-card absolute w-full">
          <Link to="/" className="text-base font-bold text-[#172b4d]" onClick={() => setMenuOpen(false)}>Casting Calls</Link>
          <Link to="/talent" className="text-base font-bold text-[#172b4d]" onClick={() => setMenuOpen(false)}>Talent Database</Link>
          <div className="border-t border-[#dfe1e6] my-2" />
          {isAuthenticated ? (
            <>
              <Link to="/job/create" className="btn-primary w-full" onClick={() => setMenuOpen(false)}>Post a Job</Link>
              <Link to="/dashboard" className="text-base font-bold text-[#172b4d]" onClick={() => setMenuOpen(false)}>Dashboard</Link>
              <Link to={`/profile/${user?.id}`} className="text-base font-bold text-[#172b4d]" onClick={() => setMenuOpen(false)}>My Profile</Link>
              <button onClick={handleLogout} className="text-base font-bold text-left text-[#bf2600]">Log Out</button>
            </>
          ) : (
            <div className="flex flex-col gap-3">
              <Link to="/login" className="btn-secondary w-full" onClick={() => setMenuOpen(false)}>Log In</Link>
              <Link to="/signup" className="btn-primary w-full" onClick={() => setMenuOpen(false)}>Join Free</Link>
            </div>
          )}
        </div>
      )}
    </nav>
  );
}
