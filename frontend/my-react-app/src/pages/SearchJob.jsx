import React from "react";
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import api from "../api";

const client = api;

function SearchJob() {
  const [jobs, setJobs] = useState([]);
  const [title, setTitle] = useState('');
  const [workType, setWorkType] = useState('');

  const handleSearch = async () => {
    try {
      const res = await client.get(
        '/api/jobPosting/search',
        {
          params: { title, workType },
          withCredentials: true, // ✅ FIX
        }
      );

      setJobs(res.data);
    } catch (err) {
      console.error("Error fetching jobs:", err);
    }
  };

  return (
    <div className="min-h-screen bg-[#0f172a] text-white px-4 py-10">

      {/* HEADER */}
      <h2 className="text-4xl font-bold text-center mb-10">
        🔍 Find Your Next Opportunity
      </h2>

      {/* SEARCH BOX (GLASS STYLE) */}
      <div className="max-w-3xl mx-auto mb-12">
        <div className="bg-white/5 backdrop-blur-lg border border-white/10 rounded-2xl p-6 flex flex-wrap gap-4 justify-center shadow-xl">

          <input
            type="text"
            placeholder="Search job title..."
            className="flex-1 min-w-[200px] px-4 py-3 rounded-lg bg-white/10 border border-white/10 text-white placeholder-gray-400 outline-none focus:border-blue-500"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />

          <select
            className="px-4 py-3 rounded-lg bg-white/10 border border-white/10 text-white outline-none focus:border-blue-500"
            value={workType}
            onChange={(e) => setWorkType(e.target.value)}
          >
            <option value="" className="text-black">Work Type</option>
            <option value="Remote" className="text-black">Remote</option>
            <option value="Onsite" className="text-black">Onsite</option>
          </select>

          <button
            onClick={handleSearch}
            className="px-6 py-3 rounded-lg bg-blue-600 hover:bg-blue-700 transition font-semibold shadow-lg"
          >
            Search
          </button>

        </div>
      </div>

      {/* JOB LIST */}
      <div className="max-w-5xl mx-auto grid gap-6">

        {jobs.length === 0 ? (
          <p className="text-center text-gray-400">
            No jobs found
          </p>
        ) : (
          jobs.map((job) => (
            <div
              key={job._id}
              className="bg-white/5 border border-white/10 backdrop-blur-lg p-6 rounded-2xl shadow-lg hover:scale-[1.02] transition"
            >

              <h3 className="text-xl font-semibold text-blue-400">
                {job.title}
              </h3>

              <p className="text-gray-300 mt-1">
                {job.company} • {job.location}
              </p>

              <p className="text-sm mt-3 text-gray-400 line-clamp-3">
                {job.description}
              </p>

              <p className="text-sm mt-3">
                <span className="text-gray-400">Skills:</span>{" "}
                <span className="text-gray-200">
                  {Array.isArray(job.requiredSkills)
                    ? job.requiredSkills.join(", ")
                    : job.requiredSkills}
                </span>
              </p>

              <p className="text-sm mt-2 text-green-400 font-semibold">
                💰 {job.salary}
              </p>

              <div className="mt-5 flex justify-between items-center">

                <span className="text-xs px-3 py-1 rounded-full bg-blue-500/20 text-blue-300">
                  {job.workType}
                </span>

                <Link to={`/apply/${job._id}`}>
                  <button className="bg-blue-600 px-4 py-2 rounded-lg hover:bg-blue-700 transition">
                    Apply →
                  </button>
                </Link>

              </div>

            </div>
          ))
        )}

      </div>

    </div>
  );
}

export default SearchJob;