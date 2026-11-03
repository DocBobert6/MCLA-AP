import { XboxControlConfig, XboxOverlayPreset } from '../types';

export const DEFAULT_XBOX_360_CONTROLS: XboxControlConfig[] = [
  // Left Analog Thumbstick (Steer)
  {
    id: 'left_stick',
    label: 'LS',
    gameAction: 'Steer Vehicle & Weight Transfer',
    color: '#00e5ff',
    x: 14,
    y: 68,
    scale: 1.15,
    opacity: 0.85,
    visible: true,
    deadzone: 0.15,
    customKeyBinding: 'A/D or Left Stick',
  },
  // Right Analog Thumbstick (Camera Look)
  {
    id: 'right_stick',
    label: 'RS',
    gameAction: 'Free Camera Orbit & Rotate',
    color: '#00e5ff',
    x: 74,
    y: 72,
    scale: 1.0,
    opacity: 0.75,
    visible: true,
    deadzone: 0.15,
    customKeyBinding: 'Right Stick',
  },
  // D-Pad (Classic 8-Way Cross)
  {
    id: 'dpad',
    label: 'D-PAD',
    gameAction: 'Hydraulics, Radio & Quick Action',
    color: '#a1a1aa',
    x: 26,
    y: 80,
    scale: 0.95,
    opacity: 0.8,
    visible: true,
    customKeyBinding: 'D-Pad / Arrow Keys',
  },
  // 'A' Button (Emerald Green)
  {
    id: 'btn_a',
    label: 'A',
    gameAction: 'Handbrake Drift / Confirm',
    color: '#10b981', // Green
    x: 88,
    y: 74,
    scale: 1.1,
    opacity: 0.9,
    visible: true,
    customKeyBinding: 'Space / Button A',
  },
  // 'B' Button (Crimson Red)
  {
    id: 'btn_b',
    label: 'B',
    gameAction: 'Nitrous Boost / Cancel',
    color: '#ef4444', // Red
    x: 94,
    y: 62,
    scale: 1.1,
    opacity: 0.9,
    visible: true,
    customKeyBinding: 'Shift / Button B',
  },
  // 'X' Button (Cobalt Blue)
  {
    id: 'btn_x',
    label: 'X',
    gameAction: 'Special Ability (Agro / EMP / Zone)',
    color: '#3b82f6', // Blue
    x: 82,
    y: 62,
    scale: 1.0,
    opacity: 0.85,
    visible: true,
    customKeyBinding: 'Key X / Button X',
  },
  // 'Y' Button (Amber Yellow)
  {
    id: 'btn_y',
    label: 'Y',
    gameAction: 'Change Camera View / Look Back',
    color: '#f59e0b', // Yellow
    x: 88,
    y: 50,
    scale: 1.0,
    opacity: 0.85,
    visible: true,
    customKeyBinding: 'Key C / Button Y',
  },
  // Left Trigger (LT) - Progressive Brake / Reverse
  {
    id: 'trigger_lt',
    label: 'LT',
    gameAction: 'Progressive Brake / Reverse',
    color: '#f43f5e',
    x: 10,
    y: 28,
    scale: 1.15,
    opacity: 0.9,
    visible: true,
    customKeyBinding: 'Key S / Axis LT',
  },
  // Right Trigger (RT) - Progressive Throttle / Gas
  {
    id: 'trigger_rt',
    label: 'RT',
    gameAction: 'Progressive Throttle / Accelerate',
    color: '#10b981',
    x: 90,
    y: 28,
    scale: 1.25,
    opacity: 0.95,
    visible: true,
    customKeyBinding: 'Key W / Axis RT',
  },
  // Left Bumper (LB)
  {
    id: 'bumper_lb',
    label: 'LB',
    gameAction: 'Previous Radio Station / Track',
    color: '#71717a',
    x: 14,
    y: 12,
    scale: 0.95,
    opacity: 0.8,
    visible: true,
    customKeyBinding: 'Key Q / Button LB',
  },
  // Right Bumper (RB)
  {
    id: 'bumper_rb',
    label: 'RB',
    gameAction: 'Next Radio Station / Shift Up',
    color: '#71717a',
    x: 86,
    y: 12,
    scale: 0.95,
    opacity: 0.8,
    visible: true,
    customKeyBinding: 'Key E / Button RB',
  },
  // Back Button
  {
    id: 'btn_back',
    label: 'BACK',
    gameAction: 'GPS Navigation / City Map',
    color: '#94a3b8',
    x: 42,
    y: 18,
    scale: 0.8,
    opacity: 0.8,
    visible: true,
    customKeyBinding: 'Key M / Button Back',
  },
  // Start Button
  {
    id: 'btn_start',
    label: 'START',
    gameAction: 'Pause Menu / Game Settings',
    color: '#94a3b8',
    x: 58,
    y: 18,
    scale: 0.8,
    opacity: 0.8,
    visible: true,
    customKeyBinding: 'Esc / Button Start',
  },
  // Xbox 360 Guide Button (Center sphere)
  {
    id: 'btn_guide',
    label: 'XBOX',
    gameAction: 'In-Game Recomp Settings & Re-map',
    color: '#22c55e',
    x: 50,
    y: 14,
    scale: 0.9,
    opacity: 0.85,
    visible: true,
    customKeyBinding: 'Home / Xbox Guide',
  },
  // Left Stick Click (LS Click / L3)
  {
    id: 'stick_click_ls',
    label: 'LS CLICK',
    gameAction: 'Vehicle Horn / Siren Toggle',
    color: '#06b6d4',
    x: 14,
    y: 86,
    scale: 0.75,
    opacity: 0.65,
    visible: true,
    customKeyBinding: 'Key H / Button L3',
  },
  // Right Stick Click (RS Click / R3)
  {
    id: 'stick_click_rs',
    label: 'RS CLICK',
    gameAction: 'Rearview Mirror / Direct Look-Back',
    color: '#06b6d4',
    x: 74,
    y: 90,
    scale: 0.75,
    opacity: 0.65,
    visible: true,
    customKeyBinding: 'Key R / Button R3',
  },
];

