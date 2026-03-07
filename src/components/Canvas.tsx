import React, { useRef, useState, useEffect } from 'react';
import { useShallow } from 'zustand/react/shallow';
import { useCircuitStore } from '../store';
import { Component, Node } from '../types';
import { cn, getResistorColors, formatValue } from '../lib/utils';
import { AlertTriangle, Flame } from 'lucide-react';

// Simple visual representations for components
export const ComponentVisual = React.memo(({ component, isSelected, onToggle }: { component: Component; isSelected: boolean; onToggle?: () => void }) => {
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
        <svg width="64" height="64" viewBox="0 0 64 64" className="w-full h-full drop-shadow-sm">
          <line x1="0" y1="32" x2="20" y2="32" stroke="#1e293b" strokeWidth="2" />
          <line x1="44" y1="32" x2="64" y2="32" stroke="#1e293b" strokeWidth="2" />
          
          {/* Terminals */}
          <circle cx="20" cy="32" r="3" fill="#cbd5e1" stroke="#1e293b" strokeWidth="1" />
          <circle cx="44" cy="32" r="3" fill="#cbd5e1" stroke="#1e293b" strokeWidth="1" />
          
          {/* Button Mechanism */}
          <g className="transition-all duration-100" style={{ transform: component.isOpen ? 'translateY(-8px)' : 'translateY(0px)' }}>
            {/* Contact Bar */}
            <line x1="20" y1="28" x2="44" y2="28" stroke="#ef4444" strokeWidth="3" strokeLinecap="round" />
            
            {/* Plunger */}
            <line x1="32" y1="28" x2="32" y2="14" stroke="#475569" strokeWidth="4" />
            
            {/* Button Cap */}
            <rect x="24" y="8" width="16" height="6" rx="2" fill="#ef4444" stroke="#991b1b" strokeWidth="1" />
            <rect x="25" y="9" width="14" height="2" fill="white" opacity="0.4" rx="1" />
          </g>
        </svg>
      )}
      {type === 'spdt_switch' && (
        <svg width="64" height="64" viewBox="0 0 64 64" className="w-full h-full drop-shadow-sm">
          <line x1="0" y1="32" x2="20" y2="32" stroke="#1e293b" strokeWidth="2" />
          <line x1="44" y1="16" x2="64" y2="16" stroke="#1e293b" strokeWidth="2" />
          <line x1="44" y1="48" x2="64" y2="48" stroke="#1e293b" strokeWidth="2" />
          
          {/* Terminals */}
          <circle cx="20" cy="32" r="3" fill="#cbd5e1" stroke="#1e293b" strokeWidth="1" />
          <circle cx="44" cy="16" r="3" fill="#cbd5e1" stroke="#1e293b" strokeWidth="1" />
          <circle cx="44" cy="48" r="3" fill="#cbd5e1" stroke="#1e293b" strokeWidth="1" />
          
          {/* Switch Blade */}
          <g className="transition-all duration-200 origin-[20px_32px]" style={{ transform: component.isOpen ? 'rotate(35deg)' : 'rotate(-35deg)' }}>
            <rect x="20" y="30" width="26" height="4" rx="2" fill="#ef4444" stroke="#991b1b" strokeWidth="1" />
            <rect x="22" y="30.5" width="22" height="1.5" fill="white" opacity="0.4" />
          </g>
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
        <svg width="64" height="64" viewBox="0 0 64 64" className="w-full h-full drop-shadow-sm">
          <line x1="0" y1="32" x2="22" y2="32" stroke="#1e293b" strokeWidth="2" />
          <line x1="42" y1="32" x2="64" y2="32" stroke="#1e293b" strokeWidth="2" />
          
          {/* Capacitor Body (Electrolytic style) */}
          <rect x="22" y="16" width="20" height="32" rx="2" fill="#0f172a" stroke="#334155" strokeWidth="1" />
          
          {/* Negative Stripe */}
          <rect x="36" y="16" width="6" height="32" fill="#cbd5e1" />
          <line x1="38" y1="20" x2="38" y2="24" stroke="#0f172a" strokeWidth="1.5" />
          <line x1="38" y1="40" x2="38" y2="44" stroke="#0f172a" strokeWidth="1.5" />
          
          {/* 3D Highlight */}
          <rect x="24" y="16" width="4" height="32" fill="white" opacity="0.2" />
          
          {/* Top Cap */}
          <ellipse cx="32" cy="16" rx="10" ry="3" fill="#334155" />
          <path d="M 28 16 L 36 16 M 32 12 L 32 20" stroke="#0f172a" strokeWidth="0.5" opacity="0.5" />
        </svg>
      )}
      {type === 'inductor' && (
        <svg width="64" height="64" viewBox="0 0 64 64" className="w-full h-full drop-shadow-sm">
          <line x1="0" y1="32" x2="12" y2="32" stroke="#1e293b" strokeWidth="2" />
          <line x1="52" y1="32" x2="64" y2="32" stroke="#1e293b" strokeWidth="2" />
          
          {/* Core */}
          <rect x="14" y="28" width="36" height="8" rx="2" fill="#334155" />
          
          {/* Coils */}
          <path d="M 12 32 C 12 20, 22 20, 22 32 C 22 44, 32 44, 32 32 C 32 20, 42 20, 42 32 C 42 44, 52 44, 52 32" fill="none" stroke="#b45309" strokeWidth="3" strokeLinecap="round" />
          
          {/* 3D Highlight on coils */}
          <path d="M 12 32 C 12 22, 20 22, 20 32 C 20 42, 30 42, 30 32 C 30 22, 40 22, 40 32 C 40 42, 50 42, 50 32" fill="none" stroke="#f59e0b" strokeWidth="1" opacity="0.8" />
        </svg>
      )}
      {type === 'diode' && (
        <svg width="64" height="64" viewBox="0 0 64 64" className="w-full h-full drop-shadow-sm">
          <line x1="0" y1="32" x2="20" y2="32" stroke="#1e293b" strokeWidth="2" />
          <line x1="44" y1="32" x2="64" y2="32" stroke="#1e293b" strokeWidth="2" />
          
          {/* Diode Body */}
          <rect x="20" y="24" width="24" height="16" rx="2" fill="#1e293b" stroke="#0f172a" strokeWidth="1" />
          
          {/* Cathode Stripe */}
          <rect x="38" y="24" width="4" height="16" fill="#cbd5e1" />
          
          {/* 3D Highlight */}
          <rect x="20" y="26" width="24" height="4" fill="white" opacity="0.2" rx="1" />
          <rect x="20" y="36" width="24" height="2" fill="black" opacity="0.3" rx="1" />
        </svg>
      )}
      {type === 'ac_source' && (
        <svg width="64" height="64" viewBox="0 0 64 64" className="w-full h-full drop-shadow-md">
          <line x1="0" y1="32" x2="16" y2="32" stroke="#1e293b" strokeWidth="2" />
          <line x1="48" y1="32" x2="64" y2="32" stroke="#1e293b" strokeWidth="2" />
          
          {/* Generator Body */}
          <circle cx="32" cy="32" r="16" fill="#f8fafc" stroke="#334155" strokeWidth="2" />
          <circle cx="32" cy="32" r="12" fill="none" stroke="#cbd5e1" strokeWidth="1" />
          
          {/* Sine Wave */}
          <path d="M 22 32 Q 27 22 32 32 T 42 32" fill="none" stroke="#3b82f6" strokeWidth="2" strokeLinecap="round" />
          
          {/* Terminals */}
          <circle cx="16" cy="32" r="2" fill="#1e293b" />
          <circle cx="48" cy="32" r="2" fill="#1e293b" />
        </svg>
      )}
      {type === 'clock' && (
        <svg width="64" height="64" viewBox="0 0 64 64" className="w-full h-full drop-shadow-md">
          <line x1="0" y1="32" x2="16" y2="32" stroke="#1e293b" strokeWidth="2" />
          <line x1="48" y1="32" x2="64" y2="32" stroke="#1e293b" strokeWidth="2" />
          
          {/* Signal Generator Body */}
          <rect x="16" y="16" width="32" height="32" rx="4" fill="#f8fafc" stroke="#334155" strokeWidth="2" />
          <rect x="20" y="20" width="24" height="14" rx="1" fill="#e2e8f0" stroke="#94a3b8" strokeWidth="1" />
          
          {/* Square Wave */}
          <path d="M 22 30 L 22 24 L 32 24 L 32 30 L 42 30 L 42 24" fill="none" stroke="#ef4444" strokeWidth="2" strokeLinejoin="round" />
          
          {/* Terminals */}
          <circle cx="16" cy="32" r="2" fill="#1e293b" />
          <circle cx="48" cy="32" r="2" fill="#1e293b" />
          
          {/* LED indicator */}
          <circle cx="32" cy="42" r="2" fill={component.value > 0 ? "#22c55e" : "#94a3b8"} />
        </svg>
      )}

      {type === 'battery' && (
        <svg width="64" height="64" viewBox="0 0 64 64" className="w-full h-full drop-shadow-md">
          <line x1="32" y1="0" x2="32" y2="12" stroke="#1e293b" strokeWidth="2" />
          <line x1="32" y1="52" x2="32" y2="64" stroke="#1e293b" strokeWidth="2" />
          
          {/* Battery Body */}
          <rect x="20" y="16" width="24" height="32" rx="3" fill="url(#batteryGrad)" stroke="#1e293b" strokeWidth="1.5" />
          
          {/* Positive Terminal (Top) */}
          <rect x="26" y="12" width="12" height="4" rx="1" fill="#cbd5e1" stroke="#1e293b" strokeWidth="1" />
          
          {/* Battery Label/Wrapper */}
          <rect x="20" y="22" width="24" height="20" fill="#ef4444" />
          <rect x="20" y="42" width="24" height="6" fill="#1e293b" />
          
          {/* Highlights/Shadows for 3D effect */}
          <rect x="22" y="16" width="4" height="32" fill="white" opacity="0.3" />
          <rect x="38" y="16" width="4" height="32" fill="black" opacity="0.2" />
          
          <text x="32" y="34" fontSize="12" fill="white" textAnchor="middle" fontWeight="bold" fontFamily="sans-serif">+</text>
          
          <defs>
            <linearGradient id="batteryGrad" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#e2e8f0" />
              <stop offset="50%" stopColor="#f8fafc" />
              <stop offset="100%" stopColor="#94a3b8" />
            </linearGradient>
          </defs>
        </svg>
      )}
      {type === 'resistor' && (
        <svg width="64" height="64" viewBox="0 0 64 64" className="w-full h-full drop-shadow-sm">
          <line x1="0" y1="32" x2="16" y2="32" stroke="#1e293b" strokeWidth="2" />
          <line x1="48" y1="32" x2="64" y2="32" stroke="#1e293b" strokeWidth="2" />
          
          {/* Resistor Body (Bone shape) */}
          <path d="M 16 26 C 16 22, 20 22, 20 26 L 20 38 C 20 42, 16 42, 16 38 Z" fill="#e2ceb5" stroke="#8b7355" strokeWidth="1" />
          <rect x="19" y="25" width="26" height="14" fill="#e2ceb5" stroke="#8b7355" strokeWidth="1" strokeDasharray="26 0 26 0" />
          <path d="M 48 26 C 48 22, 44 22, 44 26 L 44 38 C 44 42, 48 42, 48 38 Z" fill="#e2ceb5" stroke="#8b7355" strokeWidth="1" />
          
          {/* Color Bands */}
          <rect x="22" y="25.5" width="3" height="13" fill={getResistorColors(value)[0] || '#000'} />
          <rect x="28" y="25.5" width="3" height="13" fill={getResistorColors(value)[1] || '#000'} />
          <rect x="34" y="25.5" width="3" height="13" fill={getResistorColors(value)[2] || '#000'} />
          <rect x="40" y="25.5" width="2" height="13" fill="#d4af37" /> {/* Gold tolerance */}
          
          {/* 3D Highlight */}
          <rect x="16" y="26" width="32" height="4" fill="white" opacity="0.4" rx="2" />
        </svg>
      )}
      {type === 'lamp' && (
        <svg width="64" height="64" viewBox="0 0 64 64" className="w-full h-full overflow-visible drop-shadow-md">
          <line x1="0" y1="32" x2="24" y2="32" stroke="#1e293b" strokeWidth="2" />
          <line x1="40" y1="32" x2="64" y2="32" stroke="#1e293b" strokeWidth="2" />
          
          {/* Base/Socket */}
          <rect x="24" y="26" width="16" height="12" rx="1" fill="#94a3b8" stroke="#475569" strokeWidth="1" />
          <line x1="26" y1="28" x2="38" y2="28" stroke="#475569" strokeWidth="1" />
          <line x1="26" y1="32" x2="38" y2="32" stroke="#475569" strokeWidth="1" />
          <line x1="26" y1="36" x2="38" y2="36" stroke="#475569" strokeWidth="1" />
          
          {/* Glass Bulb */}
          <path d="M 32 4 C 46 4, 50 16, 40 26 L 24 26 C 14 16, 18 4, 32 4 Z" 
                fill={Math.abs(component.current) > 0.01 ? '#fef08a' : '#f8fafc'} 
                stroke="#cbd5e1" strokeWidth="1.5" opacity="0.9" />
                
          {/* Filament */}
          <path d="M 28 26 L 28 16 L 30 14 L 32 16 L 34 14 L 36 16 L 36 26" 
                fill="none" 
                stroke={Math.abs(component.current) > 0.01 ? '#f97316' : '#64748b'} 
                strokeWidth="1.5" strokeLinejoin="round" />
                
          {/* Glass Highlight */}
          <path d="M 24 12 C 26 6, 30 6, 32 6" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" opacity="0.6" />

          {/* Glow Effect */}
          {Math.abs(component.current) > 0.01 && (
            <circle cx="32" cy="16" r="24" fill="#facc15" opacity="0.5" filter="blur(8px)" />
          )}
        </svg>
      )}
      {type === 'switch' && (
        <svg width="64" height="64" viewBox="0 0 64 64" className="w-full h-full drop-shadow-sm">
          <line x1="0" y1="32" x2="16" y2="32" stroke="#1e293b" strokeWidth="2" />
          <line x1="48" y1="32" x2="64" y2="32" stroke="#1e293b" strokeWidth="2" />
          
          {/* Terminals */}
          <circle cx="16" cy="32" r="4" fill="#cbd5e1" stroke="#1e293b" strokeWidth="1.5" />
          <circle cx="48" cy="32" r="4" fill="#cbd5e1" stroke="#1e293b" strokeWidth="1.5" />
          <circle cx="16" cy="32" r="1.5" fill="#1e293b" />
          <circle cx="48" cy="32" r="1.5" fill="#1e293b" />
          
          {/* Switch Blade */}
          <g className="transition-all duration-200 origin-[16px_32px]" style={{ transform: component.isOpen ? 'rotate(-30deg)' : 'rotate(0deg)' }}>
            <rect x="16" y="30" width="34" height="4" rx="2" fill="#ef4444" stroke="#991b1b" strokeWidth="1" />
            <rect x="18" y="30.5" width="30" height="1.5" fill="white" opacity="0.4" />
          </g>
        </svg>
      )}
      {type === 'voltmeter' && (
        <svg width="64" height="64" viewBox="0 0 64 64" className="w-full h-full drop-shadow-md">
          <line x1="0" y1="32" x2="16" y2="32" stroke="#1e293b" strokeWidth="2" />
          <line x1="48" y1="32" x2="64" y2="32" stroke="#1e293b" strokeWidth="2" />
          
          {/* Meter Body */}
          <circle cx="32" cy="32" r="16" fill="#f8fafc" stroke="#334155" strokeWidth="2" />
          <circle cx="32" cy="32" r="14" fill="none" stroke="#e2e8f0" strokeWidth="1" />
          
          {/* Needle */}
          <g style={{ transform: `rotate(${Math.min(Math.max((Math.abs(component.voltageDrop) / 12) * 90 - 45, -45), 45)}deg)`, transformOrigin: '32px 40px' }} className="transition-transform duration-300">
            <line x1="32" y1="40" x2="32" y2="20" stroke="#ef4444" strokeWidth="1.5" strokeLinecap="round" />
            <circle cx="32" cy="40" r="2" fill="#1e293b" />
          </g>
          
          {/* Scale marks */}
          <path d="M 22 24 A 12 12 0 0 1 42 24" fill="none" stroke="#94a3b8" strokeWidth="1" strokeDasharray="2 4" />
          
          <text x="32" y="34" fontSize="8" fill="#1e293b" textAnchor="middle" fontWeight="bold">V</text>
          <text x="32" y="44" fontSize="6" fill="#3b82f6" textAnchor="middle" fontWeight="bold" fontFamily="monospace">{Math.abs(component.voltageDrop).toFixed(1)}V</text>
        </svg>
      )}
      {type === 'ammeter' && (
        <svg width="64" height="64" viewBox="0 0 64 64" className="w-full h-full drop-shadow-md">
          <line x1="0" y1="32" x2="16" y2="32" stroke="#1e293b" strokeWidth="2" />
          <line x1="48" y1="32" x2="64" y2="32" stroke="#1e293b" strokeWidth="2" />
          
          {/* Meter Body */}
          <circle cx="32" cy="32" r="16" fill="#f8fafc" stroke="#334155" strokeWidth="2" />
          <circle cx="32" cy="32" r="14" fill="none" stroke="#e2e8f0" strokeWidth="1" />
          
          {/* Needle */}
          <g style={{ transform: `rotate(${Math.min(Math.max((Math.abs(component.current) / 2) * 90 - 45, -45), 45)}deg)`, transformOrigin: '32px 40px' }} className="transition-transform duration-300">
            <line x1="32" y1="40" x2="32" y2="20" stroke="#ef4444" strokeWidth="1.5" strokeLinecap="round" />
            <circle cx="32" cy="40" r="2" fill="#1e293b" />
          </g>
          
          {/* Scale marks */}
          <path d="M 22 24 A 12 12 0 0 1 42 24" fill="none" stroke="#94a3b8" strokeWidth="1" strokeDasharray="2 4" />
          
          <text x="32" y="34" fontSize="8" fill="#1e293b" textAnchor="middle" fontWeight="bold">A</text>
          <text x="32" y="44" fontSize="6" fill="#3b82f6" textAnchor="middle" fontWeight="bold" fontFamily="monospace">{Math.abs(component.current).toFixed(2)}A</text>
        </svg>
      )}
      {type === 'multimeter' && (
        <svg width="64" height="64" viewBox="0 0 64 64" className="w-full h-full drop-shadow-md">
          <line x1="0" y1="32" x2="16" y2="32" stroke="#1e293b" strokeWidth="2" />
          <line x1="48" y1="32" x2="64" y2="32" stroke="#1e293b" strokeWidth="2" />
          
          {/* Multimeter Body */}
          <rect x="16" y="12" width="32" height="40" rx="3" fill="#facc15" stroke="#ca8a04" strokeWidth="1" />
          <rect x="18" y="14" width="28" height="36" rx="2" fill="#334155" />
          
          {/* Screen */}
          <rect x="20" y="16" width="24" height="14" rx="1" fill="#a7f3d0" stroke="#064e3b" strokeWidth="1" />
          <text x="32" y="26" fontSize="8" fill="#064e3b" textAnchor="middle" fontWeight="bold" fontFamily="monospace">
            {component.mode === 'current' ? `${Math.abs(component.current).toFixed(2)}A` :
             component.mode === 'resistance' ? (Math.abs(component.current) > 1e-6 ? `${(Math.abs(component.voltageDrop) / Math.abs(component.current)).toFixed(1)}Ω` : 'O.L') :
             `${Math.abs(component.voltageDrop).toFixed(1)}V`}
          </text>
          
          {/* Dial */}
          <circle cx="32" cy="38" r="6" fill="#1e293b" stroke="#475569" strokeWidth="1" />
          <line x1="32" y1="38" x2="32" y2="33" stroke="white" strokeWidth="1.5" />
          
          {/* Ports */}
          <circle cx="24" cy="46" r="2.5" fill="#ef4444" stroke="#7f1d1d" strokeWidth="0.5" />
          <circle cx="40" cy="46" r="2.5" fill="#1e293b" stroke="black" strokeWidth="0.5" />
        </svg>
      )}
      {type === 'wattmeter' && (
        <svg width="64" height="64" viewBox="0 0 64 64" className="w-full h-full drop-shadow-md">
          <line x1="0" y1="32" x2="16" y2="32" stroke="#1e293b" strokeWidth="2" />
          <line x1="48" y1="32" x2="64" y2="32" stroke="#1e293b" strokeWidth="2" />
          
          {/* Meter Body */}
          <rect x="16" y="16" width="32" height="32" rx="2" fill="#f8fafc" stroke="#334155" strokeWidth="2" />
          
          {/* Display */}
          <rect x="20" y="20" width="24" height="14" rx="1" fill="#e2e8f0" stroke="#94a3b8" strokeWidth="1" />
          
          <text x="32" y="30" fontSize="8" fill="#eab308" textAnchor="middle" fontWeight="bold" fontFamily="monospace">{Math.abs(component.voltageDrop * component.current).toFixed(1)}W</text>
          
          {/* Label */}
          <text x="32" y="44" fontSize="8" fill="#1e293b" textAnchor="middle" fontWeight="bold">POWER</text>
        </svg>
      )}
      
      {type === 'potentiometer' && (
        <svg width="64" height="64" viewBox="0 0 64 64" className="w-full h-full drop-shadow-md">
          <line x1="0" y1="32" x2="16" y2="32" stroke="#1e293b" strokeWidth="2" />
          <line x1="48" y1="32" x2="64" y2="32" stroke="#1e293b" strokeWidth="2" />
          
          {/* Base */}
          <circle cx="32" cy="32" r="16" fill="#334155" stroke="#1e293b" strokeWidth="2" />
          
          {/* Knob */}
          <circle cx="32" cy="32" r="12" fill="#e2e8f0" stroke="#94a3b8" strokeWidth="1" />
          
          {/* Wiper Indicator */}
          <g style={{ transform: `rotate(${((component.value || 0) / 1000) * 270 - 135}deg)`, transformOrigin: '32px 32px' }}>
            <line x1="32" y1="32" x2="32" y2="22" stroke="#ef4444" strokeWidth="3" strokeLinecap="round" />
            <circle cx="32" cy="32" r="2" fill="#ef4444" />
          </g>
          
          {/* 3D Highlight */}
          <path d="M 20 32 A 12 12 0 0 1 44 32" fill="none" stroke="white" strokeWidth="2" opacity="0.5" />
        </svg>
      )}
      {type === 'fuse' && (
        <svg width="64" height="64" viewBox="0 0 64 64" className="w-full h-full drop-shadow-sm">
          <line x1="0" y1="32" x2="16" y2="32" stroke="#1e293b" strokeWidth="2" />
          <line x1="48" y1="32" x2="64" y2="32" stroke="#1e293b" strokeWidth="2" />
          
          {/* Glass Tube */}
          <rect x="16" y="24" width="32" height="16" rx="2" fill="#f1f5f9" fillOpacity="0.6" stroke="#94a3b8" strokeWidth="1" />
          
          {/* Metal Caps */}
          <rect x="16" y="22" width="6" height="20" rx="1" fill="#cbd5e1" stroke="#64748b" strokeWidth="1" />
          <rect x="42" y="22" width="6" height="20" rx="1" fill="#cbd5e1" stroke="#64748b" strokeWidth="1" />
          
          {/* 3D Highlight on caps */}
          <rect x="17" y="23" width="2" height="18" fill="white" opacity="0.5" />
          <rect x="43" y="23" width="2" height="18" fill="white" opacity="0.5" />
          
          {/* Fuse Wire */}
          {!component.isBroken ? (
            <path d="M 22 32 Q 32 24 42 32" fill="none" stroke="#64748b" strokeWidth="1.5" />
          ) : (
            <>
              <path d="M 22 32 Q 26 28 28 30" fill="none" stroke="#64748b" strokeWidth="1.5" />
              <path d="M 42 32 Q 38 28 36 30" fill="none" stroke="#64748b" strokeWidth="1.5" />
              {/* Burn mark */}
              <circle cx="32" cy="32" r="4" fill="#ef4444" opacity="0.4" filter="blur(1px)" />
              <path d="M 30 30 L 34 34 M 34 30 L 30 34" stroke="#ef4444" strokeWidth="1.5" />
            </>
          )}
          
          {/* Glass Reflection */}
          <rect x="22" y="26" width="20" height="3" fill="white" opacity="0.4" rx="1" />
        </svg>
      )}
      {type === 'led' && (
        <svg width="64" height="64" viewBox="0 0 64 64" className="w-full h-full overflow-visible drop-shadow-md">
          <line x1="0" y1="32" x2="24" y2="32" stroke="#1e293b" strokeWidth="2" />
          <line x1="40" y1="32" x2="64" y2="32" stroke="#1e293b" strokeWidth="2" />
          
          {/* LED Legs */}
          <line x1="28" y1="32" x2="28" y2="24" stroke="#94a3b8" strokeWidth="2" />
          <line x1="36" y1="32" x2="36" y2="24" stroke="#94a3b8" strokeWidth="2" />
          
          {/* LED Base Rim */}
          <rect x="24" y="22" width="16" height="4" rx="1" fill={component.color || '#ef4444'} opacity="0.8" stroke="#1e293b" strokeWidth="1" />
          
          {/* LED Dome */}
          <path d="M 25 22 L 25 12 C 25 4, 39 4, 39 12 L 39 22 Z" 
                fill={Math.abs(component.current) > 0.001 ? (component.color || '#ef4444') : '#f8fafc'} 
                stroke={component.color || '#ef4444'} strokeWidth="1" opacity={Math.abs(component.current) > 0.001 ? 1 : 0.6} />
                
          {/* Internal Anode/Cathode */}
          <path d="M 28 22 L 28 14 L 30 14" fill="none" stroke="#64748b" strokeWidth="1.5" />
          <path d="M 36 22 L 36 12 L 32 12 L 32 16 L 36 16" fill="none" stroke="#64748b" strokeWidth="1.5" />

          {/* Glass Highlight */}
          <path d="M 27 18 L 27 10 C 27 6, 31 6, 31 6" fill="none" stroke="white" strokeWidth="1.5" strokeLinecap="round" opacity="0.7" />

          {/* Glow Effect */}
          {Math.abs(component.current) > 0.001 && (
            <circle cx="32" cy="14" r="20" fill={component.color || '#ef4444'} opacity="0.4" filter="blur(6px)" />
          )}
        </svg>
      )}
      {type === 'text' && (
        <div className="whitespace-nowrap font-sans text-slate-800 font-medium select-none pointer-events-none">
           {component.text || 'Text'}
        </div>
      )}

      {type === 'solar_panel' && (
        <svg width="64" height="64" viewBox="0 0 64 64" className="w-full h-full drop-shadow-md">
          <line x1="0" y1="32" x2="16" y2="32" stroke="#1e293b" strokeWidth="2" />
          <line x1="48" y1="32" x2="64" y2="32" stroke="#1e293b" strokeWidth="2" />
          
          {/* Panel Body */}
          <rect x="16" y="16" width="32" height="32" rx="2" fill="#1e40af" stroke="#1e3a8a" strokeWidth="2" />
          
          {/* Grid lines */}
          <line x1="24" y1="16" x2="24" y2="48" stroke="#60a5fa" strokeWidth="1" opacity="0.6" />
          <line x1="32" y1="16" x2="32" y2="48" stroke="#60a5fa" strokeWidth="1" opacity="0.6" />
          <line x1="40" y1="16" x2="40" y2="48" stroke="#60a5fa" strokeWidth="1" opacity="0.6" />
          
          <line x1="16" y1="24" x2="48" y2="24" stroke="#60a5fa" strokeWidth="1" opacity="0.6" />
          <line x1="16" y1="32" x2="48" y2="32" stroke="#60a5fa" strokeWidth="1" opacity="0.6" />
          <line x1="16" y1="40" x2="48" y2="40" stroke="#60a5fa" strokeWidth="1" opacity="0.6" />
          
          {/* Terminals */}
          <circle cx="16" cy="32" r="2" fill="#1e293b" />
          <circle cx="48" cy="32" r="2" fill="#1e293b" />
          
          {/* Sun icon hint */}
          <circle cx="22" cy="22" r="3" fill="#fde047" opacity="0.8" />
        </svg>
      )}

      {type === 'wind_turbine' && (
        <svg width="64" height="64" viewBox="0 0 64 64" className="w-full h-full drop-shadow-md">
          <line x1="0" y1="32" x2="16" y2="32" stroke="#1e293b" strokeWidth="2" />
          <line x1="48" y1="32" x2="64" y2="32" stroke="#1e293b" strokeWidth="2" />
          
          {/* Tower */}
          <path d="M 30 56 L 34 56 L 33 32 L 31 32 Z" fill="#94a3b8" stroke="#475569" strokeWidth="1" />
          
          {/* Nacelle */}
          <rect x="28" y="28" width="12" height="6" rx="2" fill="#f8fafc" stroke="#94a3b8" strokeWidth="1" />
          
          {/* Blades (rotating based on value or just static) */}
          <g className="origin-[30px_31px] animate-[spin_3s_linear_infinite]">
            <path d="M 30 31 L 34 16 C 32 14, 28 14, 26 16 Z" fill="#e2e8f0" stroke="#cbd5e1" strokeWidth="1" />
            <path d="M 30 31 L 44 38 C 45 40, 44 44, 42 45 Z" fill="#e2e8f0" stroke="#cbd5e1" strokeWidth="1" />
            <path d="M 30 31 L 16 38 C 15 40, 16 44, 18 45 Z" fill="#e2e8f0" stroke="#cbd5e1" strokeWidth="1" />
            <circle cx="30" cy="31" r="2" fill="#64748b" />
          </g>
        </svg>
      )}

      {type === 'thermoelectric_generator' && (
        <svg width="64" height="64" viewBox="0 0 64 64" className="w-full h-full drop-shadow-md">
          <line x1="0" y1="32" x2="16" y2="32" stroke="#1e293b" strokeWidth="2" />
          <line x1="48" y1="32" x2="64" y2="32" stroke="#1e293b" strokeWidth="2" />
          
          {/* Hot side */}
          <rect x="16" y="16" width="32" height="8" fill="#ef4444" stroke="#b91c1c" strokeWidth="1" />
          
          {/* TEG Modules */}
          <rect x="18" y="24" width="28" height="16" fill="#f8fafc" stroke="#cbd5e1" strokeWidth="1" />
          <rect x="20" y="26" width="4" height="12" fill="#3b82f6" />
          <rect x="26" y="26" width="4" height="12" fill="#ef4444" />
          <rect x="32" y="26" width="4" height="12" fill="#3b82f6" />
          <rect x="38" y="26" width="4" height="12" fill="#ef4444" />
          
          {/* Cold side */}
          <rect x="16" y="40" width="32" height="8" fill="#3b82f6" stroke="#1d4ed8" strokeWidth="1" />
          
          {/* Terminals */}
          <circle cx="16" cy="32" r="2" fill="#1e293b" />
          <circle cx="48" cy="32" r="2" fill="#1e293b" />
        </svg>
      )}

      {type === 'seven_segment' && (
        <svg width="64" height="64" viewBox="0 0 64 64" className="w-full h-full">
          <rect x="10" y="4" width="44" height="56" rx="4" fill="#1e293b" stroke="#334155" strokeWidth="2" />
          
          {/* Segments */}
          {(() => {
             // Decode BCD
             // Nodes: 0=A, 1=B, 2=C, 3=D, 4=Com
             // Actually, we need to access node voltages.
             // But ComponentVisual only receives 'component'.
             // We need to pass node voltages or calculate value in solver/store.
             // Let's assume 'component.value' stores the decoded number?
             // No, solver updates component.
             // But solver doesn't know about 7-segment logic yet.
             // We should update solver to calculate the 'value' (0-15) based on inputs.
             // OR we can pass nodes to ComponentVisual? No, it only gets Component.
             // We can use component.value to store the displayed number.
             
             // Let's assume component.value holds the integer 0-15.
             const val = Math.round(component.value || 0);
             
             // Segments: a, b, c, d, e, f, g
             // 0: 1111110
             // 1: 0110000
             // ...
             const segments = [
               0x7E, // 0
               0x30, // 1
               0x6D, // 2
               0x79, // 3
               0x33, // 4
               0x5B, // 5
               0x5F, // 6
               0x70, // 7
               0x7F, // 8
               0x7B, // 9
               0x77, // A
               0x1F, // b
               0x4E, // C
               0x3D, // d
               0x4F, // E
               0x47  // F
             ];
             
             const mask = segments[val & 0xF] || 0;
             const onColor = "#ef4444";
             const offColor = "#334155";
             
             const getFill = (bit: number) => (mask & (1 << bit)) ? onColor : offColor;
             const getGlow = (bit: number) => (mask & (1 << bit)) ? "drop-shadow(0 0 2px #ef4444)" : "";

             return (
               <g transform="translate(32, 32) scale(0.8) translate(-32, -32)">
                 {/* a (top) */}
                 <path d="M 16 8 L 48 8 L 44 12 L 20 12 Z" fill={getFill(6)} style={{filter: getGlow(6)}} />
                 {/* b (top-right) */}
                 <path d="M 48 8 L 52 12 L 52 30 L 48 32 L 44 28 L 44 12 Z" fill={getFill(5)} style={{filter: getGlow(5)}} />
                 {/* c (bottom-right) */}
                 <path d="M 48 32 L 52 34 L 52 52 L 48 56 L 44 52 L 44 36 Z" fill={getFill(4)} style={{filter: getGlow(4)}} />
                 {/* d (bottom) */}
                 <path d="M 16 56 L 48 56 L 44 52 L 20 52 Z" fill={getFill(3)} style={{filter: getGlow(3)}} />
                 {/* e (bottom-left) */}
                 <path d="M 16 56 L 12 52 L 12 34 L 16 32 L 20 36 L 20 52 Z" fill={getFill(2)} style={{filter: getGlow(2)}} />
                 {/* f (top-left) */}
                 <path d="M 16 32 L 12 30 L 12 12 L 16 8 L 20 12 L 20 28 Z" fill={getFill(1)} style={{filter: getGlow(1)}} />
                 {/* g (middle) */}
                 <path d="M 16 32 L 20 28 L 44 28 L 48 32 L 44 36 L 20 36 Z" fill={getFill(0)} style={{filter: getGlow(0)}} />
               </g>
             );
          })()}
          
          {/* Pins */}
          <line x1="0" y1="17" x2="10" y2="17" stroke="#94a3b8" strokeWidth="2" /> {/* A */}
          <line x1="0" y1="27" x2="10" y2="27" stroke="#94a3b8" strokeWidth="2" /> {/* B */}
          <line x1="0" y1="37" x2="10" y2="37" stroke="#94a3b8" strokeWidth="2" /> {/* C */}
          <line x1="0" y1="47" x2="10" y2="47" stroke="#94a3b8" strokeWidth="2" /> {/* D */}
          <line x1="32" y1="60" x2="32" y2="64" stroke="#94a3b8" strokeWidth="2" /> {/* Com */}
        </svg>
      )}

      {type === 'npn_transistor' && (
        <svg width="64" height="64" viewBox="0 0 64 64" className="w-full h-full drop-shadow-md">
          {/* Legs */}
          <line x1="0" y1="32" x2="24" y2="32" stroke="#94a3b8" strokeWidth="2" /> {/* Base */}
          <line x1="32" y1="0" x2="32" y2="20" stroke="#94a3b8" strokeWidth="2" /> {/* Collector */}
          <line x1="32" y1="44" x2="32" y2="64" stroke="#94a3b8" strokeWidth="2" /> {/* Emitter */}
          
          {/* Body (TO-92 package style) */}
          <path d="M 20 20 L 44 20 C 48 20, 52 26, 52 32 C 52 38, 48 44, 44 44 L 20 44 Z" fill="#1e293b" stroke="#0f172a" strokeWidth="1" />
          
          {/* Flat face */}
          <rect x="20" y="20" width="6" height="24" fill="#334155" />
          
          {/* 3D Highlight */}
          <path d="M 26 22 L 42 22 C 45 22, 48 26, 48 32 C 48 38, 45 42, 42 42 L 26 42 Z" fill="white" opacity="0.1" />
          
          {/* Labels */}
          <text x="14" y="30" fontSize="8" fill="#64748b" fontFamily="sans-serif">B</text>
          <text x="36" y="14" fontSize="8" fill="#64748b" fontFamily="sans-serif">C</text>
          <text x="36" y="56" fontSize="8" fill="#64748b" fontFamily="sans-serif">E</text>
        </svg>
      )}

      {type === 'pnp_transistor' && (
        <svg width="64" height="64" viewBox="0 0 64 64" className="w-full h-full drop-shadow-md">
          {/* Legs */}
          <line x1="0" y1="32" x2="24" y2="32" stroke="#94a3b8" strokeWidth="2" /> {/* Base */}
          <line x1="32" y1="0" x2="32" y2="20" stroke="#94a3b8" strokeWidth="2" /> {/* Emitter */}
          <line x1="32" y1="44" x2="32" y2="64" stroke="#94a3b8" strokeWidth="2" /> {/* Collector */}
          
          {/* Body (TO-92 package style) */}
          <path d="M 20 20 L 44 20 C 48 20, 52 26, 52 32 C 52 38, 48 44, 44 44 L 20 44 Z" fill="#1e293b" stroke="#0f172a" strokeWidth="1" />
          
          {/* Flat face */}
          <rect x="20" y="20" width="6" height="24" fill="#334155" />
          
          {/* 3D Highlight */}
          <path d="M 26 22 L 42 22 C 45 22, 48 26, 48 32 C 48 38, 45 42, 42 42 L 26 42 Z" fill="white" opacity="0.1" />
          
          {/* Labels */}
          <text x="14" y="30" fontSize="8" fill="#64748b" fontFamily="sans-serif">B</text>
          <text x="36" y="14" fontSize="8" fill="#64748b" fontFamily="sans-serif">E</text>
          <text x="36" y="56" fontSize="8" fill="#64748b" fontFamily="sans-serif">C</text>
        </svg>
      )}

      {type === 'opamp' && (
        <svg width="64" height="64" viewBox="0 0 64 64" className="w-full h-full drop-shadow-md">
          {/* IC Body */}
          <rect x="16" y="12" width="32" height="40" rx="2" fill="#1e293b" stroke="#0f172a" strokeWidth="1" />
          <circle cx="22" cy="18" r="2" fill="#334155" /> {/* Pin 1 indicator */}
          
          {/* Pins */}
          <line x1="0" y1="20" x2="16" y2="20" stroke="#94a3b8" strokeWidth="2" /> {/* Inverting (-) */}
          <line x1="0" y1="44" x2="16" y2="44" stroke="#94a3b8" strokeWidth="2" /> {/* Non-inverting (+) */}
          <line x1="48" y1="32" x2="64" y2="32" stroke="#94a3b8" strokeWidth="2" /> {/* Output */}
          
          {/* Symbol */}
          <polygon points="22,20 22,44 42,32" fill="none" stroke="#94a3b8" strokeWidth="1.5" />
          <text x="26" y="26" fontSize="8" fill="#94a3b8" fontWeight="bold">-</text>
          <text x="26" y="42" fontSize="8" fill="#94a3b8" fontWeight="bold">+</text>
          <text x="32" y="50" fontSize="6" fill="#64748b" textAnchor="middle" fontFamily="monospace">OP-AMP</text>
        </svg>
      )}

      {type === 'and_gate' && (
        <svg width="64" height="64" viewBox="0 0 64 64" className="w-full h-full drop-shadow-sm">
          {/* IC Body */}
          <rect x="16" y="12" width="32" height="40" rx="2" fill="#1e293b" stroke="#0f172a" strokeWidth="1" />
          <path d="M 16 28 A 4 4 0 0 1 16 36" fill="#0f172a" /> {/* Notch */}
          
          {/* Pins */}
          <line x1="0" y1="20" x2="16" y2="20" stroke="#94a3b8" strokeWidth="2" />
          <line x1="0" y1="44" x2="16" y2="44" stroke="#94a3b8" strokeWidth="2" />
          <line x1="48" y1="32" x2="64" y2="32" stroke="#94a3b8" strokeWidth="2" />
          
          {/* Symbol */}
          <path d="M 24 24 V 40 H 32 A 8 8 0 0 0 32 24 Z" fill="none" stroke="#94a3b8" strokeWidth="1.5" />
          <text x="32" y="48" fontSize="6" fill="#64748b" textAnchor="middle" fontFamily="monospace">AND</text>
        </svg>
      )}
      {type === 'nand_gate' && (
        <svg width="64" height="64" viewBox="0 0 64 64" className="w-full h-full drop-shadow-sm">
          {/* IC Body */}
          <rect x="16" y="12" width="32" height="40" rx="2" fill="#1e293b" stroke="#0f172a" strokeWidth="1" />
          <path d="M 16 28 A 4 4 0 0 1 16 36" fill="#0f172a" /> {/* Notch */}
          
          {/* Pins */}
          <line x1="0" y1="20" x2="16" y2="20" stroke="#94a3b8" strokeWidth="2" />
          <line x1="0" y1="44" x2="16" y2="44" stroke="#94a3b8" strokeWidth="2" />
          <line x1="48" y1="32" x2="64" y2="32" stroke="#94a3b8" strokeWidth="2" />
          
          {/* Symbol */}
          <path d="M 22 24 V 40 H 30 A 8 8 0 0 0 30 24 Z" fill="none" stroke="#94a3b8" strokeWidth="1.5" />
          <circle cx="40" cy="32" r="2" fill="none" stroke="#94a3b8" strokeWidth="1.5" />
          <text x="32" y="48" fontSize="6" fill="#64748b" textAnchor="middle" fontFamily="monospace">NAND</text>
        </svg>
      )}
      {type === 'or_gate' && (
        <svg width="64" height="64" viewBox="0 0 64 64" className="w-full h-full drop-shadow-sm">
          {/* IC Body */}
          <rect x="16" y="12" width="32" height="40" rx="2" fill="#1e293b" stroke="#0f172a" strokeWidth="1" />
          <path d="M 16 28 A 4 4 0 0 1 16 36" fill="#0f172a" /> {/* Notch */}
          
          {/* Pins */}
          <line x1="0" y1="20" x2="16" y2="20" stroke="#94a3b8" strokeWidth="2" />
          <line x1="0" y1="44" x2="16" y2="44" stroke="#94a3b8" strokeWidth="2" />
          <line x1="48" y1="32" x2="64" y2="32" stroke="#94a3b8" strokeWidth="2" />
          
          {/* Symbol */}
          <path d="M 22 24 Q 26 32 22 40 Q 34 40 40 32 Q 34 24 22 24 Z" fill="none" stroke="#94a3b8" strokeWidth="1.5" />
          <text x="32" y="48" fontSize="6" fill="#64748b" textAnchor="middle" fontFamily="monospace">OR</text>
        </svg>
      )}
      {type === 'nor_gate' && (
        <svg width="64" height="64" viewBox="0 0 64 64" className="w-full h-full drop-shadow-sm">
          {/* IC Body */}
          <rect x="16" y="12" width="32" height="40" rx="2" fill="#1e293b" stroke="#0f172a" strokeWidth="1" />
          <path d="M 16 28 A 4 4 0 0 1 16 36" fill="#0f172a" /> {/* Notch */}
          
          {/* Pins */}
          <line x1="0" y1="20" x2="16" y2="20" stroke="#94a3b8" strokeWidth="2" />
          <line x1="0" y1="44" x2="16" y2="44" stroke="#94a3b8" strokeWidth="2" />
          <line x1="48" y1="32" x2="64" y2="32" stroke="#94a3b8" strokeWidth="2" />
          
          {/* Symbol */}
          <path d="M 20 24 Q 24 32 20 40 Q 32 40 38 32 Q 32 24 20 24 Z" fill="none" stroke="#94a3b8" strokeWidth="1.5" />
          <circle cx="40" cy="32" r="2" fill="none" stroke="#94a3b8" strokeWidth="1.5" />
          <text x="32" y="48" fontSize="6" fill="#64748b" textAnchor="middle" fontFamily="monospace">NOR</text>
        </svg>
      )}
      {type === 'xor_gate' && (
        <svg width="64" height="64" viewBox="0 0 64 64" className="w-full h-full drop-shadow-sm">
          {/* IC Body */}
          <rect x="16" y="12" width="32" height="40" rx="2" fill="#1e293b" stroke="#0f172a" strokeWidth="1" />
          <path d="M 16 28 A 4 4 0 0 1 16 36" fill="#0f172a" /> {/* Notch */}
          
          {/* Pins */}
          <line x1="0" y1="20" x2="16" y2="20" stroke="#94a3b8" strokeWidth="2" />
          <line x1="0" y1="44" x2="16" y2="44" stroke="#94a3b8" strokeWidth="2" />
          <line x1="48" y1="32" x2="64" y2="32" stroke="#94a3b8" strokeWidth="2" />
          
          {/* Symbol */}
          <path d="M 24 24 Q 28 32 24 40 Q 36 40 42 32 Q 36 24 24 24 Z" fill="none" stroke="#94a3b8" strokeWidth="1.5" />
          <path d="M 20 24 Q 24 32 20 40" fill="none" stroke="#94a3b8" strokeWidth="1.5" />
          <text x="32" y="48" fontSize="6" fill="#64748b" textAnchor="middle" fontFamily="monospace">XOR</text>
        </svg>
      )}
      {type === 'not_gate' && (
        <svg width="64" height="64" viewBox="0 0 64 64" className="w-full h-full drop-shadow-sm">
          {/* IC Body */}
          <rect x="16" y="12" width="32" height="40" rx="2" fill="#1e293b" stroke="#0f172a" strokeWidth="1" />
          <path d="M 16 28 A 4 4 0 0 1 16 36" fill="#0f172a" /> {/* Notch */}
          
          {/* Pins */}
          <line x1="0" y1="32" x2="16" y2="32" stroke="#94a3b8" strokeWidth="2" />
          <line x1="48" y1="32" x2="64" y2="32" stroke="#94a3b8" strokeWidth="2" />
          
          {/* Symbol */}
          <polygon points="24,24 24,40 38,32" fill="none" stroke="#94a3b8" strokeWidth="1.5" />
          <circle cx="40" cy="32" r="2" fill="none" stroke="#94a3b8" strokeWidth="1.5" />
          <text x="32" y="48" fontSize="6" fill="#64748b" textAnchor="middle" fontFamily="monospace">NOT</text>
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
    // Only pan if we are clicking directly on the canvas container (background)
    if (e.target !== containerRef.current) return;

    // Pan on Right Click (button 2) OR Left Click (button 0)
    if (e.button === 2 || e.button === 0) {
      e.preventDefault();
      setHasPanned(false);
      setPanStart({ x: e.clientX, y: e.clientY });
    }
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    // If we are holding a button and it's on the background, we might be panning
    if ((e.buttons === 1 || e.buttons === 2) && e.target === containerRef.current) {
        const dx = e.clientX - panStart.x;
        const dy = e.clientY - panStart.y;
        
        if (Math.abs(dx) > 2 || Math.abs(dy) > 2) {
            setIsPanning(true);
            setHasPanned(true);
        }
        
        if (isPanning) {
            setOffset({ x: offset.x + dx, y: offset.y + dy });
            setPanStart({ x: e.clientX, y: e.clientY });
        }
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

  const handleNodePointerDown = (e: React.PointerEvent, nodeId: string) => {
    e.stopPropagation();
    (e.target as HTMLElement).releasePointerCapture(e.pointerId);
    
    if (wiringStartNode === nodeId) {
      setWiringStartNode(null);
    } else if (wiringStartNode) {
      connectNodes(wiringStartNode, nodeId);
      setWiringStartNode(null);
    } else {
      setWiringStartNode(nodeId);
    }
  };

  const handleNodePointerUp = (e: React.PointerEvent, nodeId: string) => {
    e.stopPropagation();
    if (wiringStartNode && wiringStartNode !== nodeId) {
      connectNodes(wiringStartNode, nodeId);
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
      className="tour-canvas flex-1 bg-slate-50 relative overflow-hidden cursor-crosshair touch-none select-none"
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
                    strokeWidth={Math.min(12, 4 + Math.abs(current) * 2)}
                    strokeOpacity={Math.min(0.8, 0.2 + Math.abs(current) * 0.1)}
                    fill="none"
                    filter="url(#wire-glow)"
                    className="pointer-events-none transition-all duration-300"
                  />
                  <path
                    d={pathD}
                    stroke="#fbbf24" // Electron color (yellow)
                    strokeWidth="3"
                    fill="none"
                    strokeDasharray="6 14" // Dot size 6, gap 14
                    style={{
                      animation: `wire-flow ${duration}s linear infinite ${direction}`
                    }}
                    className="opacity-90"
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
          onPointerDown={(e) => handleNodePointerDown(e, node.id)}
          onPointerUp={(e) => handleNodePointerUp(e, node.id)}
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
