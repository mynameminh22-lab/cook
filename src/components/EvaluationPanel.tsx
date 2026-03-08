import React from 'react';
import { useShallow } from 'zustand/react/shallow';
import { useCircuitStore } from '../store';
import { X, AlertTriangle, CheckCircle, Zap, Activity } from 'lucide-react';
import { cn } from '../lib/utils';

export function EvaluationPanel() {
  const { evaluationResult, evaluateCircuit } = useCircuitStore(useShallow(state => ({
    evaluationResult: state.evaluationResult,
    evaluateCircuit: state.evaluateCircuit
  })));

  if (!evaluationResult) return null;

  const { score, safetyIssues, connectionIssues, performanceIssues, efficiency, totalPower, totalCost } = evaluationResult;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4 animate-in fade-in duration-200">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl overflow-hidden animate-in zoom-in-95 duration-200 border border-slate-200">
        
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 bg-slate-50">
          <div className="flex items-center gap-3">
            <div className="bg-blue-100 p-2 rounded-lg">
              <Activity className="text-blue-600 w-6 h-6" />
            </div>
            <h2 className="text-xl font-bold text-slate-800">Đánh giá Mạch điện</h2>
          </div>
          <button 
            onClick={() => useCircuitStore.setState({ evaluationResult: null })}
            className="p-2 hover:bg-slate-200 text-slate-500 rounded-full transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 max-h-[70vh] overflow-y-auto custom-scrollbar space-y-6">
          
          {/* Score Section */}
          <div className="flex items-center justify-center py-4">
            <div className="relative w-32 h-32 flex items-center justify-center">
              <svg className="w-full h-full transform -rotate-90">
                <circle
                  cx="64"
                  cy="64"
                  r="56"
                  stroke="currentColor"
                  strokeWidth="12"
                  fill="transparent"
                  className="text-slate-100"
                />
                <circle
                  cx="64"
                  cy="64"
                  r="56"
                  stroke="currentColor"
                  strokeWidth="12"
                  fill="transparent"
                  strokeDasharray={351.86}
                  strokeDashoffset={351.86 - (351.86 * score) / 100}
                  className={cn(
                    "transition-all duration-1000 ease-out",
                    score >= 80 ? "text-green-500" :
                    score >= 50 ? "text-yellow-500" : "text-red-500"
                  )}
                />
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className={cn(
                  "text-4xl font-bold",
                  score >= 80 ? "text-green-600" :
                  score >= 50 ? "text-yellow-600" : "text-red-600"
                )}>
                  {Math.round(score)}
                </span>
                <span className="text-xs text-slate-400 font-medium uppercase tracking-wider">Điểm</span>
              </div>
            </div>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-3 gap-4">
            <div className="bg-slate-50 p-4 rounded-xl border border-slate-100 flex flex-col items-center text-center">
              <span className="text-slate-500 text-xs font-bold uppercase tracking-wider mb-1">Tổng công suất</span>
              <span className="text-xl font-bold text-slate-800">{totalPower.toFixed(2)} W</span>
            </div>
            <div className="bg-slate-50 p-4 rounded-xl border border-slate-100 flex flex-col items-center text-center">
              <span className="text-slate-500 text-xs font-bold uppercase tracking-wider mb-1">Hiệu suất</span>
              <span className="text-xl font-bold text-slate-800">{efficiency.toFixed(1)}%</span>
            </div>
            <div className="bg-slate-50 p-4 rounded-xl border border-slate-100 flex flex-col items-center text-center">
              <span className="text-slate-500 text-xs font-bold uppercase tracking-wider mb-1">Tổng chi phí</span>
              <span className="text-xl font-bold text-slate-800">{totalCost?.toLocaleString('vi-VN') || 0} đ</span>
            </div>
          </div>

          {/* Issues List */}
          <div className="space-y-4">
            {safetyIssues.length > 0 && (
              <div className="bg-red-50 border border-red-100 rounded-xl p-4">
                <h3 className="flex items-center gap-2 text-red-700 font-bold mb-3">
                  <AlertTriangle size={18} />
                  Vấn đề An toàn ({safetyIssues.length})
                </h3>
                <ul className="space-y-2">
                  {safetyIssues.map((issue, idx) => (
                    <li key={idx} className="text-sm text-red-600 flex items-start gap-2">
                      <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-red-400 shrink-0" />
                      {issue}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {connectionIssues.length > 0 && (
              <div className="bg-orange-50 border border-orange-100 rounded-xl p-4">
                <h3 className="flex items-center gap-2 text-orange-700 font-bold mb-3">
                  <Zap size={18} />
                  Vấn đề Kết nối ({connectionIssues.length})
                </h3>
                <ul className="space-y-2">
                  {connectionIssues.map((issue, idx) => (
                    <li key={idx} className="text-sm text-orange-600 flex items-start gap-2">
                      <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-orange-400 shrink-0" />
                      {issue}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {performanceIssues.length > 0 && (
              <div className="bg-blue-50 border border-blue-100 rounded-xl p-4">
                <h3 className="flex items-center gap-2 text-blue-700 font-bold mb-3">
                  <Activity size={18} />
                  Hiệu suất & Tối ưu ({performanceIssues.length})
                </h3>
                <ul className="space-y-2">
                  {performanceIssues.map((issue, idx) => (
                    <li key={idx} className="text-sm text-blue-600 flex items-start gap-2">
                      <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-blue-400 shrink-0" />
                      {issue}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {safetyIssues.length === 0 && connectionIssues.length === 0 && performanceIssues.length === 0 && (
              <div className="bg-green-50 border border-green-100 rounded-xl p-6 text-center">
                <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-3">
                  <CheckCircle className="text-green-600 w-6 h-6" />
                </div>
                <h3 className="text-green-800 font-bold text-lg mb-1">Tuyệt vời!</h3>
                <p className="text-green-600 text-sm">Mạch điện hoạt động tốt và không có vấn đề gì.</p>
              </div>
            )}
          </div>

        </div>
        
        {/* Footer */}
        <div className="p-4 border-t border-slate-100 bg-slate-50 flex justify-end">
          <button 
            onClick={() => useCircuitStore.setState({ evaluationResult: null })}
            className="px-6 py-2 bg-slate-800 hover:bg-slate-900 text-white rounded-lg font-medium transition-colors"
          >
            Đóng
          </button>
        </div>
      </div>
    </div>
  );
}
