import React, { useState, useEffect, useRef } from 'react';
import { Play, Pause, SkipForward, SkipBack, Volume2, VolumeX, Music } from 'lucide-react';

const TRACKS = [
  {
    id: 1,
    title: "AI-Gen Track 01: Cybernetic Pulse",
    url: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3",
    duration: "6:12"
  },
  {
    id: 2,
    title: "AI-Gen Track 02: Neon Gridrider",
    url: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3",
    duration: "7:05"
  },
  {
    id: 3,
    title: "AI-Gen Track 03: Digital Ascendance",
    url: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-3.mp3",
    duration: "5:44"
  }
];

export function MusicPlayer() {
  const [currentTrackIndex, setCurrentTrackIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [volume, setVolume] = useState(0.5);
  const [isMuted, setIsMuted] = useState(false);
  const [progress, setProgress] = useState(0);
  
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const currentTrack = TRACKS[currentTrackIndex];

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = isMuted ? 0 : volume;
    }
  }, [volume, isMuted]);

  useEffect(() => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.play().catch(e => console.error("Playback failed", e));
      } else {
        audioRef.current.pause();
      }
    }
  }, [isPlaying, currentTrackIndex]);

  const handlePlayPause = () => {
    setIsPlaying(!isPlaying);
  };

  const handleNext = () => {
    setCurrentTrackIndex((prev) => (prev + 1) % TRACKS.length);
    setIsPlaying(true);
  };

  const handlePrev = () => {
    setCurrentTrackIndex((prev) => (prev - 1 + TRACKS.length) % TRACKS.length);
    setIsPlaying(true);
  };

  const handleTimeUpdate = () => {
    if (audioRef.current) {
      const progressPercent = (audioRef.current.currentTime / audioRef.current.duration) * 100;
      setProgress(progressPercent || 0);
    }
  };

  const handleTrackEnd = () => {
    handleNext();
  };

  const formatTime = (timeInSeconds: number) => {
    const mins = Math.floor(timeInSeconds / 60);
    const secs = Math.floor(timeInSeconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <footer className="h-28 flex items-center px-6 gap-8 w-full shrink-0 font-mono text-xl screen-tear">
      <audio
        ref={audioRef}
        src={currentTrack.url}
        onTimeUpdate={handleTimeUpdate}
        onEnded={handleTrackEnd}
      />
      
      {/* Track Info */}
      <div className="flex items-center gap-4 w-72 shrink-0 border-r-4 border-[#00FFFF] pr-6 h-full py-4">
        <div className={`w-14 h-14 bg-black border-4 border-[#FF00FF] flex items-center justify-center ${isPlaying ? 'animate-pulse' : ''}`}>
          <Music className="w-8 h-8 text-[#00FFFF]" />
        </div>
        <div className="flex-1 min-w-0 overflow-hidden flex flex-col justify-center">
          <marquee className="text-lg font-bold text-[#00FFFF] tracking-widest uppercase">{currentTrack.title}</marquee>
          <p className="text-xs text-[#FF00FF] uppercase tracking-widest mt-1">AUDIO_OUT // ACTV</p>
        </div>
      </div>

      {/* Controls Container */}
      <div className="flex items-center gap-4 border-r-4 border-[#FF00FF] pr-6 h-full py-4 shrink-0">
        <button onClick={handlePrev} className="px-3 py-2 bg-[#111] border-4 border-[#00FFFF] text-[#00FFFF] hover:bg-[#00FFFF] hover:text-black font-bold">
          &lt;&lt;
        </button>
        
        <button 
          onClick={handlePlayPause} 
          className="px-6 py-2 bg-[#222] border-4 border-[#FF00FF] text-[#FF00FF] hover:bg-[#FF00FF] hover:text-black font-pixel text-lg"
        >
          {isPlaying ? "||" : ">"}
        </button>
        
        <button onClick={handleNext} className="px-3 py-2 bg-[#111] border-4 border-[#00FFFF] text-[#00FFFF] hover:bg-[#00FFFF] hover:text-black font-bold">
          &gt;&gt;
        </button>
      </div>

      {/* Progress */}
      <div className="flex-1 flex flex-col justify-center gap-3">
        <div className="w-full h-4 bg-black border-2 border-[#00FFFF] relative">
          <div 
            className="absolute left-0 top-0 h-full bg-[#FF00FF]" 
            style={{ width: `${progress}%` }}
          />
        </div>
        <div className="flex justify-between text-sm text-[#00FFFF] font-bold">
          <span>{audioRef.current ? formatTime(audioRef.current.currentTime) : '0:00'}</span>
          <span>{currentTrack.duration}</span>
        </div>
      </div>

      {/* Volume */}
      <div className="w-48 flex flex-col justify-center gap-2 text-[#FF00FF] shrink-0 font-bold border-l-4 border-[#00FFFF] pl-6 h-full py-4">
        <div className="flex justify-between text-xs tracking-widest">
          <button onClick={() => setIsMuted(!isMuted)} className="hover:text-white uppercase outline-none">
            {isMuted || volume === 0 ? "VOL: MUTE" : "VOL: SET"}
          </button>
          <span>{Math.round(volume * 100)}%</span>
        </div>
        <input
          type="range"
          min="0"
          max="1"
          step="0.01"
          value={volume}
          onChange={(e) => setVolume(parseFloat(e.target.value))}
          className="w-full h-3 bg-black border-2 border-[#FF00FF] appearance-none cursor-crosshair rounded-none [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:bg-[#00FFFF] [&::-webkit-slider-thumb]:rounded-none text-white"
        />
      </div>
    </footer>
  );
}
