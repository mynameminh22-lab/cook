import React from 'react';
import { useCircuitStore } from '../store';
import { 
  Play, Pause, RotateCcw, Trash2, Undo, Redo, 
  Grid, CornerUpRight, Minus, Activity, FolderOpen, RefreshCw, BookOpen, Wand2, Gamepad2, CheckCircle, Menu, Settings
} from 'lucide-react';
import { BASIC_EXAMPLES, COMPLEX_EXAMPLES } from '../examples';
import { cn } from '../lib/utils';

import { useShallow } from 'zustand/react/shallow';

export function Toolbar({ 
  onToggleWiki, 
  onToggleMinigame, 
  onToggleSidebar, 
  onToggleInspector 
}: { 
  onToggleWiki?: () => void, 
  onToggleMinigame?: () => void,
  onToggleSidebar?: () => void,
  onToggleInspector?: () => void
}) {
  const { 
    undo, redo, past, future, 
    simulationRunning, toggleSimulation, 
    resetCircuit, loadCircuit, autoArrange,
    selectedId, removeComponent, selectedWireIndex, removeWire,
    snapToGrid, setSnapToGrid,
    wireMode, setWireMode,
    evaluateCircuit,
    showOscilloscope,
    setShowOscilloscope
  } = useCircuitStore(useShallow(state => ({
    undo: state.undo,
    redo: state.redo,
    past: state.past,
    future: state.future,
    simulationRunning: state.simulationRunning,
    toggleSimulation: state.toggleSimulation,
    resetCircuit: state.resetCircuit,
    loadCircuit: state.loadCircuit,
    autoArrange: state.autoArrange,
    selectedId: state.selectedId,
    removeComponent: state.removeComponent,
    selectedWireIndex: state.selectedWireIndex,
    removeWire: state.removeWire,
    snapToGrid: state.snapToGrid,
    setSnapToGrid: state.setSnapToGrid,
    wireMode: state.wireMode,
    setWireMode: state.setWireMode,
    evaluateCircuit: state.evaluateCircuit,
    showOscilloscope: state.showOscilloscope,
    setShowOscilloscope: state.setShowOscilloscope
  })));

  const handleDelete = () => {
    if (selectedId) {
      removeComponent(selectedId);
      useCircuitStore.getState().setSelectedId(null);
    } else if (selectedWireIndex !== null) {
      removeWire(selectedWireIndex);
      useCircuitStore.getState().setSelectedWireIndex(null);
    }
  };

  return (
    <div className="h-14 md:h-16 bg-white border-b border-slate-200 flex items-center px-3 md:px-6 justify-between shadow-[0_4px_24px_rgba(0,0,0,0.02)] z-30 shrink-0">
      <div className="flex items-center gap-2 md:gap-6">
        {/* Mobile Sidebar Toggle */}
        <button 
          onClick={onToggleSidebar}
          className="md:hidden p-2 text-slate-600 hover:bg-slate-100 rounded-lg active:scale-95 transition-all"
        >
          <Menu size={20} />
        </button>

        <div className="flex items-center gap-2.5 font-bold text-lg md:text-xl text-slate-800 mr-2">
          <div className="w-7 h-7 md:w-8 md:h-8 rounded-lg bg-blue-600 flex items-center justify-center shadow-sm shadow-blue-200">
            <Activity className="text-white w-4 h-4 md:w-5 md:h-5" />
          </div>
          <span className="tracking-tight hidden sm:inline">CircuitSim</span>
        </div>
        
        {/* Desktop Tools Group */}
        <div className="hidden lg:flex items-center gap-1.5 mr-2 border-r border-slate-200 pr-4">
          <div className="relative group">
            <button className="flex items-center gap-2 px-3.5 py-2 text-slate-600 hover:bg-slate-100/80 hover:text-slate-900 rounded-lg active:scale-95 transition-all font-medium">
              <FolderOpen size={18} className="text-slate-500 group-hover:text-blue-600 transition-colors" />
              <span className="text-sm">Mẫu mạch</span>
            </button>
            <div className="absolute top-full left-0 mt-2 w-72 bg-white border border-slate-200 rounded-xl shadow-xl transform origin-top scale-y-0 group-hover:scale-y-100 transition-all duration-200 ease-out z-50 max-h-[80vh] overflow-y-auto opacity-0 group-hover:opacity-100 custom-scrollbar">
              
              <div className="px-4 py-2.5 text-xs font-bold text-slate-400 uppercase tracking-wider bg-slate-50/80 border-b border-slate-100 sticky top-0 backdrop-blur-sm">
                Cơ bản
              </div>
              {BASIC_EXAMPLES.map((ex, idx) => (
                <button
                  key={`basic-${idx}`}
                  onClick={() => loadCircuit(ex.create())}
                  className="w-full text-left px-4 py-2.5 text-sm text-slate-600 hover:text-slate-900 hover:bg-blue-50/50 border-b border-slate-50 last:border-0 active:bg-blue-100 transition-colors flex items-center gap-2"
                >
                  <div className="w-1.5 h-1.5 rounded-full bg-blue-400 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                  {ex.name}
                </button>
              ))}

              <div className="px-4 py-2.5 text-xs font-bold text-slate-400 uppercase tracking-wider bg-slate-50/80 border-y border-slate-100 mt-1 sticky top-0 backdrop-blur-sm">
                Phức tạp
              </div>
              {COMPLEX_EXAMPLES.map((ex, idx) => (
                <button
                  key={`complex-${idx}`}
                  onClick={() => loadCircuit(ex.create())}
                  className="w-full text-left px-4 py-2.5 text-sm text-slate-600 hover:text-slate-900 hover:bg-purple-50/50 border-b border-slate-50 last:border-0 active:bg-purple-100 transition-colors flex items-center gap-2"
                >
                  <div className="w-1.5 h-1.5 rounded-full bg-purple-400 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                  {ex.name}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Undo/Redo/Delete - Visible on Tablet+ */}
        <div className="hidden md:flex items-center gap-1.5 mr-2 border-r border-slate-200 pr-4">
          <button 
            onClick={undo}
            disabled={past.length === 0}
            className="p-2.5 text-slate-500 hover:bg-slate-100 hover:text-slate-800 rounded-lg disabled:opacity-30 disabled:hover:bg-transparent disabled:cursor-not-allowed active:scale-95 transition-all"
            title="Hoàn tác (Undo)"
          >
            <Undo size={18} />
          </button>
          <button 
            onClick={redo}
            disabled={future.length === 0}
            className="p-2.5 text-slate-500 hover:bg-slate-100 hover:text-slate-800 rounded-lg disabled:opacity-30 disabled:hover:bg-transparent disabled:cursor-not-allowed active:scale-95 transition-all"
            title="Làm lại (Redo)"
          >
            <Redo size={18} />
          </button>
          <div className="w-px h-6 bg-slate-200 mx-1"></div>
          <button 
            onClick={handleDelete}
            disabled={!selectedId && selectedWireIndex === null}
            className="p-2.5 text-slate-500 hover:bg-red-50 hover:text-red-600 rounded-lg disabled:opacity-30 disabled:hover:bg-transparent disabled:cursor-not-allowed active:scale-95 transition-all"
            title="Xóa (Delete)"
          >
            <Trash2 size={18} />
          </button>
        </div>

        {/* Tools - Hidden on Mobile */}
        <div className="hidden xl:flex items-center gap-1.5 mr-2 border-r border-slate-200 pr-4">
           {/* Grid Snap Toggle */}
           <button 
            onClick={() => setSnapToGrid(!snapToGrid)}
            className={cn("p-2.5 rounded-lg active:scale-95 transition-all", snapToGrid ? 'bg-blue-100 text-blue-700 shadow-inner' : 'text-slate-500 hover:bg-slate-100 hover:text-slate-800')}
            title={snapToGrid ? "Tắt bắt dính lưới" : "Bật bắt dính lưới"}
          >
            <Grid size={18} />
          </button>

          {/* Wire Mode Selection */}
          <div className="flex bg-slate-100/80 rounded-lg p-1 ml-2 border border-slate-200/60 shadow-inner">
            <button
              onClick={() => setWireMode('orthogonal')}
              className={cn("p-1.5 rounded-md active:scale-95 transition-all", wireMode === 'orthogonal' ? 'bg-white shadow-sm text-blue-600 font-bold' : 'text-slate-500 hover:text-slate-700 hover:bg-slate-200/50')}
              title="Dây vuông góc"
            >
              <CornerUpRight size={16} />
            </button>
            <button
              onClick={() => setWireMode('straight')}
              className={cn("p-1.5 rounded-md active:scale-95 transition-all", wireMode === 'straight' ? 'bg-white shadow-sm text-blue-600 font-bold' : 'text-slate-500 hover:text-slate-700 hover:bg-slate-200/50')}
              title="Dây thẳng"
            >
              <Minus size={16} />
            </button>
            <button
              onClick={() => setWireMode('curved')}
              className={cn("p-1.5 rounded-md active:scale-95 transition-all", wireMode === 'curved' ? 'bg-white shadow-sm text-blue-600 font-bold' : 'text-slate-500 hover:text-slate-700 hover:bg-slate-200/50')}
              title="Dây cong"
            >
              <Activity size={16} />
            </button>
          </div>
        </div>

        {/* Play/Pause Button - Always Visible */}
        <button 
          onClick={toggleSimulation}
          className={cn(
            "flex items-center gap-2.5 px-3 md:px-5 py-2 md:py-2.5 rounded-xl font-semibold transition-all active:scale-95 shadow-sm",
            simulationRunning 
              ? 'bg-red-50 text-red-600 hover:bg-red-100 border border-red-200' 
              : 'bg-emerald-500 text-white hover:bg-emerald-600 hover:shadow-md border border-emerald-600/20'
          )}
        >
          {simulationRunning ? <Pause size={18} className="fill-current" /> : <Play size={18} className="fill-current" />}
          <span className="hidden sm:inline">{simulationRunning ? 'Dừng' : 'Chạy'}</span>
        </button>

        {/* Extra Tools - Hidden on Mobile */}
        <div className="hidden lg:flex items-center">
            <button 
            onClick={resetCircuit}
            className="p-2.5 text-slate-500 hover:bg-slate-100 hover:text-slate-800 rounded-lg active:scale-95 transition-all ml-2"
            title="Xóa toàn bộ"
            >
            <RefreshCw size={18} />
            </button>
            <button 
            onClick={autoArrange}
            className="p-2.5 text-purple-600 hover:bg-purple-50 hover:text-purple-700 rounded-lg active:scale-95 transition-all ml-1 border border-purple-100 shadow-sm"
            title="Tự động xếp mạch"
            >
            <Wand2 size={18} />
            </button>

            <button 
            onClick={() => setShowOscilloscope(!showOscilloscope)}
            className={cn("p-2.5 rounded-lg active:scale-95 transition-all ml-1 border shadow-sm", showOscilloscope ? 'bg-blue-50 text-blue-600 border-blue-200' : 'text-slate-500 hover:bg-slate-50 border-slate-200')}
            title="Bật/Tắt Dao động ký"
            >
            <Activity size={18} />
            </button>

            <button 
            onClick={evaluateCircuit}
            className="p-2.5 text-indigo-600 hover:bg-indigo-50 hover:text-indigo-700 rounded-lg active:scale-95 transition-all ml-1 border border-indigo-100 shadow-sm"
            title="Đánh giá mạch điện"
            >
            <CheckCircle size={18} />
            </button>
        </div>
      </div>

      <div className="flex items-center gap-1 md:gap-3">
        {onToggleMinigame && (
          <button
            onClick={onToggleMinigame}
            className="flex items-center gap-2 px-3 py-2 text-indigo-600 bg-indigo-50/50 hover:bg-indigo-100 border border-indigo-100 rounded-xl transition-all active:scale-95 font-semibold shadow-sm"
            title="Thử thách giải đố"
          >
            <Gamepad2 size={18} />
            <span className="text-sm hidden lg:inline">Giải đố</span>
          </button>
        )}
        {onToggleWiki && (
          <button
            onClick={onToggleWiki}
            className="flex items-center gap-2 px-3 py-2 text-slate-600 bg-slate-50 hover:bg-slate-100 hover:text-slate-900 border border-slate-200 rounded-xl transition-all active:scale-95 font-medium shadow-sm"
            title="Kiến thức linh kiện"
          >
            <BookOpen size={18} />
            <span className="text-sm hidden lg:inline">Wiki</span>
          </button>
        )}
        
        {/* Mobile Inspector Toggle */}
        <button 
          onClick={onToggleInspector}
          className="md:hidden p-2 text-slate-600 hover:bg-slate-100 rounded-lg active:scale-95 transition-all"
        >
          <Settings size={20} />
        </button>
      </div>
    </div>
  );
}
