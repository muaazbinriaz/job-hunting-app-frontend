"use client";

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import CVUpload from "../components/CVUpload";
import Navbar from "../components/navbar";

export default function Dashboard() {
  const { data: session, status } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/login");
    }
  }, [status]);

  if (status === "loading") {
    return (
      <div className="min-h-screen grid place-items-center bg-[var(--bg)]">
        <div className="flex flex-col items-center gap-3">
          <div className="h-8 w-8 rounded-full border-2 border-[var(--brand-soft)] border-t-[var(--brand)] animate-spin" />
          <p className="text-sm text-[var(--ink-faint)]">
            Loading your workspace…
          </p>
        </div>
      </div>
    );
  }

  const firstName = session?.user?.name?.split(" ")[0];

  return (
    <div className="min-h-screen bg-[var(--bg)]">
      <Navbar user={session?.user} />

      <div className="max-w-350 mx-auto px-4 sm:px-6 pt-24 sm:pt-28 pb-10">
        <header className="mb-8 fade-up">
          <h1 className="text-2xl sm:text-3xl font-semibold text-[var(--ink)]">
            {firstName ? `Welcome back, ${firstName}` : "Welcome back"}
          </h1>
          <p className="text-[var(--ink-soft)] mt-1 max-w-xl">
            Upload your CV once — we'll pull out your skills and keep matching
            jobs against it.
          </p>

          {/* Signature pipeline motif */}
          <div className="mt-5 flex items-center gap-2 max-w-md">
            <PipelineNode label="Upload" color="var(--brand)" active />
            <div className="pipeline-track flex-1" />
            <PipelineNode label="Analyze" color="var(--accent)" />
            <div className="pipeline-track flex-1" />
            <PipelineNode label="Match" color="var(--match)" />
          </div>
        </header>

        <CVUpload />
      </div>
    </div>
  );
}

function PipelineNode({ label, color, active }) {
  return (
    <div className="flex items-center gap-1.5 shrink-0">
      <span
        className="h-2.5 w-2.5 rounded-full"
        style={{
          background: color,
          boxShadow: active ? `0 0 0 3px ${color}22` : "none",
        }}
      />
      <span className="text-xs font-medium text-[var(--ink-soft)] font-[family-name:var(--font-mono)]">
        {label}
      </span>
    </div>
  );
}
