import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom';
import api from "../api";


const client = api;

export default function Jobposting() {

  const navigate = useNavigate();

  const [form, setForm] = useState({
    title: "",
    company: "",
    description: "",
    workType: "",
    requiredSkills: "",
    location: "",
    salary: "",
  });

  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState("");

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMsg("");

    try {
      await client.post(
        "/api/jobPosting/post-job",
        form,
        { withCredentials: true }
      );

      setMsg("✅ Job posted successfully");

      setForm({
        title: "",
        company: "",
        description: "",
        workType: "",
        requiredSkills: "",
        location: "",
        salary: "",
      });

      setTimeout(() => navigate("/"), 1000);

    } catch (err) {
      setMsg("❌ " + (err.response?.data?.message || "Error posting job"));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0f172a] flex items-center justify-center px-4 py-10">

      {/* MAIN CARD */}
      <div className="w-full max-w-2xl bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl shadow-2xl p-8">

        {/* TITLE */}
        <h2 className="text-3xl font-bold text-white text-center mb-6">
          Post a Job
        </h2>

        {/* MESSAGE */}
        {msg && (
          <div
            className={`mb-4 px-4 py-2 rounded-md text-sm font-medium ${
              msg.startsWith("✅")
                ? "bg-green-500/20 text-green-300"
                : "bg-red-500/20 text-red-300"
            }`}
          >
            {msg}
          </div>
        )}

        {/* FORM */}
        <form onSubmit={handleSubmit} className="space-y-5">

          <input
            type="text"
            name="title"
            placeholder="Job Title"
            value={form.title}
            onChange={handleChange}
            required
            className="input-dark"
          />

          <input
            type="text"
            name="company"
            placeholder="Company Name"
            value={form.company}
            onChange={handleChange}
            required
            className="input-dark"
          />

          <textarea
            name="description"
            placeholder="Job Description"
            value={form.description}
            onChange={handleChange}
            required
            rows={4}
            className="input-dark"
          />

          <input
            type="text"
            name="workType"
            placeholder="Work Type (Remote / Onsite)"
            value={form.workType}
            onChange={handleChange}
            required
            className="input-dark"
          />

          <input
            type="text"
            name="requiredSkills"
            placeholder="Skills (comma separated)"
            value={form.requiredSkills}
            onChange={handleChange}
            required
            className="input-dark"
          />

          <input
            type="text"
            name="location"
            placeholder="Location"
            value={form.location}
            onChange={handleChange}
            required
            className="input-dark"
          />

          <input
            type="text"
            name="salary"
            placeholder="Salary (₹10L – ₹15L)"
            value={form.salary}
            onChange={handleChange}
            required
            className="input-dark"
          />

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 rounded-lg transition disabled:opacity-50"
          >
            {loading ? "Posting..." : "Post Job"}
          </button>

        </form>
      </div>
    </div>
  );
}