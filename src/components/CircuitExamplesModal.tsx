import React, { useState } from 'react';
import { useShallow } from 'zustand/react/shallow';
import { useCircuitStore } from '../store';
import { BASIC_EXAMPLES, COMPLEX_EXAMPLES, CircuitExample } from '../examples';
import { X, FolderOpen, Zap, Cpu } from 'lucide-react';
import { cn } from '../lib/utils';

interface CircuitExamplesModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function CircuitExamplesModal({ isOpen, onClose }: CircuitExamplesModalProps) {
  const [activeTab, setActiveTab] = useState<'basic' | 'complex'>('basic');
  const { loadCircuit } = useCircuitStore(useShallow(state => ({
    loadCircuit: state.loadCircuit
  })));

  if (!isOpen) return null;

  const handleSelectExample = (example: CircuitExample) => {
    loadCircuit(example.create());
    onClose();
  };

  const renderExampleCard = (example: CircuitExample, isComplex: boolean) => (
    <button
      key={example.name}
      onClick={() => handleSelectExample(example)}
      className={cn(
        "bg-white p-5 rounded-2xl border shadow-sm transition-all text-left flex flex-col group duration-300 relative overflow-hidden",
        "hover:shadow-md hover:border-indigo-300/60 hover:-translate-y-1 border-slate-200/60"
      )}
    >
      <div className="flex items-center gap-3 mb-4">
        <div className={cn(
          "w-10 h-10 rounded-xl flex items-center justify-center border shadow-sm",
          isComplex ? "bg-purple-50 text-purple-600 border-purple-100" : "bg-blue-50 text-blue-600 border-blue-100"
        )}>
          {isComplex ? <Cpu size={20} /> : <Zap size={20} />}
        </div>
        <h3 className="font-bold text-slate-800 text-base">{example.name}</h3>
      </div>
      
      <p className="text-xs text-slate-500 line-clamp-3 leading-relaxed font-medium mb-3">
        {example.description}
      </p>

      <div className="mt-auto pt-3 border-t border-slate-100 text-[10px] font-bold text-slate-400 uppercase tracking-wider">
        {isComplex ? 'Phức tạp' : 'Cơ bản'}
      </div>
    </button>
  );

  const examples = activeTab === 'basic' ? BASIC_EXAMPLES : COMPLEX_EXAMPLES;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4 sm:p-6 animate-in fade-in duration-200">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-5xl h-[80vh] flex flex-col overflow-hidden animate-in zoom-in-95 duration-200 border border-slate-200/50">
        
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-slate-100 bg-white shrink-0">
          <div className="flex items-center gap-4">
            <div className="bg-blue-50 p-2.5 rounded-xl border border-blue-100">
              <FolderOpen className="w-7 h-7 text-blue-600" />
            </div>
            <div>
              <h2 className="text-2xl font-black tracking-tight text-slate-800">Mẫu mạch điện</h2>
              <p className="text-slate-500 text-sm font-medium mt-0.5">Chọn một mẫu mạch để bắt đầu</p>
            </div>
          </div>
          <button 
            onClick={onClose}
            className="p-2.5 hover:bg-slate-100 rounded-xl transition-all text-slate-500 hover:text-slate-800 active:scale-95"
          >
            <X size={22} />
          </button>
        </div>

        {/* Tabs */}
        <div className="flex border-b border-slate-200 bg-slate-50/50 px-6">
          <button
            onClick={() => setActiveTab('basic')}
            className={cn(
              "px-6 py-4 font-bold text-sm transition-all border-b-2 whitespace-nowrap",
              activeTab === 'basic' 
                ? "border-blue-600 text-blue-600" 
                : "border-transparent text-slate-500 hover:text-slate-700"
            )}
          >
            Cơ bản
          </button>
          <button
            onClick={() => setActiveTab('complex')}
            className={cn(
              "px-6 py-4 font-bold text-sm transition-all border-b-2 whitespace-nowrap",
              activeTab === 'complex' 
                ? "border-purple-600 text-purple-600" 
                : "border-transparent text-slate-500 hover:text-slate-700"
            )}
          >
            Phức tạp
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6 sm:p-8 bg-slate-50/50 custom-scrollbar">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {examples.map((ex) => renderExampleCard(ex, activeTab === 'complex'))}
          </div>
        </div>

      </div>
    </div>
  );
}
