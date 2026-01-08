"use client";

import { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import Sidebar from "@/components/Sidebar";
import Timer from "@/components/Timer";
import TaskManager, { Task } from "@/components/TaskManager";
import { useLocalStorage } from "@/hooks/useLocalStorage";

export default function Dashboard() {
  const [greeting, setGreeting] = useState("Good Morning");
  const container = useRef(null);
  
  // Safe SSR Storage
  const [tasks, setTasks] = useLocalStorage<Task[]>("zenflow_tasks_v2", []);

  useEffect(() => {
    // Interactive greeting based on time
    const hr = new Date().getHours();
    if (hr < 12) setGreeting("Good Morning");
    else if (hr < 18) setGreeting("Good Afternoon");
    else setGreeting("Good Evening");
  }, []);

  useGSAP(() => {
    const tl = gsap.timeline();

    // 1. Sidebar (Button)
    tl.from(".gsap-sidebar", {
        x: -100,
        opacity: 0,
        duration: 1,
        ease: "power3.out"
    })
    // 2. Hero Section (Overlap)
    .from(".gsap-hero", {
        scale: 0.9,
        opacity: 0,
        duration: 1,
        ease: "power3.out"
    }, "-=0.5")
    // 3. Widgets (Staggered)
    .from(".gsap-widget", {
        y: 30,
        opacity: 0,
        duration: 0.8,
        stagger: 0.2,
        ease: "power3.out"
    }, "-=0.5")
    // 4. Task Manager
    .from(".gsap-task-manager", {
        y: 50,
        opacity: 0,
        duration: 0.8,
        ease: "power3.out"
    }, "-=0.3");

  }, { scope: container });

  return (
    <main ref={container} className="min-h-screen bg-slate-950 text-white selection:bg-cyan-500/30">
      <div className="absolute inset-0 bg-[url('/noise.png')] opacity-[0.03] pointer-events-none mix-blend-overlay" />
      <div className="absolute top-[-20%] right-[-10%] w-[600px] h-[600px] bg-purple-600/20 blur-[120px] rounded-full pointer-events-none" />
      <div className="absolute bottom-[-20%] left-[-10%] w-[600px] h-[600px] bg-cyan-600/20 blur-[120px] rounded-full pointer-events-none" />

      <div className="gsap-sidebar fixed z-50">
         <Sidebar />
      </div>

      <div className="relative z-10 flex-1 flex flex-col items-center w-full px-4 md:px-8 py-8 md:py-12">
        <div className="w-full max-w-5xl space-y-8">
          {/* Header */}
          <header className="mb-12 text-center relative gsap-hero">
               <div className="relative inline-block group">
                   {/* Ripple Layers */}
                   <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[120%] h-[150%] rounded-[100%] border text-cyan-500/30 border-current blur-[2px] animate-ripple pointer-events-none" />
                   <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[120%] h-[150%] rounded-[100%] border text-purple-500/30 border-current blur-[2px] animate-ripple pointer-events-none" style={{ animationDelay: '1.5s' }} />

                   <h1 className="text-5xl md:text-7xl font-light tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-slate-500 via-white to-slate-500 bg-[length:200%_auto] animate-shimmer relative z-10 pb-2 mb-2 drop-shadow-sm">
                      {greeting}
                   </h1>
               </div>

              <div className="flex items-center justify-center gap-4">
                  {/* Left Ornament */}
                  <div className="hidden md:block text-cyan-200/80 drop-shadow-[0_0_5px_rgba(34,211,238,0.5)]">
                      <svg width="40" height="8" viewBox="0 0 40 8" fill="none" xmlns="http://www.w3.org/2000/svg">
                          <path d="M0 4L15 4M40 4L25 4M20 0L22 4L20 8L18 4L20 0Z" stroke="currentColor" strokeWidth="1" />
                      </svg>
                  </div>

                  <p className="text-sm font-normal text-slate-400/80 tracking-[0.3em] uppercase">
                      Focus on what matters most
                  </p>
                  
                  {/* Right Ornament */}
                  <div className="hidden md:block text-cyan-200/80 drop-shadow-[0_0_5px_rgba(34,211,238,0.5)]">
                      <svg width="40" height="8" viewBox="0 0 40 8" fill="none" xmlns="http://www.w3.org/2000/svg">
                          <path d="M40 4L25 4M0 4L15 4M20 0L22 4L20 8L18 4L20 0Z" stroke="currentColor" strokeWidth="1" />
                      </svg>
                  </div>
              </div>
          </header>

          {/* Grid Layout */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
              {/* Timer Section - Left/Top */}
              <div className="lg:col-span-5 space-y-6">
                  <div className="gsap-widget">
                    <Timer />
                  </div>
                  
                  {/* Audio Mini-Widget */}
                  <div className="gsap-widget glass-card p-6 rounded-2xl flex items-center justify-between">
                      <div className="flex items-center gap-4">
                          <div className="w-10 h-10 rounded-full bg-cyan-500/10 flex items-center justify-center">
                              <div className="w-1 h-3 bg-cyan-400 rounded-full animate-bounce delay-75" />
                              <div className="w-1 h-5 bg-cyan-400 rounded-full mx-1 animate-bounce" />
                              <div className="w-1 h-3 bg-cyan-400 rounded-full animate-bounce delay-150" />
                          </div>
                          <div>
                              <h4 className="text-sm font-medium text-white">Lo-Fi Radio</h4>
                              <p className="text-xs text-slate-500">Beats to study/relax to</p>
                          </div>
                      </div>
                      <button className="px-4 py-1.5 bg-white/5 hover:bg-white/10 rounded-full text-xs font-medium text-gray-300 transition-colors">Play</button>
                  </div>
              </div>

              {/* Task Manager - Right/Main */}
              <div className="lg:col-span-7 gsap-task-manager">
                  <TaskManager tasks={tasks} setTasks={setTasks} />
              </div>
          </div>
        </div>
      </div>
    </main>
  );
}
