import React, { useEffect, useState, useRef } from 'react';
import { useShallow } from 'zustand/react/shallow';
import { useCircuitStore } from '../store';
import { X, Activity, Zap, Play, Pause, Settings2 } from 'lucide-react';
import { cn } from '../lib/utils';

interface DataPoint {
  time: number;
  voltage: number;
  current: number;
}

export function Oscilloscope() {
  const { 
    showOscilloscope, 
    setShowOscilloscope, 
    selectedId, 
    components, 
    simulationRunning,
    time 
  } = useCircuitStore(useShallow(state => ({
    showOscilloscope: state.showOscilloscope,
    setShowOscilloscope: state.setShowOscilloscope,
    selectedId: state.selectedId,
    components: state.components,
    simulationRunning: state.simulationRunning,
    time: state.time
  })));
  
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [data, setData] = useState<DataPoint[]>([]);
  const [paused, setPaused] = useState(false);
  const [timeBase, setTimeBase] = useState(5); // Seconds per screen
  const [vScale, setVScale] = useState(10); // Volts per full height (approx)
  const [iScale, setIScale] = useState(1); // Amps per full height (approx)
  const [showControls, setShowControls] = useState(false);

  const maxPoints = 1000; 
  const lastTimeRef = useRef(0);

  const selectedComponent = components.find(c => c.id === selectedId);

  // Data Collection
  useEffect(() => {
    if (!simulationRunning || !selectedComponent || paused) return;

    // Collect data at ~60fps or simulation step rate
    if (time - lastTimeRef.current > 0.016) { // ~60fps
      lastTimeRef.current = time;
      
      setData(prev => {
        const newData = [
          ...prev, 
          { 
            time: time, 
            voltage: selectedComponent.voltageDrop || 0,
            current: selectedComponent.current || 0
          }
        ];
        // Keep enough data for the current timebase plus some buffer
        // If timebase is 5s, and we sample at 60fps, that's 300 points. 
        // Let's keep a fixed buffer for simplicity but ensure it covers the window.
        if (newData.length > maxPoints) {
            return newData.slice(newData.length - maxPoints);
        }
        return newData;
      });
    }
  }, [time, simulationRunning, selectedComponent, paused]);

  // Reset data when selection changes
  useEffect(() => {
    setData([]);
    setPaused(false);
  }, [selectedId]);

  // Rendering
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const width = canvas.width;
    const height = canvas.height;

    // Clear
    ctx.fillStyle = '#0f172a'; // Dark background like real scope
    ctx.fillRect(0, 0, width, height);

    // Grid
    ctx.strokeStyle = '#334155';
    ctx.lineWidth = 1;
    ctx.beginPath();
    // Vertical lines (Time) - 10 divisions
    for (let i = 1; i < 10; i++) {
        const x = (i / 10) * width;
        ctx.moveTo(x, 0);
        ctx.lineTo(x, height);
    }
    // Horizontal lines (Voltage/Current) - 8 divisions
    for (let i = 1; i < 8; i++) {
        const y = (i / 8) * height;
        ctx.moveTo(0, y);
        ctx.lineTo(width, y);
    }
    ctx.stroke();

    // Center Line
    ctx.strokeStyle = '#475569';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(0, height / 2);
    ctx.lineTo(width, height / 2);
    ctx.stroke();

    if (data.length < 2) return;

    const endTime = data[data.length - 1].time;
    const startTime = endTime - timeBase;

    // Helper to map time to x
    const mapX = (t: number) => {
        return ((t - startTime) / timeBase) * width;
    };

    // Helper to map value to y (0 is center)
    // scale is total range (e.g. 10V means +/- 5V from center? Or 0 to 10V?)
    // Let's assume scale is the full height range. Center is 0.
    const mapY = (val: number, scale: number) => {
        const range = scale; // Total range displayed
        const normalized = val / (range / 2); // -1 to 1
        return (height / 2) - (normalized * (height / 2));
    };

    // Draw Voltage (Red)
    ctx.strokeStyle = '#ef4444';
    ctx.lineWidth = 2;
    ctx.beginPath();
    let started = false;
    for (const p of data) {
        if (p.time < startTime) continue;
        const x = mapX(p.time);
        const y = mapY(p.voltage, vScale);
        if (!started) {
            ctx.moveTo(x, y);
            started = true;
        } else {
            ctx.lineTo(x, y);
        }
    }
    ctx.stroke();

    // Draw Current (Blue)
    ctx.strokeStyle = '#3b82f6';
    ctx.lineWidth = 2;
    ctx.beginPath();
    started = false;
    for (const p of data) {
        if (p.time < startTime) continue;
        const x = mapX(p.time);
        const y = mapY(p.current, iScale);
        if (!started) {
            ctx.moveTo(x, y);
            started = true;
        } else {
            ctx.lineTo(x, y);
        }
    }
    ctx.stroke();

  }, [data, timeBase, vScale, iScale]);

  if (!showOscilloscope) return null;

  return (
    <div className="absolute bottom-4 right-4 left-4 md:left-auto w-auto md:w-[480px] h-80 bg-slate-900 rounded-xl shadow-2xl border border-slate-700 z-50 flex flex-col overflow-hidden ring-1 ring-slate-800">
      {/* Header */}
      <div className="bg-slate-800 px-3 py-2 border-b border-slate-700 flex items-center justify-between shrink-0">
        <div className="flex items-center gap-2">
          <Activity className="w-4 h-4 text-green-400" />
          <span className="font-bold text-slate-200 text-xs uppercase tracking-wider">Dao động ký</span>
        </div>
        <div className="flex items-center gap-1">
            <button 
                onClick={() => setPaused(!paused)}
                className={cn("p-1.5 rounded hover:bg-slate-700 transition-colors", paused ? "text-yellow-400" : "text-slate-400")}
                title={paused ? "Tiếp tục" : "Tạm dừng"}
            >
                {paused ? <Play size={14} /> : <Pause size={14} />}
            </button>
            <button 
                onClick={() => setShowControls(!showControls)}
                className={cn("p-1.5 rounded hover:bg-slate-700 transition-colors", showControls ? "text-blue-400" : "text-slate-400")}
                title="Cài đặt"
            >
                <Settings2 size={14} />
            </button>
            <button 
                onClick={() => setShowOscilloscope(false)}
                className="p-1.5 hover:bg-slate-700 rounded text-slate-400 transition-colors"
            >
                <X size={14} />
            </button>
        </div>
      </div>

      {/* Controls Overlay */}
      {showControls && (
          <div className="absolute top-10 right-0 z-10 bg-slate-800/95 backdrop-blur border-l border-b border-slate-700 p-3 rounded-bl-xl shadow-lg w-48 space-y-3">
              <div>
                  <label className="text-[10px] text-slate-400 uppercase font-bold block mb-1">Thời gian (s)</label>
                  <input 
                    type="range" min="0.1" max="10" step="0.1" 
                    value={timeBase} 
                    onChange={(e) => setTimeBase(parseFloat(e.target.value))}
                    className="w-full h-1 bg-slate-600 rounded-lg appearance-none cursor-pointer accent-green-500"
                  />
                  <div className="text-right text-xs text-green-400 font-mono">{timeBase.toFixed(1)}s</div>
              </div>
              <div>
                  <label className="text-[10px] text-slate-400 uppercase font-bold block mb-1">Thang đo điện áp (V)</label>
                  <input 
                    type="range" min="1" max="50" step="1" 
                    value={vScale} 
                    onChange={(e) => setVScale(parseFloat(e.target.value))}
                    className="w-full h-1 bg-slate-600 rounded-lg appearance-none cursor-pointer accent-red-500"
                  />
                  <div className="text-right text-xs text-red-400 font-mono">±{(vScale/2).toFixed(0)}V</div>
              </div>
              <div>
                  <label className="text-[10px] text-slate-400 uppercase font-bold block mb-1">Thang đo dòng điện (A)</label>
                  <input 
                    type="range" min="0.1" max="10" step="0.1" 
                    value={iScale} 
                    onChange={(e) => setIScale(parseFloat(e.target.value))}
                    className="w-full h-1 bg-slate-600 rounded-lg appearance-none cursor-pointer accent-blue-500"
                  />
                  <div className="text-right text-xs text-blue-400 font-mono">±{(iScale/2).toFixed(1)}A</div>
              </div>
          </div>
      )}

      {/* Canvas Area */}
      <div className="flex-1 relative bg-[#0f172a]">
        {!selectedComponent ? (
          <div className="absolute inset-0 flex flex-col items-center justify-center text-slate-500 text-sm p-4 text-center">
            <Zap className="w-8 h-8 mb-2 opacity-30" />
            <p>Chọn linh kiện để đo</p>
          </div>
        ) : (
          <>
             <canvas 
                ref={canvasRef} 
                width={480} 
                height={280} 
                className="w-full h-full block"
             />
             {/* Legend / Values */}
             <div className="absolute top-2 left-2 flex flex-col gap-1 pointer-events-none">
                 <div className="flex items-center gap-2 bg-slate-900/60 px-2 py-1 rounded backdrop-blur-sm border border-red-500/30">
                     <div className="w-2 h-2 rounded-full bg-red-500 animate-pulse"></div>
                     <span className="text-xs text-red-400 font-mono font-bold">
                         {(selectedComponent.voltageDrop || 0).toFixed(2)} V
                     </span>
                 </div>
                 <div className="flex items-center gap-2 bg-slate-900/60 px-2 py-1 rounded backdrop-blur-sm border border-blue-500/30">
                     <div className="w-2 h-2 rounded-full bg-blue-500 animate-pulse"></div>
                     <span className="text-xs text-blue-400 font-mono font-bold">
                         {(selectedComponent.current || 0).toFixed(3)} A
                     </span>
                 </div>
             </div>
             <div className="absolute bottom-1 right-2 text-[10px] text-slate-600 font-mono">
                 {selectedComponent.type} ({selectedComponent.id.slice(0,4)})
             </div>
          </>
        )}
      </div>
    </div>
  );
}
