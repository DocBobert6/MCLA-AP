import React from 'react';
import { 
  Disc3, 
  Gamepad2,
  Code2, 
  Cpu, 
  PackageCheck, 
  Smartphone,
  ExternalLink,
  ShieldCheck,
  Sliders
} from 'lucide-react';

export type ActiveTab = 'recomp-pipeline' | 'xbox-overlay' | 'code-viewer' | 'hardware-tuner' | 'build-apk';

interface NavigationProps {
  activeTab: ActiveTab;
  onTabChange: (tab: ActiveTab) => void;
  isoLoaded: boolean;
  gamepadConnected: boolean;
}

export const Navigation: React.FC<NavigationProps> = ({
  activeTab,
  onTabChange,
  isoLoaded,
  gamepadConnected,
}) => {
  const tabs = [
    {
      id: 'recomp-pipeline' as ActiveTab,
      label: '1. Load ISO → Decompile → Recompile',
      icon: Disc3,
      badge: isoLoaded ? 'ISO Ready' : 'Load ISO',
      badgeColor: isoLoaded ? 'bg-emerald-500/20 text-emerald-400 border-emerald-500/40' : 'bg-amber-500/20 text-amber-400 border-amber-500/40',
    },
    {
      id: 'xbox-overlay' as ActiveTab,
      label: '2. Xbox 360 Touch Overlay & Mapper',
      icon: Gamepad2,
      badge: 'Full Clone',
      badgeColor: 'bg-cyan-500/20 text-cyan-400 border-cyan-500/40',
    },
    {
      id: 'code-viewer' as ActiveTab,
      label: '3. Android NDK Port Source',
      icon: Code2,
      badge: 'C++/Kotlin',
      badgeColor: 'bg-purple-500/20 text-purple-400 border-purple-500/40',
    },
    {
      id: 'hardware-tuner' as ActiveTab,
      label: '4. SoC Tuning & Config',
      icon: Cpu,
      badge: 'Adreno/Mali',
      badgeColor: 'bg-blue-500/20 text-blue-400 border-blue-500/40',
    },
    {
      id: 'build-apk' as ActiveTab,
      label: '5. Build & Export APK',
      icon: PackageCheck,
      badge: 'Project ZIP',
      badgeColor: 'bg-pink-500/20 text-pink-400 border-pink-500/40',
    },
  ];

  return (
    <header className="border-b border-zinc-800 bg-zinc-950/90 backdrop-blur sticky top-0 z-40">
      {/* Top Banner */}
      <div className="max-w-7xl mx-auto px-4 py-2.5 flex flex-wrap items-center justify-between gap-4">
        {/* Brand / Logo */}
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-500 via-cyan-600 to-fuchsia-600 p-0.5 shadow-lg shadow-emerald-500/20">
            <div className="w-full h-full bg-zinc-950 rounded-[10px] flex items-center justify-center">
              <Gamepad2 className="w-5 h-5 text-emerald-400" />
            </div>
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-black tracking-wider text-base sm:text-lg bg-gradient-to-r from-emerald-400 via-cyan-200 to-fuchsia-400 bg-clip-text text-transparent">
                MCLA-RECOMP
              </span>
              <span className="px-1.5 py-0.5 text-[10px] font-mono font-bold tracking-wider rounded bg-zinc-800 text-zinc-300 border border-zinc-700">
                ANDROID PORT
              </span>
              <span className="hidden md:inline-flex items-center gap-1 text-[11px] font-mono text-emerald-400 bg-emerald-950/60 border border-emerald-800 px-2 py-0.5 rounded-full">
                <ShieldCheck className="w-3 h-3" /> Title 545407F8
              </span>
            </div>
            <p className="text-xs text-zinc-400 hidden sm:block">
              Midnight Club: LA Complete Edition • ISO Recompilation + Full Xbox 360 Touch Clone Overlay
            </p>
          </div>
        </div>

        {/* Status badges & Quick links */}
        <div className="flex items-center gap-2.5 text-xs font-mono">
          {gamepadConnected ? (
            <span className="flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-emerald-500/10 border border-emerald-500/30 text-emerald-400">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
              Gamepad Active
            </span>
          ) : (
            <span className="hidden sm:flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-zinc-900 border border-zinc-800 text-zinc-400">
              Xbox 360 Touch + Gamepad
            </span>
          )}

          <a
            href="https://github.com/RenanQueiroz/mcla-recomp"
            target="_blank"
            rel="noreferrer"
            className="flex items-center gap-1 px-3 py-1 rounded-md bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 text-zinc-300 transition-colors"
          >
            <span>GitHub</span>
            <ExternalLink className="w-3 h-3 text-zinc-500" />
          </a>
        </div>
      </div>

      {/* Tabs Navigation Bar */}
      <div className="max-w-7xl mx-auto px-4 flex space-x-1 sm:space-x-2 overflow-x-auto scrollbar-none py-1">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => onTabChange(tab.id)}
              className={`flex items-center gap-2 px-3.5 py-2 rounded-lg text-xs font-medium whitespace-nowrap transition-all border ${
                isActive
                  ? 'bg-zinc-900 text-cyan-300 border-cyan-500/50 shadow-md shadow-cyan-950/50'
                  : 'bg-transparent text-zinc-400 border-transparent hover:bg-zinc-900/60 hover:text-zinc-200'
              }`}
            >
              <Icon className={`w-4 h-4 ${isActive ? 'text-cyan-400' : 'text-zinc-500'}`} />
              <span>{tab.label}</span>
              <span
                className={`text-[9px] font-mono px-1.5 py-0.2 rounded border ${tab.badgeColor}`}
              >
                {tab.badge}
              </span>
            </button>
          );
        })}
      </div>
    </header>
  );
};
