import React from 'react';
import { useCircuitStore } from '../store';
import { useShallow } from 'zustand/react/shallow';
import { Sun, Cloud, CloudRain, CloudLightning, Wind, Thermometer, Clock, Play, Pause } from 'lucide-react';
import { cn } from '../lib/utils';
import { WeatherType } from '../types';

export function EnvironmentPanel() {
  const { environment, setEnvironment, showUI, showEnvironment } = useCircuitStore(useShallow(state => ({
    environment: state.environment,
    setEnvironment: state.setEnvironment,
    showUI: state.showUI,
    showEnvironment: state.showEnvironment
  })));

  if (!showUI || !showEnvironment) return null;

  const formatTime = (time: number) => {
    const hours = Math.floor(time);
    const minutes = Math.floor((time - hours) * 60);
    return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`;
  };

  const weatherIcons: Record<WeatherType, React.ReactNode> = {
    sunny: <Sun size={16} className="text-amber-500" />,
    cloudy: <Cloud size={16} className="text-slate-400" />,
    rainy: <CloudRain size={16} className="text-blue-400" />,
    stormy: <CloudLightning size={16} className="text-purple-500" />
  };

  return (
    <div className="absolute top-20 right-4 w-64 bg-white/90 backdrop-blur-md border border-slate-200 rounded-2xl shadow-lg p-4 z-40 flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <h3 className="font-bold text-slate-800 text-sm flex items-center gap-1.5">
          <Sun size={16} className="text-amber-500" />
          Môi trường
        </h3>
        <button
          onClick={() => setEnvironment({ isSimulationEnabled: !environment.isSimulationEnabled })}
          className={cn(
            "p-1.5 rounded-lg transition-colors",
            environment.isSimulationEnabled ? "bg-emerald-100 text-emerald-600" : "bg-slate-100 text-slate-500 hover:bg-slate-200"
          )}
          title={environment.isSimulationEnabled ? "Dừng mô phỏng thời gian" : "Chạy mô phỏng thời gian"}
        >
          {environment.isSimulationEnabled ? <Pause size={14} /> : <Play size={14} />}
        </button>
      </div>

      <div className="space-y-3">
        {/* Time */}
        <div>
          <div className="flex justify-between text-xs font-medium text-slate-500 mb-1">
            <span className="flex items-center gap-1"><Clock size={12} /> Thời gian</span>
            <span>{formatTime(environment.timeOfDay)}</span>
          </div>
          <input
            type="range"
            min="0"
            max="23.99"
            step="0.1"
            value={environment.timeOfDay}
            onChange={(e) => setEnvironment({ timeOfDay: parseFloat(e.target.value) })}
            className="w-full accent-blue-500"
          />
        </div>

        {/* Weather */}
        <div>
          <div className="text-xs font-medium text-slate-500 mb-1.5">Thời tiết</div>
          <div className="flex gap-1">
            {(['sunny', 'cloudy', 'rainy', 'stormy'] as WeatherType[]).map(w => (
              <button
                key={w}
                onClick={() => setEnvironment({ weather: w })}
                className={cn(
                  "flex-1 p-1.5 rounded-lg border flex justify-center transition-all",
                  environment.weather === w ? "bg-blue-50 border-blue-200 shadow-sm" : "bg-white border-slate-100 hover:bg-slate-50"
                )}
                title={w}
              >
                {weatherIcons[w]}
              </button>
            ))}
          </div>
        </div>

        {/* Wind Speed */}
        <div>
          <div className="flex justify-between text-xs font-medium text-slate-500 mb-1">
            <span className="flex items-center gap-1"><Wind size={12} /> Sức gió</span>
            <span>{environment.windSpeed.toFixed(1)} m/s</span>
          </div>
          <input
            type="range"
            min="0"
            max="30"
            step="0.5"
            value={environment.windSpeed}
            onChange={(e) => setEnvironment({ windSpeed: parseFloat(e.target.value) })}
            className="w-full accent-emerald-500"
          />
        </div>

        {/* Temperature */}
        <div>
          <div className="flex justify-between text-xs font-medium text-slate-500 mb-1">
            <span className="flex items-center gap-1"><Thermometer size={12} /> Nhiệt độ</span>
            <span>{environment.temperature.toFixed(1)} °C</span>
          </div>
          <input
            type="range"
            min="-20"
            max="50"
            step="1"
            value={environment.temperature}
            onChange={(e) => setEnvironment({ temperature: parseFloat(e.target.value) })}
            className="w-full accent-orange-500"
          />
        </div>
      </div>
    </div>
  );
}
