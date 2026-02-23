"use client";
import { signOut } from "next-auth/react";

export default function Navbar({ user }) {
  return (
    <nav className="bg-white shadow-md px-6 py-2 flex justify-between items-center fixed top-0 left-0 w-full">
      <div>
        <img src="/job-match.png" className="h-12 w-auto" alt="JobMatch Logo" />
      </div>

      <div className="flex items-center gap-4">
        <span className="bg-indigo-100 text-indigo-700 font-semibold px-4 py-2 rounded-lg shadow-sm">
          {user?.name}
        </span>

        <button
          onClick={() => signOut()}
          className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition cursor-pointer"
        >
          Sign Out
        </button>
      </div>
    </nav>
  );
}
