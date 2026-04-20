"use client";

import { useRouter } from "next/navigation";

export default function NotAllowedPage() {
  const router = useRouter();

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-black/40 border border-white/10 p-8 rounded-2xl text-center space-y-6">
        <div className="w-16 h-16 bg-red-500/20 text-red-500 rounded-full flex items-center justify-center mx-auto mb-4">
          <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
          </svg>
        </div>
        <h1 className="text-2xl font-bold">Access Denied</h1>
        <p className="text-zinc-400">
          You do not have permission to view the Shop Panel. Only Shop Owners are allowed.
        </p>
        <button
          onClick={() => {
            localStorage.removeItem("authToken");
            router.push("/login");
          }}
          className="w-full bg-red-500/10 hover:bg-red-500/20 text-red-400 border border-red-500/20 py-2 rounded-lg font-medium transition-colors"
        >
          Logout and go to Login
        </button>
      </div>
    </div>
  );
}
