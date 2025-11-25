'use client';

import { useRef, useEffect, useState } from 'react';
import { NFTTraits, TRAITS } from './NFTCustomizer';
import * as htmlToImage from 'html-to-image';
import { getTraitImagePath, compositeNFT, canvasToBlob } from '@/lib/nft-composer';
import { DEFAULT_LAYER_CONFIG, getPercentagePosition } from '@/lib/layer-config';
import Image from 'next/image';
import { useAssetCacheBuster } from '@/hooks/useAssetCacheBuster';

interface Props {
  traits: NFTTraits;
}

export function NFTPreview({ traits }: Props) {
  const previewRef = useRef<HTMLDivElement>(null);
  const cacheBust = useAssetCacheBuster();
  const [useImages, setUseImages] = useState(true);
  const [imageError, setImageError] = useState(false);

  const background = TRAITS.background.find((t) => t.id === traits.background);
  const cat = TRAITS.cat.find((t) => t.id === traits.cat);
  const eyes = TRAITS.eyes.find((t) => t.id === traits.eyes);
  const mouth = TRAITS.mouth.find((t) => t.id === traits.mouth);

  // Check if images exist, fallback to emoji if not
  useEffect(() => {
    const checkImages = async () => {
      try {
        const bgPath = getTraitImagePath('background', traits.background);
        const response = await fetch(bgPath, { method: 'HEAD' });
        if (!response.ok) {
          setUseImages(false);
          setImageError(true);
        }
      } catch {
        setUseImages(false);
        setImageError(true);
      }
    };
    checkImages();
  }, [traits]);

  const handleDownload = async () => {
    try {
      if (useImages && !imageError) {
        // Use composite method for images
        const canvas = await compositeNFT(traits);
        const blob = await canvasToBlob(canvas, 'image/jpeg', 0.95);
        const url = URL.createObjectURL(blob);
        
        const link = document.createElement('a');
        link.download = `customeow-${Date.now()}.jpg`;
        link.href = url;
        link.click();
        
        URL.revokeObjectURL(url);
      } else {
        // Fallback to screenshot method for emoji version
        if (!previewRef.current) return;
        
        const dataUrl = await htmlToImage.toJpeg(previewRef.current, {
          quality: 1.0,
          pixelRatio: 2,
        });

        const link = document.createElement('a');
        link.download = `customeow-${Date.now()}.jpg`;
        link.href = dataUrl;
        link.click();
      }
    } catch (error) {
      console.error('Failed to download image:', error);
    }
  };

  return (
    <div className="w-full">
      {/* Preview Card */}
      <div
        ref={previewRef}
        className="aspect-square rounded-3xl border-8 border-gray-800 overflow-hidden shadow-2xl relative bg-gray-100"
      >
        {useImages && !imageError ? (
          // Image-based rendering with precise positioning
          <div className="relative w-full h-full">
            {/* Background Layer - Full canvas */}
            <div 
              style={{
                position: 'absolute',
                ...getPercentagePosition(DEFAULT_LAYER_CONFIG.background),
                zIndex: DEFAULT_LAYER_CONFIG.background.zIndex,
              }}
            >
                <Image
                  src={`${getTraitImagePath('background', traits.background)}${cacheBust}`}
                alt="Background"
                fill
                className="object-cover"
                onError={() => setImageError(true)}
                priority
              />
            </div>
            
            {/* Cat Layer - Positioned according to config */}
            <div 
              style={{
                position: 'absolute',
                ...getPercentagePosition(DEFAULT_LAYER_CONFIG.cat),
                zIndex: DEFAULT_LAYER_CONFIG.cat.zIndex,
              }}
            >
                <Image
                  src={`${getTraitImagePath('cat', traits.cat)}${cacheBust}`}
                alt="Cat"
                fill
                className="object-contain"
                onError={() => setImageError(true)}
              />
            </div>
            
            {/* Eyes Layer - Positioned on cat face */}
            <div 
              style={{
                position: 'absolute',
                ...getPercentagePosition(DEFAULT_LAYER_CONFIG.eyes),
                zIndex: DEFAULT_LAYER_CONFIG.eyes.zIndex,
              }}
            >
                <Image
                  src={`${getTraitImagePath('eyes', traits.eyes)}${cacheBust}`}
                alt="Eyes"
                fill
                className="object-contain"
                onError={() => setImageError(true)}
              />
            </div>
            
            {/* Mouth Layer - Positioned below eyes */}
            <div 
              style={{
                position: 'absolute',
                ...getPercentagePosition(DEFAULT_LAYER_CONFIG.mouth),
                zIndex: DEFAULT_LAYER_CONFIG.mouth.zIndex,
              }}
            >
                <Image
                  src={`${getTraitImagePath('mouth', traits.mouth)}${cacheBust}`}
                alt="Mouth"
                fill
                className="object-contain"
                onError={() => setImageError(true)}
              />
            </div>
          </div>
        ) : (
          // Fallback to emoji-based rendering
          <div style={{ backgroundColor: background?.color || '#2D8B7A' }} className="w-full h-full">
            {/* Decorative elements */}
            <div className="absolute top-4 left-4 w-20 h-20 opacity-20">
              <svg viewBox="0 0 100 100" fill="black">
                <line x1="0" y1="0" x2="100" y2="100" stroke="black" strokeWidth="8" />
                <line x1="100" y1="0" x2="0" y2="100" stroke="black" strokeWidth="8" />
              </svg>
            </div>
            <div className="absolute top-4 right-4 w-20 h-20 opacity-20">
              <svg viewBox="0 0 100 100" fill="black">
                <line x1="0" y1="0" x2="100" y2="100" stroke="black" strokeWidth="8" />
                <line x1="100" y1="0" x2="0" y2="100" stroke="black" strokeWidth="8" />
              </svg>
            </div>

            {/* Cat body (simplified box) */}
            <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-3/4 h-1/2 bg-gray-700 rounded-t-3xl flex flex-col items-center justify-start pt-8">
              {/* Cat face */}
              <div className="text-9xl mb-4">{cat?.emoji || '🐱'}</div>
              
              {/* Eyes */}
              <div className="text-4xl mb-2">{eyes?.emoji || '👀'}</div>
              
              {/* Mouth */}
              <div className="text-3xl">{mouth?.emoji || '😊'}</div>

              {/* Cat paws */}
              <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 flex gap-8">
                <div className="w-16 h-8 bg-white rounded-t-full"></div>
                <div className="w-16 h-8 bg-white rounded-t-full"></div>
              </div>
            </div>

            {/* Ground */}
            <div className="absolute bottom-0 w-full h-1/3 bg-orange-700"></div>
            
            {/* Warning Badge */}
            <div className="absolute top-4 left-1/2 transform -translate-x-1/2 bg-yellow-500 text-gray-900 px-3 py-1 rounded-full text-xs font-bold">
              ⚠️ Add images to /public/assets/traits/
            </div>
          </div>
        )}
      </div>

      {/* Download Button */}
      <button
        onClick={handleDownload}
        className="w-full mt-4 px-6 py-4 font-bold text-lg rounded-xl border-4 border-gray-600 bg-white hover:bg-gray-50 hover:scale-105 transition-all"
      >
        📥 Download PFP
      </button>
    </div>
  );
}

