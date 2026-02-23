"use client";

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useState, useEffect, useRef } from "react";
import axios from "axios";

export default function CVUpload() {
  const { data: session, status } = useSession();
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [profile, setProfile] = useState(null);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [jobs, setJobs] = useState([]);
  const [jobsLoading, setJobsLoading] = useState(false);
  const [jobsError, setJobsError] = useState("");
  const jobsFetched = useRef(false);
  const router = useRouter();

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/login");
    }
  }, [status, router]);

  useEffect(() => {
    if (
      status === "authenticated" &&
      session?.accessToken &&
      !jobsFetched.current
    ) {
      jobsFetched.current = true;
      axios
        .get(`${process.env.NEXT_PUBLIC_API_URL}/api/cv/profile`, {
          headers: { Authorization: `Bearer ${session.accessToken}` },
        })
        .then((res) => {
          if (res.data.profile) {
            setProfile(res.data.profile);
            fetchJobs(session.accessToken);
          }
        })
        .catch(() => {});
    }
  }, [status, session]);

  const fetchJobs = async (token) => {
    setJobsLoading(true);
    setJobsError("");
    try {
      const res = await axios.get(
        `${process.env.NEXT_PUBLIC_API_URL}/api/jobs`,
        { headers: { Authorization: `Bearer ${token}` } },
      );
      setJobs(res.data.jobs || []);
    } catch (err) {
      setJobsError("Could not load jobs. Please try again.");
    } finally {
      setJobsLoading(false);
    }
  };

  const handleFileChange = (e) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      if (selectedFile.type !== "application/pdf") {
        setError("Please select a PDF file");
        return;
      }
      if (selectedFile.size > 10 * 1024 * 1024) {
        setError("File size must be less than 10MB");
        return;
      }
      setError("");
      setFile(selectedFile);
    }
  };

  const handleUpload = async () => {
    if (!file || loading) return;
    setLoading(true);
    setError("");
    setSuccess("");

    const form = new FormData();
    form.append("cv", file);

    try {
      const res = await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL}/api/cv/upload-cv`,
        form,
        { headers: { Authorization: `Bearer ${session?.accessToken}` } },
      );

      if (res.data.profile) {
        setProfile(res.data.profile);
        setSuccess("CV uploaded and analyzed successfully!");
        setFile(null);
        fetchJobs(session.accessToken);
      }
    } catch (err) {
      setError(err.response?.data?.error || "Upload failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white p-8 rounded-lg shadow-lg max-w-3xl mx-auto">
      <h2 className="text-3xl font-bold mb-2">Upload Your CV</h2>
      <p className="text-gray-600 mb-6">
        Upload a PDF file to extract your skills and experience
      </p>

      {/* Upload Section */}
      <div className="border-2 border-dashed border-blue-300 rounded-lg p-6 mb-6 bg-blue-50">
        <input
          type="file"
          accept=".pdf"
          onChange={handleFileChange}
          className="mb-4 p-3 border-2 border-gray-300 rounded w-full focus:border-blue-500 focus:outline-none"
          placeholder="Choose PDF file"
        />

        {file && (
          <p className="text-sm text-green-600 mb-4">
            File selected: {file.name}
          </p>
        )}

        <button
          onClick={handleUpload}
          disabled={!file || loading}
          className="w-full bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition"
        >
          {loading ? "Analyzing CV..." : "Upload & Analyze"}
        </button>
      </div>

      {/* Error Message */}
      {error && (
        <div className="bg-red-50 border-l-4 border-red-500 p-4 mb-6 rounded">
          <p className="text-red-700 font-semibold">Error</p>
          <p className="text-red-600">{error}</p>
        </div>
      )}

      {/* Success Message */}
      {success && (
        <div className="bg-green-50 border-l-4 border-green-500 p-4 mb-6 rounded">
          <p className="text-green-700 font-semibold">{success}</p>
        </div>
      )}

      {/* Profile Section */}
      {profile && (
        <div className="bg-gray-50 p-6 rounded-lg mb-8">
          <h3 className="text-2xl font-bold mb-6 text-gray-800">
            Your Profile
          </h3>

          {profile.summary && (
            <div className="mb-6 pb-6 border-b">
              <h4 className="text-lg font-semibold mb-3 text-gray-700">
                Summary
              </h4>
              <p className="text-gray-700 leading-relaxed">{profile.summary}</p>
            </div>
          )}

          {profile.skills?.length > 0 && (
            <div className="mb-6 pb-6 border-b">
              <h4 className="text-lg font-semibold mb-3 text-gray-700">
                Skills
              </h4>
              <div className="flex flex-wrap gap-2">
                {profile.skills.map((skill, i) => (
                  <span
                    key={i}
                    className="bg-blue-200 text-blue-800 px-4 py-2 rounded-full text-sm font-medium"
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </div>
          )}

          {profile.experience?.length > 0 && (
            <div className="mb-6 pb-6 border-b">
              <h4 className="text-lg font-semibold mb-3 text-gray-700">
                Experience
              </h4>
              {profile.experience.map((exp, i) => (
                <div key={i} className="mb-3 p-3 bg-white rounded">
                  <p className="font-semibold text-gray-800">{exp.title}</p>
                  <p className="text-gray-600">{exp.company}</p>
                  <p className="text-sm text-gray-500">{exp.duration}</p>
                </div>
              ))}
            </div>
          )}

          {profile.education?.length > 0 && (
            <div>
              <h4 className="text-lg font-semibold mb-3 text-gray-700">
                Education
              </h4>
              {profile.education.map((edu, i) => (
                <div key={i} className="mb-3 p-3 bg-white rounded">
                  <p className="font-semibold text-gray-800">{edu.degree}</p>
                  <p className="text-gray-600">{edu.institution}</p>
                  <p className="text-sm text-gray-500">{edu.year}</p>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Jobs Section */}
      {profile && (
        <div>
          <h3 className="text-2xl font-bold mb-6 text-gray-800">
            Matching Jobs
          </h3>

          {jobsLoading && (
            <p className="text-gray-500 text-center py-6">Loading jobs...</p>
          )}

          {jobsError && (
            <div className="bg-red-50 border-l-4 border-red-500 p-4 mb-4 rounded">
              <p className="text-red-600">{jobsError}</p>
            </div>
          )}

          {!jobsLoading && jobs.length === 0 && !jobsError && (
            <p className="text-gray-500 text-center py-6">
              No jobs found for your skills.
            </p>
          )}

          <div className="space-y-4">
            {jobs.map((job) => (
              <div
                key={job.id}
                className="bg-white border border-gray-200 rounded-lg p-5 shadow-sm hover:shadow-md transition"
              >
                <div className="flex justify-between items-start mb-2">
                  <h4 className="text-lg font-semibold text-gray-800">
                    {job.title}
                  </h4>
                  {job.isRemote && (
                    <span className="bg-green-100 text-green-700 text-xs px-2 py-1 rounded-full font-medium">
                      Remote
                    </span>
                  )}
                </div>
                <p className="text-blue-600 font-medium mb-1">{job.company}</p>
                <p className="text-gray-500 text-sm mb-2">{job.location}</p>
                <p className="text-gray-500 text-sm mb-3">{job.salary}</p>
                <p className="text-gray-600 text-sm mb-4">{job.description}</p>
                <a
                  href={job.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-block bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-semibold hover:bg-blue-700 transition"
                >
                  Apply Now
                </a>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
