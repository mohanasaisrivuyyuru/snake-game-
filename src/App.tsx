/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { MusicPlayer } from './components/MusicPlayer';
import { SnakeGame } from './components/SnakeGame';

export default function App() {
  return (
    <div className="flex h-screen w-full bg-black relative flex-col uppercase overflow-hidden text-xl selection:bg-[#FF00FF] selection:text-[#00FFFF]">
      {/* Background Static Noise Overlay */}
      <div className="static-noise" />
      
      {/* Header Panel */}
      <header className="border-b-4 border-[#00FFFF] p-4 flex justify-between items-end bg-[#111] screen-tear relative z-10 shrink-0">
        <h1 className="text-3xl md:text-5xl font-pixel glitch text-[#FFF]" data-text="CYBER_SNAKE">CYBER_SNAKE</h1>
        <div className="flex flex-col text-right font-mono tracking-widest leading-none">
          <span className="text-[#FF00FF] font-bold text-lg">SYS.STATUS: COMPROMISED</span>
          <span className="text-[#00FFFF] animate-pulse">AWAITING_INPUT...</span>
        </div>
      </header>

      {/* Main Execution Area */}
      <main className="flex-1 flex w-full relative z-10 p-6 pt-8 gap-6 overflow-hidden">
        {/* Memory Data Feed */}
        <aside className="w-64 border-4 border-[#FF00FF] bg-black p-4 flex flex-col gap-4 shrink-0 screen-tear">
          <h2 className="text-[#00FFFF] font-pixel text-xs border-b-2 border-[#00FFFF] pb-2 mb-4">DATA_STREAM</h2>
          <div className="flex flex-col gap-4 font-mono">
            <div className="bg-[#111] p-3 border-l-8 border-[#00FFFF] hover:bg-[#00FFFF] hover:text-black transition-none cursor-crosshair">
              <p className="font-bold tracking-widest text-2xl">MEM_BLK_01</p>
              <p className="text-sm mt-1">ERR: SECTOR_CORRUPTED</p>
            </div>
            <div className="bg-[#111] p-3 border-l-8 border-[#FF00FF] hover:bg-[#FF00FF] hover:text-black transition-none cursor-crosshair">
              <p className="font-bold tracking-widest text-2xl">OVR_KEY_X9</p>
              <p className="text-sm mt-1">ACTIVE</p>
            </div>
            <div className="bg-[#111] p-3 border-l-8 border-[#00FFFF] hover:bg-[#00FFFF] hover:text-black transition-none cursor-crosshair">
              <p className="font-bold tracking-widest text-2xl">NODE_LINK</p>
              <p className="text-sm mt-1 animate-pulse">ESTABLISHING...</p>
            </div>
          </div>
        </aside>

        {/* Core Process Area */}
        <div className="flex-1 border-4 border-[#00FFFF] bg-[#050505] relative flex p-6 justify-center items-center shadow-[0_0_30px_rgba(0,255,255,0.15)]">
          <SnakeGame />
        </div>
      </main>

      {/* Embedded Audio Matrix */}
      <div className="w-full shrink-0 border-t-4 border-[#FF00FF] bg-[#0a0a0a] z-10">
        <MusicPlayer />
      </div>
    </div>
  );
}
