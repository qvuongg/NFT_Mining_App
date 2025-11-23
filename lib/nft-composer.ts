import { NFTTraits } from '@/components/NFTCustomizer';

/**
 * Assets version - Increment this when you update trait images
 * Format: MAJOR.MINOR.PATCH
 * - Change MAJOR when completely redesigning all assets
 * - Change MINOR when adding/updating several traits
 * - Change PATCH when fixing individual images
 */
const ASSETS_VERSION = '1.0.0';

/**
 * Get trait image path from trait ID with cache busting
 */
export function getTraitImagePath(category: keyof NFTTraits, traitId: string): string {
  const paths = {
    background: `/assets/traits/backgrounds/${traitId}.png`,
    cat: `/assets/traits/cats/${traitId}.png`,
    eyes: `/assets/traits/eyes/${traitId}.png`,
    mouth: `/assets/traits/mouths/${traitId}.png`,
  };
  
  const basePath = paths[category];
  
  // In development: Use timestamp for instant updates (no cache)
  if (process.env.NODE_ENV === 'development') {
    return `${basePath}?v=${ASSETS_VERSION}&t=${Date.now()}`;
  }
  
  // In production: Use version only (allows caching between deployments)
  return `${basePath}?v=${ASSETS_VERSION}`;
}

/**
 * Check if trait image exists
 */
export async function checkTraitImageExists(category: keyof NFTTraits, traitId: string): Promise<boolean> {
  try {
    const path = getTraitImagePath(category, traitId);
    const response = await fetch(path, { method: 'HEAD' });
    return response.ok;
  } catch {
    return false;
  }
}

/**
 * Load image from URL
 */
export function loadImage(src: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.onload = () => resolve(img);
    img.onerror = reject;
    img.src = src;
  });
}

/**
 * Composite NFT layers into single canvas
 */
export async function compositeNFT(traits: NFTTraits): Promise<HTMLCanvasElement> {
  const canvas = document.createElement('canvas');
  const ctx = canvas.getContext('2d');
  
  if (!ctx) {
    throw new Error('Failed to get canvas context');
  }

  // Set canvas size (1000x1000px)
  canvas.width = 1000;
  canvas.height = 1000;

  // Layer order: background → cat → eyes → mouth
  const layers: Array<{ category: keyof NFTTraits; traitId: string }> = [
    { category: 'background', traitId: traits.background },
    { category: 'cat', traitId: traits.cat },
    { category: 'eyes', traitId: traits.eyes },
    { category: 'mouth', traitId: traits.mouth },
  ];

  // Draw each layer
  for (const layer of layers) {
    try {
      const imagePath = getTraitImagePath(layer.category, layer.traitId);
      const img = await loadImage(imagePath);
      
      // Draw image at full canvas size
      ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
    } catch (error) {
      console.warn(`Failed to load ${layer.category}/${layer.traitId}:`, error);
      // Continue with other layers even if one fails
    }
  }

  return canvas;
}

/**
 * Convert canvas to blob
 */
export function canvasToBlob(canvas: HTMLCanvasElement, type = 'image/png', quality = 1.0): Promise<Blob> {
  return new Promise((resolve, reject) => {
    canvas.toBlob(
      (blob) => {
        if (blob) {
          resolve(blob);
        } else {
          reject(new Error('Failed to convert canvas to blob'));
        }
      },
      type,
      quality
    );
  });
}

/**
 * Composite NFT and convert to File ready for IPFS upload
 */
export async function generateNFTImage(traits: NFTTraits): Promise<File> {
  const canvas = await compositeNFT(traits);
  const blob = await canvasToBlob(canvas, 'image/png', 1.0);
  const filename = `nft-${Date.now()}.png`;
  return new File([blob], filename, { type: 'image/png' });
}

