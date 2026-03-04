import React from 'react';
import { useShallow } from 'zustand/react/shallow';
import { LEVELS, Level } from '../data/levels';
import { useCircuitStore } from '../store';
import { X, PlayCircle, Trophy, Star, Zap } from 'lucide-react';
import { cn } from '../lib/utils';

interface MinigameModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function MinigameModal({ isOpen, onClose }: MinigameModalProps) {
  if (!isOpen) return null;

  const { setCurrentLevelId, loadCircuit, levelProgress } = useCircuitStore(useShallow(state => ({
    setCurrentLevelId: state.setCurrentLevelId,
    loadCircuit: state.loadCircuit,
    levelProgress: state.levelProgress
  })));

  const handleSelectLevel = (levelId: number) => {
    const level = LEVELS.find(l => l.id === levelId);
    if (level) {
      loadCircuit(level.setup());
      setCurrentLevelId(levelId);
      onClose();
    }
  };

  const renderLevelCard = (level: Level) => {
    const progress = levelProgress[level.id];
    const stars = progress?.stars || 0;
    const isLocked = level.id > 1 && !levelProgress[level.id - 1]?.completed;

    return (
      <button
        key={level.id}
        onClick={() => !isLocked && handleSelectLevel(level.id)}
        disabled={isLocked}
        className={cn(
          "bg-white p-5 rounded-2xl border shadow-sm transition-all text-left flex flex-col group duration-300 relative overflow-hidden",
          isLocked 
            ? "opacity-60 grayscale border-slate-200 cursor-not-allowed" 
            : "hover:shadow-md hover:border-indigo-300/60 hover:-translate-y-1 border-slate-200/60"
        )}
      >
        <div className="flex items-center justify-between mb-4">
          <span className={cn(
            "inline-flex items-center justify-center w-10 h-10 rounded-xl font-black text-lg border transition-colors shadow-sm",
            isLocked 
              ? "bg-slate-100 text-slate-400 border-slate-200"
              : "bg-indigo-50 text-indigo-600 border-indigo-100/50 group-hover:bg-indigo-600 group-hover:text-white"
          )}>
            {level.id}
          </span>
          {progress?.completed ? (
             <div className="flex gap-0.5">
               {[1, 2, 3].map(i => (
                 <Star key={i} size={16} className={cn("fill-current", i <= stars ? "text-yellow-400" : "text-slate-200")} />
               ))}
             </div>
          ) : (
             !isLocked && <PlayCircle className="text-slate-300 group-hover:text-indigo-500 transition-colors w-7 h-7" />
          )}
        </div>
        
        <h3 className="font-bold text-slate-800 mb-2 truncate text-base">{level.title}</h3>
        <p className="text-xs text-slate-500 line-clamp-2 leading-relaxed font-medium mb-3">
          {level.description}
        </p>

        <div className="mt-auto flex items-center justify-between pt-3 border-t border-slate-100">
           <span className={cn(
             "text-[10px] font-bold uppercase tracking-wider px-2 py-1 rounded-md",
             level.difficulty === 'Easy' ? "bg-emerald-50 text-emerald-600" :
             level.difficulty === 'Medium' ? "bg-amber-50 text-amber-600" :
             "bg-rose-50 text-rose-600"
           )}>
             {level.difficulty === 'Easy' ? 'Dễ' : level.difficulty === 'Medium' ? 'Trung bình' : 'Khó'}
           </span>
           {progress?.score !== undefined && (
             <span className="text-xs font-bold text-slate-600">
               {progress.score}/{level.maxScore}
             </span>
           )}
        </div>
      </button>
    );
  };

  const easyLevels = LEVELS.filter(l => l.difficulty === 'Easy');
  const mediumLevels = LEVELS.filter(l => l.difficulty === 'Medium');
  const hardLevels = LEVELS.filter(l => l.difficulty === 'Hard');

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4 sm:p-6 animate-in fade-in duration-200">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-6xl h-[90vh] flex flex-col overflow-hidden animate-in zoom-in-95 duration-200 border border-slate-200/50">
        
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-indigo-500/20 bg-gradient-to-r from-indigo-600 to-violet-600 text-white shadow-sm shrink-0">
          <div className="flex items-center gap-4">
            <div className="bg-white/20 p-2.5 rounded-xl backdrop-blur-md border border-white/10 shadow-inner">
              <Trophy className="w-7 h-7 text-yellow-300 drop-shadow-sm" />
            </div>
            <div>
              <h2 className="text-2xl font-black tracking-tight">Thử thách Giải đố</h2>
              <p className="text-indigo-100/90 text-sm font-medium mt-0.5">Học cách lắp ráp mạch điện qua {LEVELS.length} màn chơi</p>
            </div>
          </div>
          <button 
            onClick={onClose}
            className="p-2.5 hover:bg-white/10 rounded-xl transition-all text-indigo-100 hover:text-white active:scale-95"
          >
            <X size={22} />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6 sm:p-8 bg-slate-50/50 custom-scrollbar">
          
          {/* Easy Section */}
          <div className="mb-10">
            <div className="flex items-center gap-3 mb-5">
              <div className="p-2 bg-emerald-100 rounded-lg text-emerald-600">
                <Zap size={20} fill="currentColor" />
              </div>
              <h3 className="text-xl font-bold text-slate-800">Cơ bản</h3>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
              {easyLevels.map(renderLevelCard)}
            </div>
          </div>

          {/* Medium Section */}
          <div className="mb-10">
            <div className="flex items-center gap-3 mb-5">
              <div className="p-2 bg-amber-100 rounded-lg text-amber-600">
                <Zap size={20} fill="currentColor" />
              </div>
              <h3 className="text-xl font-bold text-slate-800">Trung bình</h3>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
              {mediumLevels.map(renderLevelCard)}
            </div>
          </div>

          {/* Hard Section */}
          <div className="mb-10">
            <div className="flex items-center gap-3 mb-5">
              <div className="p-2 bg-rose-100 rounded-lg text-rose-600">
                <Zap size={20} fill="currentColor" />
              </div>
              <h3 className="text-xl font-bold text-slate-800">Nâng cao</h3>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
              {hardLevels.map(renderLevelCard)}
            </div>
          </div>

        </div>

      </div>
    </div>
  );
}
