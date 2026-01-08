import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  X, 
  Home, 
  BarChart2, 
  Book, 
  Settings, 
  LogOut, 
  User, 
  Leaf 
} from 'lucide-react';

const Sidebar = ({ isOpen, onClose }) => {
  
  // Animation Variants
  const backdropVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1 },
    exit: { opacity: 0, transition: { duration: 0.3 } }
  };

  const sidebarVariants = {
    hidden: { x: '100%' },
    visible: { 
      x: 0, 
      transition: { 
        type: "spring", 
        stiffness: 300, 
        damping: 30 
      } 
    },
    exit: { 
      x: '100%', 
      transition: { 
        type: "spring", 
        stiffness: 300, 
        damping: 30 
      } 
    }
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        delayChildren: 0.2,
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { x: 20, opacity: 0 },
    visible: { x: 0, opacity: 1 }
  };

  const menuItems = [
    { label: 'Dashboard', icon: Home, active: true },
    { label: 'Analytics', icon: BarChart2, active: false },
    { label: 'My Journal', icon: Book, active: false },
    { label: 'Settings', icon: Settings, active: false },
  ];

  return (
    <AnimatePresence mode="wait">
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            variants={backdropVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            onClick={onClose}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40"
          />

          {/* Sidebar */}
          <motion.div
            variants={sidebarVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            className="fixed top-0 right-0 h-full w-80 bg-skin-main/95 backdrop-blur-2xl border-l border-skin-border z-50 flex flex-col shadow-2xl"
          >
            {/* Close Button */}
            <button 
              onClick={onClose} 
              className="absolute top-4 right-4 p-2 text-skin-muted hover:text-skin-text hover:bg-skin-text/10 rounded-full transition-all z-10"
            >
              <X size={24} />
            </button>

            {/* Header: User Profile */}
            <motion.div 
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="p-8 pb-6 border-b border-skin-border relative overflow-hidden"
            >
              <div className="absolute top-0 right-0 -mt-4 -mr-4 w-24 h-24 bg-skin-accent/10 rounded-full blur-2xl"></div>
              
              <div className="flex flex-col items-center text-center">
                <div className="w-20 h-20 rounded-full p-1 bg-gradient-to-tr from-skin-accent to-purple-500 mb-4 shadow-lg shadow-skin-accent/20">
                  <div className="w-full h-full rounded-full bg-skin-main flex items-center justify-center overflow-hidden">
                    <User size={40} className="text-skin-text" />
                  </div>
                </div>
                <h3 className="text-xl font-light text-skin-text tracking-wide">Zen User</h3>
                <div className="mt-2 flex items-center gap-1 px-3 py-1 rounded-full bg-skin-card border border-skin-border">
                  <Leaf size={12} className="text-green-400" />
                  <span className="text-xs font-medium text-skin-muted">Focus Level: Novice</span>
                </div>
              </div>
            </motion.div>

            {/* Navigation Staggered List */}
            <motion.div 
              variants={containerVariants}
              initial="hidden"
              animate="visible"
              className="flex-1 py-8 px-6 space-y-2"
            >
              {menuItems.map((item) => (
                <motion.button 
                  key={item.label}
                  variants={itemVariants}
                  whileHover={{ scale: 1.02, x: 5 }}
                  whileTap={{ scale: 0.98 }}
                  className={`w-full flex items-center gap-4 px-4 py-3.5 rounded-xl transition-all relative overflow-hidden group ${
                    item.active 
                      ? 'bg-skin-accent/10 text-skin-accent border border-skin-accent/20' 
                      : 'text-skin-muted hover:text-skin-text'
                  }`}
                >
                  {/* Hover visual */}
                  <div className="absolute inset-0 bg-skin-text/5 translate-x-[-100%] group-hover:translate-x-0 transition-transform duration-300 rounded-xl" />
                  
                  <item.icon size={20} className={`${item.active ? 'text-skin-accent' : 'group-hover:text-skin-accent'} transition-colors relative z-10`} />
                  <span className="font-light tracking-wide relative z-10">{item.label}</span>
                  
                  {item.active && (
                    <div className="absolute right-0 top-1/2 -translate-y-1/2 w-1 h-8 bg-skin-accent rounded-l-full shadow-[0_0_10px_rgba(6,182,212,0.5)]" />
                  )}
                </motion.button>
              ))}
            </motion.div>

            {/* Footer */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="p-6 border-t border-skin-border bg-skin-card/50 backdrop-blur-md"
            >
               <button 
                  onClick={() => alert('Logging out...')}
                  className="w-full flex items-center justify-center gap-2 py-3.5 border border-white/5 rounded-xl text-skin-muted hover:text-rose-400 hover:border-rose-500/30 hover:bg-rose-500/10 transition-all duration-300 group"
               >
                  <LogOut size={18} className="group-hover:rotate-6 transition-transform" />
                  <span className="text-sm font-medium">Log Out</span>
               </button>
               <p className="text-center text-[10px] text-skin-muted/40 mt-4 tracking-widest uppercase">
                 v2.0.1 • ZenFlow OS
               </p>
            </motion.div>

          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default Sidebar;
