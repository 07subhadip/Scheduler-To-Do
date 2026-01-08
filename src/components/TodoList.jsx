import React, { useState, useEffect } from 'react';
import { motion, Reorder, AnimatePresence } from 'framer-motion';
import { Plus, Trash2, Check, X, GripVertical } from 'lucide-react';

const TodoList = () => {
  const [tasks, setTasks] = useState(() => {
    const saved = localStorage.getItem('zen_tasks');
    return saved ? JSON.parse(saved) : [
      { id: '1', text: 'Welcome to Zen Mode', completed: false },
      { id: '2', text: 'Focus on your breath', completed: true },
    ];
  });
  const [newTask, setNewTask] = useState('');

  useEffect(() => {
    localStorage.setItem('zen_tasks', JSON.stringify(tasks));
  }, [tasks]);

  const addTask = (e) => {
    e.preventDefault();
    if (!newTask.trim()) return;
    const task = {
      id: Date.now().toString(),
      text: newTask,
      completed: false,
    };
    setTasks([task, ...tasks]);
    setNewTask('');
  };

  const toggleTask = (id) => {
    setTasks(tasks.map(t => 
      t.id === id ? { ...t, completed: !t.completed } : t
    ));
  };

  const deleteTask = (id) => {
    setTasks(tasks.filter(t => t.id !== id));
  };

  return (
    <div className="glass-card p-6 rounded-3xl w-full max-w-md h-full min-h-[400px] flex flex-col relative overflow-hidden">
      <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-cyan-500/50 to-transparent opacity-50"></div>
      
      <h2 className="text-2xl font-light mb-6 text-cyan-50 tracking-wide flex items-center gap-2">
        <span className="w-2 h-2 rounded-full bg-cyan-400 shadow-[0_0_10px_cyan]"></span>
        Tasks
      </h2>

      <form onSubmit={addTask} className="relative mb-6 group">
        <input
          type="text"
          value={newTask}
          onChange={(e) => setNewTask(e.target.value)}
          placeholder="Add a new task..."
          className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 pr-12 text-white placeholder-gray-500 focus:outline-none focus:bg-white/10 focus:border-cyan-500/50 transition-all font-light"
        />
        <button
          type="submit"
          disabled={!newTask.trim()}
          className="absolute right-2 top-1/2 -translate-y-1/2 p-2 bg-gradient-to-br from-cyan-500 to-blue-600 rounded-lg text-white opacity-0 group-focus-within:opacity-100 disabled:opacity-0 transition-all hover:scale-105"
        >
          <Plus size={16} />
        </button>
      </form>

      <div className="flex-1 overflow-y-auto pr-2 custom-scrollbar space-y-3">
        {tasks.length === 0 && (
          <div className="text-center text-gray-500 mt-10 font-light italic">
            No tasks yet. Enjoy the silence.
          </div>
        )}
        
        <Reorder.Group axis="y" values={tasks} onReorder={setTasks} className="space-y-3">
          <AnimatePresence initial={false}>
            {tasks.map((task) => (
              <Reorder.Item
                key={task.id}
                value={task}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, height: 0, marginBottom: 0 }}
                className={`group flex items-center gap-3 p-3 rounded-xl border border-white/5 hover:border-white/10 hover:bg-white/5 transition-all ${task.completed ? 'bg-white/[0.02]' : 'bg-white/[0.05]'}`}
              >
                <div className="cursor-grab text-gray-600 hover:text-gray-400 active:cursor-grabbing">
                  <GripVertical size={16} />
                </div>
                
                <button
                  onClick={() => toggleTask(task.id)}
                  className={`w-5 h-5 rounded-full border flex items-center justify-center transition-all duration-300 ${
                    task.completed
                      ? 'bg-cyan-500 border-cyan-500 shadow-[0_0_10px_rgba(6,182,212,0.5)]'
                      : 'border-gray-500 hover:border-cyan-400'
                  }`}
                >
                  {task.completed && <Check size={12} className="text-white" />}
                </button>

                <span
                  className={`flex-1 text-sm font-light transition-all duration-300 ${
                    task.completed ? 'text-gray-500 line-through' : 'text-gray-200'
                  }`}
                >
                  {task.text}
                </span>

                <button
                  onClick={() => deleteTask(task.id)}
                  className="opacity-0 group-hover:opacity-100 p-2 text-gray-500 hover:text-rose-400 hover:bg-rose-400/10 rounded-lg transition-all"
                >
                  <Trash2 size={16} />
                </button>
              </Reorder.Item>
            ))}
          </AnimatePresence>
        </Reorder.Group>
      </div>
    </div>
  );
};

export default TodoList;
