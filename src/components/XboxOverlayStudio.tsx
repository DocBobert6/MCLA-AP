import React, { useState, useRef, useEffect } from 'react';
import { 
  Gamepad2, 
  Move, 
  Maximize2, 
  Sliders, 
  RotateCcw, 
  Eye, 
  EyeOff, 
  Check, 
  Copy, 
  Download, 
  Save, 
  Smartphone, 
  ShieldCheck, 
  Flame, 
  Zap, 
  Layers,
  Settings2,
  HelpCircle
} from 'lucide-react';
import { XboxControlConfig, XboxOverlayPreset, Xbox360ControlId } from '../types';
import { DEFAULT_XBOX_360_CONTROLS, XBOX_PRESETS } from '../data/xboxOverlayPresets';

interface XboxOverlayStudioProps {
  onSaveToToml?: (controls: XboxControlConfig[]) => void;
}

const AVAILABLE_ACTIONS = [
  'Progressive Throttle / Accelerate (RT)',
  'Progressive Brake / Reverse (LT)',
  'Handbrake Drift / Confirm (A)',
  'Nitrous Boost / Cancel (B)',
  'Special Ability: Agro / EMP / Zone (X)',
  'Change Camera View / Look Back (Y)',
  'Steer Vehicle & Weight Transfer (LS)',
  'Free Camera Orbit & Rotate (RS)',
  'GPS Navigation / City Map (Back)',
  'Pause Menu / Game Settings (Start)',
  'Next Radio Station / Shift Up (RB)',
  'Previous Radio Station / Track (LB)',
  'Vehicle Horn / Siren Toggle (LS Click)',
  'Rearview Mirror / Direct Look-Back (RS Click)',
  'Hydraulics, Radio & Quick Action (D-Pad)',
  'In-Game Recomp Settings & Re-map (Xbox Guide)',
];

