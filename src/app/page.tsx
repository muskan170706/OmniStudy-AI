"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import {
  BrainCircuit,
  Mail,
  Lock,
  ArrowRight,
  Eye,
  EyeOff,
  Sparkles,
  Volume2,
  Image as ImageIcon,
  CheckCircle2,
  Loader2,
} from "lucide-react";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSignIn = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim() || !password.trim()) {
      setError("Please enter your email and password.");
      return;
    }

    setError(null);
    setIsLoading(true);

    // Simulate authentication delay for smooth UX transition
    setTimeout(() => {
      router.push("/dashboard");
    }, 600);
  };

  const handleDemoSignIn = () => {
    setEmail("student@omnistudy.ai");
    setPassword("studypassword123");
    setError(null);
    setIsLoading(true);

    setTimeout(() => {
      router.push("/dashboard");
    }, 600);
  };

  return (
    <div className="min-h-screen bg-[#070b14] text-slate-100 flex flex-col justify-between selection:bg-indigo-500/30 selection:text-indigo-200 relative overflow-hidden font-sans">
      {/* Decorative ambient gradients */}
      <div className="absolute -top-40 -left-40 w-96 h-96 bg-indigo-600/15 rounded-full blur-[128px] pointer-events-none" />
      <div className="absolute top-1/3 -right-40 w-96 h-96 bg-cyan-600/10 rounded-full blur-[128px] pointer-events-none" />
      <div className="absolute -bottom-40 left-1/3 w-96 h-96 bg-violet-600/10 rounded-full blur-[128px] pointer-events-none" />

      {/* Top Bar / Branding */}
      <header className="px-6 py-5 max-w-7xl w-full mx-auto flex items-center justify-between z-10">
        <div className="flex items-center gap-3">
          <div className="w-11 h-11 rounded-2xl bg-gradient-to-tr from-teal-400 via-indigo-500 to-violet-500 p-[2px] shadow-[0_0_24px_rgba(45,212,191,0.45)] shrink-0">
            <div className="w-full h-full bg-[#0a0d18] rounded-[14px] flex items-center justify-center">
              <BrainCircuit className="w-6 h-6 text-teal-300" />
            </div>
          </div>
          <div className="flex flex-col justify-center">
            <div className="flex items-center gap-2">
              <span className="font-display font-black text-xl lg:text-2xl tracking-tight text-white drop-shadow-[0_2px_12px_rgba(0,0,0,0.8)]">
                OmniStudy
              </span>
              <span className="px-2 py-0.5 rounded-lg bg-gradient-to-r from-teal-500/25 to-indigo-500/25 border border-teal-400/40 text-teal-300 font-display font-black text-xs lg:text-sm tracking-wider uppercase shadow-[0_0_12px_rgba(45,212,191,0.35)]">
                AI
              </span>
            </div>
            <p className="text-xs text-slate-300 hidden sm:block font-medium tracking-normal mt-0.5">
              Multimodal Real-Time Lecture & Visual Comprehension
            </p>
          </div>
        </div>

        <div className="hidden sm:flex items-center gap-2 text-xs text-slate-400">
          <span>AI Study Copilot</span>
          <span className="w-1 h-1 rounded-full bg-slate-700" />
          <span className="text-emerald-400 font-medium">Ready</span>
        </div>
      </header>

      {/* Main Login Card Section */}
      <main className="flex-1 flex items-center justify-center px-4 py-8 z-10">
        <div className="w-full max-w-md">
          {/* Card Container */}
          <div className="bg-[#0d1322]/90 backdrop-blur-xl border border-slate-800/80 rounded-3xl p-6 sm:p-8 shadow-2xl relative overflow-hidden">
            {/* Top Card Glow */}
            <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-indigo-500 via-cyan-400 to-violet-500" />

            <div className="text-center mb-6">
              <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-white mb-2">
                Welcome to OmniStudy AI
              </h2>
              <p className="text-xs text-slate-400 leading-relaxed">
                Sign in to access real-time lecture transcription, whiteboard analysis, and interactive flashcards.
              </p>
            </div>

            {/* Error Message */}
            {error && (
              <div className="mb-4 p-3 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-rose-400 shrink-0" />
                <span>{error}</span>
              </div>
            )}

            <form onSubmit={handleSignIn} className="space-y-4">
              {/* Email Input */}
              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1.5">
                  Email Address
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-500">
                    <Mail className="w-4 h-4" />
                  </div>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="student@university.edu"
                    className="w-full bg-[#080d1a] border border-slate-800 rounded-xl py-2.5 pl-10 pr-3.5 text-xs text-slate-200 placeholder-slate-600 focus:outline-none focus:ring-1 focus:ring-indigo-500/60 focus:border-indigo-500/60 transition-colors"
                  />
                </div>
              </div>

              {/* Password Input */}
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="block text-xs font-medium text-slate-300">
                    Password
                  </label>
                  <a
                    href="#"
                    onClick={(e) => {
                      e.preventDefault();
                      alert("Password reset demo link. Use the 'One-Click Demo Access' below to sign in instantly!");
                    }}
                    className="text-[11px] text-indigo-400 hover:text-indigo-300 transition-colors"
                  >
                    Forgot password?
                  </a>
                </div>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-500">
                    <Lock className="w-4 h-4" />
                  </div>
                  <input
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••••••"
                    className="w-full bg-[#080d1a] border border-slate-800 rounded-xl py-2.5 pl-10 pr-10 text-xs text-slate-200 placeholder-slate-600 focus:outline-none focus:ring-1 focus:ring-indigo-500/60 focus:border-indigo-500/60 transition-colors"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-slate-500 hover:text-slate-300 transition-colors"
                  >
                    {showPassword ? (
                      <EyeOff className="w-4 h-4" />
                    ) : (
                      <Eye className="w-4 h-4" />
                    )}
                  </button>
                </div>
              </div>

              {/* Remember Me Checkbox */}
              <div className="flex items-center justify-between pt-1">
                <label className="flex items-center gap-2 cursor-pointer select-none">
                  <input
                    type="checkbox"
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                    className="w-3.5 h-3.5 rounded bg-slate-900 border-slate-700 text-indigo-600 focus:ring-indigo-500/40 focus:ring-offset-0 cursor-pointer"
                  />
                  <span className="text-xs text-slate-400">Remember this device</span>
                </label>
              </div>

              {/* Sign In Button */}
              <button
                type="submit"
                disabled={isLoading}
                className="w-full py-3 px-4 rounded-xl font-medium text-xs sm:text-sm bg-gradient-to-r from-indigo-600 via-indigo-500 to-cyan-500 hover:from-indigo-500 hover:to-cyan-400 text-white shadow-lg shadow-indigo-900/30 flex items-center justify-center gap-2 transition-all duration-200 hover:scale-[1.01] active:scale-[0.99] disabled:opacity-60 cursor-pointer"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Signing in to Dashboard...</span>
                  </>
                ) : (
                  <>
                    <span>Sign In</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </form>

            {/* Divider */}
            <div className="relative my-5">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-slate-800" />
              </div>
              <div className="relative flex justify-center text-[10px] uppercase tracking-wider text-slate-500">
                <span className="bg-[#0d1322] px-2">Quick Evaluation</span>
              </div>
            </div>

            {/* Quick Demo Access Button */}
            <button
              type="button"
              onClick={handleDemoSignIn}
              disabled={isLoading}
              className="w-full py-2.5 px-4 rounded-xl border border-slate-800 hover:border-slate-700 bg-slate-900/60 hover:bg-slate-900 text-slate-300 font-medium text-xs flex items-center justify-center gap-2 transition-colors cursor-pointer"
            >
              <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
              <span>One-Click Demo Access</span>
            </button>
          </div>

          {/* Feature highlights pill row */}
          <div className="mt-6 flex flex-wrap items-center justify-center gap-3 text-[11px] text-slate-400">
            <div className="flex items-center gap-1.5 bg-[#0b101e]/60 border border-slate-800/80 px-2.5 py-1 rounded-full">
              <Volume2 className="w-3 h-3 text-indigo-400" />
              <span>Live Audio Capture</span>
            </div>
            <div className="flex items-center gap-1.5 bg-[#0b101e]/60 border border-slate-800/80 px-2.5 py-1 rounded-full">
              <ImageIcon className="w-3 h-3 text-cyan-400" />
              <span>Vision Board OCR</span>
            </div>
            <div className="flex items-center gap-1.5 bg-[#0b101e]/60 border border-slate-800/80 px-2.5 py-1 rounded-full">
              <Sparkles className="w-3 h-3 text-violet-400" />
              <span>AI Flashcards</span>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="px-6 py-4 max-w-7xl w-full mx-auto text-center text-[11px] text-slate-600 z-10">
        <p>OmniStudy AI © 2026 • Multimodal Lecture & Visual Comprehension Copilot</p>
      </footer>
    </div>
  );
}
