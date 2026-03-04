import React, { useState } from 'react';
import { useCircuitStore } from '../store';
import { ComponentType } from '../types';
import { 
  Battery, Zap, Lightbulb, Activity, ToggleLeft, Gauge, Search, Sliders, ZapOff, Sun, Type, 
  ArrowDownToLine, CircleDot, GitBranch, ChevronDown, ChevronRight,
  Radio, Cpu, ArrowRightToLine, Waves, Share2, Triangle
} from 'lucide-react';
import { cn } from '../lib/utils';

const COMPONENT_GROUPS = [
  {
    title: "Nguồn điện",
    items: [
      { type: 'battery', label: 'Pin (DC)', icon: Battery },
      { type: 'ac_source', label: 'Nguồn xoay chiều (AC)', icon: Waves },
      { type: 'ground', label: 'Nối đất (GND)', icon: ArrowDownToLine },
    ]
  },
  {
    title: "Linh kiện bán dẫn",
    items: [
      { type: 'diode', label: 'Đi-ốt', icon: ArrowRightToLine },
      { type: 'npn_transistor', label: 'Transistor NPN', icon: Share2 },
      { type: 'pnp_transistor', label: 'Transistor PNP', icon: Share2 },
      { type: 'opamp', label: 'Op-Amp', icon: Triangle },
    ]
  },
  {
    title: "Điều khiển",
    items: [
      { type: 'switch', label: 'Công tắc đơn', icon: ToggleLeft },
      { type: 'push_button', label: 'Nút nhấn', icon: CircleDot },
      { type: 'spdt_switch', label: 'Công tắc 3 cực', icon: GitBranch },
      { type: 'potentiometer', label: 'Biến trở', icon: Sliders },
    ]
  },
  {
    title: "Linh kiện thụ động",
    items: [
      { type: 'resistor', label: 'Điện trở', icon: Activity },
      { type: 'capacitor', label: 'Tụ điện', icon: Radio },
      { type: 'inductor', label: 'Cuộn cảm', icon: Cpu },
      { type: 'fuse', label: 'Cầu chì', icon: ZapOff },
    ]
  },
  {
    title: "Thiết bị đầu ra",
    items: [
      { type: 'lamp', label: 'Bóng đèn', icon: Lightbulb },
      { type: 'led', label: 'Đèn LED', icon: Sun },
    ]
  },
  {
    title: "Thiết bị đo",
    items: [
      { type: 'voltmeter', label: 'Vôn kế', icon: Gauge },
      { type: 'ammeter', label: 'Ampe kế', icon: Search },
    ]
  },
  {
    title: "Khác",
    items: [
      { type: 'text', label: 'Văn bản', icon: Type },
    ]
  }
] as const;

