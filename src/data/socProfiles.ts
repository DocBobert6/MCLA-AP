import { SocProfile, MclaMobileSettings } from '../types';

export const SOC_PROFILES: SocProfile[] = [
  {
    id: 'sd8gen2',
    name: 'Snapdragon 8 Gen 2 / Gen 3 / 8 Elite',
    chipsets: 'Adreno 740 / 750 / 830 (Samsung Galaxy S23/S24, OnePlus 12, ROG Phone 8)',
    recommendedResolution: '1080p (2x Recomp)',
    targetFps: 60,
    graphicsApi: 'vulkan',
    anisotropic: 16,
    msaa: 'msaa2x',
    fsrMode: 'quality',
    frameGen: true,
    description: 'High-end flagship SoC with hardware raytracing & Vulkan 1.3. Capable of locked 60 FPS at 1080p with FSR 3.1 Frame Generation enabled.',
    workarounds: {
      adrenoPipelineBypass: true,
      maliSubgroupSizeWorkaround: false,
      thermalThrottlingGuard: false,
      unifiedMemoryHeaps: true,
    },
  },
  {
    id: 'sd870',
    name: 'Snapdragon 870 / 888 / 7+ Gen 2',
    chipsets: 'Adreno 650 / 660 / 725 (POCO F3/F5, Xiaomi Pad 6, Galaxy S21)',
    recommendedResolution: '720p (Native X360)',
    targetFps: 60,
    graphicsApi: 'vulkan',
    anisotropic: 8,
    msaa: 'off',
    fsrMode: 'balanced',
    frameGen: false,
    description: 'Balanced performance profile. Runs native 720p 60 FPS stably with low thermal buildup and efficient battery draw.',
    workarounds: {
      adrenoPipelineBypass: true,
      maliSubgroupSizeWorkaround: false,
      thermalThrottlingGuard: true,
      unifiedMemoryHeaps: true,
    },
  },
  {
    id: 'dimensity',
    name: 'MediaTek Dimensity 9000 / 9200 / 8300',
    chipsets: 'Mali-G710 / Immortalis-G715 / G720 (Redmi K70E, Vivo X90, Nothing Phone 2a)',
    recommendedResolution: '720p (Native X360)',
    targetFps: 45,
    graphicsApi: 'vulkan',
    anisotropic: 4,
    msaa: 'off',
    fsrMode: 'performance',
    frameGen: false,
    description: 'ARM Mali GPU architecture with specialized Vulkan pipeline cache workarounds to prevent micro-stutters during shader translation.',
    workarounds: {
      adrenoPipelineBypass: false,
      maliSubgroupSizeWorkaround: true,
      thermalThrottlingGuard: true,
      unifiedMemoryHeaps: false,
    },
  },
  {
    id: 'tensor',
    name: 'Google Tensor G2 / G3 / Exynos 2400',
    chipsets: 'Mali-G715 / Xclipse 940 (Pixel 7/8/9, Galaxy S24 Exynos)',
    recommendedResolution: '720p (Native X360)',
    targetFps: 30,
    graphicsApi: 'vulkan',
    anisotropic: 4,
    msaa: 'off',
    fsrMode: 'quality',
    frameGen: false,
    description: 'Focuses on power efficiency, tight memory bounds, and thermal throttling guards to sustain smooth 30-40 FPS gameplay without phone overheating.',
    workarounds: {
      adrenoPipelineBypass: false,
      maliSubgroupSizeWorkaround: true,
      thermalThrottlingGuard: true,
      unifiedMemoryHeaps: false,
    },
  },
  {
    id: 'handheld',
    name: 'Android Dedicated Handhelds (Odin 2, Retroid Pocket 4 Pro, Ayaneo)',
    chipsets: 'Active Cooling / Snapdragon 8 Gen 2 / Dimensity 1100',
    recommendedResolution: '1080p (2x Recomp)',
    targetFps: 60,
    graphicsApi: 'vulkan',
    anisotropic: 16,
    msaa: 'msaa2x',
    fsrMode: 'off',
    frameGen: false,
    description: 'Optimized for dedicated gaming devices with fans and physical built-in analog triggers and dual thumbsticks. Uncapped thermals.',
    workarounds: {
      adrenoPipelineBypass: true,
      maliSubgroupSizeWorkaround: false,
      thermalThrottlingGuard: false,
      unifiedMemoryHeaps: true,
    },
  },
];

export const DEFAULT_MOBILE_SETTINGS: MclaMobileSettings = {
  graphicsApi: 'vulkan',
  resolution: '720p',
  targetFps: 60,
  graphicsPreset: 'custom',
  antiAliasing: 'fsr31_native',
  fsrUpscaling: 'quality',
  frameGeneration: false,
  anisotropicFiltering: 8,
  hdrMode: 'off',
  hapticsEnabled: true,
  hapticStrength: 80,
  touchControlsEnabled: true,
  touchLayout: 'standard',
  touchOpacity: 75,
  tiltSteering: false,
  tiltSensitivity: 1.0,
  soundVolume: 90,
  musicVolume: 75,
  mcla_prefer_dedicated_gpu: true,
  render_target_max_height: 720,
  mcla_rain_unscaled_copy: true,
  mcla_vinyl_readback: true,
  mcla_larger_tiles: true,
  occlusion_query_async: true,
  mcla_small_cpu_defaults: true,
};

export function generateTomlConfig(settings: MclaMobileSettings, profile?: SocProfile): string {
  return `# Midnight Club: Los Angeles Complete Edition (545407F8)
# ReXGlue Android Port Configuration
# Generated for: ${profile?.name ?? 'Generic Android Device'}

[graphics]
api = "${settings.graphicsApi}"
resolution = "${settings.resolution}"
framerate = ${settings.targetFps}
vsync = true
anisotropy = ${settings.anisotropicFiltering}
anti_aliasing = "${settings.antiAliasing}"
fsr_upscaling = "${settings.fsrUpscaling}"
frame_generation = ${settings.frameGeneration}
hdr = "${settings.hdrMode}"

[android]
prefer_dedicated_gpu = ${settings.mcla_prefer_dedicated_gpu}
render_target_max_height = ${settings.render_target_max_height}
haptics_enabled = ${settings.hapticsEnabled}
haptic_strength = ${settings.hapticStrength}
touch_overlay = ${settings.touchControlsEnabled}
touch_layout = "${settings.touchLayout}"
touch_opacity = ${settings.touchOpacity}
tilt_steering = ${settings.tiltSteering}
adreno_pipeline_bypass = ${profile?.workarounds.adrenoPipelineBypass ?? true}
mali_subgroup_workaround = ${profile?.workarounds.maliSubgroupSizeWorkaround ?? false}
thermal_throttling_guard = ${profile?.workarounds.thermalThrottlingGuard ?? true}

[fixes]
mcla_larger_tiles = ${settings.mcla_larger_tiles}
mcla_rain_unscaled_copy = ${settings.mcla_rain_unscaled_copy}
mcla_vinyl_readback = ${settings.mcla_vinyl_readback}
occlusion_query_async = ${settings.occlusion_query_async}
mcla_small_cpu_defaults = ${settings.mcla_small_cpu_defaults}
mcla_ui_interpolate = true

[audio]
backend = "aaudio"
volume_master = ${settings.soundVolume}
volume_music = ${settings.musicVolume}
buffer_burst_frames = 192
`;
}
