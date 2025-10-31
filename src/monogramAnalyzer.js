// Monogram Analyzer
// Finds possible shifts based on monogram analysis

const { extractMonograms } = require('./parser');
const languageStats = require('./languageStats');

// Calculate the shift needed to go from source character to target character
function calculateShift(sourceChar, targetChar) {
  const source = sourceChar.toLowerCase().charCodeAt(0) - 97;
  const target = targetChar.toLowerCase().charCodeAt(0) - 97;
  return (source - target + 26) % 26;
}

// Find possible shifts for a specific language based on monograms
function findPossibleShifts(text, langStats) {
  const textMonograms = extractMonograms(text);
  const validMonograms = Object.keys(langStats.monograms);
  
  // If no valid monograms in language, all shifts are possible
  if (validMonograms.length === 0) {
    return {
      possibleShifts: new Set(Array.from({ length: 26 }, (_, i) => i)),
      method: 'no_monograms_in_language',
      details: {
        textMonogramsFound: textMonograms.length,
        languageMonograms: 0
      }
    };
  }
  
  // If no monograms found in text, all shifts are possible
  if (textMonograms.length === 0) {
    return {
      possibleShifts: new Set(Array.from({ length: 26 }, (_, i) => i)),
      method: 'no_monograms_in_text',
      details: {
        textMonogramsFound: 0,
        languageMonograms: validMonograms.length
      }
    };
  }
  
  // Case 1: Only one monogram in text
  if (textMonograms.length === 1) {
    const textMonogram = textMonograms[0];
    const possibleShifts = new Set();
    
    // This monogram can map to any valid language monogram
    validMonograms.forEach(validMonogram => {
      const shift = calculateShift(textMonogram, validMonogram);
      possibleShifts.add(shift);
    });
    
    return {
      possibleShifts,
      method: 'single_monogram',
      details: {
        textMonogramsFound: 1,
        textMonogram: textMonogram,
        possibleMappings: validMonograms.length
      }
    };
  }
  
  // Case 2: Multiple monograms in text - Use intersection
  const uniqueTextMonograms = [...new Set(textMonograms)];
  
  if (uniqueTextMonograms.length === 1) {
    // All monograms are the same letter
    const textMonogram = uniqueTextMonograms[0];
    const possibleShifts = new Set();
    
    validMonograms.forEach(validMonogram => {
      const shift = calculateShift(textMonogram, validMonogram);
      possibleShifts.add(shift);
    });
    
    return {
      possibleShifts,
      method: 'single_unique_monogram',
      details: {
        textMonogramsFound: textMonograms.length,
        uniqueMonogram: textMonogram,
        possibleMappings: validMonograms.length
      }
    };
  }
  
  // Case 3: Multiple different monograms
  // If more unique monograms in text than in language reference, cannot determine shift
  if (uniqueTextMonograms.length > validMonograms.length) {
    return {
      possibleShifts: new Set(Array.from({ length: 26 }, (_, i) => i)),
      method: 'too_many_monograms',
      details: {
        textMonogramsFound: textMonograms.length,
        uniqueMonograms: uniqueTextMonograms.length,
        languageMonograms: validMonograms.length,
        note: 'More unique monograms in text than in language reference - cannot determine shift'
      }
    };
  }
  
  // Calculate possible shifts for each text monogram
  const shiftsPerMonogram = uniqueTextMonograms.map(textMonogram => {
    const shifts = new Set();
    validMonograms.forEach(validMonogram => {
      const shift = calculateShift(textMonogram, validMonogram);
      shifts.add(shift);
    });
    return shifts;
  });
  
  // Find intersection of all possible shifts
  let possibleShifts = shiftsPerMonogram[0];
  for (let i = 1; i < shiftsPerMonogram.length; i++) {
    possibleShifts = new Set([...possibleShifts].filter(s => 
      shiftsPerMonogram[i].has(s)
    ));
  }
  
  return {
    possibleShifts,
    method: 'intersection',
    details: {
      textMonogramsFound: textMonograms.length,
      uniqueMonograms: uniqueTextMonograms.length,
      languageMonograms: validMonograms.length,
      shiftsFound: possibleShifts.size
    }
  };
}

module.exports = {
  findPossibleShifts
};