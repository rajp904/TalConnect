import React, { useContext } from "react";
import { AuthContext } from "../context/Authcontext";

export default function Profile() {
  const { userData } = useContext(AuthContext);

  if (!userData) {
    return (
      <div className="text-center mt-20 text-xl font-semibold">
        Loading User Data...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0f172a] flex justify-center items-center px-4">

      {/* MAIN CARD */}
      <div className="w-full max-w-4xl bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl shadow-2xl p-8">

        {/* TOP SECTION */}
        <div className="flex flex-col md:flex-row items-center gap-8">

          {/* PROFILE IMAGE */}
          <div className="relative">
            <img
              src={
                userData.profilePhoto?.url ||
                "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTwTjn7ADTGtefL4Im3WluJ6ersByvJf8k7-Q&s"
              }
              alt="Profile"
              className="w-32 h-32 rounded-full object-cover border-4 border-blue-500 shadow-lg"
            />

            {/* ONLINE DOT */}
            <span className="absolute bottom-2 right-2 w-4 h-4 bg-green-400 rounded-full border-2 border-white"></span>
          </div>

          {/* USER INFO */}
          <div className="text-center md:text-left">
            <h2 className="text-3xl font-bold text-white">
              {userData.name}
            </h2>

            <p className="text-gray-400">@{userData.username}</p>

            <span className="inline-block mt-2 px-4 py-1 text-sm bg-blue-500/20 text-blue-400 rounded-full capitalize">
              {userData.role}
            </span>

            <p className="mt-4 text-gray-300 text-sm max-w-md">
              {userData.about || "No bio added yet."}
            </p>
          </div>
        </div>

        {/* DIVIDER */}
        <div className="my-8 border-t border-white/10"></div>

        {/* DETAILS GRID */}
        <div className="grid md:grid-cols-2 gap-6 text-sm">

          <div className="bg-white/5 p-4 rounded-xl border border-white/10">
            <p className="text-gray-400">Email</p>
            <p className="text-white">{userData.email}</p>
          </div>

          <div className="bg-white/5 p-4 rounded-xl border border-white/10">
            <p className="text-gray-400">Username</p>
            <p className="text-white">@{userData.username}</p>
          </div>

          <div className="bg-white/5 p-4 rounded-xl border border-white/10">
            <p className="text-gray-400">Role</p>
            <p className="text-white capitalize">{userData.role}</p>
          </div>

          <div className="bg-white/5 p-4 rounded-xl border border-white/10">
            <p className="text-gray-400">Status</p>
            <p className="text-green-400">Active</p>
          </div>

        </div>

      </div>
    </div>
  );
}