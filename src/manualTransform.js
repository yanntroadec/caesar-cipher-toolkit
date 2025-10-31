// Encoder Interface
// High-level interface for encoding text with Caesar cipher

const { shiftChar } = require('./shiftChar');

// Encode text using Caesar cipher with given shift
function encode(text, shift) {
  if (typeof text !== 'string') {
    throw new TypeError('Text must be a string');
  }

  if (typeof shift !== 'number') {
    throw new TypeError('Shift must be a number');
  }

  // Normalize shift to 0-25 range (handle negative shifts)
  const normalizedShift = ((shift % 26) + 26) % 26;

  // Apply shift to each character
  return text
    .split('')
    .map(char => shiftChar(char, normalizedShift))
    .join('');
}

// Encode text with Caesar cipher and return detailed result
function encodeText(text, shift) {
  // Validate input
  if (!text || typeof text !== 'string') {
    throw new TypeError('Text must be a non-empty string');
  }

  if (typeof shift !== 'number' || shift < 1 || shift > 25) {
    throw new RangeError('Shift must be a number between 1 and 25');
  }

  // Encode the text
  const encodedText = encode(text, shift);

  // Calculate statistics
  const letterCount = (text.match(/[a-zA-Z]/g) || []).length;
  const wordCount = (text.match(/[a-zA-Z]+/g) || []).length;

  return {
    original: text,
    encoded: encodedText,
    shift: shift,
    stats: {
      letterCount,
      wordCount,
      preservedChars: text.length - letterCount,
    },
    timestamp: new Date().toISOString(),
  };
}

// Decode text using Caesar cipher with given shift
// Decoding is just encoding with negative shift
function decode(text, shift) {
  return encode(text, -shift);
}

// ROT13 - Special case of Caesar cipher with shift of 13
function rot13(text) {
  const encoded = encode(text, 13);
  
  return {
    original: text,
    encoded: encoded
  };
}

// Try all possible shifts (brute force)
function bruteForce(text) {
  const results = [];

  for (let shift = 0; shift < 26; shift++) {
    results.push({
      shift,
      text: decode(text, shift),
    });
  }

  return results;
}

module.exports = {
  encode,
  encodeText,
  decode,
  rot13,
  bruteForce
};