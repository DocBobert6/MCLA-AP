import React, { useState } from 'react';
import { 
  PackageCheck, 
  Download, 
  Terminal, 
  Smartphone, 
  CheckCircle2, 
  Copy, 
  Check, 
  FolderArchive, 
  GitBranch, 
  Layers,
  ArrowRight,
  ExternalLink,
  ShieldCheck
} from 'lucide-react';
import JSZip from 'jszip';
import { ANDROID_PROJECT_FILES } from '../data/androidProjectFiles';
import { MclaMobileSettings } from '../types';
import { generateTomlConfig } from '../data/socProfiles';

interface ApkExportProps {
  settings: MclaMobileSettings;
}

export const ApkExport: React.FC<ApkExportProps> = ({ settings }) => {
  const [isExporting, setIsExporting] = useState(false);
  const [exportComplete, setExportComplete] = useState(false);
  const [copiedScript, setCopiedScript] = useState<string | null>(null);

  const handleExportZip = async () => {
    setIsExporting(true);
    try {
      const zip = new JSZip();

      // Add all project files into zip
      for (const file of ANDROID_PROJECT_FILES) {
        if (file.path === 'config/mcla.android.toml') {
          // Use current customized settings for mcla.toml
          zip.file('config/mcla.toml', generateTomlConfig(settings));
        } else {
          zip.file(file.path, file.content);
        }
      }

      // Add root README.md with comprehensive instructions
      const readmeContent = `# Midnight Club: Los Angeles Complete Edition (545407F8) - Android Port

This is the native Android NDK port of mcla-recomp (ReXGlue Xbox 360 static recompilation).

## Prerequisites
- Android 10+ (API 29+) device with Vulkan 1.1 support
- Legal copy of Midnight Club: Los Angeles Complete Edition (.iso, Title ID: 545407F8)
- Android Studio Ladybug / Jellyfish (or Android NDK r26d+ on CLI / Termux)

## How to Build

### Option 1: Android Studio (Recommended)
1. Open Android Studio -> Open Project -> Select this extracted folder.
2. Allow Gradle sync to complete.
3. Connect your Android phone with USB Debugging enabled.
4. Click 'Run' (Shift + F10).

### Option 2: Command Line Gradle (Linux / Mac / WSL)
\`\`\`bash
chmod +x gradlew build_apk.sh
./build_apk.sh --release
adb install -r app/build/outputs/apk/release/app-release.apk
\`\`\`

### Option 3: Direct on Android (Termux)
\`\`\`bash
pkg install openjdk-17 clang cmake ninja
./gradlew assembleRelease
\`\`\`

## Providing Game ISO
On first boot, the app will open Android's Storage Access Framework file picker.
Select your 'Midnight Club: LA Complete Edition' (.iso).
The engine will read sectors directly through Linux pread64 with zero-copy.
`;
      zip.file('README.md', readmeContent);

      // Generate and download zip
      const content = await zip.generateAsync({ type: 'blob' });
      const url = URL.createObjectURL(content);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'mcla-recomp-android-project.zip';
      a.click();
      URL.revokeObjectURL(url);

      setIsExporting(false);
      setExportComplete(true);
      setTimeout(() => setExportComplete(false), 4000);
    } catch (e) {
      console.error(e);
      setIsExporting(false);
    }
  };

  const copySnippet = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedScript(id);
    setTimeout(() => setCopiedScript(null), 2000);
  };

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="p-6 rounded-2xl bg-gradient-to-r from-zinc-900 via-zinc-900/90 to-zinc-950 border border-zinc-800 shadow-xl relative overflow-hidden">
        <div className="absolute right-0 top-0 w-96 h-96 bg-pink-500/5 rounded-full blur-3xl -mr-20 -mt-20 pointer-events-none" />
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 relative z-10">
          <div>
            <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-full bg-pink-950/80 border border-pink-800 text-pink-400 text-xs font-mono mb-3">
              <PackageCheck className="w-3.5 h-3.5" />
              <span>EXPORT &amp; COMPILATION PIPELINE</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
              Build &amp; Export Android APK
            </h2>
            <p className="text-sm text-zinc-400 mt-1 max-w-2xl leading-relaxed">
              Export the complete, production-ready Android Studio &amp; NDK cross-compilation source bundle.
              Ready to compile locally on your PC, in Termux directly on your phone, or via automated GitHub Actions CI!
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={handleExportZip}
              disabled={isExporting}
              className="px-5 py-3 rounded-xl bg-gradient-to-r from-pink-500 via-purple-600 to-cyan-500 hover:from-pink-400 hover:to-cyan-400 text-white font-bold text-xs uppercase tracking-wider transition-all flex items-center gap-2 shadow-lg shadow-pink-950 disabled:opacity-50"
            >
              {isExporting ? (
                <>
                  <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  <span>Packaging Project...</span>
                </>
              ) : exportComplete ? (
                <>
                  <Check className="w-4 h-4 text-emerald-300" />
                  <span>Downloaded ZIP!</span>
                </>
              ) : (
                <>
                  <FolderArchive className="w-4 h-4" />
                  <span>Download Android Studio Project (.ZIP)</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* 3 Compilation Methods */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Method 1: Android Studio */}
        <div className="p-5 rounded-2xl bg-zinc-900 border border-zinc-800 shadow-xl flex flex-col justify-between space-y-4">
          <div className="space-y-3">
            <div className="flex items-center gap-2 text-cyan-400 font-bold text-sm">
              <Smartphone className="w-4 h-4" />
              <span>Method 1: Android Studio (GUI)</span>
            </div>
            <p className="text-xs text-zinc-400 leading-relaxed">
              The simplest workflow for installing on your phone via USB or Wi-Fi debugging.
            </p>
            <ol className="list-decimal list-inside space-y-1.5 text-xs text-zinc-300 font-mono">
              <li>Extract the downloaded <code className="text-cyan-300">.zip</code>.</li>
              <li>Open Android Studio &amp; click <strong>Open Existing Project</strong>.</li>
              <li>Select the extracted folder and let Gradle download dependencies.</li>
              <li>Enable USB Debugging on your phone.</li>
              <li>Click <strong>Run (Shift + F10)</strong> to install directly!</li>
            </ol>
          </div>

          <div className="p-2.5 rounded-lg bg-zinc-950 border border-zinc-800 text-[11px] font-mono text-zinc-400">
            Target ABI: <span className="text-emerald-400 font-bold">arm64-v8a</span>
          </div>
        </div>

        {/* Method 2: Command-Line Gradle */}
        <div className="p-5 rounded-2xl bg-zinc-900 border border-zinc-800 shadow-xl flex flex-col justify-between space-y-4">
          <div className="space-y-3">
            <div className="flex items-center gap-2 text-amber-400 font-bold text-sm">
              <Terminal className="w-4 h-4" />
              <span>Method 2: Command Line (CLI)</span>
            </div>
            <p className="text-xs text-zinc-400 leading-relaxed">
              Direct CLI build on Linux, macOS, or Windows WSL with NDK installed.
            </p>
            <div className="p-3 rounded-lg bg-zinc-950 border border-zinc-800 font-mono text-xs text-zinc-300 relative">
              <pre className="overflow-x-auto">
                <code>{`./build_apk.sh --release
adb install -r app/build/outputs/apk/release/app-release.apk`}</code>
              </pre>
              <button
                onClick={() => copySnippet(`./build_apk.sh --release\nadb install -r app/build/outputs/apk/release/app-release.apk`, 'cli')}
                className="absolute top-2 right-2 p-1.5 rounded bg-zinc-800 text-zinc-400 hover:text-white"
              >
                {copiedScript === 'cli' ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
              </button>
            </div>
          </div>

          <div className="p-2.5 rounded-lg bg-zinc-950 border border-zinc-800 text-[11px] font-mono text-zinc-400">
            Outputs: <span className="text-cyan-300">app-release.apk</span>
          </div>
        </div>

        {/* Method 3: GitHub Actions CI */}
        <div className="p-5 rounded-2xl bg-zinc-900 border border-zinc-800 shadow-xl flex flex-col justify-between space-y-4">
          <div className="space-y-3">
            <div className="flex items-center gap-2 text-fuchsia-400 font-bold text-sm">
              <GitBranch className="w-4 h-4" />
              <span>Method 3: GitHub Actions Cloud CI</span>
            </div>
            <p className="text-xs text-zinc-400 leading-relaxed">
              Build your APK in the cloud without needing Android Studio or NDK installed on your computer.
            </p>
            <ol className="list-decimal list-inside space-y-1.5 text-xs text-zinc-300 font-mono">
              <li>Push the project to your GitHub repository.</li>
              <li>The included <code className="text-fuchsia-300">.github/workflows/android.yml</code> automatically triggers.</li>
              <li>Wait 3-4 minutes for runner compilation.</li>
              <li>Download the built APK from the <strong>Actions / Artifacts</strong> tab!</li>
            </ol>
          </div>

          <div className="p-2.5 rounded-lg bg-zinc-950 border border-zinc-800 text-[11px] font-mono text-zinc-400">
            Cloud Runner: <span className="text-cyan-300">Ubuntu 24.04 + NDK r26d</span>
          </div>
        </div>
      </div>

      {/* ISO Placement & First Run Guide */}
      <div className="p-6 rounded-2xl bg-zinc-900 border border-zinc-800 shadow-xl space-y-4">
        <div className="flex items-center gap-2">
          <ShieldCheck className="w-5 h-5 text-emerald-400" />
          <h3 className="text-sm font-bold text-white uppercase tracking-wider font-mono">
            How User Brings Own Game ISO on Android Device
          </h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs text-zinc-300 font-mono">
          <div className="p-4 rounded-xl bg-zinc-950/70 border border-zinc-800/80 space-y-2">
            <span className="font-bold text-cyan-400 block">Step 1: Transfer ISO to Android Phone</span>
            <p className="text-zinc-400 leading-relaxed font-sans text-xs">
              Connect your phone to your PC via USB or download your legally dumped <code className="text-zinc-200">Midnight Club: LA Complete Edition (.iso)</code> to your phone's <code className="text-zinc-200">/sdcard/Download/</code> folder or an external MicroSD card / USB OTG drive.
            </p>
          </div>

          <div className="p-4 rounded-xl bg-zinc-950/70 border border-zinc-800/80 space-y-2">
            <span className="font-bold text-emerald-400 block">Step 2: Select in App via SAF Document Picker</span>
            <p className="text-zinc-400 leading-relaxed font-sans text-xs">
              When you launch the app, Android's native file picker will appear. Pick your ISO. The app stores persistable permission and mounts the sectors directly through Linux <code className="text-zinc-200">pread64()</code>. No unpacking or 7GB duplicate copy needed!
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
