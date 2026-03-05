import React, { useState, useEffect } from 'react';
import { useShallow } from 'zustand/react/shallow';
import { useCircuitStore } from '../store';
import { LEVELS } from '../data/levels';
import { Trophy, CheckCircle2, XCircle, ArrowRight, X, Star } from 'lucide-react';
import { cn } from '../lib/utils';

export function LevelPanel() {
  const { currentLevelId, setCurrentLevelId, components, wires, nodes, completeLevel, levelProgress } = useCircuitStore(useShallow(state => ({
    currentLevelId: state.currentLevelId,
    setCurrentLevelId: state.setCurrentLevelId,
    components: state.components,
    wires: state.wires,
    nodes: state.nodes,
    completeLevel: state.completeLevel,
    levelProgress: state.levelProgress
  })));
  const [showSuccess, setShowSuccess] = useState(false);

  const currentLevel = LEVELS.find(l => l.id === currentLevelId);

  useEffect(() => {
    if (!currentLevel) {
      setShowSuccess(false);
      return;
    }

    // Check win condition
    const state = useCircuitStore.getState();
    const isWin = currentLevel.checkWin(state);
    
    if (isWin && !showSuccess) {
      setShowSuccess(true);
      const result = state.evaluationResult || { score: 100 };
      const score = Math.round((result.score / 100) * currentLevel.maxScore);
      
      let stars = 0;
      if (score >= currentLevel.maxScore * 0.9) stars = 3;
      else if (score >= currentLevel.maxScore * 0.7) stars = 2;
      else if (score >= currentLevel.maxScore * 0.5) stars = 1;

      completeLevel(currentLevel.id, score, stars);
    }
  }, [components, wires, nodes, currentLevelId]);

  if (!currentLevel) return null;

  const handleNextLevel = () => {
    setShowSuccess(false);
    const nextLevel = LEVELS.find(l => l.id === currentLevel.id + 1);
    if (nextLevel) {
      useCircuitStore.getState().loadCircuit(nextLevel.setup());
      setCurrentLevelId(nextLevel.id);
    } else {
      // Finished all levels
      setCurrentLevelId(null);
    }
  };

  const handleExit = () => {
    setCurrentLevelId(null);
    setShowSuccess(false);
  };

  return (
    <>
      <div className="absolute top-6 left-1/2 -translate-x-1/2 z-40 bg-white/95 backdrop-blur-md rounded-2xl shadow-[0_8px_30px_rgb(0,0,0,0.12)] border border-slate-200/60 w-[calc(100%-2rem)] max-w-[420px] overflow-hidden animate-in slide-in-from-top-4 duration-300">
        <div className="bg-gradient-to-r from-indigo-600 to-violet-600 px-5 py-3.5 flex items-center justify-between text-white shadow-sm">
          <div className="flex items-center gap-2.5 font-bold">
            <div className="bg-white/20 p-1.5 rounded-lg backdrop-blur-sm">
                <Trophy size={18} className="text-yellow-300 drop-shadow-sm" />
            </div>
            <span className="tracking-wide">{currentLevel.title}</span>
          </div>
          <button onClick={handleExit} className="text-white/70 hover:text-white hover:bg-white/10 p-1.5 rounded-lg transition-all active:scale-95">
            <X size={18} />
          </button>
        </div>
        <div className="p-5 bg-slate-50/50">
          <p className="text-sm text-slate-700 leading-relaxed font-medium">
            {currentLevel.description}
          </p>
          {currentLevel.principle && (
            <div className="mt-4 pt-4 border-t border-slate-200">
                <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">Nguyên lý:</p>
                <p className="text-sm text-slate-600 italic">{currentLevel.principle}</p>
            </div>
          )}
        </div>
      </div>

      {showSuccess && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white rounded-[2rem] shadow-2xl p-10 max-w-sm w-full text-center animate-in zoom-in-95 duration-300 border border-slate-100 relative overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-emerald-400 to-teal-500"></div>
            
            <div className="w-24 h-24 bg-emerald-50 rounded-full flex items-center justify-center mx-auto mb-6 shadow-sm border border-emerald-100">
              <CheckCircle2 size={48} className="text-emerald-500 drop-shadow-sm" />
            </div>
            
            <h2 className="text-3xl font-black text-slate-800 mb-2 tracking-tight">Tuyệt vời!</h2>
            <p className="text-slate-500 mb-6 font-medium">Bạn đã hoàn thành thử thách.</p>
            
            <div className="flex justify-center gap-2 mb-8 bg-slate-50 py-4 rounded-xl border border-slate-100">
                {[1, 2, 3].map(i => {
                    const progress = levelProgress[currentLevel.id];
                    const earnedStars = progress?.stars || 0;
                    return (
                      <Star 
                        key={i} 
                        size={32} 
                        className={cn(
                          "drop-shadow-sm animate-in zoom-in duration-500 delay-100",
                          i <= earnedStars ? "fill-yellow-400 text-yellow-400" : "fill-slate-200 text-slate-300"
                        )} 
                      />
                    );
                })}
            </div>
            
            <div className="flex gap-3">
              <button 
                onClick={handleExit}
                className="flex-1 px-5 py-3 border-2 border-slate-200 text-slate-600 rounded-xl hover:bg-slate-50 hover:border-slate-300 font-bold transition-all active:scale-95"
              >
                Thoát
              </button>
              <button 
                onClick={handleNextLevel}
                className="flex-1 px-5 py-3 bg-gradient-to-r from-indigo-600 to-violet-600 text-white rounded-xl hover:from-indigo-700 hover:to-violet-700 font-bold transition-all flex items-center justify-center gap-2 shadow-md hover:shadow-lg active:scale-95"
              >
                Tiếp theo <ArrowRight size={18} />
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
