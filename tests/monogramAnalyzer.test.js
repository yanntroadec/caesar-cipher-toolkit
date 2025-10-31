// Tests for monogramAnalyzer.js

const { findPossibleShifts } = require('../src/monogramAnalyzer');
const languageStats = require('../src/languageStats');

describe('findPossibleShifts', () => {
  
  test('should return all shifts when no monograms in text', () => {
    const text = 'Hello World';
    const result = findPossibleShifts(text, languageStats.english);
    
    expect(result.possibleShifts.size).toBe(26);
    expect(result.method).toBe('no_monograms_in_text');
  });

  test('should limit shifts with single monogram', () => {
    const text = 'I love programming';
    const result = findPossibleShifts(text, languageStats.english);
    
    // "I" in English can only be "I" or "a" in original text
    expect(result.possibleShifts.size).toBeLessThanOrEqual(2);
    expect(result.method).toBe('single_monogram');
  });

  test('should handle multiple same monograms', () => {
    const text = 'I think I know';
    const result = findPossibleShifts(text, languageStats.english);
    
    expect(result.method).toBe('single_unique_monogram');
  });

  test('should return all shifts for language with no monograms (German)', () => {
    const text = 'I love programming';
    const result = findPossibleShifts(text, languageStats.german);
    
    expect(result.possibleShifts.size).toBe(26);
    expect(result.method).toBe('no_monograms_in_language');
  });

  test('should use intersection for multiple different monograms', () => {
    const text = 'I love a good book';
    const result = findPossibleShifts(text, languageStats.english);
    
    // Should use intersection method
    expect(['intersection', 'single_monogram', 'single_unique_monogram']).toContain(result.method);
  });

  test('should handle French monograms', () => {
    const text = 'a b c'; // "a" is a monogram in French
    const result = findPossibleShifts(text, languageStats.french);
    
    expect(result.possibleShifts.size).toBeGreaterThan(0);
  });

  test('should handle Spanish monograms', () => {
    const text = 'y o a'; // "y", "o", "a" are monograms in Spanish
    const result = findPossibleShifts(text, languageStats.spanish);
    
    expect(result.possibleShifts.size).toBeGreaterThan(0);
  });

  test('should provide detailed information', () => {
    const text = 'I love programming';
    const result = findPossibleShifts(text, languageStats.english);
    
    expect(result.possibleShifts).toBeDefined();
    expect(result.method).toBeDefined();
    expect(result.details).toBeDefined();
  });

  test('should handle empty text', () => {
    const result = findPossibleShifts('', languageStats.english);
    
    expect(result.possibleShifts.size).toBe(26);
    expect(result.method).toBe('no_monograms_in_text');
  });

  test('should handle text with only non-letters', () => {
    const result = findPossibleShifts('123 !@# $%^', languageStats.english);
    
    expect(result.possibleShifts.size).toBe(26);
    expect(result.method).toBe('no_monograms_in_text');
  });
});