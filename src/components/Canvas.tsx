import React, { useRef, useState, useEffect } from 'react';
import { useShallow } from 'zustand/react/shallow';
import { useCircuitStore } from '../store';
import { Component, Node } from '../types';
import { cn, getResistorColors, formatValue } from '../lib/utils';
import { AlertTriangle, Flame } from 'lucide-react';

// Simple visual representations for components
const ComponentVisual = React.memo(({ component, isSelected, onToggle }: { component: Component; isSelected: boolean; onToggle?: () => void }) => {
  const { type, rotation, value, isBroken } = component;
  
  // Common styles
  const baseStyle = cn(
    "flex items-center justify-center relative transition-all duration-200 select-none cursor-grab active:cursor-grabbing",
    type !== 'text' && "w-16 h-16 bg-transparent", // Standard size for components
    type === 'text' && "w-auto h-auto border-none bg-transparent", // Text is free-sized
    isSelected && type !== 'text' ? "shadow-[0_0_0_2px_rgba(59,130,246,0.5)] rounded-md" : "",
    isSelected && type === 'text' ? "outline outline-2 outline-blue-500 outline-offset-2" : ""
  );

  const handleClick = (e: React.MouseEvent) => {
    if ((type === 'switch' || type === 'spdt_switch') && onToggle) {
      // Allow click to bubble up to select the component
      onToggle();
    }
  };

  return (
    <div 
      className={baseStyle}
      style={{ transform: `rotate(${rotation}deg)` }}
      onClick={handleClick}
    >
      {/* Broken Indicator */}
      {isBroken && (
        <div className="absolute -top-6 left-1/2 -translate-x-1/2 z-50 animate-bounce drop-shadow-md">
           <Flame className="text-red-500 fill-orange-500 w-6 h-6" />
        </div>
      )}

      {/* Internal Symbol Drawing */}
      {type === 'push_button' && (
        <svg width="64" height="64" viewBox="0 0 64 64" className="w-full h-full">
          <line x1="0" y1="32" x2="20" y2="32" stroke="#1e293b" strokeWidth="2" />
          <line x1="44" y1="32" x2="64" y2="32" stroke="#1e293b" strokeWidth="2" />
          <circle cx="20" cy="32" r="3" fill="#1e293b" />
          <circle cx="44" cy="32" r="3" fill="#1e293b" />
          <line x1="20" y1={component.isOpen ? 20 : 32} x2="44" y2={component.isOpen ? 20 : 32} stroke="#1e293b" strokeWidth="2" className="transition-all duration-100" />
          <line x1="32" y1={component.isOpen ? 8 : 20} x2="32" y2={component.isOpen ? 20 : 32} stroke="#1e293b" strokeWidth="2" className="transition-all duration-100" />
        </svg>
      )}
      {type === 'spdt_switch' && (
        <svg width="64" height="64" viewBox="0 0 64 64" className="w-full h-full">
          <line x1="0" y1="32" x2="20" y2="32" stroke="#1e293b" strokeWidth="2" />
          <line x1="44" y1="16" x2="64" y2="16" stroke="#1e293b" strokeWidth="2" />
          <line x1="44" y1="48" x2="64" y2="48" stroke="#1e293b" strokeWidth="2" />
          <circle cx="20" cy="32" r="3" fill="#1e293b" />
          <circle cx="44" cy="16" r="3" fill="#1e293b" />
          <circle cx="44" cy="48" r="3" fill="#1e293b" />
          <line x1="20" y1="32" x2="42" y2={component.isOpen ? 46 : 18} stroke="#1e293b" strokeWidth="2" className="transition-all duration-200" />
        </svg>
      )}
      {type === 'ground' && (
        <svg width="64" height="64" viewBox="0 0 64 64" className="w-full h-full">
          <line x1="32" y1="0" x2="32" y2="32" stroke="#1e293b" strokeWidth="2" />
          <line x1="16" y1="32" x2="48" y2="32" stroke="#1e293b" strokeWidth="2" />
          <line x1="22" y1="40" x2="42" y2="40" stroke="#1e293b" strokeWidth="2" />
          <line x1="28" y1="48" x2="36" y2="48" stroke="#1e293b" strokeWidth="2" />
        </svg>
      )}
      {type === 'capacitor' && (
        <svg width="64" height="64" viewBox="0 0 64 64" className="w-full h-full">
          <line x1="0" y1="32" x2="28" y2="32" stroke="#1e293b" strokeWidth="2" />
          <line x1="36" y1="32" x2="64" y2="32" stroke="#1e293b" strokeWidth="2" />
          <line x1="28" y1="16" x2="28" y2="48" stroke="#1e293b" strokeWidth="3" />
          <line x1="36" y1="16" x2="36" y2="48" stroke="#1e293b" strokeWidth="3" />
        </svg>
      )}
      {type === 'inductor' && (
        <svg width="64" height="64" viewBox="0 0 64 64" className="w-full h-full">
          <line x1="0" y1="32" x2="12" y2="32" stroke="#1e293b" strokeWidth="2" />
          <line x1="52" y1="32" x2="64" y2="32" stroke="#1e293b" strokeWidth="2" />
          <path d="M 12 32 A 5 5 0 1 1 22 32 A 5 5 0 1 1 32 32 A 5 5 0 1 1 42 32 A 5 5 0 1 1 52 32" fill="none" stroke="#1e293b" strokeWidth="2" />
        </svg>
      )}
      {type === 'diode' && (
        <svg width="64" height="64" viewBox="0 0 64 64" className="w-full h-full">
          <line x1="0" y1="32" x2="20" y2="32" stroke="#1e293b" strokeWidth="2" />
          <line x1="44" y1="32" x2="64" y2="32" stroke="#1e293b" strokeWidth="2" />
          <polygon points="20,16 44,32 20,48" fill="#1e293b" />
          <line x1="44" y1="16" x2="44" y2="48" stroke="#1e293b" strokeWidth="3" />
        </svg>
      )}
      {type === 'ac_source' && (
        <svg width="64" height="64" viewBox="0 0 64 64" className="w-full h-full">
          <line x1="0" y1="32" x2="16" y2="32" stroke="#1e293b" strokeWidth="2" />
          <line x1="48" y1="32" x2="64" y2="32" stroke="#1e293b" strokeWidth="2" />
          <circle cx="32" cy="32" r="16" fill="white" stroke="#1e293b" strokeWidth="2" />
          <path d="M 22 32 Q 27 22 32 32 T 42 32" fill="none" stroke="#1e293b" strokeWidth="2" />
        </svg>
      )}
      {type === 'battery' && (
        <svg width="64" height="64" viewBox="0 0 64 64" className="w-full h-full">
          <line x1="32" y1="0" x2="32" y2="16" stroke="#1e293b" strokeWidth="2" />
          <line x1="32" y1="48" x2="32" y2="64" stroke="#1e293b" strokeWidth="2" />
          <rect x="20" y="16" width="24" height="32" rx="2" fill="#334155" />
          <rect x="20" y="16" width="24" height="6" fill="#ef4444" />
          <text x="32" y="12" fontSize="10" fill="#ef4444" textAnchor="middle" fontWeight="bold">+</text>
          <text x="32" y="58" fontSize="10" fill="#1e293b" textAnchor="middle" fontWeight="bold">-</text>
        </svg>
      )}
      {type === 'resistor' && (
        <svg width="64" height="64" viewBox="0 0 64 64" className="w-full h-full">
          <line x1="0" y1="32" x2="16" y2="32" stroke="#1e293b" strokeWidth="2" />
          <line x1="48" y1="32" x2="64" y2="32" stroke="#1e293b" strokeWidth="2" />
          <rect x="16" y="24" width="32" height="16" rx="4" fill="#e2e8f0" stroke="#1e293b" strokeWidth="2" />
          <rect x="20" y="24" width="4" height="16" fill={getResistorColors(value)[0] || '#000'} />
          <rect x="28" y="24" width="4" height="16" fill={getResistorColors(value)[1] || '#000'} />
          <rect x="36" y="24" width="4" height="16" fill={getResistorColors(value)[2] || '#000'} />
          <rect x="44" y="24" width="2" height="16" fill="#d4af37" />
        </svg>
      )}
      {type === 'lamp' && (
        <svg width="64" height="64" viewBox="0 0 64 64" className="w-full h-full overflow-visible">
          <line x1="0" y1="32" x2="16" y2="32" stroke="#1e293b" strokeWidth="2" />
          <line x1="48" y1="32" x2="64" y2="32" stroke="#1e293b" strokeWidth="2" />
          <circle cx="32" cy="32" r="16" fill={Math.abs(component.current) > 0.01 ? '#fef08a' : '#f1f5f9'} stroke="#1e293b" strokeWidth="2" />
          <path d="M 24 24 L 40 40 M 24 40 L 40 24" stroke="#1e293b" strokeWidth="2" />
          {Math.abs(component.current) > 0.01 && (
            <circle cx="32" cy="32" r="24" fill="#facc15" opacity="0.4" filter="blur(8px)" />
          )}
        </svg>
      )}
      {type === 'switch' && (
        <svg width="64" height="64" viewBox="0 0 64 64" className="w-full h-full">
          <line x1="0" y1="32" x2="20" y2="32" stroke="#1e293b" strokeWidth="2" />
          <line x1="44" y1="32" x2="64" y2="32" stroke="#1e293b" strokeWidth="2" />
          <circle cx="20" cy="32" r="3" fill="#1e293b" />
          <circle cx="44" cy="32" r="3" fill="#1e293b" />
          <line x1="20" y1="32" x2="42" y2={component.isOpen ? 16 : 32} stroke="#1e293b" strokeWidth="2" className="transition-all duration-200" />
        </svg>
      )}
      {type === 'voltmeter' && (
        <svg width="64" height="64" viewBox="0 0 64 64" className="w-full h-full">
          <line x1="0" y1="32" x2="16" y2="32" stroke="#1e293b" strokeWidth="2" />
          <line x1="48" y1="32" x2="64" y2="32" stroke="#1e293b" strokeWidth="2" />
          <circle cx="32" cy="32" r="16" fill="white" stroke="#1e293b" strokeWidth="2" />
          <text x="32" y="36" fontSize="12" fill="#1e293b" textAnchor="middle" fontWeight="bold">V</text>
          <text x="32" y="46" fontSize="8" fill="#3b82f6" textAnchor="middle" fontWeight="bold">{Math.abs(component.voltageDrop).toFixed(1)}V</text>
        </svg>
      )}
      {type === 'ammeter' && (
        <svg width="64" height="64" viewBox="0 0 64 64" className="w-full h-full">
          <line x1="0" y1="32" x2="16" y2="32" stroke="#1e293b" strokeWidth="2" />
          <line x1="48" y1="32" x2="64" y2="32" stroke="#1e293b" strokeWidth="2" />
          <circle cx="32" cy="32" r="16" fill="white" stroke="#1e293b" strokeWidth="2" />
          <text x="32" y="36" fontSize="12" fill="#1e293b" textAnchor="middle" fontWeight="bold">A</text>
          <text x="32" y="46" fontSize="8" fill="#3b82f6" textAnchor="middle" fontWeight="bold">{Math.abs(component.current).toFixed(2)}A</text>
        </svg>
      )}
      
      {type === 'potentiometer' && (
        <svg width="64" height="64" viewBox="0 0 64 64" className="w-full h-full">
          <line x1="0" y1="32" x2="16" y2="32" stroke="#1e293b" strokeWidth="2" />
          <line x1="48" y1="32" x2="64" y2="32" stroke="#1e293b" strokeWidth="2" />
          <rect x="16" y="24" width="32" height="16" rx="2" fill="white" stroke="#1e293b" strokeWidth="2" />
          <line x1="32" y1="0" x2="32" y2="20" stroke="#1e293b" strokeWidth="2" />
          <polygon points="32,24 28,18 36,18" fill="#1e293b" />
        </svg>
      )}
      {type === 'fuse' && (
        <svg width="64" height="64" viewBox="0 0 64 64" className="w-full h-full">
          <line x1="0" y1="32" x2="16" y2="32" stroke="#1e293b" strokeWidth="2" />
          <line x1="48" y1="32" x2="64" y2="32" stroke="#1e293b" strokeWidth="2" />
          <rect x="16" y="24" width="32" height="16" rx="2" fill="white" stroke={component.isBroken ? "#ef4444" : "#1e293b"} strokeWidth="2" />
          {!component.isBroken ? (
            <line x1="16" y1="32" x2="48" y2="32" stroke="#1e293b" strokeWidth="2" />
          ) : (
            <>
              <line x1="16" y1="32" x2="28" y2="32" stroke="#1e293b" strokeWidth="2" />
              <line x1="36" y1="32" x2="48" y2="32" stroke="#1e293b" strokeWidth="2" />
              <path d="M 28 30 L 32 34 M 32 30 L 28 34" stroke="#ef4444" strokeWidth="2" />
            </>
          )}
        </svg>
      )}
      {type === 'led' && (
        <svg width="64" height="64" viewBox="0 0 64 64" className="w-full h-full overflow-visible">
          <line x1="0" y1="32" x2="20" y2="32" stroke="#1e293b" strokeWidth="2" />
          <line x1="44" y1="32" x2="64" y2="32" stroke="#1e293b" strokeWidth="2" />
          <polygon points="20,16 44,32 20,48" fill={Math.abs(component.current) > 0.001 ? (component.color || '#ef4444') : '#1e293b'} />
          <line x1="44" y1="16" x2="44" y2="48" stroke={Math.abs(component.current) > 0.001 ? (component.color || '#ef4444') : '#1e293b'} strokeWidth="3" />
          {/* Arrows */}
          <line x1="30" y1="14" x2="40" y2="4" stroke="#1e293b" strokeWidth="2" />
          <polygon points="40,4 34,4 40,10" fill="#1e293b" />
          <line x1="40" y1="20" x2="50" y2="10" stroke="#1e293b" strokeWidth="2" />
          <polygon points="50,10 44,10 50,16" fill="#1e293b" />
          {Math.abs(component.current) > 0.001 && (
            <circle cx="32" cy="32" r="24" fill={component.color || '#ef4444'} opacity="0.3" filter="blur(4px)" />
          )}
        </svg>
      )}
      {type === 'text' && (
        <div className="whitespace-nowrap font-sans text-slate-800 font-medium select-none pointer-events-none">
           {component.text || 'Text'}
        </div>
      )}

      {type === 'npn_transistor' && (
        <svg width="64" height="64" viewBox="0 0 64 64" className="w-full h-full">
          <circle cx="36" cy="32" r="20" fill="white" stroke="#1e293b" strokeWidth="1" />
          <line x1="0" y1="32" x2="24" y2="32" stroke="#1e293b" strokeWidth="2" />
          <line x1="24" y1="16" x2="24" y2="48" stroke="#1e293b" strokeWidth="3" />
          <line x1="24" y1="24" x2="52" y2="12" stroke="#1e293b" strokeWidth="2" />
          <line x1="52" y1="12" x2="64" y2="12" stroke="#1e293b" strokeWidth="2" />
          <line x1="24" y1="40" x2="52" y2="52" stroke="#1e293b" strokeWidth="2" />
          <line x1="52" y1="52" x2="64" y2="52" stroke="#1e293b" strokeWidth="2" />
          <polygon points="48,50 40,42 38,48" fill="#1e293b" />
        </svg>
      )}

      {type === 'pnp_transistor' && (
        <svg width="64" height="64" viewBox="0 0 64 64" className="w-full h-full">
          <circle cx="36" cy="32" r="20" fill="white" stroke="#1e293b" strokeWidth="1" />
          <line x1="0" y1="32" x2="24" y2="32" stroke="#1e293b" strokeWidth="2" />
          <line x1="24" y1="16" x2="24" y2="48" stroke="#1e293b" strokeWidth="3" />
          <line x1="24" y1="24" x2="52" y2="12" stroke="#1e293b" strokeWidth="2" />
          <line x1="52" y1="12" x2="64" y2="12" stroke="#1e293b" strokeWidth="2" />
          <line x1="24" y1="40" x2="52" y2="52" stroke="#1e293b" strokeWidth="2" />
          <line x1="52" y1="52" x2="64" y2="52" stroke="#1e293b" strokeWidth="2" />
          <polygon points="30,42 38,38 32,48" fill="#1e293b" />
        </svg>
      )}

      {type === 'opamp' && (
        <svg width="64" height="64" viewBox="0 0 64 64" className="w-full h-full">
          <polygon points="16,12 16,52 56,32" fill="white" stroke="#1e293b" strokeWidth="2" />
          <line x1="0" y1="20" x2="16" y2="20" stroke="#1e293b" strokeWidth="2" />
          <line x1="0" y1="44" x2="16" y2="44" stroke="#1e293b" strokeWidth="2" />
          <line x1="56" y1="32" x2="64" y2="32" stroke="#1e293b" strokeWidth="2" />
          <text x="20" y="24" fontSize="10" fill="#1e293b" fontWeight="bold">-</text>
          <text x="20" y="48" fontSize="10" fill="#1e293b" fontWeight="bold">+</text>
        </svg>
      )}
      
      {/* Value Label */}
      <div className="absolute -bottom-6 text-[10px] whitespace-nowrap bg-white px-1 rounded border border-slate-200 z-30 pointer-events-none shadow-sm transition-opacity duration-200 opacity-0 group-hover:opacity-100">
        {type !== 'voltmeter' && type !== 'ammeter' && type !== 'text' && (
          <>
            {formatValue(component.value, type === 'resistor' || type === 'potentiometer' ? 'Ω' : type === 'battery' ? 'V' : '')}
          </>
        )}
        {Math.abs(component.current) > 0.0001 ? (
           <span className="ml-1 text-blue-600 font-mono">
             {formatValue(component.current, 'A')}
           </span>
        ) : null}
      </div>
    </div>
  );
});

