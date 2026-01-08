import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import Layout from './components/Layout';
import AudioStudio from './components/AudioStudio';
import SmartTodoList from './components/SmartTodoList';
import Timer from './components/Timer';

function App() {
  const [greeting, setGreeting] = useState('');

  useEffect(() => {
    const updateGreeting = () => {
      const h = new Date().getHours();
      if (h >= 5 && h < 12) setGreeting("Good Morning");
      else if (h >= 12 && h < 17) setGreeting("Good Afternoon");
      else if (h >= 17 && h < 21) setGreeting("Good Evening");
      else setGreeting("Good Night");
    };
    updateGreeting();
    const timer = setInterval(updateGreeting, 60000);
    return () => clearInterval(timer);
  }, []);

  return (
    <Layout>
       <motion.div 
         initial={{ opacity: 0, y: 20 }}
         animate={{ opacity: 1, y: 0 }}
         transition={{ duration: 0.8 }}
         className="mb-12 flex flex-col items-center justify-center text-center"
       >
          <motion.h1 
            className="text-5xl md:text-7xl font-thin tracking-tight mb-4 cursor-default bg-clip-text text-transparent bg-gradient-to-r from-slate-400 via-white to-slate-400"
            style={{ backgroundSize: "200% auto" }}
            animate={{ backgroundPosition: "200% center" }}
            transition={{ 
              duration: 8, 
              repeat: Infinity, 
              ease: "linear" 
            }}
          >
            {greeting}
          </motion.h1>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5, duration: 1 }}
            className="flex items-center gap-3"
          >
             <div className="h-[1px] w-12 bg-gradient-to-r from-transparent to-skin-accent"></div>
             <p className="text-skin-muted font-light text-lg tracking-widest uppercase">
                Welcome to your digital sanctuary
             </p>
             <div className="h-[1px] w-12 bg-gradient-to-l from-transparent to-skin-accent"></div>
          </motion.div>
       </motion.div>

       <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* Left Column: Tasks (4 cols) */}
          <div className="lg:col-span-4 h-full">
             <SmartTodoList />
          </div>

          {/* Center Column: Focus Timer (4 cols) */}
          <div className="lg:col-span-4 flex flex-col gap-8">
             <Timer />
             {/* Quote Widget */}
             <div className="glass-card p-6 rounded-3xl text-center">
                <p className="font-light italic text-skin-text/80">"The only way to do great work is to love what you do."</p>
                <div className="flex justify-center mt-4 gap-1">
                   {[1,2,3].map((i) => <span key={i} className="w-1 h-1 rounded-full bg-skin-accent/50"></span>)}
                </div>
             </div>
          </div>

          {/* Right Column: Audio (4 cols) */}
          <div className="lg:col-span-4">
             <AudioStudio />
          </div>

       </div>
    </Layout>
  );
}

export default App;
