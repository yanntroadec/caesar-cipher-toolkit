#!/usr/bin/env node

// Caesar Cipher Toolkit - CLI
// Command-line interface for encoding and decoding Caesar cipher

const { program } = require('commander');
const chalk = require('chalk');
const {
  encodeText,
  decode,
  rot13,
  bruteForce,
} = require('./src/manualTransform');
const { autoDecode } = require('./src/autoDecode');

// Package info
const packageJson = require('./package.json');

// Configure program
program
  .name('caesar')
  .description(
    'Caesar cipher encoder and decoder with advanced frequency analysis'
  )
  .version(packageJson.version);

// ENCODE command
program
  .command('encode')
  .description('Encode text using Caesar cipher')
  .argument('<text>', 'Text to encode')
  .argument('<shift>', 'Shift value (1-25)', parseInt)
  .action((text, shift) => {
    try {
      const result = encodeText(text, shift);

      console.log(chalk.green.bold('\n✓ Text encoded successfully!\n'));
      console.log(chalk.cyan('Original:'), result.original);
      console.log(chalk.yellow('Encoded: '), result.encoded);
      console.log(chalk.gray('Shift:   '), result.shift);
      console.log(
        chalk.gray('Stats:   '),
        `${result.stats.letterCount} letters, ${result.stats.wordCount} words`
      );
    } catch (error) {
      console.error(chalk.red('Error:'), error.message);
      process.exit(1);
    }
  });

// DECODE command (with known shift)
program
  .command('decode')
  .description('Decode text with known shift value')
  .argument('<text>', 'Text to decode')
  .argument('<shift>', 'Shift value (0-25)', parseInt)
  .action((text, shift) => {
    try {
      const decodedText = decode(text, shift);

      console.log(chalk.green.bold('\n✓ Text decoded successfully!\n'));
      console.log(chalk.cyan('Encoded: '), text);
      console.log(chalk.yellow('Decoded: '), decodedText);
      console.log(chalk.gray('Shift:   '), shift);
    } catch (error) {
      console.error(chalk.red('Error:'), error.message);
      process.exit(1);
    }
  });

// AUTO command - Automatic decoding with statistical analysis
program
  .command('auto')
  .description(
    'Automatic decode using multi-category weighted analysis (RECOMMENDED)'
  )
  .argument('<text>', 'Encoded text to analyze')
  .option('-l, --language <lang>', 'Language for analysis', 'english')
  .action((text, options) => {
    try {
      console.log(chalk.blue.bold('\n🔬 AUTOMATIC STATISTICAL ANALYSIS\n'));
      console.log(chalk.gray('═'.repeat(70)));

      const result = autoDecode(text, options.language);

      if (!result.success) {
        console.log(chalk.red('\n❌ Decoding failed:'));
        console.log(chalk.white(`   ${result.message}`));
        console.log(chalk.gray('\n' + '═'.repeat(70) + '\n'));
        return;
      }

      const impossibleShifts = 26 - result.possibleShiftsCount;

      console.log(chalk.cyan('\n📊 Analysis Statistics:'));
      console.log(chalk.white(`   Language:              ${result.language}`));
      console.log(
        chalk.white(`   Possible shifts:       ${result.possibleShiftsCount}`)
      );
      console.log(chalk.white(`   Impossible shifts:     ${impossibleShifts}`));

      console.log(chalk.gray('\n' + '─'.repeat(70)));
      console.log(chalk.green.bold('\n✨ BEST RESULT:'));
      console.log(chalk.yellow(`   Shift:                 ${result.shift}`));
      console.log(
        chalk.yellow(
          `   Confidence:            ${result.confidence.toFixed(4)}`
        )
      );
      console.log(chalk.green(`\n   Decoded text:          ${result.decoded}`));

      console.log(chalk.gray('\n' + '─'.repeat(70)));
      console.log(chalk.cyan.bold('\n📈 ALL SHIFTS (sorted by score):\n'));

      result.allShifts.slice(0, 10).forEach((shiftData, index) => {
        const rank = (index + 1).toString().padStart(2);
        const shiftNum = shiftData.shift.toString().padStart(2);
        const score = shiftData.score.toFixed(4).padStart(10);

        const color =
          index === 0 ? chalk.green : index < 3 ? chalk.yellow : chalk.white;

        console.log(color(`   ${rank}. Shift ${shiftNum}  →  Score: ${score}`));
      });

      if (result.allShifts.length > 10) {
        console.log(
          chalk.gray(`\n   ... and ${result.allShifts.length} more shifts`)
        );
      }

      console.log(chalk.gray('\n' + '═'.repeat(70) + '\n'));
    } catch (error) {
      console.error(chalk.red('Error:'), error.message);
      process.exit(1);
    }
  });

// ROT13 command
program
  .command('rot13')
  .description('Encode/decode using ROT13')
  .argument('<text>', 'Text to process with ROT13')
  .action(text => {
    try {
      const result = rot13(text);

      console.log(chalk.green.bold('\n✓ ROT13 applied!\n'));
      console.log(chalk.cyan('Input:  '), result.original);
      console.log(chalk.yellow('Output: '), result.encoded);
    } catch (error) {
      console.error(chalk.red('Error:'), error.message);
      process.exit(1);
    }
  });

// BRUTE-FORCE command
program
  .command('brute')
  .description('Try all 26 possible shifts (brute force)')
  .argument('<text>', 'Encoded text')
  .action(text => {
    try {
      const results = bruteForce(text);

      console.log(chalk.green.bold('\n✓ All 26 possible decodings:\n'));

      results.forEach((result, index) => {
        const rank = (index + 1).toString().padStart(2);
        const shiftNum = result.shift.toString().padStart(2);

        console.log(
          chalk.cyan(` Shift ${shiftNum}: `) + chalk.white(result.text)
        );
      });
    } catch (error) {
      console.error(chalk.red('Error:'), error.message);
      process.exit(1);
    }
  });

// LANGUAGES command
program
  .command('languages')
  .description('List all supported languages')
  .action(() => {
    const languages = ['english', 'french', 'spanish', 'german'];

    console.log(chalk.green.bold('\n✓ Supported languages:\n'));
    languages.forEach(lang => {
      console.log(chalk.cyan('  •'), lang);
    });
    console.log();
  });

// Parse arguments
program.parse();
