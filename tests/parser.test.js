// Tests for parser.js

const {
  extractMonograms,
  extractWords,
  extractDigrams,
  extractTrigrams,
  extractLettersExcludingMonograms,
  extractFirstLetters,
  extractLastLetters
} = require('../src/parser');

describe('extractMonograms', () => {
  
  test('should extract single letter words', () => {
    const text = 'I am a student';
    const monograms = extractMonograms(text);
    expect(monograms).toEqual(['i', 'a']);
  });

  test('should handle text with no monograms', () => {
    const text = 'Hello World';
    const monograms = extractMonograms(text);
    expect(monograms).toEqual([]);
  });

  test('should handle empty text', () => {
    const monograms = extractMonograms('');
    expect(monograms).toEqual([]);
  });

  test('should convert to lowercase', () => {
    const text = 'I A';
    const monograms = extractMonograms(text);
    expect(monograms).toEqual(['i', 'a']);
  });
});

describe('extractWords', () => {
  
  test('should extract words with 3+ letters', () => {
    const text = 'I am very happy today';
    const words = extractWords(text);
    expect(words).toEqual(['very', 'happy', 'today']);
  });

  test('should convert to lowercase', () => {
    const text = 'Every man is a piece';
    const words = extractWords(text);
    expect(words).toEqual(['every', 'man', 'piece']);
  });

  test('should remove accents', () => {
    const text = 'café école';
    const words = extractWords(text);
    expect(words).toEqual(['cafe', 'ecole']);
  });

  test('should handle empty text', () => {
    const words = extractWords('');
    expect(words).toEqual([]);
  });

  test('should exclude 1-2 letter words', () => {
    const text = 'I am ok yes';
    const words = extractWords(text);
    expect(words).toEqual(['yes']);
  });
});

describe('extractDigrams', () => {
  
  test('should extract digrams', () => {
    const text = 'abc';
    const digrams = extractDigrams(text);
    expect(digrams).toHaveLength(2);
    expect(digrams[0].digram).toBe('ab');
    expect(digrams[1].digram).toBe('bc');
  });

  test('should calculate gaps correctly', () => {
    const text = 'abc';
    const digrams = extractDigrams(text);
    expect(digrams[0].gap).toBe(1); // b - a = 1
    expect(digrams[1].gap).toBe(1); // c - b = 1
  });

  test('should handle wrapping gap', () => {
    const text = 'za';
    const digrams = extractDigrams(text);
    expect(digrams[0].gap).toBe(1); // (a - z + 26) % 26 = 1
  });

  test('should return empty for short text', () => {
    const digrams = extractDigrams('a');
    expect(digrams).toEqual([]);
  });

  test('should ignore non-letters', () => {
    const text = 'a b c';
    const digrams = extractDigrams(text);
    expect(digrams).toHaveLength(2);
    expect(digrams[0].digram).toBe('ab');
  });
});

describe('extractTrigrams', () => {
  
  test('should extract trigrams', () => {
    const text = 'abcd';
    const trigrams = extractTrigrams(text);
    expect(trigrams).toHaveLength(2);
    expect(trigrams[0].trigram).toBe('abc');
    expect(trigrams[1].trigram).toBe('bcd');
  });

  test('should calculate gaps correctly', () => {
    const text = 'abc';
    const trigrams = extractTrigrams(text);
    expect(trigrams[0].gap1).toBe(1); // b - a = 1
    expect(trigrams[0].gap2).toBe(1); // c - b = 1
  });

  test('should return empty for short text', () => {
    const trigrams = extractTrigrams('ab');
    expect(trigrams).toEqual([]);
  });

  test('should ignore non-letters', () => {
    const text = 'a b c d';
    const trigrams = extractTrigrams(text);
    expect(trigrams).toHaveLength(2);
  });
});

describe('extractLettersExcludingMonograms', () => {
  
  test('should extract letters from words with 2+ letters', () => {
    const text = 'I am happy';
    const letters = extractLettersExcludingMonograms(text);
    // Only "happy" (5 letters) - "I" and "am" excluded
    expect(letters).toEqual(['h', 'a', 'p', 'p', 'y']);
  });

  test('should exclude single letter words', () => {
    const text = 'I a hello';
    const letters = extractLettersExcludingMonograms(text);
    expect(letters).toEqual(['h', 'e', 'l', 'l', 'o']);
  });

  test('should handle text with no valid words', () => {
    const text = 'I a';
    const letters = extractLettersExcludingMonograms(text);
    expect(letters).toEqual([]);
  });
});

describe('extractFirstLetters', () => {
  
  test('should extract first letters of words', () => {
    const text = 'Every man is a piece';
    const firstLetters = extractFirstLetters(text);
    expect(firstLetters).toEqual(['e', 'm', 'p']);
  });

  test('should only include words with 3+ letters', () => {
    const text = 'I am very happy';
    const firstLetters = extractFirstLetters(text);
    expect(firstLetters).toEqual(['v', 'h']);
  });

  test('should convert to lowercase', () => {
    const text = 'Hello';
    const firstLetters = extractFirstLetters(text);
    expect(firstLetters).toEqual(['h']);
  });

  test('should handle empty text', () => {
    const firstLetters = extractFirstLetters('');
    expect(firstLetters).toEqual([]);
  });
});

describe('extractLastLetters', () => {
  
  test('should extract last letters of words', () => {
    const text = 'Every man is a piece';
    const lastLetters = extractLastLetters(text);
    expect(lastLetters).toEqual(['y', 'n', 'e']);
  });

  test('should only include words with 3+ letters', () => {
    const text = 'I am very happy';
    const lastLetters = extractLastLetters(text);
    expect(lastLetters).toEqual(['y', 'y']);
  });

  test('should convert to lowercase', () => {
    const text = 'Hello';
    const lastLetters = extractLastLetters(text);
    expect(lastLetters).toEqual(['o']);
  });

  test('should handle empty text', () => {
    const lastLetters = extractLastLetters('');
    expect(lastLetters).toEqual([]);
  });
});