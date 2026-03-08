import React, { useState } from 'react';
import { useShallow } from 'zustand/react/shallow';
import { LEVELS, Level } from '../data/levels';
import { useCircuitStore } from '../store';
import { X, PlayCircle, Trophy, Star, Zap, Wrench, PlusCircle, BookOpen, HelpCircle } from 'lucide-react';
import { cn } from '../lib/utils';

interface MinigameModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function MinigameModal({ isOpen, onClose }: MinigameModalProps) {
  const [activeTab, setActiveTab] = useState<'basic' | 'repair' | 'build' | 'quiz' | 'minigame'>('basic');

  const { setCurrentLevelId, loadCircuit, levelProgress } = useCircuitStore(useShallow(state => ({
    setCurrentLevelId: state.setCurrentLevelId,
    loadCircuit: state.loadCircuit,
    levelProgress: state.levelProgress
  })));

  if (!isOpen) return null;

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
    // Lock logic: Basic levels unlock sequentially. Repair/Build levels unlock sequentially within their category.
    // For simplicity, let's just check if previous level in the SAME category is completed.
    const levelCategory = level.category || 'basic';
    const levelsInCategory = LEVELS.filter(l => (l.category || 'basic') === levelCategory).sort((a,b) => a.id - b.id);
    const index = levelsInCategory.findIndex(l => l.id === level.id);
    const prevLevel = index > 0 ? levelsInCategory[index - 1] : null;
    const isLocked = prevLevel ? !levelProgress[prevLevel.id]?.completed : false;

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
            {level.id > 100 ? level.id % 100 : level.id}
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

  const currentLevels = LEVELS.filter(l => (l.category || 'basic') === activeTab);

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
              <p className="text-indigo-100/90 text-sm font-medium mt-0.5">Học cách lắp ráp mạch điện qua các màn chơi</p>
            </div>
          </div>
          <button 
            onClick={onClose}
            className="p-2.5 hover:bg-white/10 rounded-xl transition-all text-indigo-100 hover:text-white active:scale-95"
          >
            <X size={22} />
          </button>
        </div>

        {/* Tabs */}
        <div className="flex border-b border-slate-200 bg-slate-50/50 px-2 sm:px-6 overflow-x-auto hide-scrollbar">
          <button
            onClick={() => setActiveTab('basic')}
            className={cn(
              "flex items-center gap-2 px-4 sm:px-6 py-4 font-bold text-sm transition-all border-b-2 whitespace-nowrap",
              activeTab === 'basic' 
                ? "border-indigo-600 text-indigo-600 bg-indigo-50/50" 
                : "border-transparent text-slate-500 hover:text-slate-700 hover:bg-slate-100"
            )}
          >
            <BookOpen size={18} />
            Cơ bản
          </button>
          <button
            onClick={() => setActiveTab('repair')}
            className={cn(
              "flex items-center gap-2 px-4 sm:px-6 py-4 font-bold text-sm transition-all border-b-2 whitespace-nowrap",
              activeTab === 'repair' 
                ? "border-indigo-600 text-indigo-600 bg-indigo-50/50" 
                : "border-transparent text-slate-500 hover:text-slate-700 hover:bg-slate-100"
            )}
          >
            <Wrench size={18} />
            Sửa mạch
          </button>
          <button
            onClick={() => setActiveTab('build')}
            className={cn(
              "flex items-center gap-2 px-4 sm:px-6 py-4 font-bold text-sm transition-all border-b-2 whitespace-nowrap",
              activeTab === 'build' 
                ? "border-indigo-600 text-indigo-600 bg-indigo-50/50" 
                : "border-transparent text-slate-500 hover:text-slate-700 hover:bg-slate-100"
            )}
          >
            <PlusCircle size={18} />
            Thêm linh kiện
          </button>
          <button
            onClick={() => setActiveTab('quiz')}
            className={cn(
              "flex items-center gap-2 px-4 sm:px-6 py-4 font-bold text-sm transition-all border-b-2 whitespace-nowrap",
              activeTab === 'quiz' 
                ? "border-indigo-600 text-indigo-600 bg-indigo-50/50" 
                : "border-transparent text-slate-500 hover:text-slate-700 hover:bg-slate-100"
            )}
          >
            <HelpCircle size={18} />
            Vấn đáp
          </button>
          <button
            onClick={() => setActiveTab('minigame')}
            className={cn(
              "flex items-center gap-2 px-4 sm:px-6 py-4 font-bold text-sm transition-all border-b-2 whitespace-nowrap",
              activeTab === 'minigame' 
                ? "border-indigo-600 text-indigo-600 bg-indigo-50/50" 
                : "border-transparent text-slate-500 hover:text-slate-700 hover:bg-slate-100"
            )}
          >
            <Zap size={18} />
            Minigame
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6 sm:p-8 bg-slate-50/50 custom-scrollbar">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
            {currentLevels.map(renderLevelCard)}
          </div>
          {currentLevels.length === 0 && (
            <div className="text-center py-20 text-slate-400">
              <p>Chưa có màn chơi nào trong mục này.</p>
            </div>
          )}
        </div>

      </div>
    </div>
  );
}
