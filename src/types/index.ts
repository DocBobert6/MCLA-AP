export interface XboxIsoInfo {
  fileName: string;
  fileSize: number;
  titleId: string;
  titleName: string;
  discType: 'XGD2' | 'XGD3' | 'Standard ISO' | 'Unknown';
  headerOffset: number;
  rootSector: number;
  totalSectors: number;
  mediaId: string;
  isValidMcla: boolean;
  status: 'validating' | 'valid' | 'invalid' | 'ready';
  message: string;
  files: IsoFileEntry[];
}

export interface IsoFileEntry {
  name: string;
  path: string;
  sector: number;
  size: number;
  isDirectory: boolean;
  isCritical: boolean;
}

export type SocProfileId = 'sd8gen2' | 'sd870' | 'dimensity' | 'tensor' | 'handheld';

export interface SocProfile {
  id: SocProfileId;
  name: string;
  chipsets: string;
  recommendedResolution: string;
  targetFps: number;
  graphicsApi: 'vulkan' | 'd3d12';
  anisotropic: number;
  msaa: string;
  fsrMode: string;
  frameGen: boolean;
  description: string;
  workarounds: {
    adrenoPipelineBypass: boolean;
    maliSubgroupSizeWorkaround: boolean;
    thermalThrottlingGuard: boolean;
    unifiedMemoryHeaps: boolean;
  };
}

export interface MclaMobileSettings {
  graphicsApi: 'vulkan' | 'd3d12';
  resolution: '720p' | '1080p' | '1440p';
  targetFps: 30 | 40 | 45 | 60 | 120 | 0; // 0 = uncapped
  graphicsPreset: 'custom' | 'low-end' | 'lowest' | 'performance';
  antiAliasing: 'msaa2x' | 'fsr31_native' | 'off';
  fsrUpscaling: 'off' | 'ultra_quality' | 'quality' | 'balanced' | 'performance';
  frameGeneration: boolean;
  anisotropicFiltering: 0 | 2 | 4 | 8 | 16;
  hdrMode: 'off' | 'auto' | 'on';
  hapticsEnabled: boolean;
  hapticStrength: number;
  touchControlsEnabled: boolean;
  touchLayout: 'compact' | 'standard' | 'wide' | 'split';
  touchOpacity: number;
  tiltSteering: boolean;
  tiltSensitivity: number;
  soundVolume: number;
  musicVolume: number;
  // Specific mobile switches
  mcla_prefer_dedicated_gpu: boolean;
  render_target_max_height: number;
  mcla_rain_unscaled_copy: boolean;
  mcla_vinyl_readback: boolean;
  mcla_larger_tiles: boolean;
  occlusion_query_async: boolean;
  mcla_small_cpu_defaults: boolean;
}

export interface VirtualInputState {
  steer: number; // -1 to 1
  throttle: number; // 0 to 1
  brake: number; // 0 to 1
  handbrake: boolean;
  nitro: boolean;
  special: boolean;
  camera: boolean;
  pause: boolean;
  map: boolean;
  dpadUp: boolean;
  dpadDown: boolean;
  dpadLeft: boolean;
  dpadRight: boolean;
}

export type Xbox360ControlId = 
  | 'left_stick'
  | 'right_stick'
  | 'dpad'
  | 'btn_a'
  | 'btn_b'
  | 'btn_x'
  | 'btn_y'
  | 'trigger_lt'
  | 'trigger_rt'
  | 'bumper_lb'
  | 'bumper_rb'
  | 'btn_back'
  | 'btn_start'
  | 'btn_guide'
  | 'stick_click_ls'
  | 'stick_click_rs';

export interface XboxControlConfig {
  id: Xbox360ControlId;
  label: string;
  gameAction: string;
  color: string;
  x: number; // 0 to 100 percentage from left
  y: number; // 0 to 100 percentage from top
  scale: number; // 0.6 to 2.0
  opacity: number; // 0.1 to 1.0
  visible: boolean;
  deadzone?: number;
  customKeyBinding?: string;
}

export type XboxOverlayPreset = 
  | 'authentic_360' 
  | 'mcla_racing' 
  | 'claw_grip' 
  | 'compact_phone' 
  | 'tablet_wide';

export interface AndroidProjectFile {
  path: string;
  language: string;
  description: string;
  content: string;
}
