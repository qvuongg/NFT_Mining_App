'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export interface NFTTraits {
  background: string;
  cat: string;
  eyes: string;
  mouth: string;
}

const TRAITS = {
  background: [
    { id: 'green', name: 'Green', color: '#2D8B7A' },
    { id: 'blue', name: 'Blue', color: '#4A90E2' },
    { id: 'purple', name: 'Purple', color: '#9B59B6' },
    { id: 'pink', name: 'Pink', color: '#E91E63' },
  ],
  cat: [
    { id: 'orange', name: 'Orange Cat', emoji: '🐱' },
    { id: 'gray', name: 'Gray Cat', emoji: '🐈' },
    { id: 'tuxedo', name: 'Tuxedo Cat', emoji: '🐈‍⬛' },
    { id: 'white', name: 'White Cat', emoji: '🐱' },
  ],
  eyes: [
    { id: 'normal', name: 'Normal', emoji: '👀' },
    { id: 'sleepy', name: 'Sleepy', emoji: '😴' },
    { id: 'heart', name: 'Heart', emoji: '😍' },
    { id: 'close', name: 'Closed', emoji: '😌' },
  ],
  mouth: [
    { id: 'happy', name: 'Happy', emoji: '😊' },
    { id: 'sad', name: 'Sad', emoji: '😢' },
    { id: 'silly', name: 'Silly', emoji: '😝' },
    { id: 'cool', name: 'Cool', emoji: '😎' },
  ],
};

interface Props {
  traits: NFTTraits;
  onTraitsChange: (traits: NFTTraits) => void;
}

export function NFTCustomizer({ traits, onTraitsChange }: Props) {
  const [activeTab, setActiveTab] = useState<keyof NFTTraits>('background');

  const handleTraitSelect = (category: keyof NFTTraits, traitId: string) => {
    onTraitsChange({
      ...traits,
      [category]: traitId,
    });
  };

  const tabs = [
    { key: 'background' as const, label: 'BACKGROUND' },
    { key: 'cat' as const, label: 'MEOW' },
    { key: 'eyes' as const, label: 'EYE' },
    { key: 'mouth' as const, label: 'MOUTH' },
  ];

  return (
    <div className="w-full">
      {/* Title */}
      <h2 className="text-3xl font-black text-blue-600 mb-6 text-center">
        CUSTOMEOW!!!!
      </h2>

      {/* Tabs */}
      <div className="flex gap-2 mb-6">
        {tabs.map((tab) => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key)}
            className={`flex-1 px-4 py-3 font-bold rounded-lg border-4 transition-all ${
              activeTab === tab.key
                ? 'bg-blue-500 text-white border-blue-700 scale-105'
                : 'bg-white text-gray-700 border-gray-300 hover:border-blue-300'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Trait Options */}
      <div className="bg-cyan-100 rounded-2xl p-6 min-h-[300px]">
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.2 }}
            className="grid grid-cols-2 gap-4"
          >
            {activeTab === 'background' &&
              TRAITS.background.map((trait) => (
                <button
                  key={trait.id}
                  onClick={() => handleTraitSelect('background', trait.id)}
                  className={`p-6 rounded-xl border-4 transition-all ${
                    traits.background === trait.id
                      ? 'border-blue-600 scale-105 shadow-lg'
                      : 'border-gray-300 hover:border-blue-400'
                  }`}
                  style={{ backgroundColor: trait.color }}
                >
                  <div className="text-white font-bold text-lg text-center">
                    {trait.name}
                  </div>
                </button>
              ))}

            {activeTab === 'cat' &&
              TRAITS.cat.map((trait) => (
                <button
                  key={trait.id}
                  onClick={() => handleTraitSelect('cat', trait.id)}
                  className={`p-6 rounded-xl border-4 bg-white transition-all ${
                    traits.cat === trait.id
                      ? 'border-blue-600 scale-105 shadow-lg'
                      : 'border-gray-300 hover:border-blue-400'
                  }`}
                >
                  <div className="text-6xl mb-2 text-center">{trait.emoji}</div>
                  <div className="font-bold text-center">{trait.name}</div>
                </button>
              ))}

            {activeTab === 'eyes' &&
              TRAITS.eyes.map((trait) => (
                <button
                  key={trait.id}
                  onClick={() => handleTraitSelect('eyes', trait.id)}
                  className={`p-6 rounded-xl border-4 bg-white transition-all ${
                    traits.eyes === trait.id
                      ? 'border-blue-600 scale-105 shadow-lg'
                      : 'border-gray-300 hover:border-blue-400'
                  }`}
                >
                  <div className="text-6xl mb-2 text-center">{trait.emoji}</div>
                  <div className="font-bold text-center">{trait.name}</div>
                </button>
              ))}

            {activeTab === 'mouth' &&
              TRAITS.mouth.map((trait) => (
                <button
                  key={trait.id}
                  onClick={() => handleTraitSelect('mouth', trait.id)}
                  className={`p-6 rounded-xl border-4 bg-white transition-all ${
                    traits.mouth === trait.id
                      ? 'border-blue-600 scale-105 shadow-lg'
                      : 'border-gray-300 hover:border-blue-400'
                  }`}
                >
                  <div className="text-6xl mb-2 text-center">{trait.emoji}</div>
                  <div className="font-bold text-center">{trait.name}</div>
                </button>
              ))}
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}

// Export traits options for use in other components
export { TRAITS };

/**
 * Helper function to get trait display name from ID
 */
export function getTraitName(category: keyof NFTTraits, traitId: string): string {
  const trait = TRAITS[category].find((t) => t.id === traitId);
  return trait?.name || traitId;
}

