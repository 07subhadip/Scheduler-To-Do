import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  Sparkles, 
  Menu, 
  X, 
  Github, 
  Twitter 
} from 'lucide-react';
import Navbar from './Navbar';

const Layout = ({ children }) => {
  return (
    <div className="min-h-screen bg-[#0f172a] text-white font-sans selection:bg-cyan-500/30 overflow-x-hidden">
      
      {/* Dynamic Background Effects */}
      <div className="fixed inset-0 z-0 pointer-events-none">
         <div className="absolute top-[-20%] left-[-10%] w-[50%] h-[50%] rounded-full bg-indigo-500/10 blur-[150px] animate-pulse"></div>
         <div className="absolute bottom-[-20%] right-[-10%] w-[50%] h-[50%] rounded-full bg-cyan-500/10 blur-[150px] animate-pulse delay-700"></div>
         <div className="absolute top-[30%] left-[40%] w-[30%] h-[30%] rounded-full bg-rose-500/5 blur-[120px] animate-pulse delay-1000"></div>
      </div>

      <Navbar />

      <main className="relative z-10 pt-24 pb-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto min-h-[calc(100vh-80px)]">
         {children}
      </main>

      <footer className="relative z-10 border-t border-white/5 py-8 mt-auto">
        <div className="max-w-7xl mx-auto px-4 flex flex-col md:flex-row items-center justify-between text-sm text-gray-500">
          <p>© 2026 ZenFlow OS. Designed for Focus.</p>
          <div className="flex items-center gap-4 mt-4 md:mt-0 opacity-50 hover:opacity-100 transition-opacity">
            <Github size={18} className="cursor-pointer hover:text-white" />
            <Twitter size={18} className="cursor-pointer hover:text-white" />
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Layout;
