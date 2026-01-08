import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { Play, Pause, RotateCcw } from 'lucide-react';

const modes = {
  focus: { label: 'Focus', time: 25 * 60, color: 'text-rose-400', stroke: 'stroke-rose-400' },
  short: { label: 'Short Break', time: 5 * 60, color: 'text-teal-400', stroke: 'stroke-teal-400' },
  long: { label: 'Long Break', time: 15 * 60, color: 'text-indigo-400', stroke: 'stroke-indigo-400' },
};

const Timer = () => {
  const [mode, setMode] = useState('focus');
  const [timeLeft, setTimeLeft] = useState(modes.focus.time);
  const [isActive, setIsActive] = useState(false);
  const audioRef = useRef(new Audio('https://assets.mixkit.co/active_storage/sfx/2869/2869-preview.mp3')); // Gentle bell

  useEffect(() => {
    setTimeLeft(modes[mode].time);
    setIsActive(false);
  }, [mode]);

  useEffect(() => {
    let interval = null;
    if (isActive && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft((time) => time - 1);
      }, 1000);
    } else if (timeLeft === 0) {
      setIsActive(false);
      audioRef.current.play();
    }
    return () => clearInterval(interval);
  }, [isActive, timeLeft]);

  const toggleTimer = () => setIsActive(!isActive);
  const resetTimer = () => {
    setIsActive(false);
    setTimeLeft(modes[mode].time);
  };

  const formatTime = (seconds) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  const progress = ((modes[mode].time - timeLeft) / modes[mode].time) * 100;
  // SVG properties
  const radius = 120;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (progress / 100) * circumference;

  return (
    <div className="glass-card p-8 rounded-3xl flex flex-col items-center justify-center w-full max-w-md mx-auto relative overflow-hidden">
      <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-white/20 to-transparent"></div>
      
      {/* Mode Selector */}
      <div className="flex gap-2 mb-8 bg-black/20 p-1 rounded-xl">
        {Object.keys(modes).map((m) => (
          <button
            key={m}
            onClick={() => setMode(m)}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-300 ${
              mode === m ? 'bg-white/10 text-white shadow-lg' : 'text-gray-400 hover:text-white hover:bg-white/5'
            }`}
          >
            {modes[m].label}
          </button>
        ))}
      </div>

      {/* Timer Circle */}
      <div className="relative mb-8 group">
        <svg width="300" height="300" className="transform -rotate-90">
          <circle
            cx="150"
            cy="150"
            r={radius}
            stroke="currentColor"
            strokeWidth="8"
            fill="transparent"
            className="text-gray-800"
          />
          <motion.circle
            cx="150"
            cy="150"
            r={radius}
            stroke="currentColor"
            strokeWidth="8"
            fill="transparent"
            strokeDasharray={circumference}
            strokeLinecap="round"
            className={`${modes[mode].stroke} transition-all duration-1000 ease-linear`}
            initial={{ strokeDashoffset: circumference }}
            animate={{ strokeDashoffset }}
          />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className={`text-6xl font-light tracking-wider ${modes[mode].color} drop-shadow-lg font-mono`}>
            {formatTime(timeLeft)}
          </span>
          <span className="text-gray-400 text-sm mt-2 font-light tracking-widest uppercase">
            {isActive ? 'Focusing...' : 'Paused'}
          </span>
        </div>
      </div>

      {/* Controls */}
      <div className="flex gap-6">
        <button
          onClick={toggleTimer}
          className="p-4 rounded-full bg-white/10 hover:bg-white/20 text-white shadow-lg backdrop-blur-sm transition-all duration-300 hover:scale-110 active:scale-95 group border border-white/5"
        >
          {isActive ? <Pause size={32} fill="white" className="opacity-90" /> : <Play size={32} fill="white" className="pl-1 opacity-90" />}
        </button>
        <button
          onClick={resetTimer}
          className="p-4 rounded-full bg-white/5 hover:bg-white/10 text-gray-300 hover:text-white shadow-sm backdrop-blur-sm transition-all duration-300 hover:scale-110 active:scale-95 border border-white/5"
        >
          <RotateCcw size={24} />
        </button>
      </div>
    </div>
  );
};

export default Timer;
