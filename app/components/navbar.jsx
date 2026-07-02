"use client";
import { signOut } from "next-auth/react";
import { useState } from "react";

function LogoMark() {
  // three connected nodes — echoes the Upload -> Analyze -> Match pipeline
  return (
    <svg
      width="30"
      height="16"
      viewBox="0 0 30 16"
      fill="none"
      aria-hidden="true"
    >
      <line
        x1="4"
        y1="8"
        x2="26"
        y2="8"
        stroke="var(--brand)"
        strokeWidth="1.5"
        strokeDasharray="1 3.5"
      />
      <circle cx="4" cy="8" r="4" fill="var(--brand)" />
      <circle cx="15" cy="8" r="4" fill="var(--accent)" />
      <circle cx="26" cy="8" r="4" fill="var(--match)" />
    </svg>
  );
}

export default function Navbar({ user }) {
  const [open, setOpen] = useState(false);
  const initial = user?.name?.trim()?.[0]?.toUpperCase() || "?";

  return (
    <nav className="fixed top-0 left-0 w-full z-40 bg-[var(--surface)]/90 backdrop-blur-md border-b border-[var(--border)]">
      <div className="max-w-350 mx-auto px-4 sm:px-6 py-3 flex items-center justify-between">
        <div className="flex items-center gap-3 min-w-0">
          <LogoMark />
          <div className="min-w-0">
            <p className="font-[family-name:var(--font-display)] font-semibold text-[var(--ink)] leading-tight truncate">
              JobMatch
            </p>
            <p className="hidden sm:block text-xs text-[var(--ink-faint)] leading-tight">
              Smart CV analysis &amp; job matching
            </p>
          </div>
        </div>

        {/* Desktop actions */}
        <div className="hidden sm:flex items-center gap-3">
          <span className="flex items-center gap-2 bg-[var(--brand-soft)] text-[var(--brand-strong)] font-medium pl-2 pr-3 py-1.5 rounded-full text-sm">
            <span className="grid place-items-center h-6 w-6 rounded-full bg-[var(--brand)] text-white text-xs font-semibold">
              {initial}
            </span>
            {user?.name}
          </span>
          <button
            onClick={() => signOut()}
            className="text-sm font-medium text-[var(--ink-soft)] border border-[var(--border-strong)] px-4 py-2 rounded-full hover:border-[var(--accent)] hover:text-[var(--accent-strong)] transition cursor-pointer"
          >
            Sign out
          </button>
        </div>

        {/* Mobile toggle */}
        <button
          onClick={() => setOpen((v) => !v)}
          aria-label="Toggle menu"
          aria-expanded={open}
          className="sm:hidden grid place-items-center h-9 w-9 rounded-full border border-[var(--border-strong)] text-[var(--ink)]"
        >
          <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
            {open ? (
              <path
                d="M3 3L15 15M15 3L3 15"
                stroke="currentColor"
                strokeWidth="1.6"
                strokeLinecap="round"
              />
            ) : (
              <path
                d="M2 5h14M2 9h14M2 13h14"
                stroke="currentColor"
                strokeWidth="1.6"
                strokeLinecap="round"
              />
            )}
          </svg>
        </button>
      </div>

      {/* Mobile panel */}
      {open && (
        <div className="sm:hidden border-t border-[var(--border)] bg-[var(--surface)] px-4 py-4 flex items-center justify-between">
          <span className="flex items-center gap-2 bg-[var(--brand-soft)] text-[var(--brand-strong)] font-medium pl-2 pr-3 py-1.5 rounded-full text-sm">
            <span className="grid place-items-center h-6 w-6 rounded-full bg-[var(--brand)] text-white text-xs font-semibold">
              {initial}
            </span>
            {user?.name}
          </span>
          <button
            onClick={() => signOut()}
            className="text-sm font-medium text-white bg-[var(--accent)] px-4 py-2 rounded-full hover:bg-[var(--accent-strong)] transition cursor-pointer"
          >
            Sign out
          </button>
        </div>
      )}
    </nav>
  );
}
