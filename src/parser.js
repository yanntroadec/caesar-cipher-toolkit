// Parser - Text Analysis Utilities
// Extracts linguistic elements from text for frequency analysis

// Extract all single-letter words (monograms) from text
// Finds isolated letters with spaces before and after
function extractMonograms(text) {
  const monograms = [];
  
  // Remove apostrophes and hyphens BETWEEN letters (keep them as one word)
  // Examples: l'école → lecole, a-t-il → atil
  const cleaned = text
    .toLowerCase()
    .replace(/([a-z])['\-]([a-z])/g, '$1$2');
  
  // Split by spaces and punctuation
  const tokens = cleaned.split(/[\s.,;!?¿¡\"()\[\]{}]+/);
  
  tokens.forEach(token => {
    // Check if token is exactly one letter (a-z only)
    if (/^[a-z]$/.test(token)) {
      monograms.push(token);
    }
  });
  
  return monograms;
}

// Extract all words (3+ letters, excluding apostrophes and hyphens)
function extractWords(text) {
  // Remove accents
  const normalized = text
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '');
  
  // Extract all letter sequences
  const allWords = normalized.match(/[a-z]+/g) || [];
  
  // Keep only words with 3+ letters
  return allWords.filter(word => word.length >= 3);
}

// Extract all digrams with gap calculation
function extractDigrams(text) {
  const letters = text.toLowerCase().match(/[a-z]/g);

  if (!letters || letters.length < 2) {
    return [];
  }

  const digrams = [];

  for (let i = 0; i < letters.length - 1; i++) {
    const letter1 = letters[i];
    const letter2 = letters[i + 1];
    const digram = letter1 + letter2;

    // Calculate gap (distance between letters in alphabet)
    const code1 = letter1.charCodeAt(0) - 97;
    const code2 = letter2.charCodeAt(0) - 97;
    const gap = (code2 - code1 + 26) % 26;

    digrams.push({ digram, gap });
  }

  return digrams;
}

// Extract all trigrams with gap calculations
function extractTrigrams(text) {
  const letters = text.toLowerCase().match(/[a-z]/g);

  if (!letters || letters.length < 3) {
    return [];
  }

  const trigrams = [];

  for (let i = 0; i < letters.length - 2; i++) {
    const letter1 = letters[i];
    const letter2 = letters[i + 1];
    const letter3 = letters[i + 2];
    const trigram = letter1 + letter2 + letter3;

    // Calculate gaps
    const code1 = letter1.charCodeAt(0) - 97;
    const code2 = letter2.charCodeAt(0) - 97;
    const code3 = letter3.charCodeAt(0) - 97;
    const gap1 = (code2 - code1 + 26) % 26;
    const gap2 = (code3 - code2 + 26) % 26;

    trigrams.push({ trigram, gap1, gap2 });
  }

  return trigrams;
}

// Extract all letters excluding monograms
function extractLettersExcludingMonograms(text) {
  // Get all words
  const words = extractWords(text);

  // Get letters only from words that are NOT monograms (length > 1)
  const lettersFromNonMonograms = [];

  words.forEach(word => {
    if (word.length > 1) {
      // This word is not a monogram, add all its letters
      for (let i = 0; i < word.length; i++) {
        lettersFromNonMonograms.push(word[i]);
      }
    }
  });

  return lettersFromNonMonograms;
}

// Extract first letters of all words
function extractFirstLetters(text) {
  const words = extractWords(text);
  return words.map(word => word[0]).filter(letter => letter);
}

// Extract last letters of all words
function extractLastLetters(text) {
  const words = extractWords(text);
  return words.map(word => word[word.length - 1]).filter(letter => letter);
}

module.exports = {
  extractMonograms,
  extractDigrams,
  extractTrigrams,
  extractWords,
  extractLettersExcludingMonograms,
  extractFirstLetters,
  extractLastLetters,
};