export function Sidebar({ onClose }: { onClose?: () => void }) {
  const addComponent = useCircuitStore((state) => state.addComponent);
  const [openGroups, setOpenGroups] = useState<Record<string, boolean>>({
    "Nguồn điện": true,
    "Bán dẫn & Tích cực": true,
    "Điều khiển": true,
    "Thụ động": true,
    "Đầu ra": true,
    "Đo lường": true,
    "Khác": true
  });

  const toggleGroup = (title: string) => {
    setOpenGroups(prev => ({ ...prev, [title]: !prev[title] }));
  };

  const handleDragStart = (e: React.DragEvent, type: ComponentType) => {
    e.dataTransfer.setData('componentType', type);
    e.dataTransfer.effectAllowed = 'copy';
  };

  const handleItemClick = (type: ComponentType) => {
    // Add component to center of screen based on current view
    const { offset, scale } = useCircuitStore.getState();
    
    // Get window dimensions (or container dimensions if possible, but window is good enough proxy)
    const windowWidth = window.innerWidth;
    const windowHeight = window.innerHeight;
    
    // Calculate center in screen coordinates (approximate center of canvas area)
    // Sidebar width is 288px (w-72) on desktop, 0 on mobile (overlay)
    // Inspector width is 320px (w-80) on desktop, 0 on mobile (overlay)
    // Let's assume mobile first (center of window)
    let centerX = windowWidth / 2;
    let centerY = windowHeight / 2;

    // Adjust for desktop layout if needed, but center of window is usually fine
    // Convert screen coordinates to world coordinates
    // worldX = (screenX - offsetX) / scale
    const worldX = (centerX - offset.x) / scale;
    const worldY = (centerY - offset.y) / scale;

    // Add some randomness to prevent perfect stacking
    const x = worldX + (Math.random() - 0.5) * 50;
    const y = worldY + (Math.random() - 0.5) * 50;

    addComponent(type, { x, y });
    
    if (onClose) onClose();
  };

  return (
    <div className="w-72 bg-white border-r border-slate-200 flex flex-col h-full select-none shadow-[4px_0_24px_rgba(0,0,0,0.02)] z-10 relative">
      <div className="p-5 border-b border-slate-100 bg-slate-50/50 flex items-center justify-between">
        <div>
            <h2 className="font-bold text-slate-800 flex items-center gap-2 text-lg">
            <Zap className="text-blue-600 fill-blue-600" size={20} />
            Linh kiện
            </h2>
            <p className="text-xs text-slate-500 mt-1.5">Kéo thả hoặc chạm để thêm</p>
        </div>
        {/* Mobile Close Button */}
        <button 
            onClick={onClose}
            className="md:hidden p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-lg"
        >
            <ChevronRight size={20} className="rotate-180" />
        </button>
      </div>
      
      <div className="flex-1 overflow-y-auto p-3 space-y-3 custom-scrollbar">
        {COMPONENT_GROUPS.map((group) => (
          <div key={group.title} className="border border-slate-100 rounded-xl bg-white overflow-hidden shadow-sm transition-all hover:shadow-md">
            <button 
              onClick={() => toggleGroup(group.title)}
              className="w-full flex items-center justify-between p-3.5 bg-slate-50/80 hover:bg-slate-100 transition-colors text-left"
            >
              <span className="font-semibold text-sm text-slate-700">{group.title}</span>
              {openGroups[group.title] ? <ChevronDown size={16} className="text-slate-400" /> : <ChevronRight size={16} className="text-slate-400" />}
            </button>
            
            {openGroups[group.title] && (
              <div className="p-2.5 grid grid-cols-2 gap-2 bg-white">
                {group.items.map((item) => (
                  <div
                    key={item.type}
                    draggable
                    onDragStart={(e) => handleDragStart(e, item.type as ComponentType)}
                    className={cn(
                      "flex flex-col items-center justify-center gap-2 p-3 rounded-lg border border-slate-100 bg-white hover:border-blue-300 hover:bg-blue-50 hover:shadow-sm transition-all cursor-grab active:cursor-grabbing group text-center"
                    )}
                    onClick={() => handleItemClick(item.type as ComponentType)}
                  >
                    <div className="w-10 h-10 rounded-full bg-slate-50 flex items-center justify-center group-hover:bg-white group-hover:shadow-sm transition-all border border-slate-100 group-hover:border-blue-200">
                      <item.icon className="w-5 h-5 text-slate-600 group-hover:text-blue-600 transition-colors" />
                    </div>
                    <span className="text-[11px] font-medium text-slate-600 group-hover:text-blue-700 leading-tight">{item.label}</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>
      
      <div className="p-4 border-t border-slate-100 bg-slate-50/80">
        <div className="text-xs text-slate-500 text-center flex items-center justify-center gap-1.5">
          <span className="bg-white px-1.5 py-0.5 rounded border border-slate-200 shadow-sm font-mono text-[10px] font-medium text-slate-600">Ctrl</span>
          <span>+ Kéo để di chuyển nút nhấn</span>
        </div>
      </div>
    </div>
  );
}
