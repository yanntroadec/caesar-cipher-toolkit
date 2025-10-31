// Tests for autoDecode.js

const { autoDecode } = require('../src/autoDecode');
const { encode } = require('../src/manualTransform');

// Test texts - John Donne poem in different languages
const TEST_TEXTS = {
  english: 'No man is an island, Entire of itself, Every man is a piece of the continent, A part of the main.',
  french: 'Nul homme est une ile, Entier de lui meme, Chaque homme est un morceau du continent, Une partie du principal.',
  spanish: 'Ningun hombre es una isla, Entero de si mismo, Cada hombre es una pieza del continente, Una parte del principal.',
  german: 'Kein Mann ist eine Insel, Ganz von sich selbst, Jeder Mann ist ein Stueck des Kontinents, Ein Teil des Hauptteils.'
};

describe('autoDecode', () => {
  
  test('should decode English text with correct shift', () => {
    const original = TEST_TEXTS.english;
    const shift = 3;
    const encoded = encode(original, shift);
    
    const result = autoDecode(encoded, 'english');
    
    expect(result.success).toBe(true);
    expect(result.shift).toBe(shift);
  });

  test('should decode English text with shift 7', () => {
    const original = TEST_TEXTS.english;
    const shift = 7;
    const encoded = encode(original, shift);
    
    const result = autoDecode(encoded, 'english');
    
    expect(result.success).toBe(true);
    expect(result.shift).toBe(shift);
  });

  test('should decode English text with shift 13 (ROT13)', () => {
    const original = TEST_TEXTS.english;
    const shift = 13;
    const encoded = encode(original, shift);
    
    const result = autoDecode(encoded, 'english');
    
    expect(result.success).toBe(true);
    expect(result.shift).toBe(shift);
  });

  test('should return language information', () => {
    const encoded = encode(TEST_TEXTS.english, 3);
    const result = autoDecode(encoded, 'english');
    
    expect(result.language).toBe('English');
  });

  test('should return confidence score', () => {
    const encoded = encode(TEST_TEXTS.english, 3);
    const result = autoDecode(encoded, 'english');
    
    expect(result.confidence).toBeDefined();
    expect(typeof result.confidence).toBe('number');
  });

  test('should return all shifts ranked by score', () => {
    const encoded = encode(TEST_TEXTS.english, 3);
    const result = autoDecode(encoded, 'english');
    
    expect(result.allShifts).toBeDefined();
    expect(Array.isArray(result.allShifts)).toBe(true);
    expect(result.allShifts.length).toBeGreaterThan(0);
  });

  test('should decode French text with correct shift', () => {
    const original = TEST_TEXTS.french;
    const shift = 5;
    const encoded = encode(original, shift);
    
    const result = autoDecode(encoded, 'french');
    
    expect(result.success).toBe(true);
    expect(result.shift).toBe(shift);
    expect(result.language).toBe('French');
  });

  test('should decode French text with shift 7', () => {
    const original = TEST_TEXTS.french;
    const shift = 7;
    const encoded = encode(original, shift);
    
    const result = autoDecode(encoded, 'french');
    
    expect(result.success).toBe(true);
    expect(result.shift).toBe(shift);
  });

  test('should decode Spanish text with correct shift', () => {
    const original = TEST_TEXTS.spanish;
    const shift = 4;
    const encoded = encode(original, shift);
    
    const result = autoDecode(encoded, 'spanish');
    
    expect(result.success).toBe(true);
    expect(result.shift).toBe(shift);
    expect(result.language).toBe('Spanish');
  });

  test('should decode Spanish text with shift 9', () => {
    const original = TEST_TEXTS.spanish;
    const shift = 9;
    const encoded = encode(original, shift);
    
    const result = autoDecode(encoded, 'spanish');
    
    expect(result.success).toBe(true);
    expect(result.shift).toBe(shift);
  });

  test('should decode German text with correct shift', () => {
    const original = TEST_TEXTS.german;
    const shift = 6;
    const encoded = encode(original, shift);
    
    const result = autoDecode(encoded, 'german');
    
    expect(result.success).toBe(true);
    expect(result.shift).toBe(shift);
    expect(result.language).toBe('German');
  });

  test('should decode German text with shift 11', () => {
    const original = TEST_TEXTS.german;
    const shift = 11;
    const encoded = encode(original, shift);
    
    const result = autoDecode(encoded, 'german');
    
    expect(result.success).toBe(true);
    expect(result.shift).toBe(shift);
  });

  test('should default to English when no language specified', () => {
    const encoded = encode(TEST_TEXTS.english, 3);
    const result = autoDecode(encoded);
    
    expect(result.language).toBe('English');
  });

  test('should throw error for unsupported language', () => {
    const encoded = encode(TEST_TEXTS.english, 3);
    
    expect(() => autoDecode(encoded, 'italian')).toThrow('not supported');
  });

  test('should include original text in result', () => {
    const encoded = encode(TEST_TEXTS.english, 3);
    const result = autoDecode(encoded, 'english');
    
    expect(result.original).toBe(encoded);
  });

  test('should include possible shifts count', () => {
    const encoded = encode(TEST_TEXTS.english, 3);
    const result = autoDecode(encoded, 'english');
    
    expect(result.possibleShiftsCount).toBeDefined();
    expect(typeof result.possibleShiftsCount).toBe('number');
  });

  test('should rank shifts by score descending', () => {
    const encoded = encode(TEST_TEXTS.english, 3);
    const result = autoDecode(encoded, 'english');
    
    // Check that scores are in descending order
    for (let i = 0; i < result.allShifts.length - 1; i++) {
      expect(result.allShifts[i].score).toBeGreaterThanOrEqual(result.allShifts[i + 1].score);
    }
  });

  test('should decode with different shifts for same text', () => {
    const original = TEST_TEXTS.english;
    const shifts = [3, 7, 13, 17, 21];
    
    shifts.forEach(shift => {
      const encoded = encode(original, shift);
      const result = autoDecode(encoded, 'english');
      expect(result.shift).toBe(shift);
    });
  });

  test('should handle text with punctuation', () => {
    const original = TEST_TEXTS.english; // Already has punctuation
    const shift = 5;
    const encoded = encode(original, shift);
    
    const result = autoDecode(encoded, 'english');
    
    expect(result.success).toBe(true);
    expect(result.shift).toBe(shift);
  });
});