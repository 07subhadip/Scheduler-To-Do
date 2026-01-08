"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X, LayoutDashboard, BarChart2, Book, Settings, LogOut, User } from "lucide-react";

export default function Sidebar() {
  const [isOpen, setIsOpen] = useState(false);

  const menuItems = [
    { icon: LayoutDashboard, label: "Dashboard", active: true },
    { icon: BarChart2, label: "Analytics", active: false },
    { icon: Book, label: "My Journal", active: false },
    { icon: Settings, label: "Settings", active: false },
  ];

  return (
    <>
      <button 
        onClick={() => setIsOpen(true)}
        className="fixed top-4 left-4 z-50 p-2 bg-slate-900/50 backdrop-blur-md border border-white/10 rounded-lg text-white hover:bg-white/10 transition-colors"
      >
        <Menu size={24} />
      </button>

      <AnimatePresence>
        {isOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsOpen(false)}
              className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40"
            />
            
            {/* Sidebar */}
            <motion.aside
              initial={{ x: "-100%" }}
              animate={{ x: 0 }}
              exit={{ x: "-100%" }}
              transition={{ type: "spring", stiffness: 300, damping: 30 }}
              className="fixed left-0 top-0 h-full w-80 bg-slate-900/90 backdrop-blur-2xl border-r border-white/10 z-50 flex flex-col"
            >
              {/* Profile Header */}
              <div className="p-8 pb-4 relative overflow-hidden">
                <div className="absolute top-0 right-0 w-32 h-32 bg-cyan-500/20 blur-3xl rounded-full -translate-y-1/2 translate-x-1/2" />
                <div className="flex items-center gap-4 relative z-10">
                   <div className="w-14 h-14 rounded-full bg-gradient-to-br from-cyan-400 to-purple-600 p-[2px]">
                     <div className="w-full h-full rounded-full bg-slate-900 flex items-center justify-center">
                        <User size={24} className="text-white" />
                     </div>
                   </div>
                   <div>
                     <h3 className="text-white font-semibold text-lg">Zen Master</h3>
                     <span className="text-xs text-cyan-400 bg-cyan-500/10 px-2 py-0.5 rounded-full border border-cyan-500/20">Focus Level: Pro</span>
                   </div>
                </div>
              </div>

              {/* Navigation */}
              <nav className="flex-1 px-4 py-6 space-y-2">
                 {menuItems.map((item, idx) => (
                   <motion.button
                     key={item.label}
                     initial={{ opacity: 0, x: -20 }}
                     animate={{ opacity: 1, x: 0 }}
                     transition={{ delay: 0.1 * idx }}
                     className={`w-full flex items-center gap-4 px-4 py-3 rounded-xl transition-all group relative overflow-hidden ${item.active ? 'bg-white/5 text-white' : 'text-gray-400 hover:text-white'}`}
                   >
                      {item.active && (
                        <motion.div layoutId="activeNav" className="absolute left-0 top-0 w-1 h-full bg-cyan-500" />
                      )}
                      
                      {/* Hover Slide Effect */}
                      <div className="absolute inset-0 bg-white/5 translate-x-[-100%] group-hover:translate-x-0 transition-transform duration-300" />

                      <item.icon size={20} className="relative z-10" />
                      <span className="relative z-10 font-medium">{item.label}</span>
                   </motion.button>
                 ))}
              </nav>

              {/* Footer */}
              <div className="p-4 border-t border-white/10">
                 <button className="w-full flex items-center gap-3 px-4 py-3 text-gray-500 hover:text-red-400 hover:bg-red-500/10 rounded-xl transition-all group">
                    <LogOut size={20} className="group-hover:rotate-180 transition-transform" />
                    <span>Log Out</span>
                 </button>
                 <p className="text-center text-[10px] text-gray-700 mt-4">ZenFlow OS v2.0</p>
              </div>
            </motion.aside>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
