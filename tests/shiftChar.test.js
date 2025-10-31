// Tests for shiftChar.js

const { shiftChar } = require('../src/shiftChar');

describe('shiftChar', () => {
  
  // Basic shifting tests
  test('should shift lowercase letter by 1', () => {
    expect(shiftChar('a', 1)).toBe('b');
  });

  test('should shift lowercase letter by 3', () => {
    expect(shiftChar('a', 3)).toBe('d');
  });

  test('should wrap around at end of alphabet', () => {
    expect(shiftChar('z', 1)).toBe('a');
    expect(shiftChar('z', 3)).toBe('c');
  });

  test('should shift uppercase letters', () => {
    expect(shiftChar('A', 1)).toBe('B');
    expect(shiftChar('A', 3)).toBe('D');
  });

  test('should wrap around uppercase letters', () => {
    expect(shiftChar('Z', 1)).toBe('A');
    expect(shiftChar('Z', 3)).toBe('C');
  });

  // Negative shifts
  test('should handle negative shifts', () => {
    expect(shiftChar('d', -3)).toBe('a');
    expect(shiftChar('a', -1)).toBe('z');
  });

  // Large shifts
  test('should handle shifts larger than 26', () => {
    expect(shiftChar('a', 27)).toBe('b'); // 27 % 26 = 1
    expect(shiftChar('a', 52)).toBe('a'); // 52 % 26 = 0
  });

  // Non-letter characters
  test('should not shift non-letter characters', () => {
    expect(shiftChar(' ', 3)).toBe(' ');
    expect(shiftChar('!', 3)).toBe('!');
    expect(shiftChar('1', 3)).toBe('1');
    expect(shiftChar('.', 3)).toBe('.');
  });

  // Accented characters
  test('should convert accented characters to base letter and shift', () => {
    expect(shiftChar('é', 1)).toBe('f');
    expect(shiftChar('à', 1)).toBe('b');
    expect(shiftChar('ñ', 1)).toBe('o');
  });

  // Case preservation
  test('should preserve original case', () => {
    expect(shiftChar('A', 3)).toBe('D');
    expect(shiftChar('a', 3)).toBe('d');
  });

  // Zero shift
  test('should return same character with zero shift', () => {
    expect(shiftChar('a', 0)).toBe('a');
    expect(shiftChar('Z', 0)).toBe('Z');
  });
});