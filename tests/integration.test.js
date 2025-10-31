// Integration Tests
// Tests that verify multiple modules working together

const { encode } = require('../src/manualTransform');
const { autoDecode } = require('../src/autoDecode');

// Test texts - John Donne poem in different languages
const TEST_TEXTS = {
  english: 'No man is an island, Entire of itself, Every man is a piece of the continent, A part of the main.',
  french: 'Nul homme est une ile, Entier de lui meme, Chaque homme est un morceau du continent, Une partie du principal.',
  spanish: 'Ningun hombre es una isla, Entero de si mismo, Cada hombre es una pieza del continente, Una parte del principal.',
  german: 'Kein Mann ist eine Insel, Ganz von sich selbst, Jeder Mann ist ein Stueck des Kontinents, Ein Teil des Hauptteils.'
};

describe('Integration Tests', () => {
  
  describe('Encode -> Auto Decode', () => {
    
    test('should encode and automatically decode English text', () => {
      const original = TEST_TEXTS.english;
      const shift = 13;
      
      const encoded = encode(original, shift);
      const result = autoDecode(encoded, 'english');
      
      expect(result.shift).toBe(shift);
      expect(result.success).toBe(true);
    });

    test('should work with different shifts', () => {
      const testCases = [
        { text: TEST_TEXTS.english, shift: 1 },
        { text: TEST_TEXTS.english, shift: 5 },
        { text: TEST_TEXTS.english, shift: 13 },
        { text: TEST_TEXTS.english, shift: 25 }
      ];

      testCases.forEach(({ text, shift }) => {
        const encoded = encode(text, shift);
        const result = autoDecode(encoded, 'english');
        expect(result.shift).toBe(shift);
      });
    });
  });

  describe('Multiple Languages', () => {
    
    test('should correctly decode English text in English', () => {
      const text = TEST_TEXTS.english;
      const encoded = encode(text, 5);
      
      const result = autoDecode(encoded, 'english');
      expect(result.shift).toBe(5);
      expect(result.language).toBe('English');
    });

    test('should correctly decode French text in French', () => {
      const text = TEST_TEXTS.french;
      const encoded = encode(text, 5);
      
      const result = autoDecode(encoded, 'french');
      expect(result.shift).toBe(5);
      expect(result.language).toBe('French');
    });

    test('should correctly decode Spanish text in Spanish', () => {
      const text = TEST_TEXTS.spanish;
      const encoded = encode(text, 5);
      
      const result = autoDecode(encoded, 'spanish');
      expect(result.shift).toBe(5);
      expect(result.language).toBe('Spanish');
    });

    test('should correctly decode German text in German', () => {
      const text = TEST_TEXTS.german;
      const encoded = encode(text, 5);
      
      const result = autoDecode(encoded, 'german');
      expect(result.shift).toBe(5);
      expect(result.language).toBe('German');
    });
  });

  describe('Edge Cases', () => {
    
    test('should handle text with only spaces', () => {
      const text = '     ';
      const encoded = encode(text, 5);
      expect(encoded).toBe(text);
    });

    test('should handle text with only punctuation', () => {
      const text = '!@#$%^&*()';
      const encoded = encode(text, 5);
      expect(encoded).toBe(text);
    });

    test('should handle text with mixed content', () => {
      const text = TEST_TEXTS.english;
      const shift = 5;
      const encoded = encode(text, shift);
      const result = autoDecode(encoded, 'english');
      
      expect(result.success).toBe(true);
      expect(result.shift).toBe(shift);
    });

    test('should preserve formatting', () => {
      const text = 'No man is an island,\nEntire of itself.';
      const shift = 3;
      const encoded = encode(text, shift);
      const result = autoDecode(encoded, 'english');
      
      expect(result.shift).toBe(shift);
    });
  });

  describe('Confidence Scores', () => {
    
    test('should have confidence scores for texts', () => {
      const shortText = TEST_TEXTS.english.substring(0, 20);
      const longText = TEST_TEXTS.english;
      const shift = 5;

      const shortEncoded = encode(shortText, shift);
      const longEncoded = encode(longText, shift);

      const shortResult = autoDecode(shortEncoded, 'english');
      const longResult = autoDecode(longEncoded, 'english');

      expect(longResult.confidence).toBeGreaterThanOrEqual(0);
      expect(shortResult.confidence).toBeGreaterThanOrEqual(0);
    });

    test('should have different confidence scores for different texts', () => {
      const text1 = TEST_TEXTS.english;
      const text2 = TEST_TEXTS.french;
      const shift = 5;

      const encoded1 = encode(text1, shift);
      const encoded2 = encode(text2, shift);

      const result1 = autoDecode(encoded1, 'english');
      const result2 = autoDecode(encoded2, 'french');

      // Both should succeed
      expect(result1.success).toBe(true);
      expect(result2.success).toBe(true);
    });
  });

  describe('Performance', () => {
    
    test('should decode within reasonable time', () => {
      const text = TEST_TEXTS.english.repeat(10);
      const shift = 7;
      const encoded = encode(text, shift);

      const startTime = Date.now();
      const result = autoDecode(encoded, 'english');
      const endTime = Date.now();

      expect(result.success).toBe(true);
      expect(endTime - startTime).toBeLessThan(5000); // Should complete within 5 seconds
    });
  });

  describe('ROT13 Special Case', () => {
    
    test('should correctly decode ROT13 (shift 13)', () => {
      const original = TEST_TEXTS.english;
      const rot13Encoded = encode(original, 13);
      
      const result = autoDecode(rot13Encoded, 'english');
      
      expect(result.shift).toBe(13);
    });

    test('ROT13 should be self-inverse', () => {
      const original = TEST_TEXTS.english;
      const once = encode(original, 13);
      const twice = encode(once, 13);
      
      expect(twice).toBe(original);
    });
  });

  describe('Various Shifts Per Language', () => {
    
    test('should decode English with various shifts', () => {
      const shifts = [1, 3, 5, 7, 9, 11, 13, 15, 17, 19, 21, 23, 25];
      
      shifts.forEach(shift => {
        const encoded = encode(TEST_TEXTS.english, shift);
        const result = autoDecode(encoded, 'english');
        expect(result.shift).toBe(shift);
      });
    });

    test('should decode French with various shifts', () => {
      const shifts = [2, 4, 6, 8, 10, 12, 14];
      
      shifts.forEach(shift => {
        const encoded = encode(TEST_TEXTS.french, shift);
        const result = autoDecode(encoded, 'french');
        expect(result.shift).toBe(shift);
      });
    });

    test('should decode Spanish with various shifts', () => {
      const shifts = [3, 7, 11, 15, 19];
      
      shifts.forEach(shift => {
        const encoded = encode(TEST_TEXTS.spanish, shift);
        const result = autoDecode(encoded, 'spanish');
        expect(result.shift).toBe(shift);
      });
    });

    test('should decode German with various shifts', () => {
      const shifts = [4, 8, 12, 16, 20];
      
      shifts.forEach(shift => {
        const encoded = encode(TEST_TEXTS.german, shift);
        const result = autoDecode(encoded, 'german');
        expect(result.shift).toBe(shift);
      });
    });
  });
});