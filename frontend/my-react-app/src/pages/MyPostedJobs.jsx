import React from "react";
import React, { useContext, useEffect, useState } from "react";
import { AuthContext } from "../context/Authcontext";
import { useNavigate } from "react-router-dom";
import api from "../api";

function MyPostedJobs() {
  const { userData } = useContext(AuthContext);
  const [postedJobs, setPostedJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  useEffect(() => {

    // ✅ WAIT for userData properly
    if (!userData || !userData._id) {
      return;
    }

    const fetchPostedJobs = async () => {
      try {
        setLoading(true); 

        const response = await api.get(
          "/api/jobPosting/my-jobs",
          { withCredentials: true }
        );

        console.log("Jobs Response:", response.data); // ✅ debug

        // ✅ safe fallback
        setPostedJobs(response.data.jobs || []);

      } catch (err) {
        console.error("Fetch error:", err);
        setError("Failed to load posted jobs.");
      } finally {
        setLoading(false);
      }
    };

    fetchPostedJobs();

  }, [userData?._id]); 

  // ✅ Handle delete
  const handleDelete = async (jobId) => {
    const confirmDelete = window.confirm("Delete this job?");
    if (!confirmDelete) return;

    try {
      await api.delete(`/api/jobPosting/${jobId}`, {
        withCredentials: true,
      });

      setPostedJobs((prev) =>
        prev.filter((job) => job._id !== jobId)
      );
    } catch (err) {
      alert("Failed to delete job");
    }
  };

  // ✅ Extra safety
  if (!userData) {
    return (
      <p className="p-6 text-center text-blue-400">
        Loading user...
      </p>
    );
  }

  if (loading)
    return (
      <p className="p-6 text-center text-blue-400">
        Loading jobs...
      </p>
    );

  if (error)
    return (
      <p className="p-6 text-center text-red-400">
        {error}
      </p>
    );

  return (
    <div className="min-h-screen bg-[#0f172a] text-white px-4 py-10">

      <h2 className="text-4xl font-bold text-center mb-10">
        📂 My Posted Jobs
      </h2>

      {postedJobs.length === 0 ? (
        <p className="text-center text-gray-400">
          You haven't posted any jobs yet.
        </p>
      ) : (
        <div className="grid gap-6 max-w-5xl mx-auto">

          {postedJobs.map((job) => (
            <div
              key={job._id}
              className="bg-white/5 backdrop-blur-lg border border-white/10 p-6 rounded-2xl shadow-lg hover:scale-[1.02] transition"
            >

              {/* TITLE */}
              <h3 className="text-xl font-semibold text-blue-400">
                {job.title}
              </h3>

              {/* DESC */}
              <p className="text-gray-300 mt-2 line-clamp-3">
                {job.description}
              </p>

              {/* SKILLS */}
              <p className="mt-3 text-sm">
                <span className="text-gray-400">Skills:</span>{" "}
                <span className="text-gray-200">
                  {Array.isArray(job.requiredSkills)
                    ? job.requiredSkills.join(", ")
                    : job.requiredSkills}
                </span>
              </p>

              {/* META */}
              <div className="mt-3 flex flex-wrap gap-4 text-sm text-gray-400">
                <span>📍 {job.location}</span>
                <span>💰 ₹{job.salary}</span>
                <span>
                  🗓 {new Date(job.postedAt).toLocaleDateString()}
                </span>
              </div>

              {/* BUTTONS */}
              <div className="flex gap-3 mt-5 flex-wrap">

                <button
                  onClick={() => navigate(`/analyze/${job._id}`)}
                  className="bg-green-600 px-4 py-2 rounded-lg hover:bg-green-700 transition"
                >
                  Analyze Candidates
                </button>

                <button
                  onClick={() => handleDelete(job._id)}
                  className="bg-red-600 px-4 py-2 rounded-lg hover:bg-red-700 transition"
                >
                  Delete
                </button>

              </div>

            </div>
          ))}

        </div>
      )}
    </div>
  );
}

export default MyPostedJobs;