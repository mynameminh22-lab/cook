import React, { useEffect, useState, useRef } from 'react';
import { useShallow } from 'zustand/react/shallow';
import { useCircuitStore } from '../store';
import { X, Activity, Zap, Play, Pause, Settings2 } from 'lucide-react';
import { cn } from '../lib/utils';

interface DataPoint {
  time: number;
  voltage: number;
  current: number;
  power: number;
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
  const [pScale, setPScale] = useState(10); // Watts per full height
  const [showControls, setShowControls] = useState(false);
  const [showPower, setShowPower] = useState(false);
  const [triggerMode, setTriggerMode] = useState<'none' | 'rising' | 'falling'>('none');
  const [triggerLevel, setTriggerLevel] = useState(0);
  const [cursorPos, setCursorPos] = useState<{x: number, y: number} | null>(null);

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
            current: selectedComponent.current || 0,
            power: Math.abs((selectedComponent.voltageDrop || 0) * (selectedComponent.current || 0))
          }
        ];
        // Keep enough data for the current timebase plus some buffer
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

  // Frequency Calculation
  let frequency = 0;
  if (data.length > 2) {
      let sumV = 0;
      let minV = data[0].voltage;
      let maxV = data[0].voltage;
      for (const p of data) {
          sumV += p.voltage;
          if (p.voltage < minV) minV = p.voltage;
          if (p.voltage > maxV) maxV = p.voltage;
      }
      const meanV = sumV / data.length;
      
      if (maxV - minV > 0.1) {
          let crossings = [];
          for (let i = 1; i < data.length; i++) {
              const p1 = data[i - 1];
              const p2 = data[i];
              if (p1.voltage <= meanV && p2.voltage > meanV) {
                  const t = p1.time + (meanV - p1.voltage) / (p2.voltage - p1.voltage) * (p2.time - p1.time);
                  crossings.push(t);
              }
          }
          
          if (crossings.length >= 2) {
              let totalPeriod = 0;
              for (let i = 1; i < crossings.length; i++) {
                  totalPeriod += crossings[i] - crossings[i - 1];
              }
              const avgPeriod = totalPeriod / (crossings.length - 1);
              if (avgPeriod > 0) {
                  frequency = 1 / avgPeriod;
              }
          }
      }
  }

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

    // Trigger Level Line
    if (triggerMode !== 'none') {
        const trigY = (height / 2) - (triggerLevel / (vScale / 2)) * (height / 2);
        ctx.strokeStyle = '#d97706'; // Amber
        ctx.setLineDash([5, 5]);
        ctx.beginPath();
        ctx.moveTo(0, trigY);
        ctx.lineTo(width, trigY);
        ctx.stroke();
        ctx.setLineDash([]);
        
        ctx.fillStyle = '#d97706';
        ctx.font = '10px monospace';
        ctx.fillText(`T: ${triggerLevel}V`, 5, trigY - 2);
    }

    if (data.length < 2) return;

    let endTime = data[data.length - 1].time;
    let startTime = endTime - timeBase;

    // Trigger Logic
    if (triggerMode !== 'none') {
        // Find trigger point in the visible window (or slightly before)
        // We look backwards from the end
        let foundTrig = false;
        for (let i = data.length - 2; i >= 0; i--) {
            const p1 = data[i];
            const p2 = data[i+1];
            
            // Check if we are within a reasonable search window (e.g. last 2 screens)
            if (endTime - p1.time > timeBase * 2) break;

            const v1 = p1.voltage;
            const v2 = p2.voltage;
            
            let crossed = false;
            if (triggerMode === 'rising') {
                crossed = v1 <= triggerLevel && v2 >= triggerLevel;
            } else {
                crossed = v1 >= triggerLevel && v2 <= triggerLevel;
            }

            if (crossed) {
                // Found trigger point!
                // Align this point to the left (or specific offset)
                // Let's align to 10% from left
                const trigTime = p1.time + (triggerLevel - v1) / (v2 - v1) * (p2.time - p1.time);
                startTime = trigTime - (timeBase * 0.1);
                endTime = startTime + timeBase;
                foundTrig = true;
                break;
            }
        }
    }

    // Helper to map time to x
    const mapX = (t: number) => {
        return ((t - startTime) / timeBase) * width;
    };

    // Helper to map value to y (0 is center)
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
        if (p.time > endTime) break;
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
        if (p.time > endTime) break;
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

    if (showPower) {
      // Draw Power (Yellow)
      ctx.strokeStyle = '#eab308';
      ctx.lineWidth = 2;
      ctx.beginPath();
      started = false;
      for (const p of data) {
          if (p.time < startTime) continue;
          if (p.time > endTime) break;
          const x = mapX(p.time);
          const y = mapY(p.power, pScale);
          if (!started) {
              ctx.moveTo(x, y);
              started = true;
          } else {
              ctx.lineTo(x, y);
          }
      }
      ctx.stroke();
    }

    // Cursor
    if (cursorPos) {
        const t = startTime + (cursorPos.x / width) * timeBase;
        
        // Find closest data point
        let closest = data[0];
        let minDiff = Math.abs(data[0].time - t);
        for (let i = 1; i < data.length; i++) {
            const diff = Math.abs(data[i].time - t);
            if (diff < minDiff) {
                minDiff = diff;
                closest = data[i];
            }
        }

        if (closest && minDiff < timeBase * 0.05) { // Only show if close enough
            const x = mapX(closest.time);
            
            ctx.strokeStyle = '#ffffff';
            ctx.lineWidth = 1;
            ctx.setLineDash([2, 2]);
            ctx.beginPath();
            ctx.moveTo(x, 0);
            ctx.lineTo(x, height);
            ctx.stroke();
            ctx.setLineDash([]);

            // Draw values near cursor
            const boxX = x > width / 2 ? x - 130 : x + 10;
            const boxY = cursorPos.y;
            
            ctx.fillStyle = 'rgba(15, 23, 42, 0.9)';
            ctx.fillRect(boxX, boxY, 120, 80);
            ctx.strokeStyle = '#475569';
            ctx.strokeRect(boxX, boxY, 120, 80);

            ctx.fillStyle = '#cbd5e1';
            ctx.font = '10px monospace';
            ctx.fillText(`T: ${closest.time.toFixed(3)}s`, boxX + 5, boxY + 15);
            
            ctx.fillStyle = '#ef4444';
            ctx.fillText(`V: ${closest.voltage.toFixed(3)}V`, boxX + 5, boxY + 30);
            
            ctx.fillStyle = '#3b82f6';
            ctx.fillText(`I: ${closest.current.toFixed(3)}A`, boxX + 5, boxY + 45);
            
            if (showPower) {
                ctx.fillStyle = '#eab308';
                ctx.fillText(`P: ${closest.power.toFixed(3)}W`, boxX + 5, boxY + 60);
            }
        }
    }

  }, [data, timeBase, vScale, iScale, pScale, showPower, triggerMode, triggerLevel, cursorPos]);

  const handleMouseMove = (e: React.MouseEvent) => {
      const rect = canvasRef.current?.getBoundingClientRect();
      if (rect) {
          setCursorPos({
              x: e.clientX - rect.left,
              y: e.clientY - rect.top
          });
      }
  };

  const handleMouseLeave = () => {
      setCursorPos(null);
  };

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
              <div className="flex items-center justify-between pt-2 border-t border-slate-700">
                  <label className="text-[10px] text-slate-400 uppercase font-bold">Hiển thị Công suất</label>
                  <input 
                    type="checkbox" 
                    checked={showPower} 
                    onChange={(e) => setShowPower(e.target.checked)}
                    className="w-4 h-4 accent-yellow-500"
                  />
              </div>
              {showPower && (
                <div>
                    <label className="text-[10px] text-slate-400 uppercase font-bold block mb-1">Thang đo công suất (W)</label>
                    <input 
                      type="range" min="1" max="100" step="1" 
                      value={pScale} 
                      onChange={(e) => setPScale(parseFloat(e.target.value))}
                      className="w-full h-1 bg-slate-600 rounded-lg appearance-none cursor-pointer accent-yellow-500"
                    />
                    <div className="text-right text-xs text-yellow-400 font-mono">±{(pScale/2).toFixed(0)}W</div>
                </div>
              )}
              <div className="flex items-center justify-between pt-2 border-t border-slate-700">
                  <label className="text-[10px] text-slate-400 uppercase font-bold">Trigger</label>
                  <select 
                    value={triggerMode} 
                    onChange={(e) => setTriggerMode(e.target.value as any)}
                    className="bg-slate-900 text-xs text-slate-300 border border-slate-600 rounded px-1 py-0.5"
                  >
                      <option value="none">None</option>
                      <option value="rising">Rising</option>
                      <option value="falling">Falling</option>
                  </select>
              </div>
              {triggerMode !== 'none' && (
                <div>
                    <label className="text-[10px] text-slate-400 uppercase font-bold block mb-1">Mức Trigger (V)</label>
                    <input 
                      type="range" min={-vScale/2} max={vScale/2} step="0.1" 
                      value={triggerLevel} 
                      onChange={(e) => setTriggerLevel(parseFloat(e.target.value))}
                      className="w-full h-1 bg-slate-600 rounded-lg appearance-none cursor-pointer accent-amber-500"
                    />
                    <div className="text-right text-xs text-amber-500 font-mono">{triggerLevel.toFixed(1)}V</div>
                </div>
              )}
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
                className="w-full h-full block cursor-crosshair"
                onMouseMove={handleMouseMove}
                onMouseLeave={handleMouseLeave}
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
                 {showPower && (
                   <div className="flex items-center gap-2 bg-slate-900/60 px-2 py-1 rounded backdrop-blur-sm border border-yellow-500/30">
                       <div className="w-2 h-2 rounded-full bg-yellow-500 animate-pulse"></div>
                       <span className="text-xs text-yellow-400 font-mono font-bold">
                           {Math.abs((selectedComponent.voltageDrop || 0) * (selectedComponent.current || 0)).toFixed(2)} W
                       </span>
                   </div>
                 )}
                 <div className="flex items-center gap-2 bg-slate-900/60 px-2 py-1 rounded backdrop-blur-sm border border-purple-500/30">
                     <div className="w-2 h-2 rounded-full bg-purple-500 animate-pulse"></div>
                     <span className="text-xs text-purple-400 font-mono font-bold">
                         {frequency > 0 ? `${frequency.toFixed(1)} Hz` : 'DC'}
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
