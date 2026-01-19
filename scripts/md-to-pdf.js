#!/usr/bin/env node

const { mdToPdf } = require('md-to-pdf');
const path = require('path');
const fs = require('fs');

async function convert() {
  const args = process.argv.slice(2);

  if (args.length < 1) {
    console.error('Usage: npm run md-to-pdf <input.md> [output.pdf]');
    process.exit(1);
  }

  const inputPath = path.resolve(args[0]);

  if (!fs.existsSync(inputPath)) {
    console.error(`Error: Input file not found: ${inputPath}`);
    process.exit(1);
  }

  // Default output: same name as input but in pdf folder
  let outputPath;
  if (args[1]) {
    outputPath = path.resolve(args[1]);
  } else {
    const baseName = path.basename(inputPath, '.md');
    outputPath = path.resolve('pdf', `${baseName}.pdf`);
  }

  // Ensure output directory exists
  const outputDir = path.dirname(outputPath);
  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
  }

  console.log(`Converting: ${inputPath}`);
  console.log(`Output: ${outputPath}`);

  try {
    const pdf = await mdToPdf(
      { path: inputPath },
      {
        dest: outputPath,
        pdf_options: {
          format: 'A4',
          margin: {
            top: '20mm',
            right: '20mm',
            bottom: '20mm',
            left: '20mm'
          },
          printBackground: true
        },
        stylesheet: [],
        css: `
          body {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Helvetica, Arial, sans-serif;
            font-size: 12pt;
            line-height: 1.6;
            color: #333;
          }
          h1 { font-size: 24pt; margin-top: 0; }
          h2 { font-size: 18pt; border-bottom: 1px solid #eee; padding-bottom: 0.3em; }
          h3 { font-size: 14pt; }
          code { background: #f4f4f4; padding: 2px 6px; border-radius: 3px; }
          blockquote {
            border-left: 4px solid #ddd;
            margin: 0;
            padding-left: 1em;
            color: #666;
          }
          hr { border: none; border-top: 1px solid #eee; margin: 2em 0; }
        `
      }
    );

    if (pdf) {
      console.log('PDF generated successfully!');
    }
  } catch (error) {
    console.error('Error generating PDF:', error.message);
    process.exit(1);
  }
}

convert();
