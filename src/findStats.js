// Statistical Shift Analysis
// Analyzes each linguistic category to find most probable shifts

const parser = require('./parser');
const { findPossibleShifts } = require('./monogramAnalyzer');
const languageStats = require('./languageStats');

// Calculate shift from encrypted letter to target letter
function calculateShift(encryptedLetter, targetLetter) {
  const encrypted = encryptedLetter.toLowerCase().charCodeAt(0) - 97;
  const target = targetLetter.toLowerCase().charCodeAt(0) - 97;
  return (encrypted - target + 26) % 26;
}

// Count frequency of each element in array
function countFrequency(array) {
  const frequency = {};
  array.forEach(item => {
    frequency[item] = (frequency[item] || 0) + 1;
  });
  return frequency;
}

// Get top N most frequent items
function getTopN(frequency, n = 10) {
  return Object.entries(frequency)
    .sort((a, b) => b[1] - a[1])
    .slice(0, n)
    .map(([item, count]) => ({ item, count }));
}

// Analyze single letters (excluding monograms)
function analyzeSingleLetters(text, langStats, possibleShifts) {
  const letters = parser.extractLettersExcludingMonograms(text);
  
  if (letters.length === 0) {
    return [];
  }
  
  // Count frequency of each letter in text
  const textFrequency = countFrequency(letters);
  const topTextLetters = getTopN(textFrequency, 5);
  
  // Get most frequent letters in language
  const languageLettersSorted = Object.entries(langStats.letterFrequency)
    .sort((a, b) => b[1] - a[1])
    .map(([letter]) => letter);
  
  // Calculate shifts for each combination
  const shiftScores = {};
  
  topTextLetters.forEach(({ item: textLetter, count: textCount }) => {
    languageLettersSorted.slice(0, 5).forEach((languageLetter, languageRank) => {
      const shift = calculateShift(textLetter, languageLetter);
      
      // Only consider possible shifts
      if (!possibleShifts.has(shift)) {
        return;
      }
      
      // Score based on frequency match (higher count = higher score)
      const score = textCount * (5 - languageRank);
      
      if (!shiftScores[shift]) {
        shiftScores[shift] = 0;
      }
      shiftScores[shift] += score;
    });
  });
  
  // Sort by score
  return Object.entries(shiftScores)
    .sort((a, b) => b[1] - a[1])
    .map(([shift, score]) => ({ shift: parseInt(shift), score }));
}

// Analyze first letters of words
function analyzeFirstLetters(text, langStats, possibleShifts) {
  const firstLetters = parser.extractFirstLetters(text);
  
  if (firstLetters.length === 0) {
    return [];
  }
  
  // Count frequency
  const textFrequency = countFrequency(firstLetters);
  const topTextLetters = getTopN(textFrequency, 5);
  
  // Get most frequent first letters in language
  const languageFirstLettersSorted = Object.entries(langStats.firstLetters)
    .sort((a, b) => b[1] - a[1])
    .map(([letter]) => letter);
  
  // Calculate shifts
  const shiftScores = {};
  
  topTextLetters.forEach(({ item: textLetter, count: textCount }) => {
    languageFirstLettersSorted.slice(0, 5).forEach((languageLetter, languageRank) => {
      const shift = calculateShift(textLetter, languageLetter);
      
      if (!possibleShifts.has(shift)) {
        return;
      }
      
      const score = textCount * (5 - languageRank);
      
      if (!shiftScores[shift]) {
        shiftScores[shift] = 0;
      }
      shiftScores[shift] += score;
    });
  });
  
  return Object.entries(shiftScores)
    .sort((a, b) => b[1] - a[1])
    .map(([shift, score]) => ({ shift: parseInt(shift), score }));
}