export const XboxOverlayStudio: React.FC<XboxOverlayStudioProps> = ({ onSaveToToml }) => {
  const [controls, setControls] = useState<XboxControlConfig[]>(() => {
    const saved = localStorage.getItem('mcla_xbox_overlay');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        return DEFAULT_XBOX_360_CONTROLS;
      }
    }
    return DEFAULT_XBOX_360_CONTROLS;
  });

  const [activePreset, setActivePreset] = useState<XboxOverlayPreset>('authentic_360');
  const [selectedControlId, setSelectedControlId] = useState<Xbox360ControlId>('btn_a');
  const [isEditMode, setIsEditMode] = useState(true);
  const [pressedButtons, setPressedButtons] = useState<Record<string, boolean>>({});
  const [stickPositions, setStickPositions] = useState<{ [key: string]: { x: number; y: number } }>({
    left_stick: { x: 0, y: 0 },
    right_stick: { x: 0, y: 0 },
  });
  const [triggerValues, setTriggerValues] = useState<{ [key: string]: number }>({
    trigger_lt: 0,
    trigger_rt: 0,
  });
  const [copied, setCopied] = useState(false);
  const [savedSuccess, setSavedSuccess] = useState(false);

  const containerRef = useRef<HTMLDivElement>(null);
  const dragItemRef = useRef<{ id: Xbox360ControlId; startX: number; startY: number; origX: number; origY: number } | null>(null);

  const selectedControl = controls.find((c) => c.id === selectedControlId) || controls[0];

  // Save to localStorage whenever controls change
  const saveLayout = (newControls: XboxControlConfig[]) => {
    setControls(newControls);
    localStorage.setItem('mcla_xbox_overlay', JSON.stringify(newControls));
    if (onSaveToToml) onSaveToToml(newControls);
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 2000);
  };

  const handleApplyPreset = (presetKey: XboxOverlayPreset) => {
    setActivePreset(presetKey);
    const preset = XBOX_PRESETS[presetKey];
    if (preset) {
      saveLayout([...preset.controls]);
    }
  };

  const handleResetToDefault = () => {
    handleApplyPreset('authentic_360');
  };

  const updateSelectedControl = (updates: Partial<XboxControlConfig>) => {
    const updated = controls.map((c) => (c.id === selectedControlId ? { ...c, ...updates } : c));
    saveLayout(updated);
  };

  // Drag and drop within the responsive viewport
  const handlePointerDown = (id: Xbox360ControlId, e: React.PointerEvent) => {
    if (!isEditMode) {
      // In Play/Test mode: register press
      setPressedButtons((prev) => ({ ...prev, [id]: true }));
      if (id === 'trigger_rt') setTriggerValues((prev) => ({ ...prev, trigger_rt: 1.0 }));
      if (id === 'trigger_lt') setTriggerValues((prev) => ({ ...prev, trigger_lt: 1.0 }));
      return;
    }

    setSelectedControlId(id);
    const container = containerRef.current;
    if (!container) return;

    const rect = container.getBoundingClientRect();
    const ctrl = controls.find((c) => c.id === id);
    if (!ctrl) return;

    dragItemRef.current = {
      id,
      startX: e.clientX,
      startY: e.clientY,
      origX: ctrl.x,
      origY: ctrl.y,
    };

    (e.target as HTMLElement).setPointerCapture(e.pointerId);
  };

  const handlePointerMove = (e: React.PointerEvent) => {
    if (!isEditMode || !dragItemRef.current || !containerRef.current) return;

    const rect = containerRef.current.getBoundingClientRect();
    const dx = e.clientX - dragItemRef.current.startX;
    const dy = e.clientY - dragItemRef.current.startY;

    const dxPercent = (dx / rect.width) * 100;
    const dyPercent = (dy / rect.height) * 100;

    const newX = Math.max(2, Math.min(98, Math.round(dragItemRef.current.origX + dxPercent)));
    const newY = Math.max(5, Math.min(95, Math.round(dragItemRef.current.origY + dyPercent)));

    setControls((prev) =>
      prev.map((c) => (c.id === dragItemRef.current?.id ? { ...c, x: newX, y: newY } : c))
    );
  };

  const handlePointerUp = (id: Xbox360ControlId, e: React.PointerEvent) => {
    if (!isEditMode) {
      setPressedButtons((prev) => ({ ...prev, [id]: false }));
      if (id === 'trigger_rt') setTriggerValues((prev) => ({ ...prev, trigger_rt: 0.0 }));
      if (id === 'trigger_lt') setTriggerValues((prev) => ({ ...prev, trigger_lt: 0.0 }));
      return;
    }

    if (dragItemRef.current) {
      localStorage.setItem('mcla_xbox_overlay', JSON.stringify(controls));
      if (onSaveToToml) onSaveToToml(controls);
      dragItemRef.current = null;
    }
  };

  // Generate TOML section for mcla.toml
  const generateOverlayToml = () => {
    let toml = `[android_touch_overlay]\nenabled = true\npreset = "${activePreset}"\n\n`;
    for (const c of controls) {
      toml += `[android_touch_overlay.controls.${c.id}]\nx = ${c.x}\ny = ${c.y}\nscale = ${c.scale.toFixed(2)}\nopacity = ${c.opacity.toFixed(2)}\nvisible = ${c.visible}\naction = "${c.gameAction}"\n\n`;
    }
    return toml;
  };

  const handleCopyToml = () => {
    navigator.clipboard.writeText(generateOverlayToml());
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="p-6 rounded-2xl bg-zinc-900 border border-zinc-800 shadow-xl">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-full bg-emerald-950/80 border border-emerald-800 text-emerald-400 text-xs font-mono mb-2">
              <Gamepad2 className="w-3.5 h-3.5" />
              <span>XBOX 360 AUTHENTIC CLONE OVERLAY</span>
            </div>
            <h2 className="text-2xl font-extrabold text-white">
              Fully Adjustable Xbox 360 Touchscreen Overlay &amp; Mapper
            </h2>
            <p className="text-xs text-zinc-400 mt-1 max-w-2xl leading-relaxed">
              Every button, thumbstick, jewel jewel face button (A/B/X/Y), analog trigger (LT/RT), and D-Pad is an authentic Xbox 360 clone.
              Drag any control to reposition it, scale it, adjust opacity, and map it to any game action for Midnight Club: LA on Android!
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setIsEditMode(!isEditMode)}
              className={`px-4 py-2 rounded-xl text-xs font-mono font-bold transition flex items-center gap-2 shadow-md ${
                isEditMode
                  ? 'bg-amber-500 hover:bg-amber-400 text-black shadow-amber-950'
                  : 'bg-emerald-600 hover:bg-emerald-500 text-white shadow-emerald-950'
              }`}
            >
              {isEditMode ? <Move className="w-4 h-4" /> : <Gamepad2 className="w-4 h-4" />}
              <span>{isEditMode ? 'EDIT MODE: ON (Drag to Move)' : 'TEST MODE: ON (Play & Press)'}</span>
            </button>

            <button
              onClick={handleCopyToml}
              className="px-3.5 py-2 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-zinc-200 border border-zinc-700 text-xs font-mono transition flex items-center gap-1.5"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copied ? 'Copied TOML' : 'Export TOML'}</span>
            </button>
          </div>
        </div>
      </div>

      {/* Preset Selector */}
      <div className="flex flex-wrap items-center justify-between gap-3 p-3.5 rounded-xl bg-zinc-900 border border-zinc-800 text-xs font-mono">
        <div className="flex items-center gap-2">
          <Layers className="w-4 h-4 text-cyan-400" />
          <span className="font-bold text-white">Layout Presets:</span>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {(Object.keys(XBOX_PRESETS) as XboxOverlayPreset[]).map((key) => {
            const p = XBOX_PRESETS[key];
            const isActive = activePreset === key;
            return (
              <button
                key={key}
                onClick={() => handleApplyPreset(key)}
                className={`px-3 py-1.5 rounded-lg border transition ${
                  isActive
                    ? 'bg-cyan-950 text-cyan-300 border-cyan-500/80 font-bold shadow'
                    : 'bg-zinc-800/80 text-zinc-400 border-zinc-700 hover:text-white'
                }`}
                title={p.desc}
              >
                {p.name}
              </button>
            );
          })}

          <button
            onClick={handleResetToDefault}
            className="px-2.5 py-1.5 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-zinc-400 hover:text-white border border-zinc-700 flex items-center gap-1"
            title="Reset all buttons to default positions"
          >
            <RotateCcw className="w-3 h-3" />
            <span>Reset</span>
          </button>
        </div>
      </div>

      {/* Screen Frame Viewport with Draggable Xbox 360 Controls */}
      <div
        ref={containerRef}
        onPointerMove={handlePointerMove}
        className="w-full h-[520px] sm:h-[580px] rounded-3xl bg-zinc-950 border-4 border-zinc-800 shadow-2xl relative overflow-hidden select-none touch-none flex flex-col justify-between p-6"
      >
        {/* Background Grid & Watermark */}
        <div className="absolute inset-0 opacity-15 pointer-events-none" style={{
          backgroundImage: 'radial-gradient(circle, #00f0ff 1px, transparent 1px)',
          backgroundSize: '24px 24px',
        }} />

        <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-5">
          <div className="w-96 h-96 rounded-full border-8 border-white" />
        </div>

        {/* Status Pill in Edit Mode */}
        <div className="absolute top-4 left-1/2 -translate-x-1/2 pointer-events-none z-30 flex items-center gap-2 px-3 py-1 rounded-full bg-zinc-900/90 backdrop-blur border border-zinc-800 text-[11px] font-mono text-zinc-300 shadow-lg">
          {isEditMode ? (
            <>
              <Move className="w-3.5 h-3.5 text-amber-400 animate-bounce" />
              <span>Drag any control to position • Click to customize on the side panel</span>
            </>
          ) : (
            <>
              <Gamepad2 className="w-3.5 h-3.5 text-emerald-400" />
              <span>Test Mode Active • Touch or click buttons to simulate controller inputs</span>
            </>
          )}
        </div>

        {/* Dynamic Interactive Xbox 360 Buttons */}
        {controls.map((ctrl) => {
          if (!ctrl.visible) return null;
          const isSelected = selectedControlId === ctrl.id;
          const isPressed = pressedButtons[ctrl.id] || false;

          // Render specific Xbox 360 control visuals
          return (
            <div
              key={ctrl.id}
              onPointerDown={(e) => handlePointerDown(ctrl.id, e)}
              onPointerUp={(e) => handlePointerUp(ctrl.id, e)}
              style={{
                left: `${ctrl.x}%`,
                top: `${ctrl.y}%`,
                transform: `translate(-50%, -50%) scale(${ctrl.scale})`,
                opacity: ctrl.opacity,
              }}
              className={`absolute cursor-pointer transition-all duration-75 z-20 ${
                isEditMode ? 'hover:ring-2 hover:ring-cyan-400' : 'active:scale-95'
              } ${isSelected && isEditMode ? 'ring-4 ring-cyan-400 shadow-2xl shadow-cyan-400/50' : ''}`}
            >
              {/* LEFT & RIGHT ANALOG THUMBSTICKS */}
              {(ctrl.id === 'left_stick' || ctrl.id === 'right_stick') && (
                <div className="w-28 h-28 rounded-full bg-zinc-900/90 border-2 border-zinc-600 shadow-2xl flex items-center justify-center relative">
                  {/* Outer textured bezel */}
                  <div className="absolute inset-1 rounded-full border border-zinc-700/60" />
                  {/* Thumbstick Concave Dish */}
                  <div className={`w-14 h-14 rounded-full border-2 flex items-center justify-center shadow-lg transition-transform ${
                    isPressed
                      ? 'bg-cyan-500 border-white text-black'
                      : 'bg-zinc-800 border-zinc-500 text-zinc-200'
                  }`}>
                    {/* Concave cross indentations */}
                    <div className="w-2 h-2 rounded-full bg-zinc-900/80" />
                  </div>
                  <span className="absolute bottom-1.5 text-[9px] font-mono font-black text-cyan-400/90">
                    {ctrl.label}
                  </span>
                </div>
              )}

              {/* D-PAD (8-WAY CLASSIC CROSS) */}
              {ctrl.id === 'dpad' && (
                <div className="w-28 h-28 relative flex items-center justify-center">
                  <div className="w-8 h-24 bg-zinc-800 rounded-md border-2 border-zinc-600 shadow-xl absolute" />
                  <div className="h-8 w-24 bg-zinc-800 rounded-md border-2 border-zinc-600 shadow-xl absolute" />
                  <div className="w-6 h-6 rounded-full bg-zinc-900 border border-zinc-700 z-10 flex items-center justify-center">
                    <span className="text-[7px] text-zinc-500 font-bold">╋</span>
                  </div>
                </div>
              )}

              {/* ABXY JEWEL BUTTONS */}
              {(ctrl.id === 'btn_a' || ctrl.id === 'btn_b' || ctrl.id === 'btn_x' || ctrl.id === 'btn_y') && (
                <div 
                  className={`w-14 h-14 rounded-full border-2 flex items-center justify-center font-black text-xl shadow-xl transition-all ${
                    isPressed ? 'scale-90 brightness-125' : ''
                  }`}
                  style={{
                    backgroundColor: isPressed ? ctrl.color : '#18181b',
                    borderColor: ctrl.color,
                    color: isPressed ? '#000000' : ctrl.color,
                    boxShadow: isPressed ? `0 0 20px ${ctrl.color}` : '0 4px 10px rgba(0,0,0,0.5)',
                  }}
                >
                  <span>{ctrl.label}</span>
                </div>
              )}

              {/* ANALOG TRIGGERS (LT & RT) */}
              {(ctrl.id === 'trigger_lt' || ctrl.id === 'trigger_rt') && (
                <div className="w-18 h-24 rounded-2xl bg-zinc-900 border-2 border-zinc-600 shadow-2xl p-2 flex flex-col justify-between items-center">
                  <span className="text-xs font-black" style={{ color: ctrl.color }}>
                    {ctrl.label}
                  </span>
                  {/* Progressive trigger gauge */}
                  <div className="w-full h-12 bg-zinc-950 rounded-lg overflow-hidden border border-zinc-800 relative">
                    <div
                      className="absolute bottom-0 w-full transition-all duration-75"
                      style={{
                        height: isPressed ? '100%' : '15%',
                        backgroundColor: ctrl.color,
                      }}
                    />
                  </div>
                  <span className="text-[9px] font-mono text-zinc-400">
                    {ctrl.id === 'trigger_rt' ? 'GAS' : 'BRAKE'}
                  </span>
                </div>
              )}

              {/* BUMPERS (LB & RB) */}
              {(ctrl.id === 'bumper_lb' || ctrl.id === 'bumper_rb') && (
                <div className="w-20 h-10 rounded-xl bg-zinc-900 border-2 border-zinc-600 shadow-xl flex items-center justify-center font-bold text-xs text-zinc-200">
                  <span>{ctrl.label}</span>
                </div>
              )}

              {/* CENTER CLUSTER: BACK & START */}
              {(ctrl.id === 'btn_back' || ctrl.id === 'btn_start') && (
                <div className="w-12 h-8 rounded-lg bg-zinc-900 border border-zinc-600 shadow flex items-center justify-center font-mono text-[9px] font-bold text-zinc-300">
                  <span>{ctrl.label}</span>
                </div>
              )}

              {/* XBOX 360 GUIDE BUTTON (CENTER SPHERE & RING OF LIGHT) */}
              {ctrl.id === 'btn_guide' && (
                <div className="w-14 h-14 rounded-full bg-gradient-to-br from-zinc-200 via-zinc-400 to-zinc-600 border-2 border-zinc-400 shadow-2xl p-1 flex items-center justify-center relative">
                  {/* Glowing 4-quadrant Ring of Light */}
                  <div className="w-full h-full rounded-full bg-zinc-950 flex items-center justify-center relative overflow-hidden">
                    <div className="w-3 h-3 rounded-full bg-emerald-500 shadow-lg shadow-emerald-500/80 animate-pulse" />
                    <span className="absolute text-[8px] font-black text-emerald-400 font-mono tracking-tighter">
                      XBOX
                    </span>
                  </div>
                </div>
              )}

              {/* THUMBSTICK CLICKS (LS / RS CLICK) */}
              {(ctrl.id === 'stick_click_ls' || ctrl.id === 'stick_click_rs') && (
                <div className="w-10 h-7 rounded-md bg-zinc-900 border border-zinc-700 shadow flex items-center justify-center text-[8px] font-mono font-bold text-cyan-400">
                  <span>{ctrl.label}</span>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Control Customizer & Mapping Editor Panel */}
      <div className="p-6 rounded-2xl bg-zinc-900 border border-zinc-800 shadow-xl space-y-6">
        <div className="flex items-center justify-between pb-3 border-b border-zinc-800">
          <div className="flex items-center gap-2">
            <Settings2 className="w-4 h-4 text-cyan-400" />
            <h3 className="text-sm font-bold text-white uppercase tracking-wider font-mono">
              Button Inspector &amp; Action Re-Mapper
            </h3>
          </div>
          {savedSuccess && (
            <span className="flex items-center gap-1 text-xs font-mono text-emerald-400">
              <Check className="w-3.5 h-3.5" /> Layout Saved to mcla.toml!
            </span>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 text-xs font-mono">
          {/* Selected Button Info */}
          <div className="space-y-2">
            <label className="text-zinc-400 block font-bold">Selected Control:</label>
            <select
              value={selectedControl.id}
              onChange={(e) => setSelectedControlId(e.target.value as Xbox360ControlId)}
              className="w-full p-2.5 rounded-xl bg-zinc-800 border border-zinc-700 text-white font-bold outline-none"
            >
              {controls.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.label} ({c.id})
                </option>
              ))}
            </select>
            <div className="flex items-center justify-between text-zinc-500 pt-1">
              <span>Pos: ({selectedControl.x}%, {selectedControl.y}%)</span>
              <button
                onClick={() => updateSelectedControl({ visible: !selectedControl.visible })}
                className="flex items-center gap-1 text-cyan-400 hover:underline"
              >
                {selectedControl.visible ? <Eye className="w-3.5 h-3.5" /> : <EyeOff className="w-3.5 h-3.5" />}
                <span>{selectedControl.visible ? 'Visible' : 'Hidden'}</span>
              </button>
            </div>
          </div>

          {/* Scale Slider */}
          <div className="space-y-2">
            <div className="flex justify-between text-zinc-400">
              <span className="font-bold">Scale (Size):</span>
              <span className="text-white font-bold">{selectedControl.scale.toFixed(2)}x</span>
            </div>
            <input
              type="range"
              min="0.6"
              max="2.0"
              step="0.05"
              value={selectedControl.scale}
              onChange={(e) => updateSelectedControl({ scale: parseFloat(e.target.value) })}
              className="w-full accent-cyan-400"
            />
            <span className="text-[11px] text-zinc-500 block">Min 0.6x • Max 2.0x</span>
          </div>

          {/* Opacity Slider */}
          <div className="space-y-2">
            <div className="flex justify-between text-zinc-400">
              <span className="font-bold">Opacity:</span>
              <span className="text-white font-bold">{Math.round(selectedControl.opacity * 100)}%</span>
            </div>
            <input
              type="range"
              min="0.15"
              max="1.0"
              step="0.05"
              value={selectedControl.opacity}
              onChange={(e) => updateSelectedControl({ opacity: parseFloat(e.target.value) })}
              className="w-full accent-cyan-400"
            />
            <span className="text-[11px] text-zinc-500 block">Ghosted 15% to Solid 100%</span>
          </div>

          {/* Game Action / Mapping Dropdown */}
          <div className="space-y-2">
            <label className="text-zinc-400 block font-bold">Mapped MCLA Function:</label>
            <select
              value={selectedControl.gameAction}
              onChange={(e) => updateSelectedControl({ gameAction: e.target.value })}
              className="w-full p-2.5 rounded-xl bg-zinc-800 border border-zinc-700 text-emerald-400 font-bold outline-none text-xs"
            >
              {AVAILABLE_ACTIONS.map((action, i) => (
                <option key={i} value={action}>
                  {action}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>
    </div>
  );
};
