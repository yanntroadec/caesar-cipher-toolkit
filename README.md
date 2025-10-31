# Caesar Cipher Toolkit

Command-line tool for encoding and decoding Caesar cipher with frequency analysis and automatic shift detection. Supports multiple languages with statistical analysis.

## Table of Contents

- [What is Caesar Cipher?](#what-is-caesar-cipher)
- [Features](#features)
- [Installation](#installation)
- [Commands](#commands)
- [Statistical Analysis](#statistical-analysis)
- [Project Structure](#project-structure)
- [Testing](#testing)

---

## What is Caesar Cipher?

The Caesar cipher is one of the oldest and simplest encryption techniques. Named after Julius Caesar, who used it to protect military messages, it works by shifting each letter in the plaintext by a fixed number of positions in the alphabet.

**Example:**
- Original text: `HELLO`
- Shift: `3`
- Encrypted text: `KHOOR`

Each letter is shifted 3 positions forward: H→K, E→H, L→O, O→R.

### How It Works

1. **Encoding:** Each letter is replaced by the letter that is N positions ahead in the alphabet
2. **Decoding:** Each letter is shifted back by N positions to reveal the original text
3. **Wrapping:** When reaching the end of the alphabet, it wraps around (Z+1 = A)

---

## Features

**Multiple Commands:**
- Encode text with any shift (1-25)
- Decode text with known shift
- Automatic decoding without knowing the shift
- ROT13 encoding/decoding
- Brute force all 26 possible shifts

**Multi-Language Support:**
- English
- French
- Spanish
- German

**Advanced Statistical Analysis:**
- Frequency analysis of letters, digrams, and trigrams
- First and last letter analysis
- Monogram detection
- Weighted scoring system

---

## Installation

```bash
# Clone the repository
git clone https://github.com/yanntroadec/caesar-cipher-toolkit
cd caesar-cipher-toolkit

# Install dependencies
npm install
```

---

## Commands

### 1. Encode

Encrypt text using Caesar cipher with a specified shift.

```bash
node index.js encode "<text>" <shift>
```

**Example:**
```bash
node index.js encode "Hello World" 3
# Output: Khoor Zruog
```

**Parameters:**
- `<text>`: Text to encode (required)
- `<shift>`: Shift value between 1 and 25 (required)

---

### 2. Decode

Decrypt text when you know the shift value.

```bash
node index.js decode "<text>" <shift>
```

**Example:**
```bash
node index.js decode "Khoor Zruog" 3
# Output: Hello World
```

**Parameters:**
- `<text>`: Encrypted text (required)
- `<shift>`: The shift value used for encoding (required)

---

### 3. Auto (Automatic Decoding) | RECOMMENDED !

Automatically decrypt text without knowing the shift, using statistical analysis.

```bash
node index.js auto "<text>" [-l <language>]
```

**Example:**
```bash
node index.js auto "Jdcx mnlxmn ljnbja lryqna"
# Automatically detects shift: 9
# Output: Auto decode caesar cipher
```

**With Language Option:**
```bash
node index.js auto "<text>" -l english
node index.js auto "<text>" -l french
node index.js auto "<text>" -l spanish
node index.js auto "<text>" -l german
```

**Parameters:**
- `<text>`: Encrypted text (required)
- `-l, --language`: Language for analysis (default: english)

**Output includes:**
- Decoded text
- Detected shift value
- Confidence score
- All possible shifts ranked by probability
- Statistics about the analysis

---

### 4. ROT13

Apply ROT13 encoding (special case with shift of 13). ROT13 is self-inverse: applying it twice returns the original text.

```bash
node index.js rot13 "<text>"
```

**Example:**
```bash
node index.js rot13 "Hello World"
# Output: Uryyb Jbeyq

node index.js rot13 "Uryyb Jbeyq"
# Output: Hello World
```

---

### 5. Brute Force

Try all 26 possible shifts and display the results.

```bash
node index.js brute "<text>"
```

**Example:**
```bash
node index.js brute "Khoor"
# Shows all 26 possible decodings
```

This is useful when you want to manually identify the correct decoding.

---

### 6. Languages

List all supported languages.

```bash
node index.js languages
```

**Output:**
- english
- french
- spanish
- german

---

## Statistical Analysis

The automatic decoding feature uses frequency analysis to determine the most likely shift without prior knowledge.

### How It Works

#### 1. **Letter Frequency Analysis**

Each language has characteristic letter frequencies. For example, in English:
- Most common letters: E, T, A, O, I, N, S, H, R
- Least common letters: Q, Z, X, J, K

The analyzer compares the frequency distribution of letters in the encrypted text with known frequencies for each language.

#### 2. **Positional Analysis**

- **First Letters:** Analyzes which letters commonly start words
- **Last Letters:** Analyzes which letters commonly end words

In English, words often start with T, A, O, W and end with E, S, T, D.

#### 3. **Pattern Analysis**

- **Monograms:** Single-letter words (like "I" and "a" in English)
- **Digrams:** Two-letter sequences (like "th", "er", "on")
- **Trigrams:** Three-letter sequences (like "the", "and", "ing")

These patterns are language-specific and help identify the correct shift.

#### 4. **Weighted Scoring System**

Each category contributes to the final score with different weights:

```javascript
{
  singleLetters: 0.25,   // 25% - Letter frequency
  firstLetters: 0.15,    // 15% - Word-initial letters
  lastLetters: 0.15,     // 15% - Word-final letters
  monograms: 0.20,       // 20% - Single-letter words
  digrams: 0.15,         // 15% - Two-letter patterns
  trigrams: 0.10         // 10% - Three-letter patterns
}
```

All shifts are ranked by their combined score, and the highest-scoring shift is selected as the most probable decoding.

### Why It Works

Statistical analysis is effective because:

1. **Language has patterns:** Natural language text has predictable patterns that remain visible even when encrypted
2. **Frequency is preserved:** Caesar cipher shifts letters but doesn't change their frequency distribution
3. **Multiple indicators:** Combining several analysis methods increases accuracy
4. **Large texts are better:** Longer texts provide more statistical data, improving detection accuracy

---

## Project Structure

```
caesar-cipher-toolkit/
├── index.js                    # CLI entry point - command routing
├── package.json               # Dependencies and npm scripts
├── jest.config.js             # Jest testing configuration
│
├── src/                       # Source code
│   ├── shiftChar.js           # Core character shifting logic
│   ├── manualTransform.js     # Encode/decode functions
│   ├── parser.js              # Text parsing and extraction utilities
│   ├── languageStats.js       # Language frequency data (EN/FR/ES/DE)
│   ├── monogramAnalyzer.js    # Monogram-based shift detection
│   ├── findStats.js           # Statistical analysis engine
│   └── autoDecode.js          # Automatic decoding with weighted scoring
│
└── tests/                     # Test suite (143 tests)
    ├── shiftChar.test.js
    ├── manualTransform.test.js
    ├── parser.test.js
    ├── monogramAnalyzer.test.js
    ├── autoDecode.test.js
    └── integration.test.js
```

### Module Overview

#### **shiftChar.js**
Handles character-level operations:
- Shifts individual characters
- Handles uppercase/lowercase
- Converts accented characters
- Preserves non-letter characters

#### **manualTransform.js**
encoding/decoding interface:
- `encode(text, shift)` - Encrypt with shift
- `decode(text, shift)` - Decrypt with shift
- `rot13(text)` - Apply ROT13
- `bruteForce(text)` - Try all shifts

#### **parser.js**
Extracts linguistic elements from text:
- Single-letter words (monograms)
- Multi-letter words
- Letter sequences (digrams, trigrams)
- First and last letters of words

#### **languageStats.js**
Contains frequency data for 4 languages:
- Letter frequencies
- Common digrams and trigrams
- Word-initial and word-final letters
- Single-letter words (monograms)

#### **monogramAnalyzer.js**
Detects possible shifts based on single-letter words:
- Identifies monograms in encrypted text
- Matches with language-specific monograms
- Eliminates impossible shifts

#### **findStats.js**
Statistical analysis across all categories:
- Analyzes letter frequencies
- Analyzes positional patterns
- Analyzes n-gram patterns
- Scores each possible shift

#### **autoDecode.js**
Orchestrates automatic decoding:
- Combines scores from all analyses
- Applies weighted scoring
- Returns ranked shift probabilities
- Decodes with best shift

---

## Testing

The project includes a comprehensive test suite with 113 tests covering all functionality.

### Run Tests

```bash
# Run all tests
npm test

# Run tests in watch mode
npm run test:watch

# Generate coverage report
npm run test:coverage

# Verbose output
npm run test:verbose
```

### Test Coverage

- **Unit tests:** Each module tested independently
- **Integration tests:** End-to-end workflows
- **Edge cases:** Empty strings, special characters, etc.
- **Multi-language:** All 4 languages tested

---

## Limitations

1. **Only works with alphabetic characters:** Numbers and special characters are preserved but not encrypted
2. **Language-dependent:** Automatic decoding requires selecting the correct language
3. **Statistical accuracy:** Very short texts (< 20 characters) may not have enough data for reliable automatic decoding
4. **No key security:** Caesar cipher is not cryptographically secure;

---

## Author

**Yann Troadec**

- Portfolio: [yanntroadec.com](https://yanntroadec.com)
- LinkedIn: [linkedin.com/in/yanntroadec](https://www.linkedin.com/in/yann-troadec/)
- Email: yann.troadec.5@gmail.com
- GitHub: [@yanntroadec](https://github.com/yanntroadec/)

---

## Quick Reference

| Command | Purpose | Example |
|---------|---------|---------|
| `encode` | Encrypt text | `node index.js encode "text" 5` |
| `decode` | Decrypt text | `node index.js decode "yjcy" 5` |
| `auto` | Auto-detect shift | `node index.js auto "yjcy"` |
| `rot13` | ROT13 encode/decode | `node index.js rot13 "text"` |
| `brute` | Show all shifts | `node index.js brute "yjcy"` |
| `languages` | List languages | `node index.js languages` |

---

**Last Updated:** 31 October 2025 