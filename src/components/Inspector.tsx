import React from 'react';
import { useShallow } from 'zustand/react/shallow';
import { useCircuitStore } from '../store';
import { Trash2, RotateCw, ChevronRight } from 'lucide-react';
import { cn } from '../lib/utils';

export function Inspector({ onClose }: { onClose?: () => void }) {
  const { 
    components, 
    selectedId, 
    updateComponent, 
    removeComponent, 
    rotateComponent 
  } = useCircuitStore(useShallow(state => ({
    components: state.components,
    selectedId: state.selectedId,
    updateComponent: state.updateComponent,
    removeComponent: state.removeComponent,
    rotateComponent: state.rotateComponent
  })));
  
  const selectedComponent = components.find(c => c.id === selectedId);

  if (!selectedComponent) {
    return (
      <div className="w-80 bg-white border-l border-slate-200 p-6 flex flex-col gap-4 shadow-[[-4px_0_24px_rgba(0,0,0,0.02)]] z-20 h-full relative">
        {/* Mobile Close Button */}
        <button 
            onClick={onClose}
            className="md:hidden absolute top-4 right-4 p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-lg"
        >
            <ChevronRight size={20} />
        </button>

        <div className="text-slate-400 text-center mt-12 text-sm flex flex-col items-center gap-3">
          <div className="w-12 h-12 rounded-full bg-slate-50 flex items-center justify-center border border-slate-100">
            <div className="w-6 h-6 border-2 border-slate-300 border-dashed rounded-sm"></div>
          </div>
          <p>Chọn một linh kiện để xem thuộc tính</p>
        </div>
      </div>
    );
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = parseFloat(e.target.value);
    if (!isNaN(val)) {
      updateComponent(selectedComponent.id, { value: val });
    }
  };

  const handleTextChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    updateComponent(selectedComponent.id, { text: e.target.value });
  };

  const handleRatingChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = parseFloat(e.target.value);
    if (!isNaN(val)) {
      updateComponent(selectedComponent.id, { rating: val });
    }
  };

  const handleMaxPowerChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = parseFloat(e.target.value);
    if (!isNaN(val)) updateComponent(selectedComponent.id, { maxPower: val });
  };

  const handleMaxCurrentChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = parseFloat(e.target.value);
    if (!isNaN(val)) updateComponent(selectedComponent.id, { maxCurrent: val });
  };

  const handleMaxVoltageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = parseFloat(e.target.value);
    if (!isNaN(val)) updateComponent(selectedComponent.id, { maxVoltage: val });
  };

  return (
    <div className="w-80 bg-white border-l border-slate-200 flex flex-col shadow-[[-4px_0_24px_rgba(0,0,0,0.02)]] z-20 h-full overflow-y-auto custom-scrollbar relative">
      <div className="p-5 border-b border-slate-100 bg-slate-50/50 flex items-center justify-between">
        <div>
            <h2 className="font-bold text-slate-800 text-lg mb-1">Thuộc tính</h2>
            <div className="text-xs text-blue-600 uppercase tracking-wider font-bold bg-blue-50 inline-block px-2 py-1 rounded-md border border-blue-100">
            {selectedComponent.type === 'resistor' ? 'Điện trở' :
            selectedComponent.type === 'battery' ? 'Nguồn điện' :
            selectedComponent.type === 'lamp' ? 'Bóng đèn' :
            selectedComponent.type === 'switch' ? 'Công tắc' : 
            selectedComponent.type === 'push_button' ? 'Nút nhấn' :
            selectedComponent.type === 'spdt_switch' ? 'Công tắc 3 cực' :
            selectedComponent.type === 'ground' ? 'Nối đất' :
            selectedComponent.type === 'voltmeter' ? 'Vôn kế' :
            selectedComponent.type === 'ammeter' ? 'Ampe kế' :
            selectedComponent.type === 'potentiometer' ? 'Biến trở' :
            selectedComponent.type === 'fuse' ? 'Cầu chì' :
            selectedComponent.type === 'led' ? 'Đèn LED' :
            selectedComponent.type === 'text' ? 'Văn bản' :
            selectedComponent.type === 'capacitor' ? 'Tụ điện' :
            selectedComponent.type === 'inductor' ? 'Cuộn cảm' :
            selectedComponent.type === 'diode' ? 'Đi-ốt' :
            selectedComponent.type === 'ac_source' ? 'Nguồn xoay chiều' :
            selectedComponent.type === 'npn_transistor' ? 'Transistor NPN' :
            selectedComponent.type === 'pnp_transistor' ? 'Transistor PNP' :
            selectedComponent.type === 'opamp' ? 'Op-Amp' :
            selectedComponent.type}
            </div>
        </div>
        {/* Mobile Close Button */}
        <button 
            onClick={onClose}
            className="md:hidden p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-lg"
        >
            <ChevronRight size={20} />
        </button>
      </div>

      <div className="p-5 space-y-5">
        {/* Value Input */}
        {(selectedComponent.type === 'resistor' || selectedComponent.type === 'battery' || selectedComponent.type === 'lamp' || selectedComponent.type === 'potentiometer' || selectedComponent.type === 'led' || selectedComponent.type === 'capacitor' || selectedComponent.type === 'inductor' || selectedComponent.type === 'diode' || selectedComponent.type === 'ac_source' || selectedComponent.type === 'npn_transistor' || selectedComponent.type === 'pnp_transistor' || selectedComponent.type === 'opamp') && (
          <div className="bg-slate-50/50 p-4 rounded-xl border border-slate-100">
            <label className="block text-xs font-bold text-slate-500 mb-2 uppercase tracking-wider">
              {selectedComponent.type === 'resistor' || selectedComponent.type === 'potentiometer' ? 'Điện trở (Ω)' :
               selectedComponent.type === 'battery' ? 'Điện áp (V)' :
               selectedComponent.type === 'ac_source' ? 'Điện áp đỉnh (V)' :
               selectedComponent.type === 'capacitor' ? 'Điện dung (F)' :
               selectedComponent.type === 'inductor' ? 'Độ tự cảm (H)' :
               selectedComponent.type === 'diode' ? 'Điện áp rơi (V)' :
               selectedComponent.type === 'led' ? 'Điện trở nội (Ω)' :
               selectedComponent.type === 'npn_transistor' || selectedComponent.type === 'pnp_transistor' ? 'Hệ số khuếch đại (β)' :
               selectedComponent.type === 'opamp' ? 'Hệ số khuếch đại vòng hở (Aol)' :
               'Công suất (W) / Trở kháng'}
            </label>
            <input
              type="number"
              value={selectedComponent.value}
              onChange={handleChange}
              className="w-full px-3.5 py-2.5 bg-white border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all text-slate-700 font-medium shadow-sm"
            />
            {(selectedComponent.type === 'resistor' || selectedComponent.type === 'potentiometer' || selectedComponent.type === 'battery') && (
                <input 
                    type="range" 
                    min="0" 
                    max={selectedComponent.type === 'battery' ? 24 : 10000} 
                    step={selectedComponent.type === 'battery' ? 0.5 : 10}
                    value={selectedComponent.value}
                    onChange={handleChange}
                    className="w-full mt-3 accent-blue-600 cursor-pointer"
                />
            )}
          </div>
        )}

        {/* Frequency Input for AC Source */}
        {selectedComponent.type === 'ac_source' && (
          <div className="bg-slate-50/50 p-4 rounded-xl border border-slate-100">
            <label className="block text-xs font-bold text-slate-500 mb-2 uppercase tracking-wider">
              Tần số (Hz)
            </label>
            <input
              type="number"
              value={selectedComponent.rating || 50}
              onChange={handleRatingChange}
              className="w-full px-3.5 py-2.5 bg-white border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all text-slate-700 font-medium shadow-sm"
            />
          </div>
        )}

        {/* Switch State Toggle */}
        {(selectedComponent.type === 'switch' || selectedComponent.type === 'spdt_switch' || selectedComponent.type === 'push_button') && (
          <div className="flex items-center justify-between bg-slate-50/50 p-4 rounded-xl border border-slate-100">
            <span className="text-sm font-bold text-slate-600">Trạng thái</span>
            <button
              onClick={() => updateComponent(selectedComponent.id, { isOpen: !selectedComponent.isOpen })}
              className={cn(
                "px-4 py-1.5 rounded-lg text-xs font-bold transition-all shadow-sm border",
                selectedComponent.isOpen ? "bg-white text-slate-600 border-slate-200 hover:bg-slate-50" : "bg-emerald-500 text-white border-emerald-600 hover:bg-emerald-600"
              )}
            >
              {selectedComponent.isOpen ? "Mở (Ngắt)" : "Đóng (Dẫn)"}
            </button>
          </div>
        )}

        {/* Fuse Rating Input */}
        {selectedComponent.type === 'fuse' && (
          <div className="bg-slate-50/50 p-4 rounded-xl border border-slate-100">
            <label className="block text-xs font-bold text-slate-500 mb-2 uppercase tracking-wider">
              Dòng điện tối đa (A)
            </label>
            <input
              type="number"
              value={selectedComponent.rating || 0.5}
              onChange={handleRatingChange}
              step="0.1"
              className="w-full px-3.5 py-2.5 bg-white border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all text-slate-700 font-medium shadow-sm"
            />
          </div>
        )}

        {/* Max Power Input */}
        {['resistor', 'potentiometer'].includes(selectedComponent.type) && (
          <div className="bg-slate-50/50 p-4 rounded-xl border border-slate-100">
            <label className="block text-xs font-bold text-slate-500 mb-2 uppercase tracking-wider">
              Công suất tối đa (W)
            </label>
            <input
              type="number"
              value={selectedComponent.maxPower || 0.5}
              onChange={handleMaxPowerChange}
              step="0.1"
              className="w-full px-3.5 py-2.5 bg-white border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all text-slate-700 font-medium shadow-sm"
            />
          </div>
        )}

        {/* Max Current Input */}
        {['led', 'diode'].includes(selectedComponent.type) && (
          <div className="bg-slate-50/50 p-4 rounded-xl border border-slate-100">
            <label className="block text-xs font-bold text-slate-500 mb-2 uppercase tracking-wider">
              Dòng điện tối đa (A)
            </label>
            <input
              type="number"
              value={selectedComponent.maxCurrent || 0.05}
              onChange={handleMaxCurrentChange}
              step="0.01"
              className="w-full px-3.5 py-2.5 bg-white border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all text-slate-700 font-medium shadow-sm"
            />
          </div>
        )}

        {/* Max Voltage Input */}
        {['capacitor', 'lamp'].includes(selectedComponent.type) && (
          <div className="bg-slate-50/50 p-4 rounded-xl border border-slate-100">
            <label className="block text-xs font-bold text-slate-500 mb-2 uppercase tracking-wider">
              Điện áp tối đa (V)
            </label>
            <input
              type="number"
              value={selectedComponent.maxVoltage || (selectedComponent.type === 'lamp' ? 18 : 16)}
              onChange={handleMaxVoltageChange}
              step="1"
              className="w-full px-3.5 py-2.5 bg-white border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all text-slate-700 font-medium shadow-sm"
            />
          </div>
        )}

        {/* Breakable Component Status */}
        {(selectedComponent.type === 'fuse' || selectedComponent.type === 'resistor' || selectedComponent.type === 'lamp' || selectedComponent.type === 'led') && (
             <div className="mt-2 text-sm bg-slate-50/50 p-4 rounded-xl border border-slate-100">
                <div className="flex justify-between items-center mb-1">
                    <span className="font-bold text-slate-600">Trạng thái:</span>
                    <span className={cn("font-bold px-2 py-0.5 rounded-md text-xs", selectedComponent.isBroken ? "bg-red-100 text-red-700 border border-red-200" : "bg-emerald-100 text-emerald-700 border border-emerald-200")}>
                        {selectedComponent.isBroken ? "Đã hỏng" : "Bình thường"}
                    </span>
                </div>
                {selectedComponent.isBroken && (
                    <button 
                        onClick={() => updateComponent(selectedComponent.id, { isBroken: false })}
                        className="mt-3 w-full px-3 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 text-center font-bold shadow-sm transition-colors"
                    >
                        Sửa chữa linh kiện
                    </button>
                )}
                {selectedComponent.isBroken && (
                    <div className="mt-2 text-xs text-red-500/80 italic text-center font-medium bg-red-50/50 py-1.5 rounded-md">
                        {selectedComponent.type === 'resistor' && "Quá tải công suất (>0.5W)"}
                        {selectedComponent.type === 'led' && "Quá tải dòng điện (>50mA)"}
                        {selectedComponent.type === 'lamp' && "Quá áp (>18V)"}
                        {selectedComponent.type === 'fuse' && "Quá tải dòng điện"}
                    </div>
                )}
            </div>
        )}

        {/* Text Input */}
        {selectedComponent.type === 'text' && (
          <div className="bg-slate-50/50 p-4 rounded-xl border border-slate-100">
            <label className="block text-xs font-bold text-slate-500 mb-2 uppercase tracking-wider">
              Nội dung
            </label>
            <input
              type="text"
              value={selectedComponent.text || ''}
              onChange={handleTextChange}
              className="w-full px-3.5 py-2.5 bg-white border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all text-slate-700 font-medium shadow-sm"
            />
          </div>
        )}

        {/* Info Display (Skip for Text) */}
        {selectedComponent.type !== 'text' && (
        <div className="bg-slate-800 p-4 rounded-xl border border-slate-700 space-y-3 shadow-inner text-slate-300">
          <div className="flex justify-between text-sm items-center">
            <span className="text-slate-400 font-medium">Dòng điện:</span>
            <span className="font-mono font-bold text-emerald-400 bg-emerald-400/10 px-2 py-0.5 rounded border border-emerald-400/20">
              {(selectedComponent.current * 1000).toFixed(2)} mA
            </span>
          </div>
          <div className="flex justify-between text-sm items-center">
            <span className="text-slate-400 font-medium">Hiệu điện thế:</span>
            <span className="font-mono font-bold text-blue-400 bg-blue-400/10 px-2 py-0.5 rounded border border-blue-400/20">
              {selectedComponent.voltageDrop.toFixed(2)} V
            </span>
          </div>
          {(selectedComponent.type === 'resistor' || selectedComponent.type === 'potentiometer' || selectedComponent.type === 'lamp' || selectedComponent.type === 'led' || selectedComponent.type === 'fuse') && (
            <div className="flex justify-between text-sm items-center">
              <span className="text-slate-400 font-medium">Công suất:</span>
              <span className="font-mono font-bold text-amber-400 bg-amber-400/10 px-2 py-0.5 rounded border border-amber-400/20">
                {(Math.abs(selectedComponent.current * selectedComponent.voltageDrop) * 1000).toFixed(2)} mW
              </span>
            </div>
          )}
          {(selectedComponent.type === 'resistor' || selectedComponent.type === 'potentiometer' || selectedComponent.type === 'lamp' || selectedComponent.type === 'led' || selectedComponent.type === 'fuse' || selectedComponent.type === 'battery' || selectedComponent.type === 'ac_source' || selectedComponent.type === 'npn_transistor' || selectedComponent.type === 'pnp_transistor') && (
            <div className="flex justify-between text-sm items-center">
              <span className="text-slate-400 font-medium">Nhiệt độ:</span>
              <span className={cn("font-mono font-bold px-2 py-0.5 rounded border", 
                  (selectedComponent.temperature || 25) > 100 ? "text-red-400 bg-red-400/10 border-red-400/20" : 
                  (selectedComponent.temperature || 25) > 50 ? "text-orange-400 bg-orange-400/10 border-orange-400/20" : 
                  "text-emerald-400 bg-emerald-400/10 border-emerald-400/20"
              )}>
                {(selectedComponent.temperature || 25).toFixed(1)} °C
              </span>
            </div>
          )}
        </div>
        )}

        {/* Actions */}
        <div className="flex gap-3 pt-5 border-t border-slate-100">
          <button
            onClick={() => rotateComponent(selectedComponent.id)}
            className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 bg-white border border-slate-200 text-slate-700 rounded-xl hover:bg-slate-50 hover:border-slate-300 transition-all shadow-sm font-bold"
            title="Xoay 90 độ"
          >
            <RotateCw size={18} className="text-slate-500" />
            <span className="text-sm">Xoay</span>
          </button>
          <button
            onClick={() => removeComponent(selectedComponent.id)}
            className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 bg-red-50 text-red-600 border border-red-100 rounded-xl hover:bg-red-100 transition-all shadow-sm font-bold"
            title="Xóa linh kiện"
          >
            <Trash2 size={18} />
            <span className="text-sm">Xóa</span>
          </button>
        </div>
      </div>
    </div>
  );
}