export function Canvas() {
  const containerRef = useRef<HTMLDivElement>(null);
  const { 
    components, 
    nodes, 
    wires, 
    addComponent, 
    moveComponent, 
    connectNodes,
    removeComponent,
    removeWire,
    simulationRunning,
    selectedId,
    setSelectedId,
    selectedWireIndex,
    setSelectedWireIndex,
    toggleSwitch,
    updateComponent,
    scale,
    offset,
    setScale,
    setOffset,
    wireMode,
    snapToGrid,
    shortCircuitWarning
  } = useCircuitStore(useShallow(state => ({
    components: state.components,
    nodes: state.nodes,
    wires: state.wires,
    addComponent: state.addComponent,
    moveComponent: state.moveComponent,
    connectNodes: state.connectNodes,
    removeComponent: state.removeComponent,
    removeWire: state.removeWire,
    simulationRunning: state.simulationRunning,
    selectedId: state.selectedId,
    setSelectedId: state.setSelectedId,
    selectedWireIndex: state.selectedWireIndex,
    setSelectedWireIndex: state.setSelectedWireIndex,
    toggleSwitch: state.toggleSwitch,
    updateComponent: state.updateComponent,
    scale: state.scale,
    offset: state.offset,
    setScale: state.setScale,
    setOffset: state.setOffset,
    wireMode: state.wireMode,
    snapToGrid: state.snapToGrid,
    shortCircuitWarning: state.shortCircuitWarning
  })));

  const [draggingId, setDraggingId] = useState<string | null>(null);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
  const [wiringStartNode, setWiringStartNode] = useState<string | null>(null);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [isPanning, setIsPanning] = useState(false);
  const [panStart, setPanStart] = useState({ x: 0, y: 0 });
  const [hasPanned, setHasPanned] = useState(false);
  const [lastTouchDistance, setLastTouchDistance] = useState<number | null>(null);
  const [hoveredWireIndex, setHoveredWireIndex] = useState<number | null>(null);
  const [tooltipPos, setTooltipPos] = useState({ x: 0, y: 0 });
  
  // Ref to track if we are interacting with a component (drag or click)
  // to prevent container click from deselecting immediately
  const isInteractingWithComponent = useRef(false);

  // Animation Loop
  useEffect(() => {
    let animationFrameId: number;
    let lastTime = performance.now();
    
    const animate = (currentTime: number) => {
      const dt = (currentTime - lastTime) / 1000; // in seconds
      lastTime = currentTime;

      if (simulationRunning) {
        useCircuitStore.getState().stepSimulation(dt);
      }
      animationFrameId = requestAnimationFrame(animate);
    };
    
    animationFrameId = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(animationFrameId);
  }, [simulationRunning]);

  // Grid background
  const gridSize = 20;

  // Helper for wire routing based on mode
  const getWirePath = (x1: number, y1: number, x2: number, y2: number) => {
    if (wireMode === 'straight') {
      return `M ${x1} ${y1} L ${x2} ${y2}`;
    } else if (wireMode === 'curved') {
      const dx = Math.abs(x2 - x1);
      const dy = Math.abs(y2 - y1);
      const controlDist = Math.max(dx, dy) * 0.5;
      const cp1x = x1 + (x2 > x1 ? controlDist : -controlDist) * 0.5;
      const cp1y = y1;
      const cp2x = x2 - (x2 > x1 ? controlDist : -controlDist) * 0.5;
      const cp2y = y2;
      return `M ${x1} ${y1} C ${x1 + (x2-x1)/2} ${y1}, ${x1 + (x2-x1)/2} ${y2}, ${x2} ${y2}`;
    } else {
      if (Math.abs(x1 - x2) > Math.abs(y1 - y2)) {
        return `M ${x1} ${y1} L ${x2} ${y1} L ${x2} ${y2}`; 
      } else {
        return `M ${x1} ${y1} L ${x1} ${y2} L ${x2} ${y2}`; 
      }
    }
  };

  const handleWheel = (e: React.WheelEvent) => {
    e.preventDefault();
    if (e.ctrlKey || e.metaKey) {
      // Zoom
      const zoomSensitivity = 0.001;
      const delta = -e.deltaY * zoomSensitivity;
      const newScale = Math.min(Math.max(scale + delta, 0.1), 5);
      
      // Zoom towards mouse pointer
      if (containerRef.current) {
        const rect = containerRef.current.getBoundingClientRect();
        const mouseX = e.clientX - rect.left;
        const mouseY = e.clientY - rect.top;
        
        const worldX = (mouseX - offset.x) / scale;
        const worldY = (mouseY - offset.y) / scale;
        
        const newOffsetX = mouseX - worldX * newScale;
        const newOffsetY = mouseY - worldY * newScale;
        
        setScale(newScale);
        setOffset({ x: newOffsetX, y: newOffsetY });
      }
    } else {
      // Pan
      setOffset({ x: offset.x - e.deltaX, y: offset.y - e.deltaY });
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    const type = e.dataTransfer.getData('componentType') as any;
    if (!type) return;

    const rect = containerRef.current?.getBoundingClientRect();
    if (!rect) return;

    const clientX = e.clientX - rect.left;
    const clientY = e.clientY - rect.top;
    
    const worldX = (clientX - offset.x) / scale;
    const worldY = (clientY - offset.y) / scale;

    const x = snapToGrid ? Math.round(worldX / gridSize) * gridSize : worldX;
    const y = snapToGrid ? Math.round(worldY / gridSize) * gridSize : worldY;

    addComponent(type, { x, y });
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'copy';
  };

  const startDrag = (e: React.MouseEvent | React.TouchEvent, id: string, pos: { x: number, y: number }, clientPos?: { x: number, y: number }) => {
    e.stopPropagation();
    isInteractingWithComponent.current = true;
    // e.preventDefault(); // Don't prevent default here, it might block scrolling/other gestures if not careful. 
    // But for drag, we usually want to prevent default.
    
    // Check if it's a mouse event and middle/right click
    if ('button' in e && (e.button === 1 || (e.button === 0 && e.shiftKey))) {
        return; 
    }

    useCircuitStore.getState().saveCheckpoint(); 
    setSelectedId(id);
    setDraggingId(id);
    
    if (containerRef.current) {
        const rect = containerRef.current.getBoundingClientRect();
        
        const cx = clientPos ? clientPos.x : ('clientX' in e ? e.clientX : 0);
        const cy = clientPos ? clientPos.y : ('clientY' in e ? e.clientY : 0);

        const mouseX = (cx - rect.left - offset.x) / scale;
        const mouseY = (cy - rect.top - offset.y) / scale;
        
        setDragOffset({
            x: mouseX - pos.x,
            y: mouseY - pos.y
        });
    }
  };

  // Handle dragging movement globally (Mouse & Touch)
  useEffect(() => {
    if (!draggingId) return;

    const handleMove = (clientX: number, clientY: number) => {
      if (!containerRef.current) return;
      const rect = containerRef.current.getBoundingClientRect();
      
      const mouseX = (clientX - rect.left - offset.x) / scale;
      const mouseY = (clientY - rect.top - offset.y) / scale;

      const rawX = mouseX - dragOffset.x;
      const rawY = mouseY - dragOffset.y;

      const newX = snapToGrid ? Math.round(rawX / gridSize) * gridSize : rawX;
      const newY = snapToGrid ? Math.round(rawY / gridSize) * gridSize : rawY;
      
      moveComponent(draggingId, { x: newX, y: newY });
    };

    const handleWindowMouseMove = (e: MouseEvent) => {
      handleMove(e.clientX, e.clientY);
    };
    
    const handleWindowTouchMove = (e: TouchEvent) => {
      e.preventDefault(); // Prevent scrolling while dragging component
      const touch = e.touches[0];
      handleMove(touch.clientX, touch.clientY);
    };

    const handleWindowUp = () => {
      setDraggingId(null);
      // Reset interaction flag after a short delay to allow click events to process
      setTimeout(() => {
          isInteractingWithComponent.current = false;
      }, 100);
    };

    window.addEventListener('mousemove', handleWindowMouseMove);
    window.addEventListener('mouseup', handleWindowUp);
    window.addEventListener('touchmove', handleWindowTouchMove, { passive: false });
    window.addEventListener('touchend', handleWindowUp);

    return () => {
      window.removeEventListener('mousemove', handleWindowMouseMove);
      window.removeEventListener('mouseup', handleWindowUp);
      window.removeEventListener('touchmove', handleWindowTouchMove);
      window.removeEventListener('touchend', handleWindowUp);
    };
  }, [draggingId, dragOffset, moveComponent, gridSize, scale, offset]);

  const handleMouseDown = (e: React.MouseEvent) => {
    // Middle click, Shift+Click, or Left Click on background (if not dragging component)
    // Note: Component mousedown stops propagation, so if we reach here, we are on background.
    if (e.button === 1 || (e.button === 0 && e.shiftKey) || e.button === 0) {
      e.preventDefault();
      setIsPanning(true);
      setHasPanned(false);
      setPanStart({ x: e.clientX, y: e.clientY });
    }
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (isPanning) {
      const dx = e.clientX - panStart.x;
      const dy = e.clientY - panStart.y;
      
      if (Math.abs(dx) > 2 || Math.abs(dy) > 2) {
          setHasPanned(true);
      }

      setOffset({ x: offset.x + dx, y: offset.y + dy });
      setPanStart({ x: e.clientX, y: e.clientY });
      return;
    }

    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = (e.clientX - rect.left - offset.x) / scale;
    const y = (e.clientY - rect.top - offset.y) / scale;
    setMousePos({ x, y });
  };

  const handleMouseUp = () => {
    setIsPanning(false);
  };

  // Touch Handlers for Canvas (Pan & Zoom)
  const getTouchDistance = (t1: React.Touch, t2: React.Touch) => {
    const dx = t1.clientX - t2.clientX;
    const dy = t1.clientY - t2.clientY;
    return Math.sqrt(dx * dx + dy * dy);
  };

  const handleTouchStart = (e: React.TouchEvent) => {
    if (e.touches.length === 2) {
      // Pinch Start
      const d = getTouchDistance(e.touches[0], e.touches[1]);
      setLastTouchDistance(d);
    } else if (e.touches.length === 1) {
      // Pan Start (if not dragging component)
      if (!draggingId) {
        const touch = e.touches[0];
        setPanStart({ x: touch.clientX, y: touch.clientY });
        setIsPanning(true);
      }
    }
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (draggingId) return; // Handled by global listener

    if (e.touches.length === 2) {
      // Pinch Zoom
      e.preventDefault(); // Prevent browser zoom
      const d = getTouchDistance(e.touches[0], e.touches[1]);
      if (lastTouchDistance && containerRef.current) {
        const delta = d - lastTouchDistance;
        const zoomSensitivity = 0.005;
        const newScale = Math.min(Math.max(scale + delta * zoomSensitivity, 0.1), 5);
        
        // Zoom towards center of pinch
        const centerClientX = (e.touches[0].clientX + e.touches[1].clientX) / 2;
        const centerClientY = (e.touches[0].clientY + e.touches[1].clientY) / 2;
        
        const rect = containerRef.current.getBoundingClientRect();
        const mouseX = centerClientX - rect.left;
        const mouseY = centerClientY - rect.top;
        
        const worldX = (mouseX - offset.x) / scale;
        const worldY = (mouseY - offset.y) / scale;
        
        const newOffsetX = mouseX - worldX * newScale;
        const newOffsetY = mouseY - worldY * newScale;
        
        setScale(newScale);
        setOffset({ x: newOffsetX, y: newOffsetY });
        setLastTouchDistance(d);
      }
    } else if (e.touches.length === 1 && isPanning) {
      // Pan
      e.preventDefault(); // Prevent browser scroll
      const touch = e.touches[0];
      const dx = touch.clientX - panStart.x;
      const dy = touch.clientY - panStart.y;
      setOffset({ x: offset.x + dx, y: offset.y + dy });
      setPanStart({ x: touch.clientX, y: touch.clientY });
    }
  };

  const handleTouchEnd = () => {
    setIsPanning(false);
    setLastTouchDistance(null);
  };

  const handleNodeClick = (e: React.MouseEvent | React.TouchEvent, nodeId: string) => {
    e.stopPropagation();
    // Prevent double firing if both events exist?
    // React usually handles this, but let's be safe.
    
    if (wiringStartNode === null) {
      setWiringStartNode(nodeId);
    } else {
      if (wiringStartNode !== nodeId) {
        connectNodes(wiringStartNode, nodeId);
      }
      setWiringStartNode(null);
    }
  };

  // Delete on Backspace
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.key === 'Backspace' || e.key === 'Delete')) {
        if (selectedId) {
          removeComponent(selectedId);
          setSelectedId(null);
        } else if (selectedWireIndex !== null) {
          removeWire(selectedWireIndex);
          setSelectedWireIndex(null);
        }
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [selectedId, selectedWireIndex, removeComponent, removeWire]);

  return (
    <div 
      ref={containerRef}
      className="flex-1 bg-slate-50 relative overflow-hidden cursor-crosshair touch-none select-none"
      onDrop={handleDrop}
      onDragOver={handleDragOver}
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseUp}
      onWheel={handleWheel}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
      onContextMenu={(e) => {
        e.preventDefault();
        setSelectedId(null);
        setSelectedWireIndex(null);
        setWiringStartNode(null);
      }}
      onClick={() => {
        if (!isPanning && !isInteractingWithComponent.current && !hasPanned) {
            setSelectedId(null);
            setSelectedWireIndex(null);
            setWiringStartNode(null);
        }
      }}
      style={{
        backgroundPosition: `${offset.x}px ${offset.y}px`,
        backgroundImage: 'radial-gradient(#94a3b8 1px, transparent 1px)',
        backgroundSize: `${gridSize * scale}px ${gridSize * scale}px`
      }}
    >
      <div style={{ transform: `translate(${offset.x}px, ${offset.y}px) scale(${scale})`, transformOrigin: '0 0', width: '100%', height: '100%' }}>
      {/* Wires Layer (SVG) */}
      <svg className="absolute inset-0 overflow-visible z-0" style={{ width: '100%', height: '100%' }}>
        <defs>
          <filter id="wire-glow" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur stdDeviation="2" result="blur" />
            <feComposite in="SourceGraphic" in2="blur" operator="over" />
          </filter>
        </defs>
        {wires.map((wire, idx) => {
          const startNode = nodes.find(n => n.id === wire.from);
          const endNode = nodes.find(n => n.id === wire.to);
          if (!startNode || !endNode) return null;

          // Calculate electron flow animation
          const current = wire.current || 0;
          const isFlowing = Math.abs(current) > 1e-6;
          const isSelected = selectedWireIndex === idx;
          
          // Voltage Visualization
          const vStart = startNode.voltage || 0;
          const vEnd = endNode.voltage || 0;
          const avgVoltage = (vStart + vEnd) / 2;
          
          // Color based on voltage (Red = High/Positive, Blue = Low/Negative/Ground)
          const getVoltageColor = (v: number) => {
            if (Math.abs(v) < 0.1) return "#3b82f6"; // Blue (Ground/Low)
            if (v > 0) return "#ef4444"; // Red (Positive)
            return "#3b82f6"; // Blue (Negative)
          };

          const wireColor = isSelected ? "#3b82f6" : getVoltageColor(avgVoltage);

          // Animation speed based on current
          const speed = Math.max(0.1, Math.min(10, Math.abs(current) * 5)); 
          const duration = 1 / speed;
          const direction = current > 0 ? 'normal' : 'reverse';
          
          const pathD = getWirePath(startNode.position.x, startNode.position.y, endNode.position.x, endNode.position.y);

          return (
            <g 
              key={idx} 
              onClick={(e) => {
                e.stopPropagation();
                setSelectedWireIndex(idx);
                setSelectedId(null);
              }}
              onMouseEnter={(e) => {
                setHoveredWireIndex(idx);
                setTooltipPos({ x: e.clientX, y: e.clientY });
              }}
              onMouseMove={(e) => {
                setTooltipPos({ x: e.clientX, y: e.clientY });
              }}
              onMouseLeave={() => {
                setHoveredWireIndex(null);
              }}
              className="cursor-pointer hover:opacity-80"
            >
              {/* Invisible wide stroke for easier clicking */}
              <path
                d={pathD}
                stroke="transparent"
                strokeWidth="12"
                fill="none"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              {/* Visible wire */}
              <path
                d={pathD}
                stroke={wireColor}
                strokeWidth={isSelected ? "4" : "3"}
                fill="none"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="transition-colors duration-300"
              />
              {/* Electron dots */}
              {isFlowing && simulationRunning && (
                <>
                  {/* Glow effect for high current */}
                  <path
                    d={pathD}
                    stroke="#fbbf24"
                    strokeWidth="6"
                    strokeOpacity="0.3"
                    fill="none"
                    filter="url(#wire-glow)"
                    className="pointer-events-none"
                  />
                  <path
                    d={pathD}
                    stroke="#fbbf24" // Electron color (yellow)
                    strokeWidth="4"
                    fill="none"
                    strokeDasharray="4 16" // Dot size 4, gap 16
                    style={{
                      animation: `wire-flow ${duration}s linear infinite ${direction}`
                    }}
                    className="opacity-80"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </>
              )}
            </g>
          );
        })}
        {/* Active wiring line */}
        {wiringStartNode && (() => {
          const startNode = nodes.find(n => n.id === wiringStartNode);
          if (!startNode) return null;
          const pathD = getWirePath(startNode.position.x, startNode.position.y, mousePos.x, mousePos.y);
          return (
            <path
              d={pathD}
              stroke="#94a3b8"
              strokeWidth="2"
              fill="none"
              strokeDasharray="5,5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          );
        })()}
      </svg>

      {/* Short Circuit Warning */}
      {shortCircuitWarning && (
        <div className="absolute top-24 left-1/2 -translate-x-1/2 z-50 bg-red-600 text-white px-6 py-3 rounded-full shadow-xl flex items-center gap-3 animate-pulse border-2 border-red-400">
          <AlertTriangle size={24} className="text-yellow-300 fill-current" />
          <span className="font-bold text-lg tracking-wide uppercase">Cảnh báo: Ngắn mạch!</span>
        </div>
      )}

      {/* Components Layer */}
      {components.map((comp) => (
        <div
          key={comp.id}
          className="absolute z-10 group"
          style={{
            left: comp.position.x,
            top: comp.position.y,
            transform: 'translate(-50%, -50%)' // Center anchor
          }}
          onMouseDown={(e) => {
            if (comp.type === 'push_button' && !e.ctrlKey && !e.metaKey) {
              e.stopPropagation();
              // Momentary switch logic: Press = Close (isOpen: false)
              useCircuitStore.getState().updateComponent(comp.id, { isOpen: false });
              
              const handleMouseUp = () => {
                // Release = Open (isOpen: true)
                useCircuitStore.getState().updateComponent(comp.id, { isOpen: true });
                window.removeEventListener('mouseup', handleMouseUp);
              };
              window.addEventListener('mouseup', handleMouseUp);
            } else {
              startDrag(e, comp.id, comp.position);
            }
          }}
          onTouchStart={(e) => {
             // Prevent panning when dragging component
             const touch = e.touches[0];
             startDrag(e, comp.id, comp.position, { x: touch.clientX, y: touch.clientY });
          }}
          onClick={(e) => {
            e.stopPropagation();
            setSelectedId(comp.id);
            setSelectedWireIndex(null);
          }}
        >
          <div className="animate-pop-in hover:scale-110 transition-transform duration-200">
            <ComponentVisual 
              component={comp} 
              isSelected={selectedId === comp.id} 
              onToggle={() => {
                   if (comp.type === 'switch' || comp.type === 'spdt_switch') {
                       useCircuitStore.getState().updateComponent(comp.id, { isOpen: !comp.isOpen });
                   }
              }}
            />
          </div>
        </div>
      ))}

      {/* Nodes Layer (Global) */}
      {nodes.map((node) => (
        <div
          key={node.id}
          className={cn(
            "absolute w-3 h-3 md:w-4 md:h-4 rounded-full border border-slate-600 z-20 transform -translate-x-1/2 -translate-y-1/2 cursor-pointer transition-transform hover:scale-150",
            wiringStartNode === node.id ? "bg-blue-500 scale-125 shadow-[0_0_0_4px_rgba(59,130,246,0.3)]" : "bg-white hover:bg-blue-200",
          )}
          style={{
            left: node.position.x,
            top: node.position.y
          }}
          onClick={(e) => handleNodeClick(e, node.id)}
          onTouchEnd={(e) => handleNodeClick(e, node.id)}
          title={`Voltage: ${node.voltage?.toFixed(2)}V`}
        />
      ))}
      </div>
      
      {/* Wire Tooltip */}
      {hoveredWireIndex !== null && wires[hoveredWireIndex] && (() => {
        const wire = wires[hoveredWireIndex];
        const startNode = nodes.find(n => n.id === wire.from);
        const endNode = nodes.find(n => n.id === wire.to);
        const voltage = startNode && endNode ? (startNode.voltage + endNode.voltage) / 2 : 0;
        
        return (
          <div 
            className="fixed z-[100] bg-slate-800/90 text-white text-xs p-2 rounded-lg shadow-xl backdrop-blur-sm border border-slate-700 pointer-events-none"
            style={{ 
              left: tooltipPos.x + 15, 
              top: tooltipPos.y + 15 
            }}
          >
            <div className="font-bold mb-1 text-slate-300">Dây dẫn #{hoveredWireIndex + 1}</div>
            <div className="grid grid-cols-2 gap-x-3 gap-y-0.5">
              <span className="text-slate-400">Dòng điện:</span>
              <span className="font-mono text-blue-400">{formatValue(wire.current || 0, 'A')}</span>
              <span className="text-slate-400">Điện áp:</span>
              <span className="font-mono text-yellow-400">{formatValue(voltage, 'V')}</span>
            </div>
          </div>
        );
      })()}

      {/* Zoom Controls */}
      <div className="absolute bottom-6 right-6 flex items-center gap-1 z-50 bg-white/90 backdrop-blur-sm p-1.5 rounded-xl shadow-[0_4px_20px_rgba(0,0,0,0.08)] border border-slate-200/60">
        <button 
            className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-slate-100 text-slate-600 transition-colors active:scale-95"
            onClick={() => setScale(Math.max(scale - 0.1, 0.1))}
            title="Thu nhỏ"
        >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="5" y1="12" x2="19" y2="12"></line></svg>
        </button>
        <div 
            className="px-2 min-w-[60px] text-center font-medium text-sm text-slate-700 cursor-pointer hover:text-blue-600 transition-colors"
            onClick={() => { setScale(1); setOffset({ x: 0, y: 0 }); }}
            title="Đặt lại (100%)"
        >
            {Math.round(scale * 100)}%
        </div>
        <button 
            className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-slate-100 text-slate-600 transition-colors active:scale-95"
            onClick={() => setScale(Math.min(scale + 0.1, 5))}
            title="Phóng to"
        >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="5" x2="12" y2="19"></line><line x1="5" y1="12" x2="19" y2="12"></line></svg>
        </button>
      </div>
    </div>
  );
}
