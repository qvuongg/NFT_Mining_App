/**
 * Layer positioning and sizing configuration
 * All coordinates are for a 1000x1000px canvas
 */

export interface LayerConfig {
  // Position (top-left corner)
  x: number;
  y: number;
  // Size
  width: number;
  height: number;
  // Z-index for layering
  zIndex: number;
}

export interface LayerConfigMap {
  background: LayerConfig;
  cat: LayerConfig;
  eyes: LayerConfig;
  mouth: LayerConfig;
}

/**
 * Default layer configuration
 * Adjust these values to properly position your NFT traits
 */
export const DEFAULT_LAYER_CONFIG: LayerConfigMap = {
  // Background fills entire canvas
  background: {
    x: 0,
    y: 0,
    width: 1000,
    height: 1000,
    zIndex: 1,
  },
  
  // Cat body - centered horizontally, positioned in lower 2/3 of canvas
  cat: {
    x: 200,     // Left offset to center ~600px wide cat
    y: 300,     // Top offset
    width: 600, // Cat body width
    height: 800, // Cat body height
    zIndex: 2,
  },
  
  // Eyes - positioned on cat's face
  eyes: {
    x: 370,     // Horizontal center position
    y: 545,     // Upper portion of cat face
    width: 250, // Eyes width
    height: 150, // Eyes height
    zIndex: 3,
  },
  
  // Mouth - positioned below eyes
  mouth: {
    x: 425,     // Slightly offset from eyes center
    y: 625,     // Below eyes
    width: 145, // Mouth width
    height: 110,  // Mouth height
    zIndex: 4,
  },
};

/**
 * Get percentage-based positioning for responsive layouts
 */
export function getPercentagePosition(config: LayerConfig): {
  left: string;
  top: string;
  width: string;
  height: string;
} {
  return {
    left: `${(config.x / 1000) * 100}%`,
    top: `${(config.y / 1000) * 100}%`,
    width: `${(config.width / 1000) * 100}%`,
    height: `${(config.height / 1000) * 100}%`,
  };
}

/**
 * Scale layer config to different canvas size
 */
export function scaleLayerConfig(config: LayerConfig, targetSize: number): LayerConfig {
  const scale = targetSize / 1000;
  return {
    x: config.x * scale,
    y: config.y * scale,
    width: config.width * scale,
    height: config.height * scale,
    zIndex: config.zIndex,
  };
}

