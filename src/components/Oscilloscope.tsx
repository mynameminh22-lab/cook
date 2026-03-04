import React, { useEffect, useState, useRef } from 'react';
import { useShallow } from 'zustand/react/shallow';
import { useCircuitStore } from '../store';
import { X, Activity, Zap } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

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
  
  const [data, setData] = useState<DataPoint[]>([]);
  const maxPoints = 100; // Keep last 100 points
  const lastTimeRef = useRef(0);

  const selectedComponent = components.find(c => c.id === selectedId);

  useEffect(() => {
    if (!simulationRunning || !selectedComponent) return;

    // Only update if time has advanced significantly to avoid too many re-renders
    if (time - lastTimeRef.current > 0.05) {
      lastTimeRef.current = time;
      
      setData(prev => {
        const newData = [
          ...prev, 
          { 
            time: parseFloat(time.toFixed(2)), 
            voltage: selectedComponent.voltageDrop || 0,
            current: selectedComponent.current || 0
          }
        ];
        return newData.slice(-maxPoints);
      });
    }
  }, [time, simulationRunning, selectedComponent]);

  // Reset data when selection changes
  useEffect(() => {
    setData([]);
  }, [selectedId]);

  if (!showOscilloscope) return null;

  return (
    <div className="absolute bottom-4 right-4 left-4 md:left-auto w-auto md:w-96 h-64 bg-white rounded-xl shadow-2xl border border-slate-200 z-50 flex flex-col overflow-hidden">
      {/* Header */}
      <div className="bg-slate-50 px-4 py-2 border-b border-slate-100 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Activity className="w-4 h-4 text-blue-600" />
          <span className="font-bold text-slate-700 text-sm">Dao động ký</span>
        </div>
        <button 
          onClick={() => setShowOscilloscope(false)}
          className="p-1 hover:bg-slate-200 rounded-full text-slate-500 transition-colors"
        >
          <X className="w-4 h-4" />
        </button>
      </div>

      {/* Content */}
      <div className="flex-1 p-2 bg-white relative">
        {!selectedComponent ? (
          <div className="absolute inset-0 flex flex-col items-center justify-center text-slate-400 text-sm p-4 text-center">
            <Zap className="w-8 h-8 mb-2 opacity-50" />
            <p>Chọn một linh kiện để xem biểu đồ</p>
          </div>
        ) : (
          <div className="w-full h-full">
             <div className="text-xs text-slate-500 mb-1 flex justify-between px-2">
                <span>{selectedComponent.type}</span>
                <div className="flex gap-3">
                    <span className="text-red-500 font-bold">V: {(selectedComponent.voltageDrop || 0).toFixed(2)}V</span>
                    <span className="text-blue-500 font-bold">I: {(selectedComponent.current || 0).toFixed(2)}A</span>
                </div>
             </div>
             <ResponsiveContainer width="100%" height="85%">
              <LineChart data={data}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                <XAxis 
                    dataKey="time" 
                    hide={true} 
                    domain={['dataMin', 'dataMax']}
                />
                <YAxis 
                    yAxisId="left" 
                    orientation="left" 
                    stroke="#ef4444" 
                    fontSize={10} 
                    tickFormatter={(val) => val.toFixed(1)}
                    domain={['auto', 'auto']}
                />
                <YAxis 
                    yAxisId="right" 
                    orientation="right" 
                    stroke="#3b82f6" 
                    fontSize={10} 
                    tickFormatter={(val) => val.toFixed(2)}
                    domain={['auto', 'auto']}
                />
                <Tooltip 
                    contentStyle={{ fontSize: '12px', padding: '4px' }}
                    labelFormatter={(label) => `t: ${label}s`}
                />
                <Line 
                    yAxisId="left"
                    type="monotone" 
                    dataKey="voltage" 
                    stroke="#ef4444" 
                    strokeWidth={2} 
                    dot={false} 
                    isAnimationActive={false}
                />
                <Line 
                    yAxisId="right"
                    type="monotone" 
                    dataKey="current" 
                    stroke="#3b82f6" 
                    strokeWidth={2} 
                    dot={false} 
                    isAnimationActive={false}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        )}
      </div>
    </div>
  );
}
