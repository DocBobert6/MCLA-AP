import React, { useState } from 'react';
import { 
  Code2, 
  Copy, 
  Check, 
  FileCode, 
  Layers, 
  Download,
  Terminal,
  Smartphone,
  ExternalLink
} from 'lucide-react';
import { ANDROID_PROJECT_FILES } from '../data/androidProjectFiles';

export const AndroidCodeViewer: React.FC = () => {
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [copied, setCopied] = useState(false);

  const currentFile = ANDROID_PROJECT_FILES[selectedIndex];

  const handleCopy = () => {
    navigator.clipboard.writeText(currentFile.content);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownloadFile = () => {
    const blob = new Blob([currentFile.content], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = currentFile.path.split('/').pop() || 'file.txt';
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="p-6 rounded-2xl bg-zinc-900 border border-zinc-800 shadow-xl">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-full bg-purple-950/80 border border-purple-800 text-purple-400 text-xs font-mono mb-2">
              <Code2 className="w-3.5 h-3.5" />
              <span>NATIVE NDK &amp; KOTLIN SOURCE</span>
            </div>
            <h2 className="text-2xl font-extrabold text-white">
              Android Port Architecture &amp; C++ NDK Engine
            </h2>
            <p className="text-xs text-zinc-400 mt-1 max-w-2xl leading-relaxed">
              Explore the complete native cross-platform port of <span className="text-cyan-300 font-mono">mcla-recomp</span> for Android.
              Engineered with <span className="text-white font-mono">ANativeWindow</span>, <span className="text-white font-mono">Vulkan 1.1+ (VK_KHR_android_surface)</span>,
              low-latency <span className="text-white font-mono">AAudio</span>, and zero-copy Xbox 360 XDVDFS sector reading directly from user-picked game ISOs.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleDownloadFile}
              className="px-3.5 py-2 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-zinc-200 border border-zinc-700 text-xs font-mono transition flex items-center gap-1.5"
            >
              <Download className="w-3.5 h-3.5 text-cyan-400" />
              <span>Download File</span>
            </button>
            <button
              onClick={handleCopy}
              className="px-3.5 py-2 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white font-mono text-xs transition flex items-center gap-1.5 shadow-md shadow-cyan-950"
            >
              {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copied ? 'Copied!' : 'Copy Code'}</span>
            </button>
          </div>
        </div>
      </div>

      {/* Main Code Explorer */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left: File Tree / List */}
        <div className="lg:col-span-4 space-y-2">
          <div className="p-3 bg-zinc-900 border border-zinc-800 rounded-xl text-xs font-mono text-zinc-400 flex items-center justify-between">
            <span className="flex items-center gap-2 font-bold text-zinc-200">
              <Layers className="w-4 h-4 text-cyan-400" />
              <span>Project Files ({ANDROID_PROJECT_FILES.length})</span>
            </span>
            <span className="text-[10px] text-zinc-500">Android Studio</span>
          </div>

          <div className="space-y-1 max-h-[580px] overflow-y-auto pr-1">
            {ANDROID_PROJECT_FILES.map((file, idx) => {
              const isSelected = idx === selectedIndex;
              const fileName = file.path.split('/').pop();
              return (
                <button
                  key={idx}
                  onClick={() => setSelectedIndex(idx)}
                  className={`w-full text-left p-3 rounded-xl border text-xs font-mono transition-all flex flex-col gap-1 ${
                    isSelected
                      ? 'bg-zinc-800/90 border-cyan-500/60 text-white shadow-lg shadow-cyan-950/40'
                      : 'bg-zinc-900/40 border-zinc-800/80 text-zinc-400 hover:bg-zinc-900 hover:text-zinc-200'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="font-semibold text-cyan-300 truncate">{fileName}</span>
                    <span className="text-[10px] uppercase px-1.5 py-0.5 rounded bg-zinc-800 text-zinc-400 border border-zinc-700">
                      {file.language}
                    </span>
                  </div>
                  <span className="text-[11px] text-zinc-500 truncate" title={file.path}>
                    {file.path}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Right: Code Viewer */}
        <div className="lg:col-span-8 space-y-3">
          {/* File Meta bar */}
          <div className="p-3.5 rounded-xl bg-zinc-900 border border-zinc-800 flex items-center justify-between text-xs font-mono">
            <div className="flex items-center gap-2">
              <FileCode className="w-4 h-4 text-cyan-400" />
              <span className="text-white font-bold">{currentFile.path}</span>
            </div>
            <span className="text-zinc-400 text-[11px] hidden sm:block">
              {currentFile.description}
            </span>
          </div>

          {/* Code Body */}
          <div className="rounded-2xl bg-zinc-950 border border-zinc-800 overflow-hidden shadow-2xl relative">
            <div className="max-h-[520px] overflow-auto p-4 font-mono text-xs leading-relaxed text-zinc-300 select-text">
              <pre>
                <code>{currentFile.content}</code>
              </pre>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
