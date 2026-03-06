import React, { useState } from 'react';
import { useCircuitStore } from '../store';
import { useShallow } from 'zustand/react/shallow';
import { Info, X, ChevronDown, ChevronUp } from 'lucide-react';

export function ExampleInfoPanel() {
  const { currentExample } = useCircuitStore(useShallow(state => ({
    currentExample: state.currentExample
  })));
  
  const [isExpanded, setIsExpanded] = useState(true);
  const [isVisible, setIsVisible] = useState(true);

  // Reset visibility when example changes
  React.useEffect(() => {
    if (currentExample) {
      setIsVisible(true);
      setIsExpanded(true);
    }
  }, [currentExample]);

  if (!currentExample || !isVisible) return null;

  return (
    <div className="absolute top-4 left-1/2 -translate-x-1/2 z-40 w-11/12 max-w-md bg-white rounded-xl shadow-2xl border border-slate-200 overflow-hidden transition-all duration-300">
      <div 
        className="bg-slate-800 text-white p-3 flex items-center justify-between cursor-pointer"
        onClick={() => setIsExpanded(!isExpanded)}
      >
        <div className="flex items-center gap-2">
          <Info size={18} className="text-blue-400" />
          <h3 className="font-semibold text-sm">{currentExample.name}</h3>
        </div>
        <div className="flex items-center gap-1">
          <button className="p-1 hover:bg-slate-700 rounded-md transition-colors">
            {isExpanded ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
          </button>
          <button 
            className="p-1 hover:bg-red-500 rounded-md transition-colors"
            onClick={(e) => {
              e.stopPropagation();
              setIsVisible(false);
            }}
          >
            <X size={16} />
          </button>
        </div>
      </div>
      
      {isExpanded && (
        <div className="p-4 space-y-3 max-h-[60vh] overflow-y-auto custom-scrollbar text-sm">
          {currentExample.description && (
            <div>
              <h4 className="font-medium text-slate-700 mb-1">Mô tả:</h4>
              <p className="text-slate-600 leading-relaxed">{currentExample.description}</p>
            </div>
          )}
          {currentExample.principle && (
            <div>
              <h4 className="font-medium text-slate-700 mb-1">Nguyên lý hoạt động:</h4>
              <p className="text-slate-600 leading-relaxed">{currentExample.principle}</p>
            </div>
          )}
          {currentExample.application && (
            <div>
              <h4 className="font-medium text-slate-700 mb-1">Ứng dụng thực tế:</h4>
              <p className="text-slate-600 leading-relaxed">{currentExample.application}</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
