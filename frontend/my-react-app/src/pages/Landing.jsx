import React, { useContext, useEffect, useState } from "react";
import api from "../api";
import { AuthContext } from "../context/Authcontext";
import { Link } from "react-router-dom";


function Landing() {
  const { userData } = useContext(AuthContext);
  const [latestJobs, setLatestJobs] = useState([]);

  // ✅ FETCH ONLY FOR DEVELOPER + LOGGED IN
  useEffect(() => {
    if (!userData || userData.role !== "developer") return;

    const fetchLatestJobs = async () => {
      try {
        const res = await api.get("/api/jobPosting/search", {
          withCredentials: true,
        });

        const sorted = res.data.sort(
          (a, b) => new Date(b.postedAt) - new Date(a.postedAt)
        );

        setLatestJobs(sorted.slice(0, 3)); // ✅ ONLY 3 JOBS
      } catch (err) {
        console.error("Latest jobs error:", err);
      }
    };

    fetchLatestJobs();
  }, [userData]);

  return (
    <div className="w-full min-h-screen bg-[#0f172a] text-white">

      {/* HERO */}
      <section className="min-h-[90vh] flex items-center relative overflow-hidden">

        <div className="absolute -top-20 -left-20 w-96 h-96 bg-blue-500/20 blur-3xl rounded-full"></div>
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-cyan-400/20 blur-3xl rounded-full"></div>

        <div className="max-w-7xl mx-auto grid md:grid-cols-2 gap-12 px-6 items-center relative z-10">

          {/* LEFT */}
          <div>
            <h1 className="text-5xl md:text-7xl font-bold leading-tight mb-6">
              Hire Smarter. <br />
              <span className="text-blue-400">Grow Faster.</span>
            </h1>

            <p className="text-lg text-gray-300 mb-8">
              TalConnect helps you connect with the right talent without noise — just results.
            </p>

            <div className="flex gap-4 flex-wrap">

              {!userData && (
                <>
                  <Link to="/login" className="px-6 py-3 rounded-lg bg-blue-500 hover:bg-blue-600 transition shadow-lg hover:shadow-blue-500/40">
                    Get Started
                  </Link>

                  <Link to="/register" className="px-6 py-3 rounded-lg border border-gray-400 hover:bg-white hover:text-black transition">
                    Create Account
                  </Link>
                </>
              )}

              {userData?.role === "developer" && (
                <>
                  <Link to="/search" className="px-6 py-3 rounded-lg bg-blue-500 hover:bg-blue-600 transition shadow-lg">
                    Browse Jobs
                  </Link>

                  <Link to="/check-resume-score" className="px-6 py-3 rounded-lg border border-gray-400 hover:bg-white hover:text-black transition">
                    Resume Score
                  </Link>
                </>
              )}

              {userData?.role === "recruiter" && (
                <>
                  <Link to="/post-job" className="px-6 py-3 rounded-lg bg-blue-500 hover:bg-blue-600 transition shadow-lg">
                    Post Job
                  </Link>

                  <Link to="/my-jobs" className="px-6 py-3 rounded-lg border border-gray-400 hover:bg-white hover:text-black transition">
                    Manage Jobs
                  </Link>
                </>
              )}

            </div>
          </div>

          {/* RIGHT CARD */}
          <div className="hidden md:block perspective">
            <div className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl p-6 shadow-2xl transform hover:rotate-y-6 hover:-rotate-x-2 transition duration-500">

              <h3 className="text-xl font-semibold mb-4">Platform Highlights</h3>

              <ul className="space-y-3 text-gray-300 text-sm">
                <li>🚀 Smart job matching</li>
                <li>📊 Resume insights</li>
                <li>⚡ Quick job posting</li>
                <li>📧 Bulk email system</li>
              </ul>

            </div>
          </div>

        </div>
      </section>

      {/* FEATURES */}
      <section className="py-20 bg-[#020617]">
        <div className="max-w-6xl mx-auto px-6">

          <h2 className="text-4xl font-bold text-center mb-14">
            Everything you need
          </h2>

          <div className="grid md:grid-cols-3 gap-10">
            {[
              { icon: "🔍", title: "Smart Matching", desc: "Match candidates with relevant jobs instantly." },
              { icon: "📄", title: "Resume Analysis", desc: "Get insights on resume strength quickly." },
              { icon: "🏢", title: "Recruiter Tools", desc: "Manage applicants easily." },
            ].map((item, i) => (
              <div key={i} className="bg-[#0f172a] p-6 rounded-xl border border-gray-800 hover:border-blue-400 transition hover:shadow-xl hover:shadow-blue-500/10 transform hover:-translate-y-2">
                <div className="text-3xl mb-4">{item.icon}</div>
                <h3 className="text-lg font-semibold mb-2">{item.title}</h3>
                <p className="text-gray-400 text-sm">{item.desc}</p>
              </div>
            ))}
          </div>

        </div>
      </section>

      {/* 🔥 LATEST JOBS (ONLY DEVELOPER + LOGIN) */}
      {userData?.role === "developer" && latestJobs.length > 0 && (
        <section className="py-20 bg-[#0f172a]">
          <div className="max-w-5xl mx-auto px-6">

            <h2 className="text-3xl font-bold text-center mb-10 text-blue-400">
              🔥 Latest Jobs For You
            </h2>

            <div className="grid gap-6">

              {latestJobs.map((job) => (
                <div
                  key={job._id}
                  className="bg-[#020617] border border-gray-800 p-5 rounded-xl hover:border-blue-400 transition"
                >
                  <h3 className="text-lg font-semibold text-white">
                    {job.title}
                  </h3>

                  <p className="text-gray-400 text-sm mt-1">
                    {job.company} • {job.location}
                  </p>

                  <p className="text-xs text-gray-500 mt-2">
                    {new Date(job.postedAt).toLocaleString()}
                  </p>
                </div>
              ))}

            </div>

          </div>
        </section>
      )}

      {/* STATS */}
      <section className="py-16 bg-[#0f172a] text-center">

        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-5xl mx-auto">
          {[
            ["5K+", "Jobs Posted"],
            ["3K+", "Developers"],
            ["1K+", "Companies"],
            ["95%", "Success Rate"],
          ].map((item, i) => (
            <div key={i} className="hover:scale-110 transition">
              <h3 className="text-4xl font-bold text-blue-400">{item[0]}</h3>
              <p className="text-gray-400">{item[1]}</p>
            </div>
          ))}
        </div>

      </section>

      {/* CTA */}
      <section className="py-20 text-center bg-[#020617]">

        <h2 className="text-3xl font-bold mb-6">
        Ready to get started?
        </h2>

        <Link
          to={
            userData
              ? userData.role === "recruiter"
                ? "/post-job"
                : "/search"
              : "/login"
          }
          className="px-8 py-3 rounded-lg bg-blue-500 hover:bg-blue-600 transition shadow-lg"
        >
          Start Now
        </Link>

      </section>

      {/* FOOTER */}
      <footer className="bg-black text-gray-500 py-6 text-center text-sm">
        © 2025 TalConnect
      </footer>

    </div>
  );
}

export default Landing;