// Analyze last letters of words
function analyzeLastLetters(text, langStats, possibleShifts) {
  const lastLetters = parser.extractLastLetters(text);
  
  if (lastLetters.length === 0) {
    return [];
  }
  
  // Count frequency
  const textFrequency = countFrequency(lastLetters);
  const topTextLetters = getTopN(textFrequency, 5);
  
  // Get most frequent last letters in language
  const languageLastLettersSorted = Object.entries(langStats.lastLetters)
    .sort((a, b) => b[1] - a[1])
    .map(([letter]) => letter);
  
  // Calculate shifts
  const shiftScores = {};
  
  topTextLetters.forEach(({ item: textLetter, count: textCount }) => {
    languageLastLettersSorted.slice(0, 5).forEach((languageLetter, languageRank) => {
      const shift = calculateShift(textLetter, languageLetter);
      
      if (!possibleShifts.has(shift)) {
        return;
      }
      
      const score = textCount * (5 - languageRank);
      
      if (!shiftScores[shift]) {
        shiftScores[shift] = 0;
      }
      shiftScores[shift] += score;
    });
  });
  
  return Object.entries(shiftScores)
    .sort((a, b) => b[1] - a[1])
    .map(([shift, score]) => ({ shift: parseInt(shift), score }));
}

// Analyze monograms
function analyzeMonograms(text, langStats, possibleShifts) {
  const monograms = parser.extractMonograms(text);
  
  if (monograms.length === 0) {
    return [];
  }
  
  // Count frequency
  const textFrequency = countFrequency(monograms);
  const validMonograms = Object.keys(langStats.monograms);
  
  // Calculate shifts
  const shiftScores = {};
  
  Object.entries(textFrequency).forEach(([textMonogram, textCount]) => {
    validMonograms.forEach(languageMonogram => {
      const shift = calculateShift(textMonogram, languageMonogram);
      
      if (!possibleShifts.has(shift)) {
        return;
      }
      
      // Score based on frequency
      const score = textCount * langStats.monograms[languageMonogram];
      
      if (!shiftScores[shift]) {
        shiftScores[shift] = 0;
      }
      shiftScores[shift] += score;
    });
  });
  
  return Object.entries(shiftScores)
    .sort((a, b) => b[1] - a[1])
    .map(([shift, score]) => ({ shift: parseInt(shift), score }));
}

// Analyze digrams with gap matching
function analyzeDigrams(text, langStats, possibleShifts) {
  const textDigrams = parser.extractDigrams(text);
  
  if (textDigrams.length === 0) {
    return [];
  }
  
  // Count digram frequency by gap
  const digramsByGap = {};
  textDigrams.forEach(({ digram, gap }) => {
    if (!digramsByGap[gap]) {
      digramsByGap[gap] = [];
    }
    digramsByGap[gap].push(digram);
  });
  
  // Get language digrams by gap
  const languageDigramsByGap = {};
  Object.entries(langStats.digrams).forEach(([digram, frequency]) => {
    const letter1 = digram[0];
    const letter2 = digram[1];
    const code1 = letter1.charCodeAt(0) - 97;
    const code2 = letter2.charCodeAt(0) - 97;
    const gap = (code2 - code1 + 26) % 26;
    
    if (!languageDigramsByGap[gap]) {
      languageDigramsByGap[gap] = [];
    }
    languageDigramsByGap[gap].push({ digram, frequency });
  });
  
  // Calculate shifts by matching gaps
  const shiftScores = {};
  
  Object.entries(digramsByGap).forEach(([gap, textDigrams]) => {
    const languageDigrams = languageDigramsByGap[gap];
    
    if (!languageDigrams) {
      return;
    }
    
    // Count text digram frequency
    const textDigramFrequency = countFrequency(textDigrams);
    
    Object.entries(textDigramFrequency).forEach(([textDigram, textCount]) => {
      languageDigrams.forEach(({ digram: languageDigram, frequency: languageFrequency }) => {
        // Calculate shift from first letter
        const shift = calculateShift(textDigram[0], languageDigram[0]);
        
        if (!possibleShifts.has(shift)) {
          return;
        }
        
        // Score based on both frequencies
        const score = textCount * languageFrequency;
        
        if (!shiftScores[shift]) {
          shiftScores[shift] = 0;
        }
        shiftScores[shift] += score;
      });
    });
  });
  
  return Object.entries(shiftScores)
    .sort((a, b) => b[1] - a[1])
    .map(([shift, score]) => ({ shift: parseInt(shift), score }));
}

