import React from "react";
import React, { useContext } from 'react';
import { AuthContext } from '../context/Authcontext';
import { useNavigate, Link } from 'react-router-dom';

function Navbar() {
  const { userData, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout(); // navigate already handled
  };

  return (
    <nav className="backdrop-blur-lg bg-[#020617]/80 border-b border-white/10 shadow-sm sticky top-0 z-50 w-full">
      
      <div className="max-w-7xl mx-auto px-6 flex justify-between items-center h-16">

  {/* LOGO */}
<div className="flex items-center gap-3">

  {/* ICON */}
  <div className="relative w-9 h-9">
    <div className="absolute inset-0 bg-gradient-to-tr from-blue-500 to-cyan-400 rounded-xl rotate-6"></div>
    <div className="absolute inset-0 bg-gray-900 rounded-xl flex items-center justify-center">
      <span className="text-white font-bold text-sm">TC</span>
    </div>
  </div>

  {/* TEXT */}
  <Link to="/" className="text-xl font-semibold text-white tracking-wide">
    TalConnect
  </Link>

</div>

        {/* DESKTOP */}
        {userData ? (
          <div className="hidden sm:flex items-center gap-6">

            {/* ROLE BASED LINKS */}
            {userData.role === "developer" && (
              <Link to="/search" className="text-gray-300 hover:text-white transition">
                Search Jobs
              </Link>
            )}

            {userData.role === "recruiter" && (
              <>
                <Link to="/post-job" className="text-gray-300 hover:text-white transition">
                  Post Job
                </Link>
                <Link to="/my-jobs" className="text-gray-300 hover:text-white transition">
                  My Jobs
                </Link>
              </>
            )}

            {/* PROFILE */}
            <Link to="/profile">
              <img
                src={
                  userData.profilePhoto?.url ||
                  "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTwTjn7ADTGtefL4Im3WluJ6ersByvJf8k7-Q&s"
                }
                alt="Profile"
                className="w-9 h-9 rounded-full object-cover border border-white/20 hover:scale-105 transition"
              />
            </Link>

            {/* LOGOUT */}
            <button
              onClick={handleLogout}
              className="px-4 py-1.5 rounded-md border border-white/30 text-white hover:bg-white hover:text-black transition"
            >
              Logout
            </button>

          </div>
        ) : (
          <div className="hidden sm:flex items-center gap-4">
            <Link
              to="/login"
              className="text-gray-300 hover:text-white transition"
            >
              Login
            </Link>
            <Link
              to="/register"
              className="px-4 py-1.5 rounded-md bg-blue-500 hover:bg-blue-600 text-white transition shadow-md"
            >
              Signup
            </Link>
          </div>
        )}

        {/* MOBILE BUTTON */}
        <div className="sm:hidden">
          <button
            onClick={() => {
              const menu = document.getElementById("mobile-menu");
              menu.classList.toggle("hidden");
            }}
            className="text-white text-2xl"
          >
            ☰
          </button>
        </div>

      </div>

      {/* MOBILE MENU */}
      <div
        id="mobile-menu"
        className="hidden sm:hidden bg-[#020617] backdrop-blur-lg border-t border-white/10 px-4 py-3 text-white"
      >

        <Link to="/" className="block py-1 text-gray-300 hover:text-white">Home</Link>

        {userData && userData.role === "developer" && (
          <Link to="/search" className="block py-1 text-gray-300 hover:text-white">
            Search Jobs
          </Link>
        )}

        {userData && userData.role === "recruiter" && (
          <>
            <Link to="/post-job" className="block py-1 text-gray-300 hover:text-white">
              Post Job
            </Link>
            <Link to="/my-jobs" className="block py-1 text-gray-300 hover:text-white">
              My Jobs
            </Link>
          </>
        )}

        {userData ? (
          <>
            <Link to="/profile" className="block py-1 text-gray-300 hover:text-white">
              Profile
            </Link>
            <button
              onClick={handleLogout}
              className="block py-1 text-left text-gray-300 hover:text-white"
            >
              Logout
            </button>
          </>
        ) : (
          <>
            <Link to="/login" className="block py-1 text-gray-300 hover:text-white">
              Login
            </Link>
            <Link to="/register" className="block py-1 text-gray-300 hover:text-white">
              Signup
            </Link>
          </>
        )}

      </div>

    </nav>
  );
}

export default Navbar;