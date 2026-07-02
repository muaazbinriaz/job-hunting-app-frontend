"use client";

import axios from "axios";
import { useSession } from "next-auth/react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function RegisterPage() {
  const { status } = useSession();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  useEffect(() => {
    if (status === "authenticated") {
      router.push("/dashboard");
    }
  }, [status, router]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      await axios.post("api/register", { name, email, password });
      router.push("/login");
    } catch (err) {
      setError(err.response?.data?.message || "Registration failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen grid lg:grid-cols-2 bg-[var(--bg)]">
      {/* Side panel — hidden on mobile */}
      <div className="hidden lg:flex flex-col justify-between p-12 bg-[var(--brand)] text-white relative overflow-hidden">
        <div className="absolute inset-0 node-field opacity-10" />
        <div className="relative inline-block bg-white rounded-xl px-3 py-2">
          <img
            src="/job-match.png"
            className="h-10 w-auto"
            alt="JobMatch Logo"
          />
        </div>
        <div className="relative max-w-sm">
          <h1 className="font-[family-name:var(--font-display)] text-3xl font-semibold leading-tight">
            Your job search, organized in one place.
          </h1>
          <p className="text-white/70 mt-3 text-sm leading-relaxed">
            Create an account, upload your CV, and let matching jobs come to you
            instead of the other way around.
          </p>
        </div>
        <p className="relative text-white/40 text-xs">
          © {new Date().getFullYear()} JobMatch
        </p>
      </div>

      {/* Form panel */}
      <div className="flex items-center justify-center px-4 py-16 sm:px-8">
        <div className="w-full max-w-sm fade-up">
          <div className="mb-8 lg:hidden">
            <img
              src="/job-match.png"
              className="h-12 w-auto"
              alt="JobMatch Logo"
            />
          </div>

          <h2 className="text-2xl font-semibold text-[var(--ink)]">
            Create your account
          </h2>
          <p className="text-[var(--ink-soft)] text-sm mt-1 mb-7">
            It takes less than a minute.
          </p>

          {error && (
            <div className="bg-[#FDEDEA] border border-[#F4C7BE] text-[#A23B24] text-sm px-4 py-3 rounded-lg mb-5">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <Field label="Name">
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Jane Doe"
                className="input-field"
                required
              />
            </Field>

            <Field label="Email">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                className="input-field"
                required
              />
            </Field>

            <Field label="Password">
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="At least 8 characters"
                className="input-field"
                required
              />
            </Field>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-[var(--accent)] text-white py-3 rounded-xl font-semibold hover:bg-[var(--accent-strong)] disabled:bg-[var(--border-strong)] disabled:text-[var(--ink-faint)] transition flex items-center justify-center gap-2"
            >
              {loading && (
                <span className="h-4 w-4 rounded-full border-2 border-white/40 border-t-white animate-spin" />
              )}
              {loading ? "Creating account…" : "Create account"}
            </button>
          </form>

          <p className="text-center text-sm text-[var(--ink-soft)] mt-6">
            Already have an account?{" "}
            <Link
              href="/login"
              className="text-[var(--brand)] font-medium hover:underline"
            >
              Log in here
            </Link>
          </p>
        </div>
      </div>

      <style jsx global>{`
        .input-field {
          width: 100%;
          padding: 0.65rem 1rem;
          border: 1px solid var(--border-strong);
          border-radius: 0.75rem;
          background: var(--surface);
          font-size: 0.925rem;
        }
        .input-field:focus {
          outline: 2px solid var(--brand);
          outline-offset: 1px;
          border-color: var(--brand);
        }
      `}</style>
    </div>
  );
}

function Field({ label, children }) {
  return (
    <label className="block">
      <span className="block text-sm font-medium text-[var(--ink)] mb-1.5">
        {label}
      </span>
      {children}
    </label>
  );
}
