"use client";

import { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { Play, Pause, RotateCcw, Volume2, VolumeX } from "lucide-react";

export default function Timer() {
  const [timeLeft, setTimeLeft] = useState(25 * 60);
  const [isActive, setIsActive] = useState(false);
  const [mode, setMode] = useState<'focus' | 'short' | 'long'>('focus');
  const [soundEnabled, setSoundEnabled] = useState(true);
  
  const modes = {
    focus: 25 * 60,
    short: 5 * 60,
    long: 15 * 60
  };

  useEffect(() => {
     let interval: NodeJS.Timeout;
     if (isActive && timeLeft > 0) {
         interval = setInterval(() => setTimeLeft(t => t - 1), 1000);
     } else if (timeLeft === 0) {
         setIsActive(false);
         if (soundEnabled) {
             const audio = new Audio("https://assets.mixkit.co/active_storage/sfx/2869/2869-preview.mp3");
             audio.play().catch(() => {});
         }
     }
     return () => clearInterval(interval);
  }, [isActive, timeLeft, soundEnabled]);

  const switchMode = (m: 'focus' | 'short' | 'long') => {
      setMode(m);
      setTimeLeft(modes[m]);
      setIsActive(false);
  };

  const formatTime = (seconds: number) => {
      const min = Math.floor(seconds / 60);
      const sec = seconds % 60;
      return `${min}:${sec < 10 ? '0' + sec : sec}`;
  };

  // Circular Progress Calculation
  const radius = 120;
  const circumference = 2 * Math.PI * radius;
  const progress = timeLeft / modes[mode];
  const dashOffset = circumference - (progress * circumference);

  return (
    <div className="glass-card rounded-3xl p-8 flex flex-col items-center justify-center relative overflow-hidden h-[400px]">
       {/* Mode Selectors */}
       <div className="flex gap-2 mb-8 z-10">
           {Object.keys(modes).map((m) => (
               <button
                 key={m}
                 onClick={() => switchMode(m as any)}
                 className={`px-4 py-1.5 rounded-full text-xs font-semibold uppercase tracking-wider transition-all ${mode === m ? 'bg-cyan-500 text-white shadow-lg shadow-cyan-500/25' : 'bg-white/5 text-gray-400 hover:text-white'}`}
               >
                 {m}
               </button>
           ))}
       </div>

       {/* Circular Timer */}
       <div className="relative mb-8">
           {/* Background Circle */}
           <svg width="300" height="300" className="-rotate-90 transform">
               <circle
                 cx="150" cy="150" r={radius}
                 stroke="currentColor" strokeWidth="8"
                 fill="transparent"
                 className="text-slate-800"
               />
               {/* Progress Circle */}
               <motion.circle
                 initial={{ strokeDashoffset: 0 }}
                 animate={{ strokeDashoffset: dashOffset }}
                 transition={{ duration: 1, ease: "linear" }}
                 cx="150" cy="150" r={radius}
                 stroke="currentColor" strokeWidth="8"
                 fill="transparent"
                 strokeDasharray={circumference}
                 strokeLinecap="round"
                 className="text-cyan-500 drop-shadow-[0_0_10px_rgba(6,182,212,0.5)]"
               />
           </svg>
           
           {/* Digital Time Display */}
           <div className="absolute inset-0 flex flex-col items-center justify-center">
               <span className="text-7xl font-thin tracking-tighter text-white tabular-nums">
                   {formatTime(timeLeft)}
               </span>
               <span className="text-sm text-cyan-400 font-medium uppercase tracking-widest mt-2">
                   {isActive ? 'Flowing' : 'Paused'}
               </span>
           </div>
       </div>

       {/* Controls */}
       <div className="flex items-center gap-6 z-10">
           <button onClick={() => setSoundEnabled(!soundEnabled)} className="text-slate-500 hover:text-cyan-400 transition-colors">
               {soundEnabled ? <Volume2 size={20} /> : <VolumeX size={20} />}
           </button>
           
           <button 
             onClick={() => setIsActive(!isActive)}
             className="w-16 h-16 rounded-full bg-white text-slate-900 flex items-center justify-center hover:scale-110 transition-transform shadow-xl shadow-white/10"
           >
               {isActive ? <Pause size={28} fill="currentColor" /> : <Play size={28} fill="currentColor" className="ml-1" />}
           </button>

           <button onClick={() => { setIsActive(false); setTimeLeft(modes[mode]); }} className="text-slate-500 hover:text-cyan-400 transition-colors">
               <RotateCcw size={20} />
           </button>
       </div>
    </div>
  );
}
