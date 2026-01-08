import React, { useState, useEffect } from 'react';
import { motion, Reorder, AnimatePresence } from 'framer-motion';
import { 
  Plus, 
  Trash2, 
  Check, 
  Clock, 
  Calendar, 
  Bell, 
  BellRing,
  MoreVertical 
} from 'lucide-react';

const SmartTodoList = () => {
  const [tasks, setTasks] = useState(() => {
    const saved = localStorage.getItem('zenflow_tasks');
    return saved ? JSON.parse(saved) : [];
  });
  
  const [showForm, setShowForm] = useState(false);
  const [editId, setEditId] = useState(null);
  
  // Form State
  const [taskText, setTaskText] = useState('');
  const [taskTime, setTaskTime] = useState('');
  const [taskDuration, setTaskDuration] = useState('25'); // minutes
  const [activeTab, setActiveTab] = useState('all'); // all | active | completed

  useEffect(() => {
    localStorage.setItem('zenflow_tasks', JSON.stringify(tasks));
  }, [tasks]);

  // Alarm Check Logic
  useEffect(() => {
    const checkAlarms = () => {
      const now = new Date();
      const currentTime = `${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}`;
      
      tasks.forEach(task => {
        if (!task.completed && task.isAlarmSet && task.scheduledTime === currentTime && !task.alarmTriggered) {
          triggerAlarm(task);
        }
      });
    };
    
    // Request permission on mount (may be blocked by browser)
    if (Notification.permission === "default") {
        Notification.requestPermission().catch(err => console.log(err));
    }

    const interval = setInterval(checkAlarms, 10000); // Check every 10 sec roughly
    return () => clearInterval(interval);
  }, [tasks]);

  const triggerAlarm = (task) => {
    // Browser Notification
    if (Notification.permission === "granted") {
      new Notification("Task Reminder", {
        body: `It's time for: ${task.text}`,
        icon: "/vite.svg" 
      });
    }
    
    // Audio Alert
    const audio = new Audio('https://assets.mixkit.co/active_storage/sfx/2869/2869-preview.mp3');
    audio.play().catch(e => console.log("Audio play failed", e));

    // Update task to prevent repeat alarm
    setTasks(prev => prev.map(t => t.id === task.id ? { ...t, alarmTriggered: true } : t));
  };

  const handleAddTask = (e) => {
    e.preventDefault();
    if (!taskText.trim()) return;

    // Ensure permission is granted when adding a task with time
    if (taskTime && Notification.permission !== "granted") {
        Notification.requestPermission();
    }

    const newTask = {
      id: Date.now().toString(),
      text: taskText,
      scheduledTime: taskTime, // "14:30"
      durationMinutes: taskDuration,
      completed: false,
      isAlarmSet: !!taskTime,
      alarmTriggered: false,
      createdAt: Date.now()
    };

    setTasks([newTask, ...tasks]);
    resetForm();
  };

  const resetForm = () => {
    setTaskText('');
    setTaskTime('');
    setTaskDuration('25');
    setShowForm(false);
  };

  const toggleTask = (id) => {
    setTasks(tasks.map(t => t.id === id ? { ...t, completed: !t.completed } : t));
  };

  const deleteTask = (id) => {
    setTasks(tasks.filter(t => t.id !== id));
  };

  const filteredTasks = tasks.filter(t => {
    if (activeTab === 'active') return !t.completed;
    if (activeTab === 'completed') return t.completed;
    return true;
  });

  return (
     <div className="glass-card flex flex-col h-full min-h-[500px] rounded-3xl overflow-hidden relative">
        <div className="p-6 border-b border-white/5 flex items-center justify-between">
            <h2 className="text-xl font-light text-white tracking-wide">Tasks</h2>
            
            <div className="flex gap-1 bg-black/20 p-1 rounded-lg">
                {['all', 'active', 'completed'].map(tab => (
                    <button
                        key={tab}
                        onClick={() => setActiveTab(tab)}
                        className={`px-3 py-1 rounded-md text-xs font-medium capitalize transition-all ${activeTab === tab ? 'bg-white/10 text-white shadow-sm' : 'text-gray-500 hover:text-gray-300'}`}
                    >
                        {tab}
                    </button>
                ))}
            </div>
        </div>

        <div className="flex-1 overflow-y-auto p-6 custom-scrollbar space-y-4">
            {/* Add Task Button (if form hidden) */}
            {!showForm && (
                <button 
                  onClick={() => setShowForm(true)}
                  className="w-full py-3 border border-dashed border-white/10 rounded-xl text-gray-500 hover:text-cyan-400 hover:border-cyan-500/30 hover:bg-cyan-500/5 transition-all flex items-center justify-center gap-2 group"
                >
                    <Plus size={18} className="group-hover:rotate-90 transition-transform" />
                    <span className="text-sm font-medium">Add New Task</span>
                </button>
            )}

            {/* Add Task Form */}
            <AnimatePresence>
                {showForm && (
                    <motion.form 
                       initial={{ opacity: 0, height: 0 }} 
                       animate={{ opacity: 1, height: 'auto' }}
                       exit={{ opacity: 0, height: 0 }}
                       onSubmit={handleAddTask}
                       className="bg-white/5 border border-white/10 rounded-2xl p-4 space-y-4 overflow-hidden"
                    >
                        <input
                           autoFocus
                           type="text"
                           placeholder="What needs to be done?"
                           value={taskText}
                           onChange={(e) => setTaskText(e.target.value)}
                           className="w-full bg-transparent border-b border-white/10 pb-2 text-white placeholder-gray-500 focus:outline-none focus:border-cyan-500 transition-colors"
                        />
                        
                        <div className="flex gap-4">
                            <div className="flex-1 space-y-1">
                                <label className="text-xs text-gray-500 flex items-center gap-1"><Clock size={10} /> Time</label>
                                <input
                                    type="time"
                                    value={taskTime}
                                    onChange={(e) => setTaskTime(e.target.value)}
                                    className="w-full bg-black/20 border border-white/10 rounded-lg px-2 py-1.5 text-sm text-gray-300 focus:outline-none focus:border-cyan-500/50"
                                />
                            </div>
                            <div className="flex-1 space-y-1">
                                <label className="text-xs text-gray-500 flex items-center gap-1"><Calendar size={10} /> Duration (m)</label>
                                <input
                                    type="number"
                                    value={taskDuration}
                                    onChange={(e) => setTaskDuration(e.target.value)}
                                    className="w-full bg-black/20 border border-white/10 rounded-lg px-2 py-1.5 text-sm text-gray-300 focus:outline-none focus:border-cyan-500/50"
                                />
                            </div>
                        </div>

                        <div className="flex justify-end gap-2 pt-2">
                             <button type="button" onClick={resetForm} className="px-3 py-1.5 text-xs text-gray-400 hover:text-white transition-colors">Cancel</button>
                             <button type="submit" className="px-4 py-1.5 bg-cyan-500 hover:bg-cyan-400 text-white rounded-lg text-xs font-medium shadow-lg shadow-cyan-500/20 transition-all">Add Task</button>
                        </div>
                    </motion.form>
                )}
            </AnimatePresence>

            {/* Task List */}
            <Reorder.Group axis="y" values={tasks} onReorder={setTasks} className="space-y-3">
                <AnimatePresence>
                     {filteredTasks.length === 0 && !showForm && (
                        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center py-10">
                            <p className="text-gray-600 text-sm">No tasks found. Time to relax?</p>
                        </motion.div>
                     )}
                     
                     {filteredTasks.map((task) => (
                         <Reorder.Item 
                             key={task.id} 
                             value={task}
                             initial={{ opacity: 0, y: 10 }}
                             animate={{ opacity: 1, y: 0 }}
                             exit={{ opacity: 0, x: -20 }}
                             className="group relative"
                         >
                             <div className={`p-4 rounded-xl border transition-all duration-300 ${
                                 task.completed 
                                   ? 'bg-black/10 border-transparent opacity-50' 
                                   : 'bg-white/[0.03] border-white/[0.05] hover:border-cyan-500/30 hover:bg-white/[0.05]'
                             }`}>
                                 <div className="flex items-start gap-4">
                                     <button 
                                        onClick={() => toggleTask(task.id)}
                                        className={`mt-1 w-5 h-5 rounded-md border flex items-center justify-center transition-all ${
                                            task.completed ? 'bg-cyan-500 border-cyan-500' : 'border-gray-600 group-hover:border-cyan-400'
                                        }`}
                                     >
                                         {task.completed && <Check size={14} className="text-white" />}
                                     </button>

                                     <div className="flex-1 min-w-0">
                                         <p className={`text-sm font-medium truncate transition-all ${task.completed ? 'text-gray-500 line-through' : 'text-gray-200'}`}>
                                             {task.text}
                                         </p>
                                         <div className="flex items-center gap-3 mt-1.5">
                                             {task.scheduledTime && (
                                                <span className={`flex items-center gap-1 text-[10px] px-1.5 py-0.5 rounded border ${
                                                    task.alarmTriggered ? 'bg-red-500/10 border-red-500/20 text-red-400' : 'bg-white/5 border-white/10 text-gray-400'
                                                }`}>
                                                    {task.isAlarmSet && <BellRing size={8} />}
                                                    {task.scheduledTime}
                                                </span>
                                             )}
                                             <span className="text-[10px] text-gray-600">{task.durationMinutes}m</span>
                                         </div>
                                     </div>

                                     <button onClick={() => deleteTask(task.id)} className="opacity-0 group-hover:opacity-100 text-gray-600 hover:text-rose-400 transition-opacity">
                                         <Trash2 size={16} />
                                     </button>
                                 </div>
                             </div>
                         </Reorder.Item>
                     ))}
                </AnimatePresence>
            </Reorder.Group>
        </div>
     </div>
  );
};

export default SmartTodoList;
