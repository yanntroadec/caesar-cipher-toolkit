// Caesar Cipher Core Functions
// Handles basic encryption and decryption with shift/rotation

// Map of accented characters to their base equivalents
const ACCENT_MAP = {
  // Lowercase
  'à': 'a', 'á': 'a', 'â': 'a', 'ã': 'a', 'ä': 'a', 'å': 'a',
  'è': 'e', 'é': 'e', 'ê': 'e', 'ë': 'e',
  'ì': 'i', 'í': 'i', 'î': 'i', 'ï': 'i',
  'ò': 'o', 'ó': 'o', 'ô': 'o', 'õ': 'o', 'ö': 'o',
  'ù': 'u', 'ú': 'u', 'û': 'u', 'ü': 'u',
  'ý': 'y', 'ÿ': 'y',
  'ñ': 'n', 'ç': 'c',
  // Uppercase
  'À': 'A', 'Á': 'A', 'Â': 'A', 'Ã': 'A', 'Ä': 'A', 'Å': 'A',
  'È': 'E', 'É': 'E', 'Ê': 'E', 'Ë': 'E',
  'Ì': 'I', 'Í': 'I', 'Î': 'I', 'Ï': 'I',
  'Ò': 'O', 'Ó': 'O', 'Ô': 'O', 'Õ': 'O', 'Ö': 'O',
  'Ù': 'U', 'Ú': 'U', 'Û': 'U', 'Ü': 'U',
  'Ý': 'Y', 'Ÿ': 'Y',
  'Ñ': 'N', 'Ç': 'C'
};

// Shift a single character by the given amount
function shiftChar(char, shift) {
  // Handle accented characters - convert to base letter first
  const baseChar = ACCENT_MAP[char] || char;
  
  // Only shift letters, leave other characters unchanged
  if (!/[a-zA-Z]/.test(baseChar)) {
    return char;
  }

  // Determine if uppercase or lowercase
  const isUpperCase = baseChar === baseChar.toUpperCase();

  // Get position in alphabet (0-25)
  const charCode = baseChar.toLowerCase().charCodeAt(0) - 97;

  // Apply shift with wrapping (modulo 26)
  const shiftedCode = ((charCode + shift) % 26 + 26) % 26;

  // Convert back to character
  const shiftedChar = String.fromCharCode(shiftedCode + 97);

  // Return in original case
  return isUpperCase ? shiftedChar.toUpperCase() : shiftedChar;
}

module.exports = {
  shiftChar,
};