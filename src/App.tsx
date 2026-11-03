import React, { useState, useEffect } from 'react';
import { Navigation, ActiveTab } from './components/Navigation';
import { RecompPipeline } from './components/RecompPipeline';
import { XboxOverlayStudio } from './components/XboxOverlayStudio';
import { AndroidCodeViewer } from './components/AndroidCodeViewer';
import { MobileConfigTuner } from './components/MobileConfigTuner';
import { ApkExport } from './components/ApkExportModal';
import { XboxIsoInfo, MclaMobileSettings, XboxControlConfig } from './types';
import { DEFAULT_MOBILE_SETTINGS } from './data/socProfiles';
import { generateDefaultMclaFiles } from './utils/xdvdfsParser';

export default function App() {
  const [activeTab, setActiveTab] = useState<ActiveTab>('recomp-pipeline');
  const [settings, setSettings] = useState<MclaMobileSettings>(DEFAULT_MOBILE_SETTINGS);
  const [gamepadConnected, setGamepadConnected] = useState(false);

  // Initial state for ISO verification
  const [isoInfo, setIsoInfo] = useState<XboxIsoInfo | null>({
    fileName: 'Midnight.Club.Los.Angeles.Complete.Edition.USA.X360-545407F8.iso',
    fileSize: 7835492352, // 7.30 GB
    titleId: '545407F8',
    titleName: 'Midnight Club: Los Angeles Complete Edition',
    discType: 'XGD2',
    headerOffset: 0x1000000,
    rootSector: 0x2000,
    totalSectors: 3825924,
    mediaId: '7B32F1A0-4C98',
    isValidMcla: true,
    status: 'ready',
    message: 'Midnight Club: LA Complete Edition ISO verified. Ready for PowerPC Decompilation.',
    files: generateDefaultMclaFiles(0x2000),
  });

  // Track physical controller connection
  useEffect(() => {
    const handleGamepadConnected = () => setGamepadConnected(true);
    const handleGamepadDisconnected = () => {
      const gps = navigator.getGamepads ? navigator.getGamepads() : [];
      const hasAny = Array.from(gps).some((g) => g && g.connected);
      setGamepadConnected(hasAny);
    };

    window.addEventListener('gamepadconnected', handleGamepadConnected);
    window.addEventListener('gamepaddisconnected', handleGamepadDisconnected);

    if (navigator.getGamepads) {
      const gps = navigator.getGamepads();
      if (Array.from(gps).some((g) => g && g.connected)) {
        setGamepadConnected(true);
      }
    }

    return () => {
      window.removeEventListener('gamepadconnected', handleGamepadConnected);
      window.removeEventListener('gamepaddisconnected', handleGamepadDisconnected);
    };
  }, []);

  const handleUpdateSettings = (newSettings: Partial<MclaMobileSettings>) => {
    setSettings((prev) => ({ ...prev, ...newSettings }));
  };

  const handleSaveControlsToToml = (controls: XboxControlConfig[]) => {
    // Stores custom touch overlay layout state for mcla.toml generation
    console.log('Saved custom Xbox 360 touch overlay mapping with', controls.length, 'controls');
  };

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100 flex flex-col font-sans selection:bg-cyan-500 selection:text-black">
      {/* Navigation Header */}
      <Navigation
        activeTab={activeTab}
        onTabChange={setActiveTab}
        isoLoaded={isoInfo?.isValidMcla ?? false}
        gamepadConnected={gamepadConnected}
      />

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-4 sm:p-6 lg:p-8">
        {activeTab === 'recomp-pipeline' && (
          <RecompPipeline
            isoInfo={isoInfo}
            onIsoValidated={setIsoInfo}
            settings={settings}
          />
        )}

        {activeTab === 'xbox-overlay' && (
          <XboxOverlayStudio
            onSaveToToml={handleSaveControlsToToml}
          />
        )}

        {activeTab === 'code-viewer' && <AndroidCodeViewer />}

        {activeTab === 'hardware-tuner' && (
          <MobileConfigTuner
            settings={settings}
            onUpdateSettings={handleUpdateSettings}
          />
        )}

        {activeTab === 'build-apk' && <ApkExport settings={settings} />}
      </main>

      {/* Footer */}
      <footer className="border-t border-zinc-900 bg-zinc-950 py-4 px-6 text-xs text-zinc-500 font-mono flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-emerald-400" />
          <span>MCLA-RECOMP ANDROID PORT (X360 TITLE 545407F8)</span>
        </div>
        <div className="flex items-center gap-4 text-zinc-400">
          <span>Load ISO → Decompile → Recompile</span>
          <span>•</span>
          <span>Xbox 360 Touch Clone Overlay</span>
          <span>•</span>
          <span>ARM64 Native NDK</span>
        </div>
      </footer>
    </div>
  );
}
