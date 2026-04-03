import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import api from "../api";
import axios from "axios";

function AnalyzeCandidates() {
  const { jobId } = useParams();
  const [loading, setLoading] = useState(true);
  const [analyzedData, setAnalyzedData] = useState([]);
  const [error, setError] = useState("");

  const [emailSending, setEmailSending] = useState(false);
  const [emailStatusMessage, setEmailStatusMessage] = useState("");

  useEffect(() => {
    const analyze = async () => {
      try {
        const { data: job } = await api.get(`/api/jobPosting/${jobId}`, {
          withCredentials: true, 
        });

        if (!job) {
          throw new Error("Job not found");
        }

        const jobDesc = job.description || "";
        const applicants = job.applicants || [];

        const results = await Promise.all(
          applicants.map(async (applicant, i) => {
            const resumeUrl = applicant.resumeUrl;

            try {
              if (!resumeUrl) {
                return {
                  Name: applicant.name || applicant.developer?.name || "Candidate",
                  Email: applicant.email || applicant.developer?.email || "N/A",
                  matching_percent: 0,
                  emailStatus: "skipped",
                };
              }

              const response = await fetch(resumeUrl, {
                method: "GET",
                mode: "cors",
              });

              if (!response.ok) throw new Error("Failed to fetch resume");

              const blob = await response.blob();
              if (blob.size === 0) throw new Error("Empty resume file");

              const file = new File([blob], `resume${i + 1}.pdf`, {
                type: blob.type,
              });

              const formData = new FormData();
              formData.append("resume", file);
              formData.append("job_description", jobDesc);

              const { data } = await axios.post(
                "https://talconnect1.onrender.com/evaluate",
                formData,
                {
                  headers: { "Content-Type": "multipart/form-data" },
                }
              );

              const score = data.matching_percent || 0;

              return {
                Name:
                  applicant.name ||
                  applicant.developer?.name ||
                  data.Name ||
                  "Candidate",

                Email:
                  applicant.email ||
                  applicant.developer?.email ||
                  data.Email ||
                  "N/A",

                matching_percent: score,
                resumeLink: resumeUrl,
              };
            } catch (err) {
              console.error("Resume analysis failed:", err.message);

              return {
                Name:
                  applicant.name ||
                  applicant.developer?.name ||
                  "Candidate",

                Email:
                  applicant.email ||
                  applicant.developer?.email ||
                  "N/A",

                matching_percent: 0,
                resumeLink: resumeUrl,
                error: true,
                emailStatus: "fail",
              };
            }
          })
        );

        setAnalyzedData(results);
      } catch (err) {
        console.error("Job fetch or analysis error:", err.message);
        setError("Failed to analyze candidates.");
      } finally {
        setLoading(false);
      }
    };

    analyze();
  }, [jobId]);

  const handleSendEmails = async () => {
    setEmailSending(true);
    setEmailStatusMessage("");

    try {
      const response = await api.post(
        "/api/jobPosting/sendBulkEmails",
        {
          candidates: analyzedData.map((candidate) => ({
            name: candidate.Name,
            email: candidate.Email,
            score: candidate.matching_percent || 0,
            resumeLink: candidate.resumeLink,
          })),
        },
        {
          withCredentials: true,
        }
      );

      setEmailStatusMessage(response.data.message || "Emails sent.");
    } catch (err) {
      console.error("Error sending emails:", err.message);
      setEmailStatusMessage("❌ Failed to send emails.");
    }

    setEmailSending(false);
  };

  if (loading)
    return (
      <p className="p-6 text-center text-blue-400">
        Analyzing candidates...
      </p>
    );

  if (error)
    return <p className="p-6 text-center text-red-400">{error}</p>;

  return (
    <div className="min-h-screen bg-[#0f172a] text-white px-4 py-10">

      <h2 className="text-4xl font-bold text-center mb-10">
        📊 Analyzed Candidates
      </h2>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">

        {analyzedData.map((candidate, index) => (
          <div
            key={index}
            className="bg-white/5 backdrop-blur-lg border border-white/10 p-5 rounded-2xl shadow-lg hover:scale-[1.02] transition"
          >

            <h3 className="text-lg font-semibold text-blue-400">
              {candidate.Name || "N/A"}
            </h3>

            <p className="text-sm text-gray-300 mt-2">
              {candidate.Email || "N/A"}
            </p>

            {/* MATCH BAR */}
            <div className="mt-4">
              <div className="text-xs text-gray-400 mb-1">
                Match Score
              </div>

              <div className="w-full h-2 bg-white/10 rounded-full overflow-hidden">
                <div
                  className="h-full bg-green-500"
                  style={{ width: `${candidate.matching_percent || 0}%` }}
                ></div>
              </div>

              <p className="text-sm mt-1 text-green-400 font-semibold">
                {candidate.matching_percent || 0}%
              </p>
            </div>

            {candidate.resumeLink && (
              <a
                href={candidate.resumeLink}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-block mt-4 text-blue-400 hover:underline text-sm"
              >
                View Resume →
              </a>
            )}

            {candidate.error && (
              <p className="text-sm text-red-400 mt-2">
                Resume processing failed
              </p>
            )}

          </div>
        ))}

      </div>

      {/* BUTTON */}
      <div className="mt-12 text-center">

        <button
          onClick={handleSendEmails}
          className="bg-blue-600 px-8 py-3 rounded-lg font-semibold hover:bg-blue-700 transition shadow-lg"
          disabled={emailSending}
        >
          {emailSending ? "Sending..." : "Send Emails"}
        </button>

        {emailStatusMessage && (
          <p className="text-green-400 mt-4 font-medium">
            {emailStatusMessage}
          </p>
        )}

      </div>
    </div>
  );
}

export default AnalyzeCandidates;