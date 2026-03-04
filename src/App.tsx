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
import { AlertTriangle, Menu, X } from 'lucide-react';
import { cn } from './lib/utils';

function ShortCircuitWarning() {
  const shortCircuitWarning = useCircuitStore(state => state.shortCircuitWarning);
  if (!shortCircuitWarning) return null;
  return (
    <div className="absolute top-24 left-1/2 -translate-x-1/2 bg-red-500 text-white px-4 py-2 rounded-full shadow-lg flex items-center gap-2 z-50 animate-bounce text-sm md:text-base whitespace-nowrap">
      <AlertTriangle className="w-5 h-5" />
      <span className="font-bold">CẢNH BÁO: NGẮN MẠCH!</span>
    </div>
  );
}

export default function App() {
  const [showWiki, setShowWiki] = useState(false);
  const [showMinigame, setShowMinigame] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isInspectorOpen, setIsInspectorOpen] = useState(false);
  
  const selectedId = useCircuitStore(state => state.selectedId);

  // Auto-open inspector when component selected on desktop
  // On mobile, we might want to show a small indicator or auto-open bottom sheet
  useEffect(() => {
    if (selectedId) {
      setIsInspectorOpen(true);
    }
  }, [selectedId]);

  return (
    <div className="flex flex-col h-screen w-screen bg-slate-100 overflow-hidden font-sans relative">
      <Toolbar 
        onToggleWiki={() => setShowWiki(true)}
        onToggleMinigame={() => setShowMinigame(true)}
        onToggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)}
        onToggleInspector={() => setIsInspectorOpen(!isInspectorOpen)}
      />
      
      <div className="flex flex-1 overflow-hidden relative">
        {/* Sidebar - Responsive */}
        <div className={cn(
          "fixed inset-y-0 left-0 z-40 transform transition-transform duration-300 ease-in-out md:relative md:translate-x-0",
          isSidebarOpen ? "translate-x-0" : "-translate-x-full",
          "md:block h-full shadow-xl md:shadow-none"
        )}>
          <Sidebar onClose={() => setIsSidebarOpen(false)} />
        </div>

        {/* Overlay for mobile sidebar */}
        {isSidebarOpen && (
          <div 
            className="fixed inset-0 bg-black/20 z-30 md:hidden"
            onClick={() => setIsSidebarOpen(false)}
          />
        )}

        {/* Main Canvas Area */}
        <div className="flex-1 relative overflow-hidden flex flex-col">
            <Canvas />
            <ShortCircuitWarning />
            <Oscilloscope />
        </div>

        {/* Inspector - Responsive (Right side on desktop, Slide-over on mobile) */}
        <div className={cn(
          "fixed inset-y-0 right-0 z-40 transform transition-transform duration-300 ease-in-out md:relative md:translate-x-0",
          isInspectorOpen ? "translate-x-0" : "translate-x-full",
          "md:block h-full shadow-xl md:shadow-none bg-white"
        )}>
          <Inspector onClose={() => setIsInspectorOpen(false)} />
        </div>
        
        {/* Overlay for mobile inspector */}
        {isInspectorOpen && (
          <div 
            className="fixed inset-0 bg-black/20 z-30 md:hidden"
            onClick={() => setIsInspectorOpen(false)}
          />
        )}

        <Wiki isOpen={showWiki} onClose={() => setShowWiki(false)} />
        <MinigameModal isOpen={showMinigame} onClose={() => setShowMinigame(false)} />
        <LevelPanel />
        <EvaluationPanel />
      </div>
    </div>
  );
}
