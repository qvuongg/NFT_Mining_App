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

  const getRandomTraits = (): NFTTraits => ({
    background: getRandomTrait('background'),
    cat: getRandomTrait('cat'),
    eyes: getRandomTrait('eyes'),
    mouth: getRandomTrait('mouth'),
  });

  const handleRandomize = async () => {
    if (isAnimating) return;

    setIsAnimating(true);

    const steps = 28;
    const baseInterval = 40;
    const maxInterval = 180;
    let accumulatedDelay = 0;

    for (let i = 0; i < steps; i++) {
      const progress = i / (steps - 1);
      const eased = 1 - Math.cos((progress * Math.PI) / 2); // ease-out
      const interval = baseInterval + eased * (maxInterval - baseInterval);
      accumulatedDelay += interval;

      setTimeout(() => {
        onRandomize(getRandomTraits());
      }, accumulatedDelay);
    }

    setTimeout(() => {
      onRandomize(getRandomTraits());
      setIsAnimating(false);
    }, accumulatedDelay + 220);
  };

  return (
    <motion.button
      onClick={handleRandomize}
      disabled={isAnimating}
      className={`w-full px-6 py-4 font-extrabold text-lg rounded-2xl transition-all shadow-lg shadow-rose-200/40 ${
        isAnimating
          ? 'bg-gray-200 text-gray-500 cursor-not-allowed'
          : 'bg-gradient-to-r from-rose-500 via-amber-400 to-emerald-400 text-white hover:shadow-2xl hover:shadow-rose-200/60'
      }`}
      whileTap={{ scale: isAnimating ? 1 : 0.96 }}
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

