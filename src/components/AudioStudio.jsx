import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  CloudRain, 
  Wind, 
  Music, 
  Upload, 
  Volume2, 
  VolumeX, 
  Play, 
  Pause, 
  Youtube,
  CloudLightning,
  Home
} from 'lucide-react';

const soundModes = {
  rain: {
    id: 'rain',
    label: 'Rain',
    icon: CloudRain,
    presets: [
      { name: 'Light Drizzle', url: 'https://assets.mixkit.co/active_storage/sfx/2393/2393-preview.mp3', icon: CloudRain },
      { name: 'Heavy Storm', url: 'https://assets.mixkit.co/active_storage/sfx/2405/2405-preview.mp3', icon: CloudLightning }, // Placeholder storm
      { name: 'Roof Rain', url: 'https://assets.mixkit.co/active_storage/sfx/2869/2869-preview.mp3', icon: Home }, // Placeholder roof
    ]
  },
  lofi: {
    id: 'lofi',
    label: 'Lo-Fi',
    icon: Music,
    presets: [
      { name: 'Chill Beats', videoId: 'jfKfPfyJRdk' },
      { name: 'Study Focus', videoId: '5qap5aO4i9A' },
      { name: 'Synthwave', videoId: '4xDxr3kT0_Y' },
    ]
  },
  noise: {
    id: 'noise',
    label: 'Noise',
    icon: Wind,
    presets: [
      { name: 'White Noise', url: 'https://assets.mixkit.co/active_storage/sfx/1279/1279-preview.mp3', icon: Wind },
      { name: 'Pink Noise', url: 'https://assets.mixkit.co/active_storage/sfx/2568/2568-preview.mp3', icon: Wind }, // Placeholder
      { name: 'Brown Noise', url: 'https://assets.mixkit.co/active_storage/sfx/2573/2573-preview.mp3', icon: Wind }, // Placeholder
    ]
  },
  local: {
    id: 'local',
    label: 'Upload',
    icon: Upload,
    presets: []
  }
};

