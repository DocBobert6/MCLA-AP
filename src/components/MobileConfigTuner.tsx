import React, { useState } from 'react';
import { 
  Cpu, 
  Settings, 
  Download, 
  Copy, 
  Check, 
  Sliders, 
  Zap, 
  ShieldCheck, 
  BatteryCharging, 
  Flame, 
  CheckCircle2 
} from 'lucide-react';
import { MclaMobileSettings, SocProfile } from '../types';
import { SOC_PROFILES, generateTomlConfig } from '../data/socProfiles';

interface MobileConfigTunerProps {
  settings: MclaMobileSettings;
  onUpdateSettings: (newSettings: Partial<MclaMobileSettings>) => void;
}

export const MobileConfigTuner: React.FC<MobileConfigTunerProps> = ({
  settings,
  onUpdateSettings,
}) => {
  const [selectedProfileId, setSelectedProfileId] = useState<string>('sd8gen2');
  const [copied, setCopied] = useState(false);

  const selectedProfile = SOC_PROFILES.find((p) => p.id === selectedProfileId) || SOC_PROFILES[0];

  const handleApplyProfile = (profile: SocProfile) => {
    setSelectedProfileId(profile.id);
    onUpdateSettings({
      graphicsApi: profile.graphicsApi,
      resolution: profile.recommendedResolution.includes('1080p') ? '1080p' : '720p',
      targetFps: profile.targetFps as any,
      anisotropicFiltering: profile.anisotropic as any,
      antiAliasing: profile.msaa === 'msaa2x' ? 'msaa2x' : 'off',
      fsrUpscaling: profile.fsrMode as any,
      frameGeneration: profile.frameGen,
      mcla_prefer_dedicated_gpu: true,
      mcla_small_cpu_defaults: true,
      thermal_throttling_guard: profile.workarounds.thermalThrottlingGuard,
    } as any);
  };

  const tomlConfig = generateTomlConfig(settings, selectedProfile);

  const handleCopyToml = () => {
    navigator.clipboard.writeText(tomlConfig);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownloadToml = () => {
    const blob = new Blob([tomlConfig], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'mcla.toml';
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="p-6 rounded-2xl bg-zinc-900 border border-zinc-800 shadow-xl">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-full bg-blue-950/80 border border-blue-800 text-blue-400 text-xs font-mono mb-2">
              <Cpu className="w-3.5 h-3.5" />
              <span>MOBILE HARDWARE OPTIMIZATION</span>
            </div>
            <h2 className="text-2xl font-extrabold text-white">
              SoC Tuning &amp; Mobile <code className="text-cyan-400 font-mono">mcla.toml</code> Generator
            </h2>
            <p className="text-xs text-zinc-400 mt-1 max-w-2xl leading-relaxed">
              Tailor Midnight Club: Los Angeles for your Android phone's GPU architecture (Qualcomm Adreno vs ARM Mali vs Samsung Xclipse).
              Configure thermal throttling limits, unified memory budgets, and FSR 3.1 mobile upscaling.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleDownloadToml}
              className="px-3.5 py-2 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-zinc-200 border border-zinc-700 text-xs font-mono transition flex items-center gap-1.5"
            >
              <Download className="w-3.5 h-3.5 text-cyan-400" />
              <span>Download mcla.toml</span>
            </button>
            <button
              onClick={handleCopyToml}
              className="px-3.5 py-2 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white font-mono text-xs transition flex items-center gap-1.5 shadow-md shadow-cyan-950"
            >
              {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copied ? 'Copied TOML' : 'Copy TOML'}</span>
            </button>
          </div>
        </div>
      </div>

      {/* Preset SoC Profile Cards */}
      <div className="space-y-3">
        <h3 className="text-sm font-bold text-white uppercase tracking-wider font-mono">
          1. Select Your Android Device Profile
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {SOC_PROFILES.map((profile) => {
            const isSelected = profile.id === selectedProfileId;
            return (
              <div
                key={profile.id}
                onClick={() => handleApplyProfile(profile)}
                className={`p-4 rounded-xl border text-left cursor-pointer transition-all flex flex-col justify-between ${
                  isSelected
                    ? 'bg-zinc-800/90 border-cyan-400 text-white shadow-lg shadow-cyan-950/50 ring-1 ring-cyan-400/30'
                    : 'bg-zinc-900/60 border-zinc-800 text-zinc-400 hover:bg-zinc-900 hover:border-zinc-700'
                }`}
              >
                <div>
                  <div className="flex items-center justify-between gap-2">
                    <span className="font-bold text-sm text-white">{profile.name}</span>
                    {isSelected && <CheckCircle2 className="w-4 h-4 text-cyan-400 shrink-0" />}
                  </div>
                  <p className="text-[11px] font-mono text-cyan-300/80 mt-1">{profile.chipsets}</p>
                  <p className="text-xs text-zinc-400 mt-2 line-clamp-2">{profile.description}</p>
                </div>

                <div className="mt-4 pt-3 border-t border-zinc-800/80 grid grid-cols-2 gap-2 text-[11px] font-mono">
                  <div>
                    <span className="text-zinc-500 block">Target:</span>
                    <span className="text-emerald-400 font-semibold">{profile.targetFps} FPS</span>
                  </div>
                  <div>
                    <span className="text-zinc-500 block">Resolution:</span>
                    <span className="text-zinc-300 font-semibold">{profile.recommendedResolution}</span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Manual Fine-Tuning Controls */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <div className="lg:col-span-6 space-y-4">
          <h3 className="text-sm font-bold text-white uppercase tracking-wider font-mono">
            2. Graphics &amp; Mobile Performance
          </h3>

          <div className="p-5 rounded-2xl bg-zinc-900 border border-zinc-800 shadow-xl space-y-4">
            {/* Resolution */}
            <div className="flex items-center justify-between text-xs">
              <div>
                <span className="font-bold text-white block">Resolution Scale</span>
                <span className="text-zinc-400 text-[11px]">720p is native X360; 1080p requires flagship GPU</span>
              </div>
              <select
                value={settings.resolution}
                onChange={(e) => onUpdateSettings({ resolution: e.target.value as any })}
                className="px-3 py-1.5 rounded-lg bg-zinc-800 text-zinc-200 border border-zinc-700 font-mono text-xs"
              >
                <option value="720p">720p (Native 1x)</option>
                <option value="1080p">1080p (2x Recomp)</option>
                <option value="1440p">1440p (High-end Tablet)</option>
              </select>
            </div>

            {/* Framerate Cap */}
            <div className="flex items-center justify-between text-xs pt-3 border-t border-zinc-800">
              <div>
                <span className="font-bold text-white block">Framerate Cap</span>
                <span className="text-zinc-400 text-[11px]">Lower fps prevents phone thermal throttling</span>
              </div>
              <select
                value={settings.targetFps}
                onChange={(e) => onUpdateSettings({ targetFps: Number(e.target.value) as any })}
                className="px-3 py-1.5 rounded-lg bg-zinc-800 text-zinc-200 border border-zinc-700 font-mono text-xs"
              >
                <option value={30}>30 FPS (Battery Saver)</option>
                <option value={45}>45 FPS (Smooth Balanced)</option>
                <option value={60}>60 FPS (Full Speed)</option>
                <option value={120}>120 FPS (High Refresh Gaming)</option>
                <option value={0}>Uncapped</option>
              </select>
            </div>

            {/* FSR Upscaling */}
            <div className="flex items-center justify-between text-xs pt-3 border-t border-zinc-800">
              <div>
                <span className="font-bold text-white block">FSR 3.1 Upscaling</span>
                <span className="text-zinc-400 text-[11px]">Renders scene at lower res &amp; sharpens on mobile</span>
              </div>
              <select
                value={settings.fsrUpscaling}
                onChange={(e) => onUpdateSettings({ fsrUpscaling: e.target.value as any })}
                className="px-3 py-1.5 rounded-lg bg-zinc-800 text-zinc-200 border border-zinc-700 font-mono text-xs"
              >
                <option value="off">Off (Native)</option>
                <option value="quality">Quality (Recommended)</option>
                <option value="balanced">Balanced</option>
                <option value="performance">Performance (Max FPS)</option>
              </select>
            </div>

            {/* FSR Frame Generation */}
            <div className="flex items-center justify-between text-xs pt-3 border-t border-zinc-800">
              <div>
                <span className="font-bold text-white block">FSR 3.1 Frame Generation</span>
                <span className="text-zinc-400 text-[11px]">Generates interpolated frames on 90Hz+ screens</span>
              </div>
              <button
                onClick={() => onUpdateSettings({ frameGeneration: !settings.frameGeneration })}
                className={`px-3 py-1.5 rounded-lg font-mono text-xs border transition ${
                  settings.frameGeneration
                    ? 'bg-cyan-950 text-cyan-300 border-cyan-800'
                    : 'bg-zinc-800 text-zinc-400 border-zinc-700'
                }`}
              >
                {settings.frameGeneration ? 'ENABLED' : 'DISABLED'}
              </button>
            </div>

            {/* Anisotropic Filtering */}
            <div className="flex items-center justify-between text-xs pt-3 border-t border-zinc-800">
              <div>
                <span className="font-bold text-white block">Anisotropic Texture Filtering</span>
                <span className="text-zinc-400 text-[11px]">Keeps road asphalt textures sharp at distance</span>
              </div>
              <select
                value={settings.anisotropicFiltering}
                onChange={(e) => onUpdateSettings({ anisotropicFiltering: Number(e.target.value) as any })}
                className="px-3 py-1.5 rounded-lg bg-zinc-800 text-zinc-200 border border-zinc-700 font-mono text-xs"
              >
                <option value={2}>2x</option>
                <option value={4}>4x</option>
                <option value={8}>8x</option>
                <option value={16}>16x (Max)</option>
              </select>
            </div>
          </div>
        </div>

        {/* Live Generated mcla.toml */}
        <div className="lg:col-span-6 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-white uppercase tracking-wider font-mono">
              3. Generated Mobile Config Preview
            </h3>
            <span className="text-[11px] font-mono text-zinc-400">mcla.toml</span>
          </div>

          <div className="p-4 rounded-2xl bg-zinc-950 border border-zinc-800 font-mono text-xs text-zinc-300 max-h-[380px] overflow-auto shadow-2xl leading-relaxed">
            <pre>
              <code>{tomlConfig}</code>
            </pre>
          </div>

          <div className="p-3.5 rounded-xl bg-zinc-900 border border-zinc-800 flex items-center justify-between text-xs text-zinc-400">
            <span>Target location on Android:</span>
            <code className="text-cyan-400 font-mono text-[11px]">
              /sdcard/Android/data/com.recomp.mcla/files/mcla.toml
            </code>
          </div>
        </div>
      </div>
    </div>
  );
};
