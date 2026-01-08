import React, { useState, useRef, useEffect } from 'react';
import { Volume2, VolumeX, CloudRain, Music, Wind, Play, Pause } from 'lucide-react';

const sounds = [
  { 
    id: 'rain', 
    label: 'Rain', 
    icon: CloudRain, 
    url: 'https://assets.mixkit.co/active_storage/sfx/2393/2393-preview.mp3' 
  },
  { 
    id: 'lofi', 
    label: 'Lo-Fi', 
    icon: Music, 
    // Using a sample ambient track
    url: 'https://assets.mixkit.co/active_storage/stock_music/122/122-preview.mp3' 
  },
  { 
    id: 'noise', 
    label: 'White Noise', 
    icon: Wind, 
    url: 'https://assets.mixkit.co/active_storage/sfx/1279/1279-preview.mp3' 
  }
];

const AudioPlayer = () => {
  const [activeSound, setActiveSound] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [volume, setVolume] = useState(0.5);
  const audioRef = useRef(new Audio());
  const audio = audioRef.current;

  useEffect(() => {
    audio.loop = true;
    return () => {
      audio.pause();
      audio.src = "";
    };
  }, []);

  useEffect(() => {
    if (activeSound) {
      if (audio.src !== activeSound.url) {
        audio.src = activeSound.url;
        audio.load();
      }
      if (isPlaying) {
        audio.play().catch(e => console.error("Audio playback error:", e));
      } else {
        audio.pause();
      }
    } else {
      audio.pause();
    }
  }, [activeSound, isPlaying]);

  useEffect(() => {
    audio.volume = volume;
  }, [volume]);

  const toggleSound = (sound) => {
    if (activeSound?.id === sound.id) {
      setIsPlaying(!isPlaying);
    } else {
      setActiveSound(sound);
      setIsPlaying(true);
    }
  };

  return (
    <div className="glass-card p-6 rounded-3xl w-full max-w-sm flex flex-col justify-between">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-light text-gray-200">Ambience</h3>
        <div className="flex items-center gap-2 text-gray-400">
          {volume === 0 ? <VolumeX size={16} /> : <Volume2 size={16} />}
          <input
            type="range"
            min="0"
            max="1"
            step="0.01"
            value={volume}
            onChange={(e) => setVolume(parseFloat(e.target.value))}
            className="w-20 accent-cyan-400 h-1 bg-white/10 rounded-lg appearance-none cursor-pointer"
          />
        </div>
      </div>

      <div className="space-y-3">
        {sounds.map((sound) => {
          const isActive = activeSound?.id === sound.id;
          const Icon = sound.icon;
          
          return (
            <button
              key={sound.id}
              onClick={() => toggleSound(sound)}
              className={`w-full flex items-center justify-between p-4 rounded-2xl transition-all duration-300 border ${
                isActive && isPlaying
                  ? 'bg-cyan-500/10 border-cyan-500/30 text-cyan-50 shadow-[0_0_15px_rgba(6,182,212,0.1)]' 
                  : 'bg-white/5 border-white/5 text-gray-400 hover:bg-white/10 hover:text-gray-200'
              }`}
            >
              <div className="flex items-center gap-4">
                <div className={`p-2 rounded-xl text-white transition-all ${isActive && isPlaying ? 'bg-cyan-500' : 'bg-white/10'}`}>
                  <Icon size={18} />
                </div>
                <span className="font-medium">{sound.label}</span>
              </div>
              
              {isActive && isPlaying ? (
                <div className="flex items-center gap-2">
                   <span className="flex gap-[2px] items-end h-3">
                      <span className="w-1 bg-cyan-400 rounded-full animate-[music-bar_1s_ease-in-out_infinite] h-2"></span>
                      <span className="w-1 bg-cyan-400 rounded-full animate-[music-bar_1.2s_ease-in-out_infinite_0.1s] h-3"></span>
                      <span className="w-1 bg-cyan-400 rounded-full animate-[music-bar_0.8s_ease-in-out_infinite_0.2s] h-1"></span>
                   </span>
                </div>
              ) : (
                <Play size={16} className="opacity-50" />
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default AudioPlayer;
