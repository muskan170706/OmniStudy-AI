import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "OmniStudy AI - Intelligent Multimodal Study Copilot",
  description: "Transform lectures, whiteboards, and discussions into interactive flashcards and AI tutoring in real-time.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body className="bg-slate-950 text-slate-100 antialiased selection:bg-indigo-500/30 selection:text-indigo-200">
        {children}
      </body>
    </html>
  );
}
