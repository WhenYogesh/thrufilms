import { useState, type FormEvent } from "react";
import { Link, useNavigate } from "react-router-dom";
import api from "../api/axios";
import { useAuthStore } from "../store/authStore";
import type { AuthToken, User } from "../types";

const ROLE_OPTIONS = [
  { value: "actor", label: "Talent", desc: "Actor, Model, Voiceover" },
  { value: "crew", label: "Crew", desc: "Editor, DOP, Production" },
  { value: "filmmaker", label: "Creator", desc: "Director, Casting, Producer" },
];

export default function Signup() {
  const navigate = useNavigate();
  const { login } = useAuthStore();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("actor");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError("");
    if (password.length < 6) {
      setError("Password must be at least 6 characters.");
      return;
    }
    setLoading(true);
    try {
      const res = await api.post<AuthToken>("/auth/signup", { email, password, role });
      const { access_token } = res.data;
      localStorage.setItem("tf_token", access_token);
      const userRes = await api.get<User>("/users/me");
      login(userRes.data, access_token);
      navigate("/profile/edit");
    } catch (err: unknown) {
      const msg = (err as { response?: { data?: { detail?: string } } })?.response?.data?.detail;
      setError(msg || "Signup failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="page-container flex items-center justify-center min-h-[80vh]">
      <div className="w-full max-w-md animate-slide-up">
        <div className="text-center mb-8">
          <h1 className="font-display text-3xl font-black tracking-tight text-[#172b4d] mb-2">Join ThruFilms</h1>
          <p className="text-[#5e6c84]">Create your free professional profile</p>
        </div>

        <div className="card p-8">
          <form onSubmit={handleSubmit} className="flex flex-col gap-6">
            {error && <div className="alert-error">{error}</div>}

            {/* Role selection */}
            <div>
              <label className="input-label">I am signing up as...</label>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                {ROLE_OPTIONS.map((opt) => (
                  <button
                    key={opt.value}
                    type="button"
                    onClick={() => setRole(opt.value)}
                    className={`flex flex-col items-center justify-center p-3 rounded border text-center cursor-pointer transition-all duration-200 ${
                      role === opt.value
                        ? "border-[#0052cc] bg-[#deebff] text-[#0052cc]"
                        : "border-[#dfe1e6] bg-white text-[#5e6c84] hover:bg-[#fafbfc]"
                    }`}
                  >
                    <span className="text-sm font-bold">{opt.label}</span>
                    <span className="text-[10px] mt-1 text-center leading-tight opacity-80">{opt.desc}</span>
                  </button>
                ))}
              </div>
            </div>

            <div className="border-t border-[#dfe1e6] my-1" />

            <div>
              <label htmlFor="signup-email" className="input-label">Email Address</label>
              <input
                id="signup-email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="input-field"
                placeholder="you@example.com"
                required
                autoComplete="email"
              />
            </div>

            <div>
              <label htmlFor="signup-password" className="input-label">Password</label>
              <input
                id="signup-password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="input-field"
                placeholder="Min. 6 characters"
                required
                minLength={6}
                autoComplete="new-password"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="btn-primary w-full text-base py-3 mt-2"
            >
              {loading ? "Creating account..." : "Create Account"}
            </button>

            <p className="text-xs text-[#97a0af] text-center mt-2 leading-relaxed">
              By joining, you agree to our Terms of Service & Privacy Policy.
            </p>
          </form>
        </div>

        <p className="text-center text-[#5e6c84] mt-8 font-medium">
          Already a member?{" "}
          <Link to="/login" className="text-[#0052cc] hover:underline">
            Log In
          </Link>
        </p>
      </div>
    </div>
  );
}
