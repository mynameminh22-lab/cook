import React, { useState } from 'react';
import { COMPONENT_DOCS } from '../data/componentDocs';
import { ELECTRICAL_LAWS, SAFETY_PRINCIPLES } from '../data/educationDocs';
import { X, BookOpen, Search, Zap, ShieldAlert, Component } from 'lucide-react';
import { cn } from '../lib/utils';

interface WikiProps {
  isOpen: boolean;
  onClose: () => void;
}

export function Wiki({ isOpen, onClose }: WikiProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [activeTab, setActiveTab] = useState<'components' | 'laws' | 'safety'>('components');

  if (!isOpen) return null;

  const getActiveData = () => {
    switch (activeTab) {
      case 'components': return COMPONENT_DOCS;
      case 'laws': return ELECTRICAL_LAWS;
      case 'safety': return SAFETY_PRINCIPLES;
      default: return [];
    }
  };

  const filteredDocs = getActiveData().filter(doc => 
    doc.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    doc.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4 sm:p-6 animate-in fade-in duration-200">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-6xl h-[90vh] flex flex-col overflow-hidden animate-in zoom-in-95 duration-200 border border-slate-200/50">
        
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 bg-white shrink-0">
          <div className="flex items-center gap-3">
            <div className="bg-blue-100/80 p-2.5 rounded-xl border border-blue-200/50">
              <BookOpen className="text-blue-600 w-6 h-6" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-slate-800">Kiến thức Mạch điện</h2>
              <p className="text-sm text-slate-500 font-medium">Tìm hiểu linh kiện, định luật và an toàn</p>
            </div>
          </div>
          <button 
            onClick={onClose}
            className="p-2 hover:bg-slate-100 text-slate-400 hover:text-slate-600 rounded-full transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        {/* Tabs */}
        <div className="flex border-b border-slate-200 bg-slate-50/50 px-2 sm:px-6 overflow-x-auto hide-scrollbar shrink-0">
          <button
            onClick={() => setActiveTab('components')}
            className={cn(
              "flex items-center gap-2 px-4 sm:px-6 py-4 font-bold text-sm transition-all border-b-2 whitespace-nowrap",
              activeTab === 'components' 
                ? "border-blue-600 text-blue-600 bg-blue-50/50" 
                : "border-transparent text-slate-500 hover:text-slate-700 hover:bg-slate-100"
            )}
          >
            <Component size={18} />
            Linh kiện
          </button>
          <button
            onClick={() => setActiveTab('laws')}
            className={cn(
              "flex items-center gap-2 px-4 sm:px-6 py-4 font-bold text-sm transition-all border-b-2 whitespace-nowrap",
              activeTab === 'laws' 
                ? "border-blue-600 text-blue-600 bg-blue-50/50" 
                : "border-transparent text-slate-500 hover:text-slate-700 hover:bg-slate-100"
            )}
          >
            <Zap size={18} />
            Định luật
          </button>
          <button
            onClick={() => setActiveTab('safety')}
            className={cn(
              "flex items-center gap-2 px-4 sm:px-6 py-4 font-bold text-sm transition-all border-b-2 whitespace-nowrap",
              activeTab === 'safety' 
                ? "border-blue-600 text-blue-600 bg-blue-50/50" 
                : "border-transparent text-slate-500 hover:text-slate-700 hover:bg-slate-100"
            )}
          >
            <ShieldAlert size={18} />
            An toàn
          </button>
        </div>

        {/* Search Bar */}
        <div className="px-6 py-4 border-b border-slate-100 bg-slate-50/50 sticky top-0 z-10 shrink-0">
          <div className="relative max-w-xl mx-auto">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5" />
            <input 
              type="text" 
              placeholder="Tìm kiếm..." 
              className="w-full pl-12 pr-4 py-3 bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 transition-all shadow-sm text-slate-700 placeholder:text-slate-400 font-medium"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>

        {/* Content Grid */}
        <div className="flex-1 overflow-y-auto p-6 bg-slate-50/30 custom-scrollbar">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 max-w-7xl mx-auto">
            {filteredDocs.map((doc) => (
              <div 
                key={doc.title} 
                className="bg-white rounded-2xl border border-slate-200/60 shadow-sm hover:shadow-md transition-all duration-300 overflow-hidden flex flex-col group"
              >
                {/* Card Header */}
                <div className="p-5 bg-gradient-to-br from-slate-50 to-white border-b border-slate-100 flex items-center gap-4">
                  <div className="w-12 h-12 rounded-xl bg-white border border-slate-200/60 flex items-center justify-center shadow-sm group-hover:scale-105 transition-transform">
                    <doc.icon className="w-6 h-6 text-slate-700" />
                  </div>
                  <h3 className="font-bold text-slate-800 text-lg leading-tight">{doc.title}</h3>
                </div>
                
                {/* Card Body */}
                <div className="p-5 space-y-5 flex-1 flex flex-col">
                  <div>
                    <h4 className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1.5">Mô tả</h4>
                    <p className="text-sm text-slate-600 leading-relaxed font-medium">{doc.description}</p>
                  </div>

                  {/* Price Display */}
                  {'price' in doc && (
                    <div>
                      <h4 className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1.5">Giá thành</h4>
                      <p className="text-sm text-emerald-600 leading-relaxed font-bold">{(doc as any).price.toLocaleString('vi-VN')} VND</p>
                    </div>
                  )}
                  
                  <div>
                    <h4 className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1.5">Nguyên lý</h4>
                    <p className="text-sm text-slate-600 leading-relaxed font-medium">{doc.principle}</p>
                  </div>

                  {doc.formula && (
                    <div className="bg-blue-50/50 p-3.5 rounded-xl border border-blue-100/50">
                      <h4 className="text-[11px] font-bold text-blue-500 uppercase tracking-wider mb-1.5">
                        {activeTab === 'safety' ? 'Quy tắc' : 'Công thức'}
                      </h4>
                      <code className="text-sm font-mono text-blue-700 block bg-white px-2 py-1 rounded border border-blue-100">{doc.formula}</code>
                    </div>
                  )}

                  <div className="pt-4 border-t border-slate-100 mt-auto">
                    <h4 className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1.5">
                      {activeTab === 'safety' ? 'Ứng dụng thực tế' : 'Ứng dụng cơ bản'}
                    </h4>
                    <p className="text-sm text-slate-500 italic font-medium">{doc.usage}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {filteredDocs.length === 0 && (
            <div className="flex flex-col items-center justify-center h-64 text-slate-400">
              <Search className="w-12 h-12 mb-4 opacity-20" />
              <p>Không tìm thấy nội dung phù hợp.</p>
            </div>
          )}
        </div>

      </div>
    </div>
  );
}
