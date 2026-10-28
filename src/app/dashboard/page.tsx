"use client";

import React, { useState, useRef, useEffect } from "react";
import Link from "next/link";
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
  Loader2,
  LogOut,
  Flame,
  Plus,
  MessageSquare,
  Clock,
  TrendingUp,
  PanelLeft,
  PanelLeftClose,
  X,
  Search,
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

interface StudySession {
  id: string;
  title: string;
  course: string;
  date: string;
  cardsCount: number;
}

export default function OmniStudyDashboard() {
  // --- Left Sidebar: User & Session History States ---
  const [sessions, setSessions] = useState<StudySession[]>([
    {
      id: "1",
      title: "Raft & Paxos Consensus",
      course: "CS 301",
      date: "Active now",
      cardsCount: 3,
    },
    {
      id: "2",
      title: "Eigenvalues & Spectral Theorem",
      course: "MATH 240",
      date: "Yesterday",
      cardsCount: 8,
    },
    {
      id: "3",
      title: "Cellular Respiration & ATP",
      course: "BIO 110",
      date: "2 days ago",
      cardsCount: 12,
    },
    {
      id: "4",
      title: "Quantum Tunneling & Waves",
      course: "PHYS 202",
      date: "3 days ago",
      cardsCount: 6,
    },
    {
      id: "5",
      title: "Self-Attention & Transformers",
      course: "AI 405",
      date: "5 days ago",
      cardsCount: 15,
    },
    {
      id: "6",
      title: "Thermodynamic Equilibrium",
      course: "CHEM 102",
      date: "Oct 21",
      cardsCount: 9,
    },
    {
      id: "7",
      title: "Epistemology & Rationalism",
      course: "PHIL 101",
      date: "Oct 18",
      cardsCount: 5,
    },
  ]);
  const [selectedSessionId, setSelectedSessionId] = useState("1");
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [sessionSearch, setSessionSearch] = useState("");

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
  const [isAnalyzing, setIsAnalyzing] = useState(false);

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

  const [flashcards, setFlashcards] = useState<Flashcard[]>(sampleFlashcards);

  // Hidden file inputs & scrolling refs
  const audioFileInputRef = useRef<HTMLInputElement>(null);
  const imageFileInputRef = useRef<HTMLInputElement>(null);
  const chatContainerRef = useRef<HTMLDivElement>(null);

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
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTo({
        top: chatContainerRef.current.scrollHeight,
        behavior: "smooth",
      });
    }
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

  const sendImageToVisionAPI = async (file: File | Blob) => {
    setIsAnalyzing(true);
    try {
      const formData = new FormData();
      formData.append("image", file);

      const response = await fetch("/api/vision", {
        method: "POST",
        body: formData,
      });

      const data = await response.json();
      console.log("Vision API Response:", data);

      if (data.success) {
        // 1. Update left 'Live Transcript' column with AI transcription & analysis
        if (data.transcription) {
          const timestamp = new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
          let newTranscriptEntry = `\n\n[Whiteboard AI Transcription • ${timestamp}]:\n${data.transcription}`;
          if (data.analysis) {
            newTranscriptEntry += `\n\n[Key Educational Takeaways]:\n${data.analysis}`;
          }
          setTranscript((prev) => (prev ? prev + newTranscriptEntry : newTranscriptEntry.trim()));
        }

        // 2. Format and display generated flashcards in the right 'AI Tutor' column
        if (data.flashcards && Array.isArray(data.flashcards) && data.flashcards.length > 0) {
          const newCards: Flashcard[] = data.flashcards.map((card: any, idx: number) => {
            if (typeof card === "string") {
              if (card.includes("|")) {
                const [q, a] = card.split("|");
                return {
                  question: q.replace(/^question:\s*/i, "").trim(),
                  answer: (a || "").replace(/^answer:\s*/i, "").trim(),
                  topic: "Whiteboard AI",
                };
              } else if (card.toLowerCase().includes("answer:")) {
                const parts = card.split(/answer:/i);
                return {
                  question: parts[0].replace(/^question:\s*/i, "").trim(),
                  answer: (parts[1] || "").trim(),
                  topic: "Whiteboard AI",
                };
              }
              return {
                question: card,
                answer: "Core concept identified by Gemini Vision AI.",
                topic: `Card ${idx + 1}`,
              };
            } else if (typeof card === "object" && card !== null) {
              return {
                question: card.question || card.q || "Key Concept",
                answer: card.answer || card.a || "Analysis summary",
                topic: card.topic || card.tag || "Whiteboard AI",
              };
            }
            return {
              question: String(card),
              answer: "Study concept",
              topic: "AI Study",
            };
          });

          setFlashcards(newCards);
          setFlashcardsGenerated(true);
          setActiveFlashcardIndex(0);
          setIsCardFlipped(false);

          // 3. Post summary message in AI Tutor chat history
          const tutorMsg: Message = {
            id: Date.now().toString(),
            sender: "ai",
            text: data.analysis
              ? `✨ **Whiteboard Transcribed & Analyzed!**\n\n${data.analysis}\n\nI've generated **${newCards.length} flashcards** from this board for you to review above!`
              : `✨ **Whiteboard Transcribed!**\n\nI've extracted the notes into your Live Transcript and generated **${newCards.length} flashcards** for your study session.`,
            timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
            flashcardPreview: newCards[0],
          };
          setMessages((prev) => [...prev, tutorMsg]);
        }
      } else {
        console.warn("Vision API returned non-success response:", data.error);
        const errMsg: Message = {
          id: Date.now().toString(),
          sender: "ai",
          text: `⚠️ **Vision API Notice**: ${data.error || "Could not analyze the board. Please check your API key configuration."}`,
          timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
        };
        setMessages((prev) => [...prev, errMsg]);
      }
    } catch (error) {
      console.error("Error sending image to Vision API:", error);
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setBoardImageName(file.name);
      const url = URL.createObjectURL(file);
      setBoardImage(url);
      e.target.value = "";
      sendImageToVisionAPI(file);
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
      sendImageToVisionAPI(file);
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
    const imgUri = `data:image/svg+xml;utf8,${svgContent}`;
    setBoardImage(imgUri);
    setBoardImageName("lecture_14_raft_state_machine.png");

    if (typeof window !== "undefined") {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement("canvas");
        canvas.width = 800;
        canvas.height = 500;
        const ctx = canvas.getContext("2d");
        if (ctx) {
          ctx.drawImage(img, 0, 0);
          canvas.toBlob((blob) => {
            if (blob) {
              sendImageToVisionAPI(blob);
            }
          }, "image/png");
        }
      };
      img.src = imgUri;
    }
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
      text: `✨ Reviewing ${flashcards.length} high-yield study flashcards based on the lecture whiteboard and transcript!`,
      timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      flashcardPreview: flashcards[0],
    };
    setMessages((prev) => [...prev, flashcardMsg]);
  };

  return (
    <div className="min-h-screen h-screen bg-[#06080f] text-slate-100 flex flex-col font-sans selection:bg-teal-500/30 selection:text-teal-200 overflow-hidden relative">
      {/* Ambient Bespoke Midnight Mesh Glows */}
      <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
        {/* Soft violet glow top left */}
        <div className="absolute -top-32 -left-32 w-[34rem] h-[34rem] bg-violet-600/12 rounded-full blur-[140px]" />
        {/* Glowing teal / emerald aura top right */}
        <div className="absolute top-1/4 -right-32 w-[36rem] h-[36rem] bg-teal-500/10 rounded-full blur-[150px]" />
        {/* Subtle deep indigo bottom center */}
        <div className="absolute -bottom-40 left-1/4 w-[42rem] h-[42rem] bg-indigo-600/10 rounded-full blur-[160px]" />
      </div>

      {/* Top Glassmorphism Navigation Bar */}
      <header className="h-16 border-b border-white/[0.07] bg-[#07080e]/75 backdrop-blur-2xl sticky top-0 z-40 px-4 lg:px-7 flex items-center justify-between shrink-0 shadow-[0_4px_24px_rgba(0,0,0,0.4)]">
        <div className="flex items-center gap-3.5">
          {/* Universal sidebar toggle button */}
          <button
            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
            className="p-2.5 text-slate-400 hover:text-white bg-white/[0.03] hover:bg-white/[0.08] rounded-2xl transition-all duration-300 ease-in-out border border-white/[0.08] hover:border-white/[0.18] flex items-center justify-center cursor-pointer shadow-sm hover:shadow-[0_0_15px_rgba(99,102,241,0.25)] hover:-translate-y-0.5 active:translate-y-0 shrink-0 group"
            title={isSidebarOpen ? "Collapse sidebar" : "Expand sidebar (study history & profile)"}
            aria-label="Toggle sidebar"
          >
            {isSidebarOpen ? (
              <PanelLeftClose className="w-4 h-4 text-teal-400 group-hover:scale-110 transition-transform duration-300" />
            ) : (
              <PanelLeft className="w-4 h-4 text-slate-400 group-hover:text-teal-400 group-hover:scale-110 transition-transform duration-300" />
            )}
          </button>

          <div className="w-11 h-11 rounded-2xl bg-gradient-to-tr from-teal-400 via-indigo-500 to-violet-500 p-[2px] shadow-[0_0_24px_rgba(45,212,191,0.45)] shrink-0 group">
            <div className="w-full h-full bg-[#0a0d18] rounded-[14px] flex items-center justify-center">
              <BrainCircuit className="w-6 h-6 text-teal-300 group-hover:scale-110 transition-transform duration-300" />
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

        <div className="flex items-center gap-2.5 lg:gap-3.5">
          <div className="hidden md:flex items-center gap-2.5 px-3.5 py-1.5 rounded-full bg-white/[0.03] border border-white/[0.08] backdrop-blur-xl text-xs text-slate-300 shadow-sm">
            <span className="w-2 h-2 rounded-full bg-teal-400 shadow-[0_0_8px_rgba(45,212,191,0.6)] animate-pulse"></span>
            <span className="font-medium font-sans">Session: CS 301 • Distributed Systems</span>
          </div>

          <div className="h-5 w-px bg-white/[0.08] hidden md:block"></div>

          <button
            onClick={() => {
              setTranscript("");
              setBoardImage(null);
              setBoardImageName(null);
              setAudioFileName(null);
            }}
            className="p-2 lg:px-3 lg:py-2 text-slate-300 hover:text-white bg-white/[0.03] hover:bg-white/[0.08] border border-white/[0.07] hover:border-white/[0.16] rounded-xl transition-all duration-300 ease-in-out text-xs flex items-center gap-1.5 hover:-translate-y-0.5 active:translate-y-0 shadow-sm"
            title="Clear workspace"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span className="hidden sm:inline font-medium">Reset</span>
          </button>

          <Link
            href="/"
            className="p-2 lg:px-3 lg:py-2 text-slate-300 hover:text-rose-300 bg-white/[0.03] hover:bg-rose-500/10 border border-white/[0.07] hover:border-rose-500/30 rounded-xl transition-all duration-300 ease-in-out text-xs flex items-center gap-1.5 hover:-translate-y-0.5 active:translate-y-0 shadow-sm"
            title="Sign out to Login"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span className="hidden sm:inline font-medium">Sign Out</span>
          </Link>
        </div>
      </header>

      {/* Body Container: Left Sidebar + Main Workspace */}
      <div className="flex-1 flex overflow-hidden relative z-10">
        {/* Mobile backdrop */}
        {isSidebarOpen && (
          <div
            onClick={() => setIsSidebarOpen(false)}
            className="fixed inset-0 bg-black/60 backdrop-blur-md z-40 lg:hidden"
          />
        )}

        {/* ======================================================== */}
        {/* COLLAPSIBLE LEFT SIDEBAR: Profile & Session History     */}
        {/* ======================================================== */}
        <aside
          className={`fixed lg:static top-0 bottom-0 left-0 z-50 lg:z-30 bg-[#080b14]/85 backdrop-blur-2xl flex flex-col shrink-0 transition-all duration-300 ease-in-out overflow-hidden shadow-2xl lg:shadow-none ${
            isSidebarOpen
              ? "w-72 xl:w-80 translate-x-0 opacity-100 border-r border-white/[0.08]"
              : "w-0 -translate-x-full lg:translate-x-0 opacity-0 pointer-events-none border-r-0"
          }`}
        >
          {/* Inner fixed-width container prevents content squishing during collapse transition */}
          <div className="w-72 xl:w-80 h-full flex flex-col shrink-0">
            {/* Sidebar header with collapse button */}
            <div className="flex items-center justify-between p-4 border-b border-white/[0.07] bg-white/[0.02]">
              <span className="text-xs font-semibold text-slate-200 flex items-center gap-2 font-display tracking-wide">
                <span className="w-2 h-2 rounded-full bg-teal-400 shadow-[0_0_8px_rgba(45,212,191,0.6)]"></span>
                Study History & Profile
              </span>
              <button
                onClick={() => setIsSidebarOpen(false)}
                className="p-1.5 rounded-xl text-slate-400 hover:text-white hover:bg-white/[0.08] transition-all duration-300 ease-in-out cursor-pointer hover:-translate-y-0.5"
                title="Collapse sidebar"
              >
                <PanelLeftClose className="w-4 h-4" />
              </button>
            </div>

            {/* User Profile Area (Top) */}
            <div className="p-4 border-b border-white/[0.07] bg-white/[0.015] shrink-0">
              <div className="flex items-center gap-3 mb-3.5">
                <div className="relative shrink-0">
                  <div className="w-11 h-11 rounded-2xl bg-gradient-to-tr from-violet-500 via-indigo-500 to-teal-400 p-[1.5px] shadow-[0_0_15px_rgba(99,102,241,0.3)]">
                    <div className="w-full h-full rounded-[14px] bg-[#0c101c] flex items-center justify-center font-bold text-sm font-display text-teal-300">
                      MK
                    </div>
                  </div>
                  <span className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-teal-400 border-2 border-[#080b14] rounded-full shadow-[0_0_6px_rgba(45,212,191,0.8)]" />
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <h3 className="text-xs font-bold text-white truncate font-display">Muskan Kataria</h3>
                    <span className="text-[9px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full bg-teal-400/15 text-teal-300 border border-teal-400/30 shadow-sm font-mono">
                      PRO
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-400 truncate mt-0.5">Computer Science • Senior</p>
                </div>
              </div>

              {/* 'Active Days' Streak Counter */}
              <div className="mb-3.5 p-3 rounded-2xl bg-gradient-to-r from-amber-500/10 via-orange-500/10 to-amber-500/5 border border-amber-500/25 flex items-center justify-between shadow-[inset_0_1px_0_0_rgba(251,191,36,0.15)] hover:border-amber-500/40 transition-all duration-300">
                <div className="flex items-center gap-2.5">
                  <div className="p-1.5 rounded-xl bg-orange-500/20 text-orange-400 shadow-sm">
                    <Flame className="w-4 h-4 fill-orange-400" />
                  </div>
                  <div>
                    <div className="text-xs font-bold text-amber-200 font-display">14 Days Streak</div>
                    <div className="text-[10px] text-amber-400/80">Active Study Consistency</div>
                  </div>
                </div>
                <span className="text-[10px] font-mono text-amber-300 bg-amber-950/60 px-2 py-0.5 rounded-full border border-amber-800/60">
                  Top 5%
                </span>
              </div>

              {/* 'Recent Topics Studied' Stats */}
              <div>
                <div className="flex items-center justify-between text-[11px] text-slate-400 mb-2 font-medium">
                  <span className="flex items-center gap-1.5 text-slate-300">
                    <TrendingUp className="w-3.5 h-3.5 text-teal-400" /> Recent Topics Studied
                  </span>
                  <span className="text-teal-400 font-semibold font-mono">18 Topics</span>
                </div>
                <div className="grid grid-cols-2 gap-2 text-center">
                  <div className="p-2.5 rounded-xl bg-white/[0.02] border border-white/[0.06] hover:border-white/[0.12] transition-colors">
                    <span className="block text-[10px] text-slate-400 font-medium">Mastered Decks</span>
                    <span className="text-xs font-bold text-slate-100 font-display mt-0.5 block">42 Cards</span>
                  </div>
                  <div className="p-2.5 rounded-xl bg-white/[0.02] border border-white/[0.06] hover:border-white/[0.12] transition-colors">
                    <span className="block text-[10px] text-slate-400 font-medium">Study Hours</span>
                    <span className="text-xs font-bold text-slate-100 font-display mt-0.5 block">19.5 hrs</span>
                  </div>
                </div>
              </div>
            </div>

            {/* New Study Session Button */}
            <div className="p-3.5 border-b border-white/[0.07] bg-white/[0.01] shrink-0">
              <button
                onClick={() => {
                  setTranscript("");
                  setBoardImage(null);
                  setBoardImageName(null);
                  setAudioFileName(null);
                  const newId = Date.now().toString();
                  const newSession: StudySession = {
                    id: newId,
                    title: "New Untitled Lecture",
                    course: "GENERAL",
                    date: "Just now",
                    cardsCount: 0,
                  };
                  setSessions([newSession, ...sessions]);
                  setSelectedSessionId(newId);
                }}
                className="w-full py-2.5 px-3 rounded-2xl bg-gradient-to-r from-violet-600 via-indigo-600 to-teal-600 hover:from-violet-500 hover:to-teal-500 text-white text-xs font-medium flex items-center justify-center gap-2 shadow-[0_0_20px_rgba(99,102,241,0.25)] hover:shadow-[0_0_25px_rgba(45,212,191,0.35)] transition-all duration-300 ease-in-out hover:-translate-y-0.5 active:translate-y-0 cursor-pointer"
              >
                <Plus className="w-3.5 h-3.5" />
                <span className="font-display font-medium">New Study Session</span>
              </button>
            </div>

            {/* Chat / Session History Area (Middle/Bottom) */}
            <div className="flex-1 flex flex-col min-h-0 p-3.5 bg-transparent">
              <div className="flex items-center justify-between mb-2.5 px-1">
                <span className="text-[11px] font-semibold text-slate-300 flex items-center gap-1.5 font-display tracking-wide">
                  <Clock className="w-3.5 h-3.5 text-teal-400" />
                  <span>Session History</span>
                </span>
                <span className="text-[10px] text-slate-400 bg-white/[0.04] px-2 py-0.5 rounded-full border border-white/[0.08] font-mono">
                  {sessions.length}
                </span>
              </div>

              {/* Quick Filter Search */}
              <div className="relative mb-3">
                <Search className="w-3.5 h-3.5 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={sessionSearch}
                  onChange={(e) => setSessionSearch(e.target.value)}
                  placeholder="Search past lectures & boards..."
                  className="w-full bg-black/30 border border-white/[0.08] rounded-xl pl-8 pr-3 py-2 text-[11px] text-slate-200 placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-teal-400/50 focus:border-teal-400/50 transition-all duration-300"
                />
              </div>

              {/* Scrollable list of previous study sessions */}
              <div className="flex-1 overflow-y-auto space-y-2 pr-1">
                {sessions
                  .filter(
                    (s) =>
                      s.title.toLowerCase().includes(sessionSearch.toLowerCase()) ||
                      s.course.toLowerCase().includes(sessionSearch.toLowerCase())
                  )
                  .map((session) => {
                    const isSelected = session.id === selectedSessionId;
                    return (
                      <button
                        key={session.id}
                        onClick={() => {
                          setSelectedSessionId(session.id);
                          if (isSidebarOpen) setIsSidebarOpen(false);
                        }}
                        className={`w-full text-left p-3 rounded-2xl border transition-all duration-300 ease-in-out flex flex-col gap-1.5 cursor-pointer group hover:-translate-y-0.5 ${
                          isSelected
                            ? "bg-gradient-to-r from-violet-600/20 via-indigo-600/20 to-teal-500/10 border-teal-400/40 text-white shadow-[0_0_20px_rgba(45,212,191,0.15)]"
                            : "bg-white/[0.02] hover:bg-white/[0.05] border-white/[0.06] text-slate-300 hover:border-white/[0.15] hover:shadow-[0_4px_16px_rgba(0,0,0,0.3)]"
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <span
                            className={`text-[9px] font-mono uppercase font-bold px-2 py-0.5 rounded-full border ${
                              isSelected
                                ? "bg-teal-400/20 border-teal-400/40 text-teal-300"
                                : "bg-white/[0.04] border-white/[0.08] text-slate-400 group-hover:text-slate-200"
                            }`}
                          >
                            {session.course}
                          </span>
                          <span className="text-[10px] text-slate-500 font-mono">{session.date}</span>
                        </div>
                        <p className="text-xs font-medium truncate leading-tight font-display">
                          {session.title}
                        </p>
                        <div className="flex items-center justify-between text-[10px] text-slate-400 mt-0.5">
                          <span className="flex items-center gap-1 text-[10px]">
                            <MessageSquare className="w-2.5 h-2.5 text-teal-400/80" /> Transcribed
                          </span>
                          <span className="font-mono">{session.cardsCount} cards</span>
                        </div>
                      </button>
                    );
                  })}
              </div>
            </div>

            {/* Sidebar Footer Info */}
            <div className="p-3.5 border-t border-white/[0.07] bg-white/[0.015] flex items-center justify-between text-[10px] text-slate-500 shrink-0">
              <span className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-teal-400 shadow-[0_0_6px_rgba(45,212,191,0.8)]"></span>
                Auto-saved to Cloud
              </span>
              <span className="font-mono text-slate-400">v2.5</span>
            </div>
          </div>
        </aside>

        {/* ======================================================== */}
        {/* MAIN CONTENT AREA: 3-Column Glassmorphic Workspace       */}
        {/* ======================================================== */}
        <main className="flex-1 h-full overflow-y-auto p-4 sm:p-5 lg:p-6 xl:p-8 bg-transparent flex flex-col transition-all duration-300">
          <div className="flex-1 grid grid-cols-1 lg:grid-cols-12 gap-5 lg:gap-6 xl:gap-7 min-h-0">
        
        {/* ======================================================== */}
        {/* LEFT COLUMN: Audio Capture (span 3 / 12 on large screens) */}
        {/* ======================================================== */}
        <section className="lg:col-span-3 flex flex-col gap-5 glass-panel rounded-3xl p-5 lg:p-6 shadow-[inset_0_1px_0_0_rgba(255,255,255,0.08),0_20px_48px_-12px_rgba(0,0,0,0.6)] relative overflow-hidden group">
          {/* Subtle decorative glow */}
          <div className="absolute top-0 right-0 w-48 h-48 bg-rose-500/10 rounded-full blur-3xl pointer-events-none group-hover:bg-rose-500/15 transition-all duration-500" />

          {/* Section Header */}
          <div className="flex items-center justify-between border-b border-white/[0.07] pb-3.5 shrink-0">
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-2xl bg-rose-500/15 text-rose-400 border border-rose-500/25 shadow-sm shrink-0">
                <Volume2 className="w-5 h-5" />
              </div>
              <div>
                <h2 className="font-display font-bold text-base text-white tracking-tight">Audio Capture</h2>
                <p className="text-xs text-slate-300 font-medium">Microphone stream & recordings</p>
              </div>
            </div>
            {isRecording && (
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-rose-500/20 border border-rose-500/40 text-rose-300 text-xs font-mono font-medium animate-pulse shadow-[0_0_12px_rgba(244,63,94,0.3)]">
                REC {formatSeconds(recordDuration)}
              </span>
            )}
          </div>

          {/* Prominent 'Record Lecture' Button */}
          <button
            onClick={() => setIsRecording(!isRecording)}
            className={`w-full py-3.5 px-4 rounded-2xl font-display font-medium text-sm flex items-center justify-center gap-3 transition-all duration-300 ease-in-out shadow-lg hover:-translate-y-0.5 active:translate-y-0 cursor-pointer ${
              isRecording
                ? "bg-gradient-to-r from-rose-600 via-rose-500 to-red-600 text-white shadow-rose-900/40 ring-2 ring-rose-500/50 hover:shadow-[0_0_25px_rgba(244,63,94,0.45)]"
                : "bg-gradient-to-r from-indigo-600 via-indigo-500 to-teal-500 hover:from-indigo-500 hover:to-teal-400 text-white shadow-[0_0_20px_rgba(99,102,241,0.3)] hover:shadow-[0_0_28px_rgba(45,212,191,0.4)]"
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
            <div className="bg-black/35 backdrop-blur-xl border border-rose-500/30 rounded-2xl p-3 flex items-center justify-between gap-2 h-14 shadow-inner">
              <span className="text-[10px] text-rose-300 font-mono font-semibold">LIVE AUDIO:</span>
              <div className="flex items-center gap-1.5 flex-1 justify-end h-full">
                {[40, 75, 30, 90, 60, 45, 85, 35, 70, 95, 50, 65, 80, 40].map((height, i) => (
                  <div
                    key={i}
                    style={{ height: `${height}%` }}
                    className="w-1 bg-gradient-to-t from-rose-500 to-amber-300 rounded-full animate-pulse"
                  />
                ))}
              </div>
            </div>
          )}

          {/* Audio File Upload Input */}
          <div>
            <div className="text-xs font-medium text-slate-300 mb-2 flex items-center justify-between font-display">
              <span>Import Audio File</span>
              <span className="text-[10px] text-slate-500 font-mono">MP3, WAV, M4A</span>
            </div>
            <input
              id="audio-file-input"
              type="file"
              ref={audioFileInputRef}
              onChange={handleAudioUpload}
              accept="audio/*"
              className="sr-only"
            />
            <label
              htmlFor="audio-file-input"
              onClick={() => audioFileInputRef.current?.click()}
              className="w-full border border-dashed border-white/[0.12] hover:border-teal-400/50 bg-white/[0.02] hover:bg-white/[0.05] transition-all duration-300 ease-in-out rounded-2xl p-3.5 flex items-center justify-center gap-2.5 text-xs text-slate-300 group cursor-pointer hover:-translate-y-0.5 shadow-sm"
            >
              <Upload className="w-4 h-4 text-slate-400 group-hover:text-teal-400 transition-colors duration-300" />
              <span className="truncate font-medium">
                {audioFileName ? audioFileName : "Choose audio file to transcribe..."}
              </span>
            </label>
          </div>

          {/* Live Transcript Section */}
          <div className="flex-1 flex flex-col min-h-[220px]">
            <div className="flex items-center justify-between mb-2.5">
              <label className="text-xs font-semibold text-slate-200 flex items-center gap-2 font-display">
                <FileAudio className="w-3.5 h-3.5 text-teal-400" />
                <span>Live Transcript</span>
              </label>
              <div className="flex items-center gap-2">
                {isAnalyzing ? (
                  <span className="text-[10px] text-teal-300 bg-teal-950/70 border border-teal-500/40 px-2.5 py-0.5 rounded-full flex items-center gap-1.5 animate-pulse font-medium shadow-[0_0_10px_rgba(45,212,191,0.25)]">
                    <Loader2 className="w-2.5 h-2.5 animate-spin" />
                    Transcribing Board...
                  </span>
                ) : (
                  <span className="text-[10px] text-slate-400 bg-white/[0.04] px-2.5 py-0.5 rounded-full border border-white/[0.08] font-mono">
                    Auto-syncing
                  </span>
                )}
              </div>
            </div>

            <textarea
              value={transcript}
              onChange={(e) => setTranscript(e.target.value)}
              placeholder="Live transcript will stream here as the lecture is recorded or uploaded..."
              className="flex-1 w-full bg-black/35 backdrop-blur-xl border border-white/[0.08] rounded-2xl p-3.5 text-xs leading-relaxed text-slate-200 placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-teal-400/50 focus:border-teal-400/50 resize-none font-mono transition-all duration-300 shadow-inner"
            />
            
            <div className="mt-2.5 flex items-center justify-between text-[11px] text-slate-400">
              <span className="font-mono">{transcript.split(/\s+/).filter(Boolean).length} words captured</span>
              <button
                onClick={() => navigator.clipboard.writeText(transcript)}
                className="hover:text-teal-300 transition-colors duration-300 font-medium cursor-pointer"
              >
                Copy text
              </button>
            </div>
          </div>
        </section>

        {/* ======================================================== */}
        {/* MIDDLE COLUMN: Visual Board (span 5 / 12 on large screens) */}
        {/* ======================================================== */}
        <section className="lg:col-span-5 flex flex-col gap-5 glass-panel rounded-3xl p-5 lg:p-6 shadow-[inset_0_1px_0_0_rgba(255,255,255,0.08),0_20px_48px_-12px_rgba(0,0,0,0.6)] relative overflow-hidden group">
          {/* Subtle decorative glow */}
          <div className="absolute top-0 right-1/2 translate-x-1/2 w-72 h-72 bg-teal-500/10 rounded-full blur-3xl pointer-events-none group-hover:bg-teal-500/15 transition-all duration-500" />

          {/* Section Header */}
          <div className="flex items-center justify-between border-b border-white/[0.07] pb-3.5 shrink-0">
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-2xl bg-teal-500/15 text-teal-400 border border-teal-500/25 shadow-sm shrink-0">
                <ImageIcon className="w-5 h-5" />
              </div>
              <div>
                <h2 className="font-display font-bold text-base text-white tracking-tight">Visual Board</h2>
                <p className="text-xs text-slate-300 font-medium">Slides, chalkboard & diagram analysis</p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              {isAnalyzing && (
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-teal-500/20 border border-teal-500/40 text-teal-300 text-xs font-medium animate-pulse shadow-[0_0_12px_rgba(45,212,191,0.25)]">
                  <Loader2 className="w-3 h-3 animate-spin text-teal-400" />
                  Analyzing...
                </span>
              )}
              {!boardImage && (
                <button
                  onClick={loadSampleWhiteboard}
                  className="px-3 py-1.5 text-xs text-teal-300 hover:text-white bg-teal-500/15 hover:bg-teal-500/25 border border-teal-500/30 rounded-xl transition-all duration-300 ease-in-out font-medium hover:-translate-y-0.5 active:translate-y-0 cursor-pointer shadow-sm"
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
                  className="p-2 text-slate-400 hover:text-rose-400 hover:bg-white/[0.08] rounded-xl transition-all duration-300 ease-in-out hover:-translate-y-0.5 cursor-pointer"
                  title="Remove image"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              )}
            </div>
          </div>

          {/* Action Bar: Upload Whiteboard/Slide button */}
          <div className="flex flex-col sm:flex-row gap-2.5">
            <label className="flex-1 py-3 px-4 rounded-2xl bg-gradient-to-r from-teal-600 via-teal-500 to-cyan-500 hover:from-teal-500 hover:to-cyan-400 text-white font-display font-medium text-xs flex items-center justify-center gap-2.5 transition-all duration-300 ease-in-out shadow-[0_0_20px_rgba(20,184,166,0.3)] hover:shadow-[0_0_28px_rgba(45,212,191,0.45)] hover:-translate-y-0.5 active:translate-y-0 cursor-pointer select-none">
              <input
                type="file"
                accept="image/*"
                onChange={handleImageUpload}
                className="sr-only"
              />
              <Upload className="w-4 h-4" />
              <span>Upload Whiteboard / Slide</span>
            </label>
          </div>

          {/* Large Glass Placeholder Box for Image Display */}
          <div
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            className={`flex-1 min-h-[360px] lg:min-h-[440px] bg-black/35 backdrop-blur-xl border-2 border-dashed rounded-3xl flex flex-col items-center justify-center relative overflow-hidden transition-all duration-300 ease-in-out group/drop ${
              isDraggingOver
                ? "border-teal-400 bg-teal-950/20 shadow-[0_0_25px_rgba(45,212,191,0.2)]"
                : "border-white/[0.1] hover:border-white/[0.2] shadow-inner"
            }`}
          >
            {/* Loading Indicator Overlay */}
            {isAnalyzing && (
              <div className="absolute inset-0 bg-[#070914]/85 backdrop-blur-md z-30 flex flex-col items-center justify-center gap-3.5">
                <div className="relative">
                  <div className="w-14 h-14 rounded-full border-2 border-teal-500/20 border-t-teal-400 animate-spin" />
                  <Loader2 className="w-7 h-7 text-teal-400 absolute inset-0 m-auto animate-spin" />
                </div>
                <div className="text-center px-4">
                  <p className="text-xs font-semibold text-slate-100 font-display">Analyzing Whiteboard with Gemini Vision AI</p>
                  <p className="text-[11px] text-slate-400 mt-0.5">Extracting diagrams, formulas, text, and flashcard concepts...</p>
                </div>
              </div>
            )}

            {boardImage ? (
              <div className="w-full h-full flex flex-col p-3">
                <div className="flex items-center justify-between px-3.5 py-2 bg-white/[0.04] backdrop-blur-md rounded-2xl border border-white/[0.08] mb-2.5">
                  <div className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-teal-400 shadow-[0_0_6px_rgba(45,212,191,0.8)]"></span>
                    <span className="text-xs text-slate-200 font-mono truncate max-w-[240px]">
                      {boardImageName || "whiteboard_capture.png"}
                    </span>
                  </div>
                  <div className="flex items-center gap-2.5">
                    <label className="text-[10px] text-teal-300 hover:text-white px-2 py-0.5 rounded-full hover:bg-white/[0.05] transition-colors cursor-pointer font-medium">
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleImageUpload}
                        className="sr-only"
                      />
                      Change
                    </label>
                    <span className="text-[10px] text-teal-300 bg-teal-950/70 border border-teal-500/40 px-2.5 py-0.5 rounded-full font-medium">
                      Visual Preview Active
                    </span>
                  </div>
                </div>
                
                {/* Image Container */}
                <div className="relative flex-1 rounded-2xl overflow-hidden bg-black/50 border border-white/[0.08] flex items-center justify-center p-2 shadow-inner">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={boardImage}
                    alt="Uploaded Whiteboard or Slide"
                    className="max-h-full max-w-full object-contain rounded-xl"
                  />
                  
                  {/* Overlay tags simulating AI visual detection */}
                  <div className="absolute bottom-3 left-3 flex flex-wrap gap-2 pointer-events-none">
                    <span className="text-[10px] bg-black/75 backdrop-blur-md border border-teal-400/40 text-teal-300 px-2.5 py-1 rounded-full shadow-lg font-medium">
                      📌 Visual Content Loaded
                    </span>
                    <span className="text-[10px] bg-black/75 backdrop-blur-md border border-emerald-400/40 text-emerald-300 px-2.5 py-1 rounded-full shadow-lg font-medium">
                      ✓ Ready for AI Analysis
                    </span>
                  </div>
                </div>
              </div>
            ) : (
              /* Empty Placeholder State */
              <div className="text-center p-8 max-w-sm flex flex-col items-center">
                <label
                  className="w-16 h-16 rounded-2xl bg-white/[0.03] border border-white/[0.08] flex items-center justify-center mb-4 text-slate-400 group-hover/drop:text-teal-400 group-hover/drop:border-teal-500/40 group-hover/drop:shadow-[0_0_20px_rgba(45,212,191,0.25)] transition-all duration-300 ease-in-out cursor-pointer hover:-translate-y-0.5"
                  title="Click to browse image"
                >
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageUpload}
                    className="sr-only"
                  />
                  <ImageIcon className="w-8 h-8" />
                </label>
                <h3 className="text-sm font-semibold text-slate-100 mb-1 font-display">
                  No visual board loaded
                </h3>
                <p className="text-xs text-slate-400 mb-5 leading-relaxed">
                  Drop a photo of the lecture whiteboard, PowerPoint slide, or diagram. OmniStudy will correlate it with the spoken transcript.
                </p>
                <div className="flex gap-2.5">
                  <label className="px-4 py-2 text-xs bg-white/[0.04] hover:bg-white/[0.08] text-slate-200 rounded-xl border border-white/[0.1] hover:border-white/[0.2] transition-all duration-300 ease-in-out hover:-translate-y-0.5 cursor-pointer font-medium inline-flex items-center justify-center select-none shadow-sm">
                    <input
                      type="file"
                      ref={imageFileInputRef}
                      accept="image/*"
                      onChange={handleImageUpload}
                      className="sr-only"
                    />
                    Browse Files
                  </label>
                  <button
                    type="button"
                    onClick={loadSampleWhiteboard}
                    className="px-3.5 py-2 text-xs bg-teal-500/15 hover:bg-teal-500/25 text-teal-300 hover:text-white border border-teal-500/30 rounded-xl transition-all duration-300 ease-in-out hover:-translate-y-0.5 font-medium cursor-pointer shadow-sm"
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
        <section className="lg:col-span-4 flex flex-col gap-4 lg:gap-4.5 glass-panel rounded-3xl p-5 lg:p-6 shadow-[inset_0_1px_0_0_rgba(255,255,255,0.08),0_20px_48px_-12px_rgba(0,0,0,0.6)] relative overflow-hidden group">
          {/* Subtle decorative glow */}
          <div className="absolute top-0 right-0 w-48 h-48 bg-violet-600/10 rounded-full blur-3xl pointer-events-none group-hover:bg-violet-600/15 transition-all duration-500" />

          {/* Section Header */}
          <div className="flex items-center justify-between border-b border-white/[0.07] pb-3.5 shrink-0">
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-2xl bg-violet-500/20 text-violet-300 border border-violet-500/30 shadow-sm shrink-0">
                <Bot className="w-5 h-5" />
              </div>
              <div>
                <h2 className="font-display font-bold text-base text-white tracking-tight flex items-center gap-2">
                  <span>AI Tutor</span>
                </h2>
                <p className="text-xs text-slate-300 font-medium">Contextual multimodal assistant</p>
              </div>
            </div>

            <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-white/[0.05] border border-white/[0.1] shadow-sm shrink-0">
              <span className="w-2 h-2 rounded-full bg-teal-400 shadow-[0_0_8px_rgba(45,212,191,0.8)] animate-pulse"></span>
              <span className="text-xs text-slate-200 font-medium">Online</span>
            </div>
          </div>

          {/* Action Header: 'Generate Flashcards' Button */}
          <div className="flex items-center gap-2 shrink-0">
            <button
              onClick={handleGenerateFlashcards}
              className="flex-1 py-3 px-4 rounded-2xl bg-gradient-to-r from-violet-600 via-purple-600 to-indigo-600 hover:from-violet-500 hover:to-indigo-500 text-white font-display font-medium text-xs flex items-center justify-center gap-2.5 shadow-[0_0_20px_rgba(139,92,246,0.3)] hover:shadow-[0_0_28px_rgba(167,139,250,0.45)] transition-all duration-300 ease-in-out hover:-translate-y-0.5 active:translate-y-0 cursor-pointer"
            >
              <Sparkles className="w-3.5 h-3.5 text-yellow-300" />
              <span>Generate Flashcards</span>
              {flashcards.length > 0 && (
                <span className="px-2 py-0.5 bg-white/20 rounded-full text-[10px] font-mono">
                  {flashcards.length}
                </span>
              )}
            </button>
          </div>

          {/* Active AI Processing Indicator */}
          {isAnalyzing && (
            <div className="shrink-0 bg-gradient-to-r from-violet-950/70 via-purple-950/60 to-indigo-950/70 border border-violet-500/40 rounded-2xl p-3.5 flex items-center gap-3 text-xs text-violet-200 animate-pulse shadow-md">
              <Loader2 className="w-4 h-4 text-violet-400 animate-spin shrink-0" />
              <div>
                <p className="font-semibold text-slate-100 font-display">Generating flashcards & tutor insights...</p>
                <p className="text-[10px] text-slate-400">Gemini Vision AI is analyzing visual concepts</p>
              </div>
            </div>
          )}

          {/* Flashcard Active Preview (if generated) */}
          {flashcardsGenerated && flashcards.length > 0 && (
            <div className="shrink-0 bg-gradient-to-br from-violet-950/30 via-[#101426] to-[#0a0d18] border border-violet-500/30 rounded-2xl p-4 relative shadow-[inset_0_1px_0_0_rgba(167,139,250,0.15)]">
              <div className="flex items-center justify-between mb-2.5">
                <span className="text-[10px] uppercase font-bold tracking-wider text-violet-300 flex items-center gap-1.5 font-display">
                  <Layers className="w-3.5 h-3.5" /> Flashcard {activeFlashcardIndex + 1} of {flashcards.length}
                </span>
                <span className="text-[10px] text-teal-300 bg-teal-950/70 px-2.5 py-0.5 rounded-full border border-teal-500/30 font-medium">
                  {flashcards[activeFlashcardIndex]?.topic || "AI Flashcard"}
                </span>
              </div>

              {/* Flip Card Interactive Display */}
              <div
                onClick={() => setIsCardFlipped(!isCardFlipped)}
                className="cursor-pointer min-h-[96px] bg-black/40 hover:bg-black/55 border border-white/[0.08] hover:border-violet-500/40 rounded-xl p-3.5 flex flex-col justify-center transition-all duration-300 ease-in-out hover:-translate-y-0.5 shadow-sm"
              >
                <span className="text-[10px] font-semibold text-violet-400/90 mb-1 font-mono tracking-wide">
                  {isCardFlipped ? "ANSWER (CLICK TO FLIP):" : "QUESTION (CLICK TO FLIP):"}
                </span>
                <p className="text-xs text-slate-100 leading-relaxed font-sans">
                  {isCardFlipped
                    ? flashcards[activeFlashcardIndex]?.answer
                    : flashcards[activeFlashcardIndex]?.question}
                </p>
              </div>

              {/* Flashcard Pagination */}
              <div className="flex items-center justify-between mt-3">
                <button
                  onClick={() => {
                    setIsCardFlipped(false);
                    setActiveFlashcardIndex((prev) => (prev > 0 ? prev - 1 : flashcards.length - 1));
                  }}
                  className="text-[11px] text-slate-300 hover:text-white px-2.5 py-1 rounded-full bg-white/[0.04] hover:bg-white/[0.08] border border-white/[0.08] transition-all duration-300 cursor-pointer"
                >
                  Previous
                </button>
                <div className="flex gap-1.5">
                  {flashcards.map((_, i) => (
                    <span
                      key={i}
                      className={`w-1.5 h-1.5 rounded-full transition-all duration-300 ${
                        i === activeFlashcardIndex ? "bg-teal-400 w-3 shadow-[0_0_6px_rgba(45,212,191,0.8)]" : "bg-slate-700"
                      }`}
                    />
                  ))}
                </div>
                <button
                  onClick={() => {
                    setIsCardFlipped(false);
                    setActiveFlashcardIndex((prev) => (prev < flashcards.length - 1 ? prev + 1 : 0));
                  }}
                  className="text-[11px] text-teal-300 hover:text-white px-2.5 py-1 rounded-full bg-teal-500/15 hover:bg-teal-500/25 border border-teal-500/30 transition-all duration-300 cursor-pointer"
                >
                  Next Card
                </button>
              </div>
            </div>
          )}

          {/* Chat Message History Area */}
          <div
            ref={chatContainerRef}
            className="flex-1 min-h-[140px] bg-black/35 backdrop-blur-xl border border-white/[0.08] rounded-2xl p-3.5 overflow-y-auto flex flex-col gap-3 shadow-inner"
          >
            {messages.map((msg) => (
              <div
                key={msg.id}
                className={`flex gap-2.5 max-w-[90%] ${
                  msg.sender === "user" ? "ml-auto flex-row-reverse" : "mr-auto"
                }`}
              >
                <div
                  className={`w-7 h-7 rounded-xl flex items-center justify-center shrink-0 shadow-sm ${
                    msg.sender === "user"
                      ? "bg-gradient-to-tr from-teal-500 to-indigo-600 text-white"
                      : "bg-white/[0.04] text-violet-300 border border-violet-500/30"
                  }`}
                >
                  {msg.sender === "user" ? <User className="w-3.5 h-3.5" /> : <Bot className="w-3.5 h-3.5" />}
                </div>

                <div
                  className={`rounded-2xl px-4 py-2.5 text-xs leading-relaxed transition-all duration-300 ${
                    msg.sender === "user"
                      ? "bg-gradient-to-r from-teal-600/80 to-indigo-600/80 backdrop-blur-md text-white rounded-tr-none shadow-[0_4px_16px_rgba(20,184,166,0.2)] border border-teal-400/30"
                      : "bg-white/[0.035] backdrop-blur-md border border-white/[0.08] text-slate-200 rounded-tl-none whitespace-pre-line shadow-[inset_0_1px_0_0_rgba(255,255,255,0.05)]"
                  }`}
                >
                  {msg.text}
                  <div
                    className={`text-[9px] mt-1.5 font-mono ${
                      msg.sender === "user" ? "text-teal-200/80 text-right" : "text-slate-500"
                    }`}
                  >
                    {msg.timestamp}
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Quick prompt suggestion chips */}
          <div className="flex gap-2 overflow-x-auto pb-1 text-[11px] scrollbar-none shrink-0">
            {["Summarize Whiteboard", "Key Definitions", "Create Practice Quiz"].map((chip) => (
              <button
                key={chip}
                onClick={() => {
                  setChatInput(chip);
                }}
                className="whitespace-nowrap px-3 py-1 rounded-full bg-white/[0.03] hover:bg-white/[0.08] border border-white/[0.08] hover:border-teal-400/40 text-slate-400 hover:text-slate-100 transition-all duration-300 ease-in-out hover:-translate-y-0.5 cursor-pointer shadow-sm"
              >
                {chip}
              </button>
            ))}
          </div>

          {/* Bottom Chat Text Input Box */}
          <form onSubmit={handleSendMessage} className="relative flex items-center shrink-0">
            <input
              type="text"
              value={chatInput}
              onChange={(e) => setChatInput(e.target.value)}
              placeholder="Ask AI Tutor about the lecture or board..."
              className="w-full bg-black/35 backdrop-blur-xl border border-white/[0.08] rounded-2xl py-3 pl-4 pr-12 text-xs text-slate-100 placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-teal-400/50 focus:border-teal-400/50 transition-all duration-300 shadow-inner"
            />
            <button
              type="submit"
              disabled={!chatInput.trim()}
              className="absolute right-2 p-2 rounded-xl bg-gradient-to-r from-violet-600 to-teal-500 text-white hover:from-violet-500 hover:to-teal-400 disabled:opacity-40 disabled:hover:from-violet-600 disabled:hover:to-teal-500 transition-all duration-300 shadow-md hover:shadow-[0_0_12px_rgba(45,212,191,0.35)] cursor-pointer"
            >
              <Send className="w-3.5 h-3.5" />
            </button>
          </form>
        </section>
          </div>
        </main>
      </div>
    </div>
  );
}
