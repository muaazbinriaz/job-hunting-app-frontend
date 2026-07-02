"use client";

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useState, useEffect, useRef } from "react";
import axios from "axios";

export default function CVUpload() {
  const { data: session, status } = useSession();
  const [file, setFile] = useState(null);
  const [dragActive, setDragActive] = useState(false);
  const [loading, setLoading] = useState(false);
  const [profile, setProfile] = useState(null);
  const [profileLoading, setProfileLoading] = useState(true);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [jobs, setJobs] = useState([]);
  const [jobsLoading, setJobsLoading] = useState(false);
  const [jobsError, setJobsError] = useState("");
  const jobsFetched = useRef(false);
  const fileInputRef = useRef(null);
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
        .catch(() => {})
        .finally(() => setProfileLoading(false));
    } else if (status === "authenticated") {
      setProfileLoading(false);
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

  const validateAndSetFile = (selectedFile) => {
    if (!selectedFile) return;
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
  };

  const handleFileChange = (e) => validateAndSetFile(e.target.files?.[0]);

  const handleDrop = (e) => {
    e.preventDefault();
    setDragActive(false);
    validateAndSetFile(e.dataTransfer.files?.[0]);
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
        if (fileInputRef.current) fileInputRef.current.value = "";
        fetchJobs(session.accessToken);
      }
    } catch (err) {
      setError(err.response?.data?.error || "Upload failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-[minmax(0,420px)_1fr] gap-6 items-start">
      {/* LEFT: Upload + Profile */}
      <div className="flex flex-col gap-6">
        <section className="bg-[var(--surface)] border border-[var(--border)] rounded-2xl p-5 sm:p-6 fade-up">
          <h2 className="text-lg font-semibold text-[var(--ink)]">Your CV</h2>
          <p className="text-sm text-[var(--ink-soft)] mt-1 mb-4">
            PDF only, up to 10MB.
          </p>

          <label
            htmlFor="cv-file"
            onDragOver={(e) => {
              e.preventDefault();
              setDragActive(true);
            }}
            onDragLeave={() => setDragActive(false)}
            onDrop={handleDrop}
            className={`block cursor-pointer rounded-xl border-2 border-dashed p-6 text-center transition ${
              dragActive
                ? "border-[var(--accent)] bg-[var(--accent-soft)]"
                : "border-[var(--border-strong)] bg-[var(--surface-sunken)] hover:border-[var(--brand)]"
            }`}
          >
            <input
              id="cv-file"
              ref={fileInputRef}
              type="file"
              accept=".pdf"
              onChange={handleFileChange}
              className="sr-only"
            />
            <div className="mx-auto mb-3 h-10 w-10 rounded-full bg-[var(--brand-soft)] grid place-items-center">
              <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
                <path
                  d="M9 12V2M9 2 5 6M9 2l4 4"
                  stroke="var(--brand)"
                  strokeWidth="1.6"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <path
                  d="M2.5 12v2.5A1.5 1.5 0 0 0 4 16h10a1.5 1.5 0 0 0 1.5-1.5V12"
                  stroke="var(--brand)"
                  strokeWidth="1.6"
                  strokeLinecap="round"
                />
              </svg>
            </div>
            {file ? (
              <p className="text-sm font-medium text-[var(--match)]">
                {file.name}
              </p>
            ) : (
              <>
                <p className="text-sm font-medium text-[var(--ink)]">
                  Drag your CV here, or{" "}
                  <span className="text-[var(--brand)] underline">browse</span>
                </p>
                <p className="text-xs text-[var(--ink-faint)] mt-1">
                  PDF up to 10MB
                </p>
              </>
            )}
          </label>

          <button
            onClick={handleUpload}
            disabled={!file || loading}
            className="w-full mt-4 bg-[var(--accent)] text-white px-6 py-3 rounded-xl font-semibold hover:bg-[var(--accent-strong)] disabled:bg-[var(--border-strong)] disabled:text-[var(--ink-faint)] disabled:cursor-not-allowed transition flex items-center justify-center gap-2"
          >
            {loading && (
              <span className="h-4 w-4 rounded-full border-2 border-white/40 border-t-white animate-spin" />
            )}
            {loading ? "Analyzing CV…" : "Upload & analyze"}
          </button>

          {error && (
            <div className="bg-[#FDEDEA] border border-[#F4C7BE] text-[#A23B24] text-sm rounded-lg px-4 py-3 mt-4">
              {error}
            </div>
          )}
          {success && (
            <div className="bg-[var(--match-soft)] border border-[#BFE7D3] text-[#146B49] text-sm rounded-lg px-4 py-3 mt-4">
              {success}
            </div>
          )}
        </section>

        {profileLoading ? (
          <ProfileSkeleton />
        ) : (
          profile && (
            <section className="bg-[var(--surface)] border border-[var(--border)] rounded-2xl p-5 sm:p-6 fade-up">
              <h3 className="text-lg font-semibold text-[var(--ink)] mb-4">
                Profile
              </h3>

              {profile.summary && (
                <div className="mb-5 pb-5 border-b border-[var(--border)]">
                  <SectionLabel>Summary</SectionLabel>
                  <p className="text-[var(--ink-soft)] text-sm leading-relaxed">
                    {profile.summary}
                  </p>
                </div>
              )}

              {profile.skills?.length > 0 && (
                <div className="mb-5 pb-5 border-b border-[var(--border)]">
                  <SectionLabel>Skills</SectionLabel>
                  <div className="flex flex-wrap gap-2">
                    {profile.skills.map((skill, i) => (
                      <span
                        key={i}
                        className="bg-[var(--brand-soft)] text-[var(--brand-strong)] px-3 py-1 rounded-full text-xs font-medium"
                      >
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {profile.experience?.length > 0 && (
                <div className="mb-5 pb-5 border-b border-[var(--border)]">
                  <SectionLabel>Experience</SectionLabel>
                  <div className="flex flex-col gap-2">
                    {profile.experience.map((exp, i) => (
                      <div
                        key={i}
                        className="p-3 rounded-lg bg-[var(--surface-sunken)]"
                      >
                        <p className="font-medium text-[var(--ink)] text-sm">
                          {exp.title}
                        </p>
                        <p className="text-[var(--ink-soft)] text-sm">
                          {exp.company}
                        </p>
                        <p className="text-xs text-[var(--ink-faint)] font-[family-name:var(--font-mono)]">
                          {exp.duration}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {profile.education?.length > 0 && (
                <div>
                  <SectionLabel>Education</SectionLabel>
                  <div className="flex flex-col gap-2">
                    {profile.education.map((edu, i) => (
                      <div
                        key={i}
                        className="p-3 rounded-lg bg-[var(--surface-sunken)]"
                      >
                        <p className="font-medium text-[var(--ink)] text-sm">
                          {edu.degree}
                        </p>
                        <p className="text-[var(--ink-soft)] text-sm">
                          {edu.institution}
                        </p>
                        <p className="text-xs text-[var(--ink-faint)] font-[family-name:var(--font-mono)]">
                          {edu.year}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </section>
          )
        )}
      </div>

      {/* RIGHT: Jobs */}
      <div className="min-w-0">
        {(profileLoading || profile) && (
          <section className="bg-[var(--surface)] border border-[var(--border)] rounded-2xl p-5 sm:p-6 fade-up">
            <div className="flex items-center justify-between mb-5">
              <h3 className="text-lg font-semibold text-[var(--ink)]">
                Matching jobs
              </h3>
              {jobs.length > 0 && (
                <span className="text-xs font-[family-name:var(--font-mono)] text-[var(--ink-faint)]">
                  {jobs.length} found
                </span>
              )}
            </div>

            {jobsLoading && <JobListSkeleton />}

            {jobsError && (
              <div className="bg-[#FDEDEA] border border-[#F4C7BE] text-[#A23B24] text-sm rounded-lg px-4 py-3 mb-4">
                {jobsError}
              </div>
            )}

            {!jobsLoading &&
              !jobsError &&
              !profileLoading &&
              profile &&
              jobs.length === 0 && <EmptyState />}

            <div className="grid gap-4 sm:grid-cols-2">
              {jobs.map((job) => (
                <JobCard key={job.id} job={job} />
              ))}
            </div>
          </section>
        )}

        {!profileLoading && !profile && <NoCvState />}
      </div>
    </div>
  );
}

function SectionLabel({ children }) {
  return (
    <p className="text-xs font-semibold uppercase tracking-wide text-[var(--ink-faint)] mb-2">
      {children}
    </p>
  );
}

function JobCard({ job }) {
  return (
    <div className="bg-[var(--surface)] border border-[var(--border)] rounded-xl p-4 hover:border-[var(--brand)] hover:shadow-sm transition flex flex-col">
      <div className="flex justify-between items-start gap-2 mb-1">
        <h4 className="font-semibold text-[var(--ink)] text-sm leading-snug">
          {job.title}
        </h4>
        {job.isRemote && (
          <span className="shrink-0 bg-[var(--match-soft)] text-[#146B49] text-[11px] px-2 py-0.5 rounded-full font-medium">
            Remote
          </span>
        )}
      </div>
      <p className="text-[var(--brand)] font-medium text-sm">{job.company}</p>
      <p className="text-[var(--ink-faint)] text-xs mt-0.5">{job.location}</p>
      <p className="text-[var(--ink-soft)] text-xs font-[family-name:var(--font-mono)] mt-1">
        {job.salary}
      </p>
      <p className="text-[var(--ink-soft)] text-sm mt-3 leading-relaxed grow">
        {job.description}
      </p>
      <a
        href={job.url}
        target="_blank"
        rel="noopener noreferrer"
        className="mt-4 inline-flex items-center justify-center gap-1.5 bg-[var(--brand)] text-white px-4 py-2 rounded-lg text-sm font-semibold hover:bg-[var(--brand-strong)] transition"
      >
        Apply now
        <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
          <path
            d="M3 9 9 3M9 3H4M9 3v5"
            stroke="currentColor"
            strokeWidth="1.4"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </a>
    </div>
  );
}

function EmptyState() {
  return (
    <div className="text-center py-10 px-4 rounded-xl bg-[var(--surface-sunken)]">
      <p className="text-[var(--ink)] font-medium text-sm">
        No matching jobs yet
      </p>
      <p className="text-[var(--ink-faint)] text-sm mt-1">
        We'll refresh this list the next time you update your CV.
      </p>
    </div>
  );
}

function NoCvState() {
  return (
    <div className="h-full min-h-64 flex items-center justify-center text-center py-16 px-6 rounded-2xl border-2 border-dashed border-[var(--border-strong)] bg-[var(--surface-sunken)]">
      <div>
        <p className="text-[var(--ink)] font-medium">Jobs will show up here</p>
        <p className="text-[var(--ink-faint)] text-sm mt-1 max-w-xs">
          Upload your CV on the left and we'll match you against live openings.
        </p>
      </div>
    </div>
  );
}

function ProfileSkeleton() {
  return (
    <section className="bg-[var(--surface)] border border-[var(--border)] rounded-2xl p-5 sm:p-6 animate-pulse">
      <div className="h-4 w-24 bg-[var(--surface-sunken)] rounded mb-5" />
      <div className="space-y-2 mb-5">
        <div className="h-3 bg-[var(--surface-sunken)] rounded w-full" />
        <div className="h-3 bg-[var(--surface-sunken)] rounded w-5/6" />
      </div>
      <div className="flex gap-2 flex-wrap">
        {[...Array(5)].map((_, i) => (
          <div
            key={i}
            className="h-6 w-16 bg-[var(--surface-sunken)] rounded-full"
          />
        ))}
      </div>
    </section>
  );
}

function JobListSkeleton() {
  return (
    <div className="grid gap-4 sm:grid-cols-2">
      {[...Array(4)].map((_, i) => (
        <div
          key={i}
          className="border border-[var(--border)] rounded-xl p-4 animate-pulse"
        >
          <div className="h-4 bg-[var(--surface-sunken)] rounded w-3/4 mb-2" />
          <div className="h-3 bg-[var(--surface-sunken)] rounded w-1/2 mb-3" />
          <div className="h-3 bg-[var(--surface-sunken)] rounded w-full mb-1" />
          <div className="h-3 bg-[var(--surface-sunken)] rounded w-5/6 mb-3" />
          <div className="h-8 bg-[var(--surface-sunken)] rounded" />
        </div>
      ))}
    </div>
  );
}
