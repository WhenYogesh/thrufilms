import { useState, type FormEvent } from "react";
import { Link, useNavigate } from "react-router-dom";
import api from "../api/axios";
import { useAuthStore } from "../store/authStore";
import type { AuthToken, User } from "../types";

export default function Login() {
  const navigate = useNavigate();
  const { login } = useAuthStore();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const res = await api.post<AuthToken>("/auth/login", { email, password });
      const { access_token } = res.data;

      localStorage.setItem("tf_token", access_token);
      const userRes = await api.get<User>("/users/me");
      login(userRes.data, access_token);

      if (!userRes.data.profile) {
        navigate("/profile/edit");
      } else {
        navigate("/");
      }
    } catch (err: unknown) {
      const msg = (err as { response?: { data?: { detail?: string } } })?.response?.data?.detail;
      setError(msg || "Login failed. Check your credentials.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="page-container flex items-center justify-center min-h-[80vh]">
      <div className="w-full max-w-md animate-slide-up">
        <div className="text-center mb-8">
          <h1 className="font-display text-3xl font-black tracking-tight text-[#172b4d] mb-2">Welcome Back</h1>
          <p className="text-[#5e6c84]">Log in to your ThruFilms account</p>
        </div>

        <div className="card p-8">
          <form onSubmit={handleSubmit} className="flex flex-col gap-5">
            {error && <div className="alert-error">{error}</div>}

            <div>
              <label htmlFor="login-email" className="input-label">Email Address</label>
              <input
                id="login-email"
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
              <label htmlFor="login-password" className="input-label">Password</label>
              <input
                id="login-password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="input-field"
                placeholder="Enter your password"
                required
                autoComplete="current-password"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="btn-primary w-full text-base py-3 mt-2"
            >
              {loading ? "Logging in..." : "Log In"}
            </button>
          </form>
        </div>

        <p className="text-center text-[#5e6c84] mt-8 font-medium">
          Don't have an account?{" "}
          <Link to="/signup" className="text-[#0052cc] hover:underline">
            Join Free
          </Link>
        </p>
      </div>
    </div>
  );
}
