import React from "react";
import React, { useState } from 'react';
import axios from 'axios';
import api from "../api";

function ResumeAnalyzer() {
  const [jobDescription, setJobDescription] = useState('');
  const [resumeFile, setResumeFile] = useState(null);
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    if (!resumeFile || !jobDescription) {
      alert('Please provide job description and upload resume');
      return;
    }

    const formData = new FormData();
    formData.append('job_description', jobDescription);
    formData.append('resume', resumeFile);

    setLoading(true);
    try {
      // ✅ IMPORTANT FIX → correct backend (Flask)
      const res = await axios.post("https://talconnect1.onrender.com/evaluate", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      console.log("API RESPONSE:", res.data);

      // ✅ SAFE handling (no crash)
      const data = res.data.result || res.data;

      setResult(data);

    } catch (err) {
      console.error("ERROR:", err.response?.data || err.message);
      alert('Error evaluating resume');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#020617] text-white flex justify-center items-start px-4 py-10">

      <div className="w-full max-w-5xl bg-[#0f172a] border border-gray-800 rounded-2xl shadow-xl p-8">

        <h1 className="text-3xl font-bold mb-6 text-blue-400 text-center">
          Resume Evaluator
        </h1>

        <textarea
          className="w-full p-4 bg-[#020617] border border-gray-700 rounded-lg mb-6 focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-200 placeholder-gray-500"
          rows="6"
          placeholder="Paste job description here..."
          value={jobDescription}
          onChange={(e) => setJobDescription(e.target.value)}
        />

        <div className="flex flex-col md:flex-row items-center gap-4 mb-6">

          <input
            type="file"
            accept="application/pdf"
            onChange={(e) => setResumeFile(e.target.files[0])}
            className="text-sm text-gray-300"
          />

          <button
            onClick={handleSubmit}
            disabled={loading}
            className="bg-blue-500 hover:bg-blue-600 text-white font-semibold px-6 py-2 rounded-lg transition shadow-md"
          >
            {loading ? 'Analyzing...' : 'Analyze Resume'}
          </button>

        </div>

        {result && (
          <div className="mt-8 bg-[#020617] p-6 rounded-xl border border-gray-800">

            <h2 className="text-xl font-semibold text-blue-400 mb-4">
              Evaluation Summary
            </h2>

            <div className="mb-6 space-y-2">
              <p className="text-lg">
                <strong>Match Percentage:</strong>{" "}
                <span className="text-green-400 font-bold">
                  {result.match_percentage || 0}%
                </span>
              </p>
              <p className="text-lg">
                <strong>Ranking:</strong>{" "}
                <span className="text-blue-400 font-semibold">
                  {result.ranking || "N/A"}
                </span>
              </p>
            </div>

            {/* ✅ SAFE CHECK */}
            {result.keywords && (
              <>
                <h3 className="text-lg font-semibold mb-3 text-gray-300">
                  Keyword Match
                </h3>

                <div className="overflow-x-auto">
                  <table className="w-full border border-gray-700 rounded-lg overflow-hidden">
                    <thead className="bg-[#0f172a] text-gray-300">
                      <tr>
                        <th className="p-3 border border-gray-700">Keyword</th>
                        <th className="p-3 border border-gray-700">Present</th>
                        <th className="p-3 border border-gray-700">Match %</th>
                      </tr>
                    </thead>
                    <tbody>
                      {result.keywords.map((kw, index) => (
                        <tr key={index} className="text-center hover:bg-[#0f172a] transition">
                          <td className="border border-gray-700 p-2">{kw.keyword}</td>
                          <td className={`border border-gray-700 p-2 ${kw.present ? 'text-green-400' : 'text-red-400'}`}>
                            {kw.present ? 'Yes' : 'No'}
                          </td>
                          <td className="border border-gray-700 p-2">{kw.percentage}%</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </>
            )}

            {/* ✅ SAFE CHECK */}
            {result.suggestions && (
              <>
                <h3 className="text-lg font-semibold mt-6 mb-2 text-gray-300">
                  Suggestions to Improve Resume
                </h3>
                <ul className="list-disc pl-5 text-gray-300 space-y-1">
                  {result.suggestions.map((suggestion, index) => (
                    <li key={index}>{suggestion}</li>
                  ))}
                </ul>
              </>
            )}

          </div>
        )}
      </div>
    </div>
  );
}

export default ResumeAnalyzer;