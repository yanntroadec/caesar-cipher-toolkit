// Tests for manualTransform.js

const { encode, encodeText, decode, rot13, bruteForce } = require('../src/manualTransform');

describe('encode', () => {
  
  test('should encode simple text', () => {
    expect(encode('abc', 3)).toBe('def');
  });

  test('should encode with wrapping', () => {
    expect(encode('xyz', 3)).toBe('abc');
  });

  test('should preserve case', () => {
    expect(encode('ABC', 3)).toBe('DEF');
    expect(encode('AbC', 3)).toBe('DeF');
  });

  test('should not encode non-letters', () => {
    expect(encode('Hello, World!', 3)).toBe('Khoor, Zruog!');
  });

  test('should handle zero shift', () => {
    expect(encode('Hello', 0)).toBe('Hello');
  });

  test('should handle negative shifts', () => {
    expect(encode('def', -3)).toBe('abc');
  });

  test('should handle large shifts', () => {
    expect(encode('abc', 29)).toBe('def'); // 29 % 26 = 3
  });

  test('should throw error for non-string input', () => {
    expect(() => encode(123, 3)).toThrow(TypeError);
  });

  test('should throw error for non-number shift', () => {
    expect(() => encode('abc', '3')).toThrow(TypeError);
  });
});

describe('encodeText', () => {
  
  test('should return detailed result', () => {
    const result = encodeText('Hello', 3);
    
    expect(result.original).toBe('Hello');
    expect(result.encoded).toBe('Khoor');
    expect(result.shift).toBe(3);
    expect(result.stats.letterCount).toBe(5);
    expect(result.stats.wordCount).toBe(1);
  });

  test('should count letters and words correctly', () => {
    const result = encodeText('Hello World!', 3);
    
    expect(result.stats.letterCount).toBe(10);
    expect(result.stats.wordCount).toBe(2);
  });

  test('should throw error for empty text', () => {
    expect(() => encodeText('', 3)).toThrow(TypeError);
  });

  test('should throw error for invalid shift range', () => {
    expect(() => encodeText('Hello', 0)).toThrow(RangeError);
    expect(() => encodeText('Hello', 26)).toThrow(RangeError);
  });

  test('should have timestamp', () => {
    const result = encodeText('Hello', 3);
    expect(result.timestamp).toBeDefined();
  });
});

describe('decode', () => {
  
  test('should decode encoded text', () => {
    const encoded = encode('Hello', 3);
    expect(decode(encoded, 3)).toBe('Hello');
  });

  test('should decode with wrapping', () => {
    expect(decode('abc', 3)).toBe('xyz');
  });

  test('should preserve case when decoding', () => {
    const encoded = encode('Hello World', 5);
    expect(decode(encoded, 5)).toBe('Hello World');
  });

  test('should be inverse of encode', () => {
    const original = 'The Quick Brown Fox';
    const shift = 7;
    const encoded = encode(original, shift);
    const decoded = decode(encoded, shift);
    expect(decoded).toBe(original);
  });
});

describe('rot13', () => {
  
  test('should apply ROT13', () => {
    const result = rot13('Hello');
    expect(result.original).toBe('Hello');
    expect(result.encoded).toBe('Uryyb');
  });

  test('should be reversible', () => {
    const text = 'Hello World';
    const first = rot13(text);
    const second = rot13(first.encoded);
    expect(second.encoded).toBe(text);
  });

  test('should preserve case and non-letters', () => {
    const result = rot13('Hello, World!');
    expect(result.encoded).toBe('Uryyb, Jbeyq!');
  });
});

describe('bruteForce', () => {
  
  test('should return 26 results', () => {
    const results = bruteForce('Hello');
    expect(results).toHaveLength(26);
  });

  test('should have shifts from 0 to 25', () => {
    const results = bruteForce('Hello');
    const shifts = results.map(r => r.shift);
    expect(shifts).toEqual([...Array(26).keys()]);
  });

  test('should include original text at shift 0', () => {
    const results = bruteForce('Hello');
    expect(results[0].text).toBe('Hello');
  });

  test('should decode correctly at known shift', () => {
    const original = 'Hello';
    const encoded = encode(original, 7);
    const results = bruteForce(encoded);
    expect(results[7].text).toBe(original);
  });
});