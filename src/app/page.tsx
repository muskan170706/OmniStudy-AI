"use client";

import React, { useState, useRef, useEffect } from "react";
import {
  Mic,
  Square,
  Upload,
  FileAudio,
  Sparkles,
  Send,
  Image as ImageIcon,
  Layers,
  RotateCcw,
  Trash2,
  Bot,
  User,
  BrainCircuit,
  Volume2,
} from "lucide-react";

interface Flashcard {
  question: string;
  answer: string;
  topic: string;
}

interface Message {
  id: string;
  sender: "user" | "ai";
  text: string;
  timestamp: string;
  flashcardPreview?: Flashcard;
}

export default function OmniStudyDashboard() {
  // --- Left Column: Audio Capture States ---
  const [isRecording, setIsRecording] = useState(false);
  const [recordDuration, setRecordDuration] = useState(0);
  const [audioFileName, setAudioFileName] = useState<string | null>(null);
  const [transcript, setTranscript] = useState(
    "Prof. Vance (00:01): Good morning everyone. Today we are exploring Distributed Consensus algorithms, specifically the Raft protocol and Paxos...\n\n" +
    "Prof. Vance (00:45): Remember that Raft decomposes consensus into three independent subproblems: Leader Election, Log Replication, and Safety guarantees. Notice the state machine diagram on the board where nodes transition between Follower, Candidate, and Leader states."
  );

  // --- Middle Column: Visual Board States ---
  const [boardImage, setBoardImage] = useState<string | null>(null);
  const [boardImageName, setBoardImageName] = useState<string | null>(null);
  const [isDraggingOver, setIsDraggingOver] = useState(false);

  // --- Right Column: AI Tutor States ---
  const [chatInput, setChatInput] = useState("");
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "1",
      sender: "ai",
      text: "Hello! I'm your OmniStudy AI Tutor. I'm actively listening to your lecture stream and analyzing any whiteboard diagrams or slides you upload. How can I help you understand today's material?",
      timestamp: "10:15 AM",
    },
    {
      id: "2",
      sender: "user",
      text: "Can you summarize the main difference between Follower and Candidate states in Raft mentioned in the transcript?",
      timestamp: "10:16 AM",
    },
    {
      id: "3",
      sender: "ai",
      text: "Based on the transcript:\n\n• **Follower State**: Nodes are passive; they don't issue requests on their own but respond to incoming RPCs from leaders and candidates.\n• **Candidate State**: When a follower doesn't hear heartbeats within its election timeout, it transitions to Candidate, increments its term, and votes for itself while requesting votes from peers.",
      timestamp: "10:16 AM",
    },
  ]);

  // Flashcards state
  const [flashcardsGenerated, setFlashcardsGenerated] = useState(false);
  const [activeFlashcardIndex, setActiveFlashcardIndex] = useState(0);
  const [isCardFlipped, setIsCardFlipped] = useState(false);

  const sampleFlashcards: Flashcard[] = [
    {
      question: "What are the three subproblems Raft decomposes consensus into?",
      answer: "Leader Election, Log Replication, and Safety Guarantees.",
      topic: "Consensus Algorithms",
    },
    {
      question: "When does a Follower node transition into a Candidate in Raft?",
      answer: "When it does not receive a heartbeat or AppendEntries RPC within its randomized election timeout window.",
      topic: "State Machine",
    },
    {
      question: "What guarantees safety during leader election in Raft?",
      answer: "A candidate must contain all committed entries to win an election (Election Restriction / Log Matching property).",
      topic: "Safety & Invariants",
    },
  ];

  // Hidden file inputs & scrolling refs
  const audioFileInputRef = useRef<HTMLInputElement>(null);
  const imageFileInputRef = useRef<HTMLInputElement>(null);
  const chatBottomRef = useRef<HTMLDivElement>(null);

  // Recording timer simulation
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isRecording) {
      interval = setInterval(() => {
        setRecordDuration((prev) => prev + 1);
      }, 1000);
    } else {
      setRecordDuration(0);
    }
    return () => clearInterval(interval);
  }, [isRecording]);

  useEffect(() => {
    chatBottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const formatSeconds = (sec: number) => {
    const mins = Math.floor(sec / 60);
    const secs = sec % 60;
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
  };

  const handleAudioUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setAudioFileName(file.name);
      setTranscript((prev) =>
        prev + `\n\n[Uploaded Audio '${file.name}' Processed]: "In Paxos, consensus is reached through Prepare/Promise and Accept/Accepted phases..."`
      );
    }
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setBoardImageName(file.name);
      const url = URL.createObjectURL(file);
      setBoardImage(url);
      e.target.value = "";
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDraggingOver(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDraggingOver(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDraggingOver(false);
    const file = e.dataTransfer.files?.[0];
    if (file && file.type.startsWith("image/")) {
      setBoardImageName(file.name);
      const url = URL.createObjectURL(file);
      setBoardImage(url);
    }
  };

  const loadSampleWhiteboard = () => {
    // Generate an illustrative SVG data URI representing a whiteboard architecture diagram
    const svgContent = encodeURIComponent(`
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 500" width="100%" height="100%">
        <rect width="800" height="500" fill="#0f172a" rx="12"/>
        <g stroke="#334155" stroke-width="1" stroke-dasharray="8 8">
          <line x1="0" y1="125" x2="800" y2="125"/>
          <line x1="0" y1="250" x2="800" y2="250"/>
          <line x1="0" y1="375" x2="800" y2="375"/>
          <line x1="200" y1="0" x2="200" y2="500"/>
          <line x1="400" y1="0" x2="400" y2="500"/>
          <line x1="600" y1="0" x2="600" y2="500"/>
        </g>
        <text x="40" y="50" fill="#38bdf8" font-family="sans-serif" font-weight="bold" font-size="22">LECTURE 14: RAFT PROTOCOL CONSENSUS</text>
        
        <!-- Follower Node -->
        <rect x="80" y="160" width="180" height="110" rx="10" fill="#1e293b" stroke="#3b82f6" stroke-width="2.5"/>
        <text x="170" y="200" fill="#f8fafc" font-family="sans-serif" font-weight="bold" font-size="16" text-anchor="middle">Follower</text>
        <text x="170" y="230" fill="#94a3b8" font-family="sans-serif" font-size="12" text-anchor="middle">Awaits RPC heartbeats</text>
        
        <!-- Transition Arrow to Candidate -->
        <path d="M 260 215 L 360 215" fill="none" stroke="#6366f1" stroke-width="2.5"/>
        <text x="310" y="205" fill="#a5b4fc" font-family="sans-serif" font-size="11" text-anchor="middle">Timeout</text>

        <!-- Candidate Node -->
        <rect x="360" y="160" width="180" height="110" rx="10" fill="#1e293b" stroke="#8b5cf6" stroke-width="2.5"/>
        <text x="450" y="200" fill="#f8fafc" font-family="sans-serif" font-weight="bold" font-size="16" text-anchor="middle">Candidate</text>
        <text x="450" y="230" fill="#94a3b8" font-family="sans-serif" font-size="12" text-anchor="middle">Votes for self, starts term</text>

        <!-- Transition Arrow to Leader -->
        <path d="M 540 215 L 620 215" fill="none" stroke="#10b981" stroke-width="2.5"/>
        <text x="580" y="205" fill="#6ee7b7" font-family="sans-serif" font-size="11" text-anchor="middle">Majority</text>

        <!-- Leader Node -->
        <rect x="620" y="160" width="150" height="110" rx="10" fill="#1e293b" stroke="#10b981" stroke-width="2.5"/>
        <text x="695" y="200" fill="#34d399" font-family="sans-serif" font-weight="bold" font-size="16" text-anchor="middle">Leader</text>
        <text x="695" y="230" fill="#94a3b8" font-family="sans-serif" font-size="12" text-anchor="middle">Sends AppendEntries</text>

        <!-- Annotations -->
        <rect x="80" y="330" width="690" height="90" rx="8" fill="#1e1e2e" stroke="#475569" stroke-width="1"/>
        <text x="100" y="365" fill="#facc15" font-family="sans-serif" font-weight="bold" font-size="14">Key Exam Formula / Theorem:</text>
        <text x="100" y="395" fill="#cbd5e1" font-family="sans-serif" font-size="13">Majority Quorum = ⌊ n / 2 ⌋ + 1  |  Tolerates f failures out of 2f + 1 total nodes</text>
      </svg>
    `);
    setBoardImage(`data:image/svg+xml;utf8,${svgContent}`);
    setBoardImageName("lecture_14_raft_state_machine.svg");
  };

  const handleSendMessage = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!chatInput.trim()) return;

    const userMsg: Message = {
      id: Date.now().toString(),
      sender: "user",
      text: chatInput.trim(),
      timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    };

    setMessages((prev) => [...prev, userMsg]);
    const query = chatInput.trim();
    setChatInput("");

    // Simulate AI response
    setTimeout(() => {
      let aiText = `I analyzed your query regarding "${query}".`;
      if (query.toLowerCase().includes("quorum") || query.toLowerCase().includes("formula")) {
        aiText = "Based on the whiteboard diagram notes: In a distributed system with 2f + 1 nodes, you require a majority quorum of ⌊n/2⌋ + 1 votes to ensure consensus without split-brain partitioning.";
      } else if (query.toLowerCase().includes("flashcard")) {
        aiText = "I've synthesized key points from both the audio transcript and the whiteboard diagram into flashcards for you. Click 'Generate Flashcards' above to review!";
      } else {
        aiText = "Synthesizing cross-modal context between the lecture audio and the current whiteboard slide: The professor emphasized that state consistency is guaranteed by majority quorums before committing log entries.";
      }

      const aiReply: Message = {
        id: (Date.now() + 1).toString(),
        sender: "ai",
        text: aiText,
        timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      };
      setMessages((prev) => [...prev, aiReply]);
    }, 700);
  };

  const handleGenerateFlashcards = () => {
    setFlashcardsGenerated(true);
    setIsCardFlipped(false);
    setActiveFlashcardIndex(0);

    const flashcardMsg: Message = {
      id: Date.now().toString(),
      sender: "ai",
      text: "✨ I've generated 3 high-yield study flashcards based on the Raft consensus lecture and whiteboard diagrams!",
      timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      flashcardPreview: sampleFlashcards[0],
    };
    setMessages((prev) => [...prev, flashcardMsg]);
  };

  return (
    <div className="min-h-screen bg-[#070b14] text-slate-100 flex flex-col font-sans selection:bg-indigo-500/30 selection:text-indigo-200">
      {/* Top Navigation Bar */}
      <header className="h-16 border-b border-slate-800/80 bg-[#0b101e]/80 backdrop-blur-md sticky top-0 z-50 px-4 lg:px-6 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-600 via-indigo-500 to-cyan-400 p-[1px] shadow-lg shadow-indigo-500/20">
            <div className="w-full h-full bg-[#0b101e] rounded-[11px] flex items-center justify-center">
              <BrainCircuit className="w-5 h-5 text-indigo-400" />
            </div>
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="font-bold text-lg tracking-tight bg-gradient-to-r from-white via-slate-200 to-slate-400 bg-clip-text text-transparent">
                OmniStudy <span className="text-indigo-400">AI</span>
              </h1>
              <span className="text-[10px] uppercase font-semibold px-2 py-0.5 rounded-full bg-indigo-500/10 text-indigo-300 border border-indigo-500/20 tracking-wider">
                Copilot
              </span>
            </div>
            <p className="text-xs text-slate-400 hidden sm:block">
              Multimodal Real-Time Lecture & Visual Comprehension
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="hidden md:flex items-center gap-2 px-3 py-1.5 rounded-lg bg-slate-900/90 border border-slate-800 text-xs text-slate-300">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
            <span>Session: CS 301 • Distributed Systems</span>
          </div>

          <div className="h-4 w-px bg-slate-800 hidden md:block"></div>

          <button
            onClick={() => {
              setTranscript("");
              setBoardImage(null);
              setBoardImageName(null);
              setAudioFileName(null);
            }}
            className="p-2 text-slate-400 hover:text-slate-200 hover:bg-slate-800/60 rounded-lg transition-colors text-xs flex items-center gap-1.5"
            title="Clear workspace"
          >
            <RotateCcw className="w-4 h-4" />
            <span className="hidden sm:inline">Reset</span>
          </button>
        </div>
      </header>

      {/* Main 3-Column Dashboard Content */}
      <main className="flex-1 p-3 lg:p-5 max-w-[1920px] w-full mx-auto grid grid-cols-1 lg:grid-cols-12 gap-4 lg:gap-5">
        
        {/* ======================================================== */}
        {/* LEFT COLUMN: Audio Capture (span 3 / 12 on large screens) */}
        {/* ======================================================== */}
        <section className="lg:col-span-3 flex flex-col gap-4 bg-[#0d1322] border border-slate-800/80 rounded-2xl p-4 lg:p-5 shadow-xl relative overflow-hidden">
          {/* Subtle decorative glow */}
          <div className="absolute top-0 right-0 w-44 h-44 bg-indigo-600/5 rounded-full blur-3xl pointer-events-none" />

          {/* Section Header */}
          <div className="flex items-center justify-between border-b border-slate-800/80 pb-3">
            <div className="flex items-center gap-2.5">
              <div className="p-2 rounded-lg bg-rose-500/10 text-rose-400 border border-rose-500/20">
                <Volume2 className="w-4 h-4" />
              </div>
              <div>
                <h2 className="font-semibold text-sm text-slate-100">Audio Capture</h2>
                <p className="text-[11px] text-slate-400">Microphone stream & recordings</p>
              </div>
            </div>
            {isRecording && (
              <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-rose-500/20 border border-rose-500/30 text-rose-300 text-xs font-mono font-medium animate-pulse">
                REC {formatSeconds(recordDuration)}
              </span>
            )}
          </div>

          {/* Prominent 'Record Lecture' Button */}
          <button
            onClick={() => setIsRecording(!isRecording)}
            className={`w-full py-3.5 px-4 rounded-xl font-medium text-sm flex items-center justify-center gap-3 transition-all duration-200 shadow-md ${
              isRecording
                ? "bg-gradient-to-r from-rose-600 to-red-600 hover:from-rose-500 hover:to-red-500 text-white shadow-rose-900/30 ring-2 ring-rose-500/40"
                : "bg-gradient-to-r from-indigo-600 to-indigo-700 hover:from-indigo-500 hover:to-indigo-600 text-white shadow-indigo-900/30 hover:scale-[1.01]"
            }`}
          >
            {isRecording ? (
              <>
                <Square className="w-4 h-4 fill-current text-white animate-pulse" />
                <span>Stop Recording</span>
              </>
            ) : (
              <>
                <Mic className="w-4 h-4" />
                <span>Record Lecture</span>
              </>
            )}
          </button>

          {/* Audio Visualizer Waveform Dummy Animation */}
          {isRecording && (
            <div className="bg-slate-900/90 border border-rose-500/20 rounded-xl p-3 flex items-center justify-between gap-1 h-12">
              <span className="text-[10px] text-rose-400 font-mono">LIVE AUDIO:</span>
              <div className="flex items-center gap-1 flex-1 justify-end h-full">
                {[40, 75, 30, 90, 60, 45, 85, 35, 70, 95, 50, 65, 80, 40].map((height, i) => (
                  <div
                    key={i}
                    style={{ height: `${height}%` }}
                    className="w-1 bg-gradient-to-t from-rose-600 to-pink-400 rounded-full animate-pulse"
                  />
                ))}
              </div>
            </div>
          )}

          {/* Audio File Upload Input */}
          <div>
            <label className="text-xs font-medium text-slate-300 mb-1.5 flex items-center justify-between">
              <span>Import Audio File</span>
              <span className="text-[10px] text-slate-500">MP3, WAV, M4A</span>
            </label>
            <input
              type="file"
              ref={audioFileInputRef}
              onChange={handleAudioUpload}
              accept="audio/*"
              className="hidden"
            />
            <button
              onClick={() => audioFileInputRef.current?.click()}
              className="w-full border border-dashed border-slate-700 hover:border-indigo-500/60 bg-slate-900/50 hover:bg-slate-900 transition-colors rounded-xl p-3 flex items-center justify-center gap-2 text-xs text-slate-300 group"
            >
              <Upload className="w-3.5 h-3.5 text-slate-400 group-hover:text-indigo-400 transition-colors" />
              <span className="truncate">
                {audioFileName ? audioFileName : "Choose audio file to transcribe..."}
              </span>
            </button>
          </div>

          {/* Live Transcript Section */}
          <div className="flex-1 flex flex-col min-h-[220px]">
            <div className="flex items-center justify-between mb-2">
              <label className="text-xs font-medium text-slate-300 flex items-center gap-1.5">
                <FileAudio className="w-3.5 h-3.5 text-indigo-400" />
                <span>Live Transcript</span>
              </label>
              <span className="text-[10px] text-slate-500 bg-slate-900 px-2 py-0.5 rounded border border-slate-800">
                Auto-syncing
              </span>
            </div>

            <textarea
              value={transcript}
              onChange={(e) => setTranscript(e.target.value)}
              placeholder="Live transcript will stream here as the lecture is recorded or uploaded..."
              className="flex-1 w-full bg-[#080d1a] border border-slate-800 rounded-xl p-3 text-xs leading-relaxed text-slate-300 placeholder-slate-600 focus:outline-none focus:ring-1 focus:ring-indigo-500/50 resize-none font-mono"
            />
            
            <div className="mt-2 flex items-center justify-between text-[11px] text-slate-500">
              <span>{transcript.split(/\s+/).filter(Boolean).length} words captured</span>
              <button
                onClick={() => navigator.clipboard.writeText(transcript)}
                className="hover:text-slate-300 transition-colors"
              >
                Copy text
              </button>
            </div>
          </div>
        </section>

        {/* ======================================================== */}
        {/* MIDDLE COLUMN: Visual Board (span 5 / 12 on large screens) */}
        {/* ======================================================== */}
        <section className="lg:col-span-5 flex flex-col gap-4 bg-[#0d1322] border border-slate-800/80 rounded-2xl p-4 lg:p-5 shadow-xl relative overflow-hidden">
          {/* Subtle decorative glow */}
          <div className="absolute top-0 right-1/2 translate-x-1/2 w-64 h-64 bg-cyan-600/5 rounded-full blur-3xl pointer-events-none" />

          {/* Section Header */}
          <div className="flex items-center justify-between border-b border-slate-800/80 pb-3">
            <div className="flex items-center gap-2.5">
              <div className="p-2 rounded-lg bg-cyan-500/10 text-cyan-400 border border-cyan-500/20">
                <ImageIcon className="w-4 h-4" />
              </div>
              <div>
                <h2 className="font-semibold text-sm text-slate-100">Visual Board</h2>
                <p className="text-[11px] text-slate-400">Slides, chalkboard & diagram analysis</p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              {!boardImage && (
                <button
                  onClick={loadSampleWhiteboard}
                  className="px-2.5 py-1 text-xs text-cyan-400 hover:text-cyan-300 bg-cyan-500/10 hover:bg-cyan-500/20 border border-cyan-500/30 rounded-lg transition-colors font-medium"
                >
                  Load Demo Board
                </button>
              )}
              {boardImage && (
                <button
                  onClick={() => {
                    setBoardImage(null);
                    setBoardImageName(null);
                  }}
                  className="p-1.5 text-slate-400 hover:text-rose-400 hover:bg-slate-800/60 rounded-lg transition-colors"
                  title="Remove image"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              )}
            </div>
          </div>

          {/* Action Bar: Upload Whiteboard/Slide button */}
          <div className="flex flex-col sm:flex-row gap-2.5">
            <input
              type="file"
              ref={imageFileInputRef}
              onChange={handleImageUpload}
              accept="image/*"
              className="hidden"
            />
            <button
              onClick={() => imageFileInputRef.current?.click()}
              className="flex-1 py-2.5 px-4 rounded-xl bg-gradient-to-r from-cyan-600 to-teal-600 hover:from-cyan-500 hover:to-teal-500 text-white font-medium text-xs flex items-center justify-center gap-2 transition-all shadow-md shadow-cyan-900/20 hover:scale-[1.005]"
            >
              <Upload className="w-4 h-4" />
              <span>Upload Whiteboard/Slide</span>
            </button>
          </div>

          {/* Large Placeholder Box for Image Display */}
          <div
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            className={`flex-1 min-h-[360px] lg:min-h-[440px] bg-[#070b16] border-2 border-dashed rounded-2xl flex flex-col items-center justify-center relative overflow-hidden transition-all duration-200 group ${
              isDraggingOver
                ? "border-cyan-400 bg-cyan-950/20 shadow-lg shadow-cyan-500/10"
                : "border-slate-800 hover:border-slate-700"
            }`}
          >
            {boardImage ? (
              <div className="w-full h-full flex flex-col p-2">
                <div className="flex items-center justify-between px-3 py-1.5 bg-slate-900/90 rounded-lg border border-slate-800 mb-2">
                  <div className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-cyan-400"></span>
                    <span className="text-xs text-slate-300 font-mono truncate max-w-[240px]">
                      {boardImageName || "whiteboard_capture.png"}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => imageFileInputRef.current?.click()}
                      className="text-[10px] text-cyan-400 hover:text-cyan-300 hover:underline px-1 py-0.5"
                    >
                      Change
                    </button>
                    <span className="text-[10px] text-cyan-400 bg-cyan-950/60 border border-cyan-800/50 px-2 py-0.5 rounded">
                      Visual Preview Active
                    </span>
                  </div>
                </div>
                
                {/* Image Container */}
                <div className="relative flex-1 rounded-xl overflow-hidden bg-slate-950 border border-slate-800/60 flex items-center justify-center p-1">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={boardImage}
                    alt="Uploaded Whiteboard or Slide"
                    className="max-h-full max-w-full object-contain rounded-lg"
                  />
                  
                  {/* Overlay tags simulating AI visual detection */}
                  <div className="absolute bottom-3 left-3 flex flex-wrap gap-2 pointer-events-none">
                    <span className="text-[10px] bg-slate-950/80 backdrop-blur border border-indigo-500/40 text-indigo-300 px-2 py-0.5 rounded-md shadow">
                      📌 Visual Content Loaded
                    </span>
                    <span className="text-[10px] bg-slate-950/80 backdrop-blur border border-emerald-500/40 text-emerald-300 px-2 py-0.5 rounded-md shadow">
                      ✓ Ready for AI Analysis
                    </span>
                  </div>
                </div>
              </div>
            ) : (
              /* Empty Placeholder State */
              <div className="text-center p-8 max-w-sm flex flex-col items-center">
                <div
                  onClick={() => imageFileInputRef.current?.click()}
                  className="w-16 h-16 rounded-2xl bg-slate-900 border border-slate-800 flex items-center justify-center mb-4 text-slate-500 group-hover:text-cyan-400 group-hover:border-cyan-500/30 transition-all duration-300 cursor-pointer"
                  title="Click to browse image"
                >
                  <ImageIcon className="w-8 h-8" />
                </div>
                <h3 className="text-sm font-semibold text-slate-200 mb-1">
                  No visual board loaded
                </h3>
                <p className="text-xs text-slate-400 mb-4 leading-relaxed">
                  Drop a photo of the lecture whiteboard, PowerPoint slide, or diagram. OmniStudy will correlate it with the spoken transcript.
                </p>
                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() => imageFileInputRef.current?.click()}
                    className="px-3.5 py-1.5 text-xs bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-lg border border-slate-700 transition-colors cursor-pointer font-medium"
                  >
                    Browse Files
                  </button>
                  <button
                    type="button"
                    onClick={loadSampleWhiteboard}
                    className="px-3 py-1.5 text-xs bg-cyan-600/20 hover:bg-cyan-600/30 text-cyan-300 border border-cyan-500/30 rounded-lg transition-colors font-medium cursor-pointer"
                  >
                    View Sample Board
                  </button>
                </div>
              </div>
            )}
          </div>
        </section>

        {/* ======================================================== */}
        {/* RIGHT COLUMN: AI Tutor (span 4 / 12 on large screens)     */}
        {/* ======================================================== */}
        <section className="lg:col-span-4 flex flex-col gap-3 bg-[#0d1322] border border-slate-800/80 rounded-2xl p-4 lg:p-5 shadow-xl relative overflow-hidden">
          {/* Subtle decorative glow */}
          <div className="absolute top-0 right-0 w-44 h-44 bg-violet-600/5 rounded-full blur-3xl pointer-events-none" />

          {/* Section Header */}
          <div className="flex items-center justify-between border-b border-slate-800/80 pb-3">
            <div className="flex items-center gap-2.5">
              <div className="p-2 rounded-lg bg-violet-500/10 text-violet-400 border border-violet-500/20">
                <Bot className="w-4 h-4" />
              </div>
              <div>
                <h2 className="font-semibold text-sm text-slate-100">AI Tutor</h2>
                <p className="text-[11px] text-slate-400">Contextual multimodal assistant</p>
              </div>
            </div>

            <div className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
              <span className="text-[11px] text-slate-400">Online</span>
            </div>
          </div>

          {/* Action Header: 'Generate Flashcards' Button */}
          <div className="flex items-center gap-2">
            <button
              onClick={handleGenerateFlashcards}
              className="flex-1 py-2.5 px-3.5 rounded-xl bg-gradient-to-r from-violet-600 via-indigo-600 to-purple-600 hover:from-violet-500 hover:to-purple-500 text-white font-medium text-xs flex items-center justify-center gap-2 shadow-lg shadow-violet-900/30 transition-all hover:scale-[1.01]"
            >
              <Sparkles className="w-3.5 h-3.5 text-yellow-300" />
              <span>Generate Flashcards</span>
            </button>
          </div>

          {/* Flashcard Active Preview (if generated) */}
          {flashcardsGenerated && (
            <div className="bg-gradient-to-br from-[#12142a] to-[#1a1532] border border-violet-500/30 rounded-xl p-3.5 relative shadow-inner">
              <div className="flex items-center justify-between mb-2">
                <span className="text-[10px] uppercase font-bold tracking-wider text-violet-400 flex items-center gap-1">
                  <Layers className="w-3 h-3" /> Flashcard {activeFlashcardIndex + 1} of {sampleFlashcards.length}
                </span>
                <span className="text-[10px] text-slate-400 bg-slate-900/60 px-2 py-0.5 rounded border border-slate-800">
                  {sampleFlashcards[activeFlashcardIndex].topic}
                </span>
              </div>

              {/* Flip Card Interactive Display */}
              <div
                onClick={() => setIsCardFlipped(!isCardFlipped)}
                className="cursor-pointer min-h-[90px] bg-slate-900/80 hover:bg-slate-900 border border-slate-800/80 rounded-lg p-3 flex flex-col justify-center transition-colors"
              >
                <span className="text-[10px] font-semibold text-slate-400 mb-1">
                  {isCardFlipped ? "ANSWER (CLICK TO FLIP):" : "QUESTION (CLICK TO FLIP):"}
                </span>
                <p className="text-xs text-slate-200 leading-snug">
                  {isCardFlipped
                    ? sampleFlashcards[activeFlashcardIndex].answer
                    : sampleFlashcards[activeFlashcardIndex].question}
                </p>
              </div>

              {/* Flashcard Pagination */}
              <div className="flex items-center justify-between mt-2.5">
                <button
                  onClick={() => {
                    setIsCardFlipped(false);
                    setActiveFlashcardIndex((prev) => (prev > 0 ? prev - 1 : sampleFlashcards.length - 1));
                  }}
                  className="text-[11px] text-slate-400 hover:text-slate-200 px-2 py-1 rounded bg-slate-900/60 border border-slate-800"
                >
                  Previous
                </button>
                <div className="flex gap-1">
                  {sampleFlashcards.map((_, i) => (
                    <span
                      key={i}
                      className={`w-1.5 h-1.5 rounded-full ${
                        i === activeFlashcardIndex ? "bg-violet-400" : "bg-slate-700"
                      }`}
                    />
                  ))}
                </div>
                <button
                  onClick={() => {
                    setIsCardFlipped(false);
                    setActiveFlashcardIndex((prev) => (prev < sampleFlashcards.length - 1 ? prev + 1 : 0));
                  }}
                  className="text-[11px] text-violet-300 hover:text-violet-200 px-2 py-1 rounded bg-violet-950/50 border border-violet-800/50"
                >
                  Next Card
                </button>
              </div>
            </div>
          )}

          {/* Chat Message History Area */}
          <div className="flex-1 min-h-[280px] bg-[#070b16] border border-slate-800/80 rounded-xl p-3 overflow-y-auto flex flex-col gap-3">
            {messages.map((msg) => (
              <div
                key={msg.id}
                className={`flex gap-2.5 max-w-[90%] ${
                  msg.sender === "user" ? "ml-auto flex-row-reverse" : "mr-auto"
                }`}
              >
                <div
                  className={`w-7 h-7 rounded-lg flex items-center justify-center shrink-0 ${
                    msg.sender === "user"
                      ? "bg-indigo-600 text-white"
                      : "bg-violet-950 text-violet-400 border border-violet-800/50"
                  }`}
                >
                  {msg.sender === "user" ? <User className="w-3.5 h-3.5" /> : <Bot className="w-3.5 h-3.5" />}
                </div>

                <div
                  className={`rounded-2xl px-3.5 py-2.5 text-xs leading-relaxed ${
                    msg.sender === "user"
                      ? "bg-indigo-600 text-white rounded-tr-none shadow-sm"
                      : "bg-[#111728] border border-slate-800 text-slate-200 rounded-tl-none whitespace-pre-line"
                  }`}
                >
                  {msg.text}
                  <div
                    className={`text-[9px] mt-1.5 ${
                      msg.sender === "user" ? "text-indigo-200 text-right" : "text-slate-500"
                    }`}
                  >
                    {msg.timestamp}
                  </div>
                </div>
              </div>
            ))}
            <div ref={chatBottomRef} />
          </div>

          {/* Quick prompt suggestion chips */}
          <div className="flex gap-1.5 overflow-x-auto pb-1 text-[11px] scrollbar-none">
            {["Summarize Whiteboard", "Key Definitions", "Create Practice Quiz"].map((chip) => (
              <button
                key={chip}
                onClick={() => {
                  setChatInput(chip);
                }}
                className="whitespace-nowrap px-2.5 py-1 rounded-full bg-slate-900 border border-slate-800 text-slate-400 hover:text-slate-200 hover:border-slate-700 transition-colors"
              >
                {chip}
              </button>
            ))}
          </div>

          {/* Bottom Chat Text Input Box */}
          <form onSubmit={handleSendMessage} className="relative flex items-center">
            <input
              type="text"
              value={chatInput}
              onChange={(e) => setChatInput(e.target.value)}
              placeholder="Ask AI Tutor about the lecture or board..."
              className="w-full bg-[#080d1a] border border-slate-800 rounded-xl py-3 pl-3.5 pr-11 text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-violet-500/60"
            />
            <button
              type="submit"
              disabled={!chatInput.trim()}
              className="absolute right-2 p-1.5 rounded-lg bg-violet-600 text-white hover:bg-violet-500 disabled:opacity-40 disabled:hover:bg-violet-600 transition-colors"
            >
              <Send className="w-3.5 h-3.5" />
            </button>
          </form>
        </section>
      </main>
    </div>
  );
}
