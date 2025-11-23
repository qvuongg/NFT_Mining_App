#!/usr/bin/env node

/**
 * Script to check if all NFT trait images are present
 * Run: node scripts/check-traits.js
 */

const fs = require('fs');
const path = require('path');

const TRAITS_DIR = path.join(__dirname, '../public/assets/traits');

const REQUIRED_FILES = {
  backgrounds: ['green.png', 'blue.png', 'purple.png', 'pink.png'],
  cats: ['orange.png', 'gray.png', 'tuxedo.png', 'white.png'],
  eyes: ['normal.png', 'sleepy.png', 'heart.png', 'close.png'],
  mouths: ['happy.png', 'sad.png', 'silly.png', 'cool.png'],
};

function checkFiles() {
  console.log('🔍 Checking NFT trait images...\n');
  
  let totalMissing = 0;
  let totalPresent = 0;
  const missingFiles = [];

  Object.entries(REQUIRED_FILES).forEach(([category, files]) => {
    console.log(`📁 ${category}/`);
    
    const categoryPath = path.join(TRAITS_DIR, category);
    
    // Check if directory exists
    if (!fs.existsSync(categoryPath)) {
      console.log(`   ❌ Directory not found!\n`);
      missingFiles.push(...files.map(f => `${category}/${f}`));
      totalMissing += files.length;
      return;
    }

    files.forEach(file => {
      const filePath = path.join(categoryPath, file);
      const exists = fs.existsSync(filePath);
      
      if (exists) {
        const stats = fs.statSync(filePath);
        const sizeKB = (stats.size / 1024).toFixed(1);
        const sizeWarning = stats.size > 200 * 1024 ? ' ⚠️  (large file)' : '';
        console.log(`   ✅ ${file} (${sizeKB}KB)${sizeWarning}`);
        totalPresent++;
      } else {
        console.log(`   ❌ ${file} - MISSING`);
        missingFiles.push(`${category}/${file}`);
        totalMissing++;
      }
    });
    
    console.log('');
  });

  // Summary
  console.log('━'.repeat(50));
  console.log(`\n📊 Summary:\n`);
  console.log(`   Total files: ${totalPresent + totalMissing}`);
  console.log(`   ✅ Present: ${totalPresent}`);
  console.log(`   ❌ Missing: ${totalMissing}\n`);

  if (totalMissing > 0) {
    console.log('📋 Missing files:\n');
    missingFiles.forEach(file => {
      console.log(`   - ${file}`);
    });
    console.log('');
    console.log('💡 Tip: Add these files to public/assets/traits/');
    console.log('📖 See NFT_IMAGES_GUIDE.md for details\n');
    process.exit(1);
  } else {
    console.log('🎉 All trait images are present!');
    console.log('✨ Your NFT collection is ready to mint!\n');
    process.exit(0);
  }
}

// Run check
checkFiles();

