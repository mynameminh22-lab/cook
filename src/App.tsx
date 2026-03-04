/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { Sidebar } from './components/Sidebar';
import { Canvas } from './components/Canvas';
import { Toolbar } from './components/Toolbar';
import { Inspector } from './components/Inspector';
import { Wiki } from './components/Wiki';
import { MinigameModal } from './components/MinigameModal';
import { LevelPanel } from './components/LevelPanel';
import { Oscilloscope } from './components/Oscilloscope';
import { EvaluationPanel } from './components/EvaluationPanel';
import { useCircuitStore } from './store';
import { AlertTriangle, Menu, X, Eye, EyeOff } from 'lucide-react';
import { cn } from './lib/utils';
import { useShallow } from 'zustand/react/shallow';

export default function App() {
  const [showWiki, setShowWiki] = useState(false);
  const [showMinigame, setShowMinigame] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isInspectorOpen, setIsInspectorOpen] = useState(false);
  
  const { selectedId, showUI, setShowUI } = useCircuitStore(useShallow(state => ({
    selectedId: state.selectedId,
    showUI: state.showUI,
    setShowUI: state.setShowUI
  })));

  // Auto-open inspector when component selected on desktop
  useEffect(() => {
    if (selectedId) {
      setIsInspectorOpen(true);
    }
  }, [selectedId]);

  return (
    <div className="flex flex-col h-screen w-screen bg-slate-100 overflow-hidden font-sans relative">
      {/* UI Toggle Button - Always Visible */}
      <button
        onClick={() => setShowUI(!showUI)}
        className={cn(
          "fixed z-[100] p-2 rounded-full shadow-lg transition-all duration-300 hover:scale-110",
          showUI ? "bottom-4 left-4 bg-slate-800/80 text-white hover:bg-slate-900" : "top-4 right-4 bg-blue-600 text-white hover:bg-blue-700 animate-pulse"
        )}
        title={showUI ? "Ẩn giao diện" : "Hiện giao diện"}
      >
        {showUI ? <EyeOff size={20} /> : <Eye size={24} />}
      </button>

      {showUI && (
        <Toolbar 
          onToggleWiki={() => setShowWiki(true)}
          onToggleMinigame={() => setShowMinigame(true)}
          onToggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)}
          onToggleInspector={() => setIsInspectorOpen(!isInspectorOpen)}
        />
      )}
      
      <div className="flex flex-1 overflow-hidden relative">
        {/* Sidebar - Responsive */}
        <div className={cn(
          "fixed inset-y-0 left-0 z-[60] md:z-0 transform transition-transform duration-300 ease-in-out md:relative md:translate-x-0",
          (isSidebarOpen && showUI) ? "translate-x-0" : "-translate-x-full",
          "md:block h-full shadow-xl md:shadow-none",
          !showUI && "hidden md:hidden"
        )}>
          <Sidebar onClose={() => setIsSidebarOpen(false)} />
        </div>

        {/* Overlay for mobile sidebar */}
        {isSidebarOpen && showUI && (
          <div 
            className="fixed inset-0 bg-black/20 z-[55] md:hidden"
            onClick={() => setIsSidebarOpen(false)}
          />
        )}

        {/* Main Canvas Area */}
        <div className="flex-1 relative overflow-hidden flex flex-col">
            <Canvas />
            {showUI && <Oscilloscope />}
        </div>

        {/* Inspector - Responsive */}
        <div className={cn(
          "fixed inset-y-0 right-0 z-[60] md:z-0 transform transition-transform duration-300 ease-in-out md:relative md:translate-x-0",
          (isInspectorOpen && showUI) ? "translate-x-0" : "translate-x-full",
          "md:block h-full shadow-xl md:shadow-none bg-white",
          !showUI && "hidden md:hidden"
        )}>
          <Inspector onClose={() => setIsInspectorOpen(false)} />
        </div>
        
        {/* Overlay for mobile inspector */}
        {isInspectorOpen && showUI && (
          <div 
            className="fixed inset-0 bg-black/20 z-[55] md:hidden"
            onClick={() => setIsInspectorOpen(false)}
          />
        )}

        {showUI && (
          <>
            <Wiki isOpen={showWiki} onClose={() => setShowWiki(false)} />
            <MinigameModal isOpen={showMinigame} onClose={() => setShowMinigame(false)} />
            <LevelPanel />
            <EvaluationPanel />
          </>
        )}
      </div>
    </div>
  );
}
