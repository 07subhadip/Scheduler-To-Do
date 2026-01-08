"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence, Reorder } from "framer-motion";
import { Plus, Trash2, Check, Clock, Calendar, BellRing, AlertTriangle } from "lucide-react";

export interface Task {
  id: string;
  text: string;
  completed: boolean;
  totalDuration: number; // Seconds
  scheduledTime?: string;
  startTimeMs?: number;
  endTimeMs?: number;
  createdAt: number;
}

interface TaskManagerProps {
  tasks: Task[];
  setTasks: (tasks: Task[]) => void;
}

export default function TaskManager({ tasks, setTasks }: TaskManagerProps) {
  const [showForm, setShowForm] = useState(false);
  const [activeTab, setActiveTab] = useState<'all' | 'active' | 'completed'>('all');
  
  // -- Form State --
  const [taskText, setTaskText] = useState('');
  
  // Date State
  const today = new Date();
  const [dDay, setDDay] = useState(today.getDate().toString().padStart(2, '0'));
  const [dMonth, setDMonth] = useState((today.getMonth() + 1).toString().padStart(2, '0'));
  const [dYear, setDYear] = useState(today.getFullYear().toString());

  // Time State
  const [tHour, setTHour] = useState('');
  const [tMinute, setTMinute] = useState('');
  const [tPeriod, setTPeriod] = useState<'AM' | 'PM'>('AM');

  // Duration State
  const [dHours, setDHours] = useState('00');
  const [dMinutes, setDMinutes] = useState('00');
  const [dSeconds, setDSeconds] = useState('00');

  // Conflict State
  const [conflictTasks, setConflictTasks] = useState<Task[]>([]);

  // -- Handlers --

  const formatTwoDigit = (val: string) => {
      const num = parseInt(val) || 0;
      return num.toString().padStart(2, '0');
  };

  const calculateTiming = () => {
       if (!tHour || !tMinute) return null;

       const year = parseInt(dYear);
       const month = parseInt(dMonth) - 1; 
       const day = parseInt(dDay);

       let h = parseInt(tHour) || 0;
       const m = parseInt(tMinute) || 0;
       
       if (tPeriod === 'PM' && h < 12) h += 12;
       if (tPeriod === 'AM' && h === 12) h = 0;

       const startDate = new Date(year, month, day, h, m, 0);
       const startMs = startDate.getTime();

       const durH = parseInt(dHours) || 0;
       const durM = parseInt(dMinutes) || 0;
       const durS = parseInt(dSeconds) || 0;
       const totalDurationSeconds = (durH * 3600) + (durM * 60) + durS;
       
       if (totalDurationSeconds === 0) return null;

       const endMs = startMs + (totalDurationSeconds * 1000);
       
        // Format "HH:MM"
        const hh = h.toString().padStart(2, '0');
        const mm = m.toString().padStart(2, '0');
        const scheduledTimeStr = `${hh}:${mm}`;

       return { startMs, endMs, totalDurationSeconds, scheduledTimeStr };
  };

  // Conflict Detection
  useEffect(() => {
     const debounce = setTimeout(() => {
         const timing = calculateTiming();
         if (!timing) {
             setConflictTasks([]);
             return;
         }

         const { startMs, endMs } = timing;
         const conflicts = tasks.filter(t => {
             if (t.completed || !t.startTimeMs || !t.endTimeMs) return false;
             return (startMs < t.endTimeMs && endMs > t.startTimeMs);
         });
         setConflictTasks(conflicts);
     }, 500);
     return () => clearTimeout(debounce);
  }, [tHour, tMinute, tPeriod, dDay, dMonth, dYear, dHours, dMinutes, dSeconds, tasks]);


  const handleAddTask = (e?: React.FormEvent) => {
    e?.preventDefault();
    if (!taskText.trim()) return;
    if (conflictTasks.length > 0) return; // Wait for overwrite

    saveTask();
  };

  const handleOverwrite = () => {
      const conflictIds = conflictTasks.map(t => t.id);
      const remaining = tasks.filter(t => !conflictIds.includes(t.id));
      saveTask(remaining);
  };

  const saveTask = (existingTasks = tasks) => {
      const timing = calculateTiming();
      
      // Calculate duration even if timing (date/time) is missing (simple duration task)
      const durH = parseInt(dHours) || 0;
      const durM = parseInt(dMinutes) || 0;
      const durS = parseInt(dSeconds) || 0;
      const totalDur = (durH * 3600) + (durM * 60) + durS;

      if (totalDur === 0) {
          alert("Please set a duration");
          return;
      }

      const newTask: Task = {
          id: Date.now().toString(),
          text: taskText,
          completed: false,
          totalDuration: totalDur,
          createdAt: Date.now()
      };

      if (timing) {
          newTask.scheduledTime = timing.scheduledTimeStr;
          newTask.startTimeMs = timing.startMs;
          newTask.endTimeMs = timing.endMs;
      }

      setTasks([newTask, ...existingTasks]);
      resetForm();
  };

  const resetForm = () => {
      setTaskText('');
      setTHour('');
      setTMinute('');
      setTPeriod('AM');
      setDHours('00');
      setDMinutes('00');
      setDSeconds('00');
      setShowForm(false);
      setConflictTasks([]);
  };

  const toggleTask = (id: string) => {
      setTasks(tasks.map(t => t.id === id ? { ...t, completed: !t.completed } : t));
  };

  const deleteTask = (id: string) => {
      setTasks(tasks.filter(t => t.id !== id));
  };

  const filtered = tasks.filter(t => {
      if (activeTab === 'active') return !t.completed;
      if (activeTab === 'completed') return t.completed;
      return true;
  });

  return (
    <div className="glass-card flex flex-col h-[600px] rounded-3xl overflow-hidden relative">
       {/* Header */}
       <div className="p-6 border-b border-white/5 flex items-center justify-between">
          <h2 className="text-xl font-light text-white tracking-wide">Tasks</h2>
          <div className="flex gap-1 bg-black/20 p-1 rounded-lg">
             {['all', 'active', 'completed'].map((tab) => (
                 <button
                    key={tab}
                    onClick={() => setActiveTab(tab as any)}
                    className={`px-3 py-1 rounded-md text-xs font-medium capitalize transition-all ${activeTab === tab ? 'bg-white/10 text-white' : 'text-gray-500 hover:text-gray-300'}`}
                 >
                    {tab}
                 </button>
             ))}
          </div>
       </div>

       {/* Body */}
       <div className="flex-1 overflow-y-auto p-6 md:custom-scrollbar space-y-4">
           {!showForm && (
               <button 
                 onClick={() => setShowForm(true)}
                 className="w-full py-4 border border-dashed border-white/10 rounded-xl text-gray-500 hover:text-cyan-400 hover:border-cyan-500/30 hover:bg-cyan-500/5 transition-all flex items-center justify-center gap-2"
               >
                   <Plus size={18} />
                   <span className="text-sm font-medium">Add New Task</span>
               </button>
           )}

           <AnimatePresence>
               {showForm && (
                   <motion.form
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      className="glass-card bg-white/5 border border-white/10 rounded-2xl p-4 space-y-5 overflow-hidden"
                   >
                       <input 
                         autoFocus
                         placeholder="What needs to be done?"
                         className="w-full bg-transparent border-b border-white/10 pb-2 text-white placeholder-slate-500 focus:border-cyan-500 outline-none"
                         value={taskText}
                         onChange={e => setTaskText(e.target.value)}
                       />
                       
                       {/* Date / Time Grid */}
                       <div className="flex gap-4">
                           {/* Date */}
                           <div className="flex-1 space-y-2">
                               <label className="text-xs text-gray-400 flex items-center gap-1"><Calendar size={12} className="text-cyan-400"/> Date</label>
                               <div className="flex gap-1">
                                    <InputBlock val={dDay} set={setDDay} label="Day" max={31} />
                                    <InputBlock val={dMonth} set={setDMonth} label="Mon" max={12} />
                                    <InputBlock val={dYear} set={setDYear} label="Year" max={2100} width="flex-[1.5]" />
                               </div>
                           </div>
                       </div>
                       
                        <div className="flex gap-4">
                           {/* Time */}
                           <div className="flex-1 space-y-2">
                               <label className="text-xs text-gray-400 flex items-center gap-1"><Clock size={12} className="text-cyan-400"/> Time</label>
                               <div className="flex gap-1">
                                    <InputBlock val={tHour} set={setTHour} label="Hr" max={12} blur={() => setTHour(formatTwoDigit(tHour) || '12')} />
                                    <InputBlock val={tMinute} set={setTMinute} label="Min" max={59} blur={() => setTMinute(formatTwoDigit(tMinute))} />
                                    <div className="flex-1 flex flex-col">
                                        <span className="text-[10px] text-gray-500 text-center mb-1 uppercase">Per</span>
                                        <button type="button" onClick={() => setTPeriod(p => p === 'AM' ? 'PM' : 'AM')} className="h-full bg-black/30 rounded-lg text-cyan-400 font-bold text-sm border border-white/5 hover:bg-white/5">{tPeriod}</button>
                                    </div>
                               </div>
                           </div>
                           
                           {/* Duration */}
                           <div className="flex-1 space-y-2">
                               <label className="text-xs text-gray-400 flex items-center gap-1"><Clock size={12} className="text-cyan-400"/> Dur</label>
                               <div className="flex gap-1">
                                    <InputBlock val={dHours} set={setDHours} label="Hrs" max={23} blur={() => setDHours(formatTwoDigit(dHours))} />
                                    <InputBlock val={dMinutes} set={setDMinutes} label="Min" max={59} blur={() => setDMinutes(formatTwoDigit(dMinutes))} />
                                    <InputBlock val={dSeconds} set={setDSeconds} label="Sec" max={59} blur={() => setDSeconds(formatTwoDigit(dSeconds))} />
                               </div>
                           </div>
                       </div>

                       {/* Conflict Warning */}
                       {conflictTasks.length > 0 && (
                           <div className="bg-red-500/10 border border-red-500/20 p-3 rounded-lg flex gap-3 text-red-200">
                               <AlertTriangle size={16} className="shrink-0 text-red-400" />
                               <div className="text-xs">
                                   <p className="font-bold">Time slot occupied:</p>
                                   <ul className="list-disc pl-4 opacity-80">{conflictTasks.map(t => <li key={t.id} className="truncate w-24">{t.text}</li>)}</ul>
                               </div>
                           </div>
                       )}

                       {/* Actions */}
                       <div className="flex justify-end gap-2 pt-2">
                           <button onClick={resetForm} type="button" className="px-3 py-1.5 text-xs text-slate-400 hover:text-white">Cancel</button>
                           {conflictTasks.length > 0 ? (
                               <button onClick={handleOverwrite} type="button" className="px-4 py-1.5 bg-red-500 hover:bg-red-400 text-white rounded-lg text-xs font-semibold shadow-lg shadow-red-500/20">Overwrite</button>
                           ) : (
                               <button onClick={() => handleAddTask()} type="button" className="px-4 py-1.5 bg-cyan-500 hover:bg-cyan-400 text-white rounded-lg text-xs font-semibold shadow-lg shadow-cyan-500/20">Add Task</button>
                           )}
                       </div>
                   </motion.form>
               )}
           </AnimatePresence>

           {/* List */}
            <Reorder.Group axis="y" values={tasks} onReorder={setTasks} className="space-y-3">
                {filtered.map(task => (
                    <Reorder.Item key={task.id} value={task}>
                        <div className={`p-4 rounded-xl border transition-all group ${task.completed ? 'bg-black/10 border-transparent opacity-50' : 'bg-white/[0.03] border-white/5 hover:border-cyan-500/30'}`}>
                            <div className="flex items-center gap-4">
                                <button onClick={() => toggleTask(task.id)} className={`w-5 h-5 rounded border flex items-center justify-center transition-colors ${task.completed ? 'bg-cyan-500 border-cyan-500' : 'border-slate-600 hover:border-cyan-400'}`}>
                                    {task.completed && <Check size={14} className="text-white" />}
                                </button>
                                <div className="flex-1 min-w-0">
                                    <p className={`text-sm font-medium ${task.completed ? 'line-through text-slate-500' : 'text-slate-200'}`}>{task.text}</p>
                                    <div className="flex gap-2 mt-1">
                                        {task.scheduledTime && <span className="text-[10px] px-1.5 py-0.5 bg-white/5 rounded border border-white/5 text-cyan-400 flex items-center gap-1"><BellRing size={8}/> {task.scheduledTime}</span>}
                                        <span className="text-[10px] text-slate-500">{Math.floor(task.totalDuration / 60)}m</span>
                                    </div>
                                </div>
                                <button onClick={() => deleteTask(task.id)} className="opacity-0 group-hover:opacity-100 text-slate-500 hover:text-rose-400"><Trash2 size={16} /></button>
                            </div>
                        </div>
                    </Reorder.Item>
                ))}
            </Reorder.Group>
            
            {filtered.length === 0 && !showForm && (
                <div className="text-center py-10 text-slate-600 text-sm">No tasks found. Enjoy your day.</div>
            )}
       </div>
    </div>
  );
}

// Helper Component for Inputs
const InputBlock = ({ val, set, label, max, width = 'flex-1', blur }: any) => (
    <div className={`${width} flex flex-col`}>
        <span className="text-[10px] text-gray-500 text-center mb-1 uppercase">{label}</span>
        <input 
          type="number" 
          value={val}
          min={0} max={max}
          onChange={e => {
              let v = parseInt(e.target.value);
              if (v > max) v = max;
              if (v < 0) v = 0;
              set(v.toString());
          }}
          onBlur={blur}
          className="w-full bg-black/30 border border-white/5 rounded-lg py-2 text-center text-white focus:border-cyan-500/50 outline-none [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
        />
    </div>
);
