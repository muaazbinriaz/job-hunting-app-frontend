"use client";

import { signIn, useSession } from "next-auth/react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function LoginPage() {
  const { status } = useSession();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  useEffect(() => {
    if (status === "authenticated") {
      router.push("/dashboard");
    }
  }, [status]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    const result = await signIn("credentials", {
      email,
      password,
      redirect: false,
    });
    setLoading(false);
    if (result?.error) {
      setError("Invalid email or password");
    } else {
      router.push("/dashboard");
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
            One CV. Every match, found for you.
          </h1>
          <p className="text-white/70 mt-3 text-sm leading-relaxed">
            Upload once — we read your skills and experience, then keep an eye
            out for roles worth your time.
          </p>
          <div className="mt-8 flex items-center gap-2">
            <PipelineNode label="Upload" active />
            <div className="h-px w-8 bg-white/25" />
            <PipelineNode label="Analyze" />
            <div className="h-px w-8 bg-white/25" />
            <PipelineNode label="Match" />
          </div>
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
            Welcome back
          </h2>
          <p className="text-[var(--ink-soft)] text-sm mt-1 mb-7">
            Log in to see your latest job matches.
          </p>

          {error && (
            <div className="bg-[#FDEDEA] border border-[#F4C7BE] text-[#A23B24] text-sm px-4 py-3 rounded-lg mb-5">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
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
                placeholder="••••••••"
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
              {loading ? "Logging in…" : "Log in"}
            </button>
          </form>

          <p className="text-center text-sm text-[var(--ink-soft)] mt-6">
            Don't have an account?{" "}
            <Link
              href="/register"
              className="text-[var(--brand)] font-medium hover:underline"
            >
              Register here
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

function PipelineNode({ label, active }) {
  return (
    <div className="flex items-center gap-1.5">
      <span
        className="h-2 w-2 rounded-full bg-white"
        style={{ opacity: active ? 1 : 0.4 }}
      />
      <span className="text-xs text-white/70 font-[family-name:var(--font-mono)]">
        {label}
      </span>
    </div>
  );
}
