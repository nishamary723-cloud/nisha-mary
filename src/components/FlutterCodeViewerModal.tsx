import React, { useState } from 'react';
import { X, Copy, Check, Code2, FileCode, Download } from 'lucide-react';
import { FLUTTER_PROJECT_FILES, FlutterFile } from '../data/flutterSourceCode';

interface FlutterCodeViewerModalProps {
  onClose: () => void;
}

export const FlutterCodeViewerModal: React.FC<FlutterCodeViewerModalProps> = ({ onClose }) => {
  const [selectedFileIndex, setSelectedFileIndex] = useState(0);
  const [copied, setCopied] = useState(false);

  const currentFile: FlutterFile = FLUTTER_PROJECT_FILES[selectedFileIndex];

  const handleCopyCode = () => {
    navigator.clipboard.writeText(currentFile.code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownloadAll = () => {
    const combinedContent = FLUTTER_PROJECT_FILES.map(
      (f) => `// ==========================================\n// FILE: ${f.filename}\n// DESCRIPTION: ${f.description}\n// ==========================================\n\n${f.code}\n\n`
    ).join('\n');

    const blob = new Blob([combinedContent], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'LocalLens_Flutter_Codebase_NishaMaryJ.txt';
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/85 backdrop-blur-sm animate-in fade-in">
      <div className="relative w-full max-w-4xl max-h-[92vh] bg-slate-900 border border-amber-500/30 rounded-3xl p-5 shadow-2xl flex flex-col overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-800 pb-3">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-2xl bg-cyan-500/15 border border-cyan-500/30 text-cyan-400 flex items-center justify-center">
              <Code2 className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-bold text-white text-base">Flutter & Dart Source Code</h3>
                <span className="bg-cyan-500/20 text-cyan-300 border border-cyan-500/30 font-bold text-[10px] px-2 py-0.5 rounded-full">
                  Production Modular
                </span>
              </div>
              <p className="text-[11px] text-slate-400">
                Complete Flutter codebase for college submission & viva • By Nisha Mary J
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-full bg-slate-800 hover:bg-slate-700 text-slate-300 transition"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Toolbar & File Tabs */}
        <div className="pt-3 pb-2 flex items-center justify-between gap-2 border-b border-slate-800 overflow-x-auto">
          <div className="flex items-center gap-1.5 overflow-x-auto scrollbar-none py-1">
            {FLUTTER_PROJECT_FILES.map((f, i) => (
              <button
                key={f.filename}
                onClick={() => setSelectedFileIndex(i)}
                className={`flex-shrink-0 flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-mono transition border ${
                  selectedFileIndex === i
                    ? 'bg-amber-500 text-slate-950 font-bold border-amber-400'
                    : 'bg-slate-800/80 hover:bg-slate-800 text-slate-300 border-slate-700'
                }`}
              >
                <FileCode className="w-3.5 h-3.5" />
                <span>{f.filename.split('/').pop()}</span>
              </button>
            ))}
          </div>

          <div className="flex items-center gap-2 flex-shrink-0">
            <button
              onClick={handleCopyCode}
              className="flex items-center gap-1 bg-slate-800 hover:bg-slate-700 text-amber-300 border border-slate-700 px-3 py-1.5 rounded-xl text-xs font-bold transition active:scale-95"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copied ? 'Copied!' : 'Copy File'}</span>
            </button>
            <button
              onClick={handleDownloadAll}
              className="hidden sm:flex items-center gap-1 bg-cyan-600 hover:bg-cyan-500 text-white px-3 py-1.5 rounded-xl text-xs font-bold transition active:scale-95"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Export Bundle</span>
            </button>
          </div>
        </div>

        {/* File Description Header */}
        <div className="py-2.5 px-3 bg-slate-950/80 border-b border-slate-800/80 flex items-center justify-between text-xs">
          <div className="flex items-center gap-2">
            <span className="font-mono text-cyan-400 font-bold">{currentFile.filename}</span>
            <span className="text-slate-500">•</span>
            <span className="text-slate-400">{currentFile.description}</span>
          </div>
          <span className="bg-slate-800 text-slate-400 font-mono text-[10px] px-2 py-0.5 rounded">
            {currentFile.language}
          </span>
        </div>

        {/* Code Content */}
        <div className="overflow-y-auto flex-1 bg-slate-950 p-4 rounded-b-2xl font-mono text-[11px] leading-relaxed text-slate-200">
          <pre className="whitespace-pre overflow-x-auto selection:bg-amber-500 selection:text-slate-950">
            <code>{currentFile.code}</code>
          </pre>
        </div>
      </div>
    </div>
  );
};
