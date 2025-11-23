'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { NFTTraits, TRAITS } from './NFTCustomizer';

interface Props {
  onRandomize: (traits: NFTTraits) => void;
}

export function RandomGenerator({ onRandomize }: Props) {
  const [isAnimating, setIsAnimating] = useState(false);

  const getRandomTrait = <T extends keyof typeof TRAITS>(category: T): string => {
    const options = TRAITS[category];
    return options[Math.floor(Math.random() * options.length)].id;
  };

  const handleRandomize = async () => {
    if (isAnimating) return;

    setIsAnimating(true);

    // Animation duration
    const animationDuration = 2000;
    const updateInterval = 50;

    // Start rapid cycling
    const intervalId = setInterval(() => {
      onRandomize({
        background: getRandomTrait('background'),
        cat: getRandomTrait('cat'),
        eyes: getRandomTrait('eyes'),
        mouth: getRandomTrait('mouth'),
      });
    }, updateInterval);

    // Stop after animation duration
    setTimeout(() => {
      clearInterval(intervalId);
      
      // Final selection with easing stop
      const finalTraits: NFTTraits = {
        background: getRandomTrait('background'),
        cat: getRandomTrait('cat'),
        eyes: getRandomTrait('eyes'),
        mouth: getRandomTrait('mouth'),
      };
      
      onRandomize(finalTraits);
      setIsAnimating(false);
    }, animationDuration);
  };

  return (
    <motion.button
      onClick={handleRandomize}
      disabled={isAnimating}
      className={`w-full px-6 py-4 font-bold text-lg rounded-xl border-4 transition-all ${
        isAnimating
          ? 'bg-gray-400 border-gray-600 cursor-not-allowed'
          : 'bg-white border-blue-600 text-blue-600 hover:bg-blue-50 hover:scale-105'
      }`}
      whileTap={{ scale: isAnimating ? 1 : 0.95 }}
    >
      {isAnimating ? (
        <div className="flex items-center justify-center gap-3">
          <motion.div
            className="flex gap-1"
            animate={{
              rotate: 360,
            }}
            transition={{
              duration: 1,
              repeat: Infinity,
              ease: "linear",
            }}
          >
            🎲
          </motion.div>
          <span>Randomizing...</span>
        </div>
      ) : (
        '🎲 Random Generate'
      )}
    </motion.button>
  );
}

