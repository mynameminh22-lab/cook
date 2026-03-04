import React, { useState } from 'react';
import { COMPONENT_DOCS } from '../data/componentDocs';
import { X, BookOpen, Search } from 'lucide-react';
import { cn } from '../lib/utils';

interface WikiProps {
  isOpen: boolean;
  onClose: () => void;
}

export function Wiki({ isOpen, onClose }: WikiProps) {
  const [searchTerm, setSearchTerm] = useState('');

  if (!isOpen) return null;

  const filteredDocs = COMPONENT_DOCS.filter(doc => 
    doc.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    doc.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4 sm:p-6 animate-in fade-in duration-200">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-6xl h-[90vh] flex flex-col overflow-hidden animate-in zoom-in-95 duration-200 border border-slate-200/50">
        
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 bg-white">
          <div className="flex items-center gap-3">
            <div className="bg-blue-100/80 p-2.5 rounded-xl border border-blue-200/50">
              <BookOpen className="text-blue-600 w-6 h-6" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-slate-800">Kiến thức Linh kiện</h2>
              <p className="text-sm text-slate-500 font-medium">Tìm hiểu nguyên lý hoạt động và ứng dụng thực tế</p>
            </div>
          </div>
          <button 
            onClick={onClose}
            className="p-2 hover:bg-slate-100 text-slate-400 hover:text-slate-600 rounded-full transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        {/* Search Bar */}
        <div className="px-6 py-4 border-b border-slate-100 bg-slate-50/50 sticky top-0 z-10">
          <div className="relative max-w-xl mx-auto">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5" />
            <input 
              type="text" 
              placeholder="Tìm kiếm linh kiện (VD: Điện trở, Tụ điện...)" 
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
                  
                  <div>
                    <h4 className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1.5">Nguyên lý</h4>
                    <p className="text-sm text-slate-600 leading-relaxed font-medium">{doc.principle}</p>
                  </div>

                  {doc.formula && (
                    <div className="bg-blue-50/50 p-3.5 rounded-xl border border-blue-100/50">
                      <h4 className="text-[11px] font-bold text-blue-500 uppercase tracking-wider mb-1.5">Công thức</h4>
                      <code className="text-sm font-mono text-blue-700 block bg-white px-2 py-1 rounded border border-blue-100">{doc.formula}</code>
                    </div>
                  )}

                  <div className="pt-4 border-t border-slate-100 mt-auto">
                    <h4 className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1.5">Ứng dụng cơ bản</h4>
                    <p className="text-sm text-slate-500 italic font-medium">{doc.usage}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {filteredDocs.length === 0 && (
            <div className="flex flex-col items-center justify-center h-64 text-slate-400">
              <Search className="w-12 h-12 mb-4 opacity-20" />
              <p>Không tìm thấy linh kiện phù hợp.</p>
            </div>
          )}
        </div>

      </div>
    </div>
  );
}