export const XBOX_PRESETS: Record<XboxOverlayPreset, { name: string; desc: string; controls: XboxControlConfig[] }> = {
  authentic_360: {
    name: 'Authentic Xbox 360 Controller',
    desc: 'True-to-life Xbox 360 ergonomic controller placement with green/red/blue/yellow ABXY jewel buttons and chrome guide ring.',
    controls: DEFAULT_XBOX_360_CONTROLS,
  },
  mcla_racing: {
    name: 'MCLA Racing Dedicated',
    desc: 'Enlarged RT gas, LT brake, A drift and B nitro buttons with streamlined thumbstick placement for high-speed street racing.',
    controls: DEFAULT_XBOX_360_CONTROLS.map((c) => {
      if (c.id === 'trigger_rt') return { ...c, scale: 1.4, x: 92, y: 34 };
      if (c.id === 'trigger_lt') return { ...c, scale: 1.25, x: 8, y: 34 };
      if (c.id === 'btn_a') return { ...c, scale: 1.3, x: 88, y: 76 }; // handbrake
      if (c.id === 'btn_b') return { ...c, scale: 1.25, x: 76, y: 76 }; // nitro
      if (c.id === 'left_stick') return { ...c, scale: 1.3, x: 14, y: 72 };
      return c;
    }),
  },
  claw_grip: {
    name: 'Claw Grip (4-Finger)',
    desc: 'Bumper and trigger controls shifted lower, allowing simultaneous index-finger braking, thumb steering, and multi-action triggers.',
    controls: DEFAULT_XBOX_360_CONTROLS.map((c) => {
      if (c.id === 'bumper_lb') return { ...c, x: 12, y: 22, scale: 1.05 };
      if (c.id === 'bumper_rb') return { ...c, x: 88, y: 22, scale: 1.05 };
      if (c.id === 'trigger_lt') return { ...c, x: 12, y: 40, scale: 1.2 };
      if (c.id === 'trigger_rt') return { ...c, x: 88, y: 40, scale: 1.2 };
      return c;
    }),
  },
  compact_phone: {
    name: 'Compact Mobile (Small Screens)',
    desc: 'Pushed tightly towards the screen edges with minimized center buttons to preserve maximum screen visibility on 6.1" to 6.5" displays.',
    controls: DEFAULT_XBOX_360_CONTROLS.map((c) => {
      if (c.id === 'left_stick') return { ...c, x: 10, y: 74, scale: 0.95 };
      if (c.id === 'dpad') return { ...c, x: 20, y: 84, scale: 0.8 };
      if (c.id === 'btn_back' || c.id === 'btn_start' || c.id === 'btn_guide') return { ...c, scale: 0.7 };
      return c;
    }),
  },
  tablet_wide: {
    name: 'Tablet & Foldable (Wide Screen)',
    desc: 'Spaced widely for comfortable two-handed grip on 10"+ Android tablets, Samsung Galaxy Fold and Lenovo Legion Y700.',
    controls: DEFAULT_XBOX_360_CONTROLS.map((c) => {
      if (c.id === 'left_stick') return { ...c, x: 8, y: 65, scale: 1.3 };
      if (c.id === 'trigger_lt') return { ...c, x: 6, y: 25, scale: 1.3 };
      if (c.id === 'trigger_rt') return { ...c, x: 94, y: 25, scale: 1.3 };
      if (c.id === 'btn_a' || c.id === 'btn_b' || c.id === 'btn_x' || c.id === 'btn_y') return { ...c, scale: 1.25 };
      return c;
    }),
  },
};