const AudioStudio = () => {
  const [activeMode, setActiveMode] = useState('rain'); // rain | lofi | noise | local
  const [activePreset, setActivePreset] = useState(soundModes.rain.presets[0]);
  const [isPlaying, setIsPlaying] = useState(false);
  const [volume, setVolume] = useState(0.5);
  const [localFile, setLocalFile] = useState(null);
  const [youtubeLink, setYoutubeLink] = useState('');
  
  // Refs
  const audioRef = useRef(new Audio());
  const fileInputRef = useRef(null);

  // Audio Logic
  useEffect(() => {
    const audio = audioRef.current;
    audio.loop = true;
    audio.volume = volume;

    if (activeMode !== 'lofi' && activePreset?.url) {
      if (audio.src !== activePreset.url) {
        audio.src = activePreset.url;
        audio.load();
        if (isPlaying) audio.play().catch(() => setIsPlaying(false));
      } else {
        if (isPlaying) audio.play();
        else audio.pause();
      }
    } else {
      audio.pause();
    }

    return () => audio.pause();
  }, [activeMode, activePreset, isPlaying, volume]);

  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const url = URL.createObjectURL(file);
      const newPreset = { name: file.name, url: url, icon: Music };
      setLocalFile(newPreset);
      setActivePreset(newPreset);
      setIsPlaying(true);
    }
  };

  const handleYoutubeInput = (e) => {
    e.preventDefault();
    // Simple regex to extract video ID
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
    const match = youtubeLink.match(regExp);
    if (match && match[2].length === 11) {
      const videoId = match[2];
      const newPreset = { name: 'Custom URL', videoId: videoId };
      setActivePreset(newPreset);
      setIsPlaying(true);
      setYoutubeLink('');
    }
  };

  // Render Visualizer Bars
  const Visualizer = () => (
    <div className="flex gap-1 items-end h-8">
      {[...Array(6)].map((_, i) => (
        <motion.div
          key={i}
          className="w-1.5 bg-cyan-400 rounded-full"
          animate={{
            height: isPlaying ? ['20%', '80%', '40%'] : '20%',
          }}
          transition={{
            duration: 0.5 + Math.random() * 0.5,
            repeat: Infinity,
            repeatType: "reverse",
            ease: "easeInOut",
            delay: i * 0.1
          }}
        />
      ))}
    </div>
  );

  return (
    <div className="glass-card p-6 rounded-3xl w-full h-[380px] flex flex-col relative overflow-hidden">
      {/* Background Gradient */}
      <div className="absolute top-0 right-0 w-32 h-32 bg-cyan-500/10 rounded-full blur-3xl -z-10"></div>
      
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-xl font-light text-white tracking-wide flex items-center gap-2">
          <Music size={20} className="text-cyan-400" /> Audio Engine
        </h3>
        <div className="flex items-center gap-2 bg-black/20 px-3 py-1.5 rounded-full">
          <button onClick={() => setIsPlaying(!isPlaying)} className={`transition ${isPlaying ? 'text-cyan-400' : 'text-gray-400'}`}>
             {isPlaying ? <Pause size={16} /> : <Play size={16} />}
          </button>
          <input
            type="range"
            min="0"
            max="1"
            step="0.01"
            value={volume}
            onChange={(e) => setVolume(parseFloat(e.target.value))}
            className="w-16 h-1 bg-gray-600 rounded-lg appearance-none cursor-pointer accent-cyan-400"
          />
        </div>
      </div>

      {/* Mode Tabs */}
      <div className="flex gap-2 mb-6">
        {Object.values(soundModes).map((mode) => (
          <button
            key={mode.id}
            onClick={() => { setActiveMode(mode.id); setIsPlaying(true); if(mode.id !== 'local') setActivePreset(mode.presets[0]); }}
            className={`flex-1 py-2 rounded-xl flex items-center justify-center gap-2 text-sm transition-all duration-300 ${
              activeMode === mode.id
                ? 'bg-gradient-to-br from-cyan-500/20 to-blue-500/20 border border-cyan-500/30 text-cyan-50' 
                : 'hover:bg-white/5 text-gray-400'
            }`}
          >
            <mode.icon size={16} />
          </button>
        ))}
      </div>

      {/* Main Control Area */}
      <div className="flex-1 overflow-y-auto custom-scrollbar relative">
        <AnimatePresence mode="wait">
          <motion.div
            key={activeMode}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="space-y-3"
          >
            {activeMode === 'local' ? (
              <div className="flex flex-col items-center justify-center h-full gap-4 mt-4">
                <input
                  type="file"
                  accept="audio/*"
                  ref={fileInputRef}
                  className="hidden"
                  onChange={handleFileUpload}
                />
                <button
                  onClick={() => fileInputRef.current.click()}
                  className="w-full py-8 border-2 border-dashed border-white/20 rounded-2xl flex flex-col items-center gap-2 text-gray-400 hover:text-white hover:border-cyan-400/50 hover:bg-white/5 transition-all"
                >
                  <Upload size={32} />
                  <span className="text-sm">Click to Upload MP3</span>
                </button>
                {localFile && (
                  <div className="w-full p-4 bg-white/5 rounded-xl flex items-center justify-between border border-cyan-500/20">
                    <span className="truncate flex-1 text-sm text-cyan-100">{localFile.name}</span>
                    <Visualizer />
                  </div>
                )}
              </div>
            ) : activeMode === 'lofi' ? (
              <div className="space-y-4">
                {/* YouTube Embed (Hidden mainly, needs interaction) */}
                {activePreset?.videoId && isPlaying && (
                  <div className="relative w-full aspect-video rounded-xl overflow-hidden shadow-lg border border-white/10 group">
                     {/* Overlay to prevent interaction if needed, or allow it */}
                    <div className="absolute inset-0 bg-transparent group-hover:bg-black/10 transition-colors pointer-events-none" />
                    <iframe 
                      width="100%" 
                      height="100%" 
                      src={`https://www.youtube.com/embed/${activePreset.videoId}?autoplay=1&controls=0&loop=1&playlist=${activePreset.videoId}`} 
                      title="LoFi Player" 
                      frameBorder="0" 
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
                      allowFullScreen
                      className="pointer-events-auto"
                    ></iframe>
                  </div>
                )}

                <div className="grid grid-cols-3 gap-2">
                  {soundModes.lofi.presets.map((preset) => (
                    <button
                      key={preset.name}
                      onClick={() => { setActivePreset(preset); setIsPlaying(true); }}
                      className={`p-3 rounded-xl text-xs text-center border transition-all ${
                        activePreset?.name === preset.name
                          ? 'bg-cyan-500/20 border-cyan-500/50 text-white' 
                          : 'bg-white/5 border-transparent text-gray-400 hover:bg-white/10'
                      }`}
                    >
                      {preset.name}
                    </button>
                  ))}
                </div>

                <form onSubmit={handleYoutubeInput} className="relative">
                  <input
                    type="text"
                    value={youtubeLink}
                    onChange={(e) => setYoutubeLink(e.target.value)}
                    placeholder="Paste YouTube Link..."
                    className="w-full bg-black/20 border border-white/10 rounded-xl px-4 py-2.5 pl-10 text-sm focus:outline-none focus:border-cyan-500/50"
                  />
                  <Youtube size={16} className="absolute left-3 top-3 text-gray-500 text-red-500" />
                </form>
              </div>
            ) : (
              // Standard Audio Lists (Rain / Noise)
              <div className="grid grid-cols-1 gap-2">
                {soundModes[activeMode].presets.map((preset) => {
                  const Icon = preset.icon;
                  const isActive = activePreset?.name === preset.name && isPlaying;
                  return (
                    <button
                      key={preset.name}
                      onClick={() => { setActivePreset(preset); setIsPlaying(true); }}
                      className={`flex items-center justify-between p-4 rounded-xl transition-all border ${
                        isActive
                          ? 'bg-gradient-to-r from-cyan-900/40 to-blue-900/40 border-cyan-500/30' 
                          : 'bg-white/5 border-transparent hover:bg-white/10'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <div className={`p-2 rounded-lg ${isActive ? 'bg-cyan-500 text-white' : 'bg-white/10 text-gray-400'}`}>
                          <Icon size={18} />
                        </div>
                        <span className={`text-sm ${isActive ? 'text-white' : 'text-gray-400'}`}>
                          {preset.name}
                        </span>
                      </div>
                      {isActive && <Visualizer />}
                    </button>
                  );
                })}
              </div>
            )}
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
};

export default AudioStudio;
