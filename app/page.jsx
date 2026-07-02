"use client";

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function Home() {
  const { status } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (status === "authenticated") router.push("/dashboard");
    if (status === "unauthenticated") router.push("/login");
  }, [status]);

  return (
    <div className="min-h-screen grid place-items-center bg-[var(--bg)]">
      <div className="flex flex-col items-center gap-3">
        <div className="h-8 w-8 rounded-full border-2 border-[var(--brand-soft)] border-t-[var(--brand)] animate-spin" />
        <p className="text-sm text-[var(--ink-faint)]">Loading…</p>
      </div>
    </div>
  );
}
