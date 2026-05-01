import { BrowserRouter, Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import ProtectedRoute from "./components/ProtectedRoute";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Profile from "./pages/Profile";
import EditProfile from "./pages/EditProfile";
import CreatePost from "./pages/CreatePost";
import PostDetail from "./pages/PostDetail";
import Dashboard from "./pages/Dashboard";
import People from "./pages/People";

export default function App() {
  return (
    <BrowserRouter>
      <div className="min-h-screen bg-[#f4f5f7] flex flex-col">
        <Navbar />
        <main className="flex-1">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />
            <Route path="/talent" element={<People />} />
            <Route path="/profile/:id" element={<Profile />} />
            <Route path="/job/:id" element={<PostDetail />} />

            {/* Protected Routes */}
            <Route
              path="/profile/edit"
              element={
                <ProtectedRoute>
                  <EditProfile />
                </ProtectedRoute>
              }
            />
            <Route
              path="/job/create"
              element={
                <ProtectedRoute>
                  <CreatePost />
                </ProtectedRoute>
              }
            />
            <Route
              path="/dashboard"
              element={
                <ProtectedRoute>
                  <Dashboard />
                </ProtectedRoute>
              }
            />

            {/* 404 */}
            <Route
              path="*"
              element={
                <div className="page-container flex flex-col items-center justify-center py-32 text-center">
                  <h1 className="font-display text-4xl font-bold text-[#172b4d] mb-4">Page Not Found</h1>
                  <p className="text-[#5e6c84] mb-8 max-w-md">The page you're looking for doesn't exist or has been removed.</p>
                  <a href="/" className="btn-primary">Return Home</a>
                </div>
              }
            />
          </Routes>
        </main>

        {/* Footer */}
        <footer className="bg-[#172b4d] text-white py-12 mt-12">
          <div className="max-w-[1200px] mx-auto px-4">
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-8 mb-10">
              <div className="col-span-2 sm:col-span-1">
                <div className="font-display font-black text-2xl tracking-tighter mb-3">
                  THRUFILMS.
                </div>
                <p className="text-sm text-[#97a0af] leading-relaxed">
                  India's casting and talent network for independent filmmakers.
                </p>
              </div>
              <div>
                <h4 className="text-xs font-bold uppercase tracking-wider text-[#97a0af] mb-3">Platform</h4>
                <div className="flex flex-col gap-2">
                  <a href="/" className="text-sm text-white/80 hover:text-white">Casting Calls</a>
                  <a href="/talent" className="text-sm text-white/80 hover:text-white">Talent Database</a>
                  <a href="/job/create" className="text-sm text-white/80 hover:text-white">Post a Job</a>
                </div>
              </div>
              <div>
                <h4 className="text-xs font-bold uppercase tracking-wider text-[#97a0af] mb-3">Company</h4>
                <div className="flex flex-col gap-2">
                  <a href="#" className="text-sm text-white/80 hover:text-white">About</a>
                  <a href="#" className="text-sm text-white/80 hover:text-white">Blog</a>
                  <a href="#" className="text-sm text-white/80 hover:text-white">Contact</a>
                </div>
              </div>
              <div>
                <h4 className="text-xs font-bold uppercase tracking-wider text-[#97a0af] mb-3">Legal</h4>
                <div className="flex flex-col gap-2">
                  <a href="#" className="text-sm text-white/80 hover:text-white">Terms of Service</a>
                  <a href="#" className="text-sm text-white/80 hover:text-white">Privacy Policy</a>
                  <a href="#" className="text-sm text-white/80 hover:text-white">Cookie Policy</a>
                </div>
              </div>
            </div>
            <div className="border-t border-white/10 pt-6 flex flex-col sm:flex-row justify-between items-center gap-3">
              <p className="text-xs text-[#97a0af]">© {new Date().getFullYear()} ThruFilms. All rights reserved.</p>
              <p className="text-xs text-[#97a0af]">Made with 🎬 for Indian Filmmakers</p>
            </div>
          </div>
        </footer>
      </div>
    </BrowserRouter>
  );
}
