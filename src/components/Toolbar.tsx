import React, { useRef, useState } from 'react';
import { useCircuitStore } from '../store';
import { 
  Play, Pause, RotateCcw, Trash2, Undo, Redo, 
  Grid, CornerUpRight, Minus, Activity, FolderOpen, RefreshCw, BookOpen, Wand2, Gamepad2, CheckCircle, Menu, Settings, Save, Upload, CloudSun, HelpCircle, Zap
} from 'lucide-react';
import { BASIC_EXAMPLES, COMPLEX_EXAMPLES } from '../examples';
import { cn } from '../lib/utils';
import { useShallow } from 'zustand/react/shallow';

export function Toolbar({ 
  onToggleWiki, 
  onToggleMinigame, 
  onToggleSidebar, 
  onToggleInspector,
  onToggleExamplesModal
}: { 
  onToggleWiki?: () => void, 
  onToggleMinigame?: () => void,
  onToggleSidebar?: () => void,
  onToggleInspector?: () => void,
  onToggleExamplesModal?: () => void
}) {
  const { 
    undo, redo, past, future, 
    simulationRunning, toggleSimulation, 
    resetCircuit, loadCircuit, autoArrange, autoOptimize,
    selectedId, removeComponent, selectedWireIndex, removeWire,
    snapToGrid, setSnapToGrid,
    wireMode, setWireMode,
    evaluateCircuit,
    showOscilloscope,
    setShowOscilloscope,
    showEnvironment,
    setShowEnvironment,
    currentLevelId
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
    autoOptimize: state.autoOptimize,
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
    setShowOscilloscope: state.setShowOscilloscope,
    showEnvironment: state.showEnvironment,
    setShowEnvironment: state.setShowEnvironment,
    currentLevelId: state.currentLevelId
  })));

  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleDelete = () => {
    if (selectedId) {
      removeComponent(selectedId);
      useCircuitStore.getState().setSelectedId(null);
    } else if (selectedWireIndex !== null) {
      removeWire(selectedWireIndex);
      useCircuitStore.getState().setSelectedWireIndex(null);
    }
  };

  const handleSave = () => {
    const state = useCircuitStore.getState();
    const data = {
      components: state.components,
      wires: state.wires,
      nodes: state.nodes
    };
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `circuit-${new Date().toISOString().slice(0, 10)}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const handleLoad = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const data = JSON.parse(event.target?.result as string);
        if (data.components && data.wires && data.nodes) {
          loadCircuit(data);
        } else {
          alert('File không hợp lệ!');
        }
      } catch (error) {
        alert('Lỗi khi đọc file!');
      }
    };
    reader.readAsText(file);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const renderTools = () => (
    <>
      {/* File Group */}
      <div className="flex items-center gap-1 shrink-0 border-r border-slate-200 pr-2 mr-1">
        <button onClick={handleSave} className="p-2 text-slate-500 hover:bg-slate-100 rounded-lg" title="Lưu mạch"><Save size={18} /></button>
        <button onClick={() => fileInputRef.current?.click()} className="p-2 text-slate-500 hover:bg-slate-100 rounded-lg" title="Tải mạch"><Upload size={18} /></button>
        {onToggleExamplesModal && (
          <button onClick={onToggleExamplesModal} className="tour-examples p-2 text-slate-500 hover:bg-slate-100 rounded-lg" title="Mẫu mạch"><FolderOpen size={18} /></button>
        )}
      </div>
      {/* Edit Group */}
      <div className="flex items-center gap-1 shrink-0 border-r border-slate-200 pr-2 mr-1">
        <button onClick={undo} disabled={past.length === 0} className="p-2 text-slate-500 hover:bg-slate-100 rounded-lg disabled:opacity-30" title="Hoàn tác"><Undo size={18} /></button>
        <button onClick={redo} disabled={future.length === 0} className="p-2 text-slate-500 hover:bg-slate-100 rounded-lg disabled:opacity-30" title="Làm lại"><Redo size={18} /></button>
        <button onClick={handleDelete} disabled={!selectedId && selectedWireIndex === null} className="p-2 text-slate-500 hover:bg-red-50 hover:text-red-600 rounded-lg disabled:opacity-30" title="Xóa"><Trash2 size={18} /></button>
      </div>

      {/* Canvas Group */}
      <div className="flex items-center gap-1 shrink-0 border-r border-slate-200 pr-2 mr-1">
        <button onClick={() => setSnapToGrid(!snapToGrid)} className={cn("p-2 rounded-lg", snapToGrid ? 'bg-blue-100 text-blue-700' : 'text-slate-500 hover:bg-slate-100')} title="Bật/tắt lưới"><Grid size={18} /></button>
        
        <div className="flex bg-slate-100 rounded-lg p-0.5">
          <button onClick={() => setWireMode('orthogonal')} className={cn("p-1.5 rounded-md", wireMode === 'orthogonal' ? 'bg-white shadow-sm text-blue-600' : 'text-slate-500')} title="Dây vuông góc"><CornerUpRight size={16} /></button>
          <button onClick={() => setWireMode('straight')} className={cn("p-1.5 rounded-md", wireMode === 'straight' ? 'bg-white shadow-sm text-blue-600' : 'text-slate-500')} title="Dây thẳng"><Minus size={16} /></button>
          <button onClick={() => setWireMode('curved')} className={cn("p-1.5 rounded-md", wireMode === 'curved' ? 'bg-white shadow-sm text-blue-600' : 'text-slate-500')} title="Dây cong"><Activity size={16} /></button>
        </div>

        <button onClick={resetCircuit} className="p-2 text-slate-500 hover:bg-slate-100 rounded-lg" title="Xóa toàn bộ"><RefreshCw size={18} /></button>
        <button 
          onClick={autoArrange} 
          disabled={currentLevelId !== null}
          className="p-2 text-purple-600 hover:bg-purple-50 rounded-lg disabled:opacity-30 disabled:hover:bg-transparent" 
          title={currentLevelId !== null ? "Không khả dụng trong chế độ giải đố" : "Tự động xếp mạch"}
        >
          <Wand2 size={18} />
        </button>
        <button 
          onClick={autoOptimize} 
          disabled={currentLevelId !== null}
          className="p-2 text-amber-600 hover:bg-amber-50 rounded-lg disabled:opacity-30 disabled:hover:bg-transparent" 
          title={currentLevelId !== null ? "Không khả dụng trong chế độ giải đố" : "Tự động tối ưu linh kiện"}
        >
          <Zap size={18} />
        </button>
      </div>

      {/* Sim Group */}
      <div className="flex items-center gap-1 shrink-0">
        <button onClick={() => setShowOscilloscope(!showOscilloscope)} className={cn("p-2 rounded-lg", showOscilloscope ? 'bg-blue-50 text-blue-600' : 'text-slate-500 hover:bg-slate-100')} title="Dao động ký"><Activity size={18} /></button>
        <button onClick={() => setShowEnvironment(!showEnvironment)} className={cn("p-2 rounded-lg", showEnvironment ? 'bg-amber-50 text-amber-600' : 'text-slate-500 hover:bg-slate-100')} title="Môi trường"><CloudSun size={18} /></button>
        <button onClick={evaluateCircuit} className="p-2 text-indigo-600 hover:bg-indigo-50 rounded-lg" title="Đánh giá mạch"><CheckCircle size={18} /></button>
      </div>
      
      {/* Mobile Extras (Wiki, Minigame) */}
      <div className="flex md:hidden items-center gap-1 shrink-0 border-l border-slate-200 pl-2 ml-1">
        {onToggleMinigame && <button onClick={onToggleMinigame} className="p-2 text-indigo-600 hover:bg-indigo-50 rounded-lg" title="Giải đố"><Gamepad2 size={18} /></button>}
        {onToggleWiki && <button onClick={onToggleWiki} className="p-2 text-slate-600 hover:bg-slate-100 rounded-lg" title="Wiki"><BookOpen size={18} /></button>}
      </div>
    </>
  );

  return (
    <div className="tour-tools flex flex-col w-full z-[70] shrink-0 bg-white shadow-[0_4px_24px_rgba(0,0,0,0.02)]">
      {/* Main Top Bar */}
      <div className="h-14 md:h-16 border-b border-slate-200 flex items-center px-2 md:px-4 justify-between w-full">
        {/* Left: Logo & Mobile Menu */}
        <div className="flex items-center gap-2 shrink-0">
          <button onClick={onToggleSidebar} className="md:hidden p-2 text-slate-600 hover:bg-slate-100 rounded-lg">
            <Menu size={20} />
          </button>
          <div className="flex items-center gap-2 font-bold text-lg text-slate-800 mr-2">
            <div className="w-7 h-7 bg-blue-600 rounded-lg flex items-center justify-center shadow-sm">
              <Activity className="text-white w-4 h-4" />
            </div>
            <span className="hidden sm:inline">CircuitSim</span>
          </div>
        </div>

        {/* Center: Scrollable Tools (Desktop & Tablet) */}
        <div className="hidden md:flex flex-1 overflow-x-auto hide-scrollbar items-center gap-2 px-2 mx-2">
          {renderTools()}
        </div>

        {/* Right: Play/Pause & Extras */}
        <div className="flex items-center gap-1 md:gap-2 shrink-0">
          <button 
            onClick={toggleSimulation}
            className={cn(
              "tour-play-pause flex items-center gap-1.5 px-3 py-1.5 md:px-4 md:py-2 rounded-lg font-bold transition-all active:scale-95 shadow-sm text-sm md:text-base",
              simulationRunning 
                ? 'bg-red-50 text-red-600 border border-red-200 hover:bg-red-100' 
                : 'bg-emerald-500 text-white border border-emerald-600/20 hover:bg-emerald-600'
            )}
          >
            {simulationRunning ? <Pause size={16} className="fill-current" /> : <Play size={16} className="fill-current" />}
            <span>{simulationRunning ? 'Dừng' : 'Chạy'}</span>
          </button>

          {onToggleMinigame && (
            <button onClick={onToggleMinigame} className="hidden md:flex items-center gap-1.5 px-2.5 py-1.5 md:px-3 md:py-2 text-indigo-600 bg-indigo-50 border border-indigo-100 rounded-lg hover:bg-indigo-100 transition-all font-semibold text-sm">
              <Gamepad2 size={16} />
              <span className="hidden lg:inline">Giải đố</span>
            </button>
          )}

          {onToggleWiki && (
            <button onClick={onToggleWiki} className="hidden md:flex items-center gap-1.5 px-2.5 py-1.5 md:px-3 md:py-2 text-slate-600 bg-slate-50 border border-slate-200 rounded-lg hover:bg-slate-100 transition-all font-semibold text-sm">
              <BookOpen size={16} />
              <span className="hidden lg:inline">Wiki</span>
            </button>
          )}

          <button 
            onClick={() => useCircuitStore.getState().setHasCompletedTutorial(false)} 
            className="hidden md:flex items-center gap-1.5 px-2.5 py-1.5 md:px-3 md:py-2 text-slate-600 bg-slate-50 border border-slate-200 rounded-lg hover:bg-slate-100 transition-all font-semibold text-sm"
            title="Hướng dẫn"
          >
            <HelpCircle size={16} />
          </button>

          <button onClick={onToggleInspector} className="md:hidden p-2 text-slate-600 hover:bg-slate-100 rounded-lg">
            <Settings size={20} />
          </button>
        </div>
      </div>

      {/* Mobile Bottom Tools Bar (Scrollable) */}
      <div className="md:hidden h-12 border-b border-slate-200 flex items-center overflow-x-auto hide-scrollbar px-2 gap-1 w-full bg-slate-50/50">
        {renderTools()}
      </div>
      
      <input 
        type="file" 
        ref={fileInputRef} 
        onChange={handleLoad} 
        accept=".json" 
        className="hidden" 
      />
    </div>
  );
}