// Analyze trigrams with gap matching
function analyzeTrigrams(text, langStats, possibleShifts) {
  const textTrigrams = parser.extractTrigrams(text);
  
  if (textTrigrams.length === 0) {
    return [];
  }
  
  // Group by gap pattern
  const trigramsByGaps = {};
  textTrigrams.forEach(({ trigram, gap1, gap2 }) => {
    const gapKey = `${gap1}-${gap2}`;
    if (!trigramsByGaps[gapKey]) {
      trigramsByGaps[gapKey] = [];
    }
    trigramsByGaps[gapKey].push(trigram);
  });
  
  // Get language trigrams by gaps
  const languageTrigramsByGaps = {};
  Object.entries(langStats.trigrams).forEach(([trigram, frequency]) => {
    const code1 = trigram[0].charCodeAt(0) - 97;
    const code2 = trigram[1].charCodeAt(0) - 97;
    const code3 = trigram[2].charCodeAt(0) - 97;
    const gap1 = (code2 - code1 + 26) % 26;
    const gap2 = (code3 - code2 + 26) % 26;
    const gapKey = `${gap1}-${gap2}`;
    
    if (!languageTrigramsByGaps[gapKey]) {
      languageTrigramsByGaps[gapKey] = [];
    }
    languageTrigramsByGaps[gapKey].push({ trigram, frequency });
  });
  
  // Calculate shifts
  const shiftScores = {};
  
  Object.entries(trigramsByGaps).forEach(([gapKey, textTrigrams]) => {
    const languageTrigrams = languageTrigramsByGaps[gapKey];
    
    if (!languageTrigrams) {
      return;
    }
    
    const textTrigramFrequency = countFrequency(textTrigrams);
    
    Object.entries(textTrigramFrequency).forEach(([textTrigram, textCount]) => {
      languageTrigrams.forEach(({ trigram: languageTrigram, frequency: languageFrequency }) => {
        const shift = calculateShift(textTrigram[0], languageTrigram[0]);
        
        if (!possibleShifts.has(shift)) {
          return;
        }
        
        const score = textCount * languageFrequency;
        
        if (!shiftScores[shift]) {
          shiftScores[shift] = 0;
        }
        shiftScores[shift] += score;
      });
    });
  });
  
  return Object.entries(shiftScores)
    .sort((a, b) => b[1] - a[1])
    .map(([shift, score]) => ({ shift: parseInt(shift), score }));
}

// Analyze text for all categories in one language
function analyzeLanguage(text, languageId) {
  const langStats = languageStats[languageId];
  const possibleShiftsResult = findPossibleShifts(text, langStats);
  const possibleShifts = possibleShiftsResult.possibleShifts;
  
  return {
    language: langStats.name,
    possibleShiftsCount: possibleShifts.size,
    possibleShifts: Array.from(possibleShifts).sort((a, b) => a - b),
    categories: {
      singleLetters: analyzeSingleLetters(text, langStats, possibleShifts),
      firstLetters: analyzeFirstLetters(text, langStats, possibleShifts),
      lastLetters: analyzeLastLetters(text, langStats, possibleShifts),
      monograms: analyzeMonograms(text, langStats, possibleShifts),
      digrams: analyzeDigrams(text, langStats, possibleShifts),
      trigrams: analyzeTrigrams(text, langStats, possibleShifts)
    }
  };
}

// Analyze text for all languages
function analyzeAllLanguages(text) {
  return {
    english: analyzeLanguage(text, 'english'),
    french: analyzeLanguage(text, 'french'),
    spanish: analyzeLanguage(text, 'spanish'),
    german: analyzeLanguage(text, 'german')
  };
}

module.exports = {
  analyzeAllLanguages
};