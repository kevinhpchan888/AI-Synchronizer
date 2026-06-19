#!/usr/bin/env node
/**
 * Text-to-SVG Path Converter
 *
 * Converts text strings to SVG <path> elements using opentype.js,
 * removing the dependency on fonts being installed on the viewer's system.
 *
 * Usage:
 *   node text-to-svg-convert.js --font Inter-ExtraBold.ttf --size 96 --text "Brand Name" --output logo.svg
 *   node text-to-svg-convert.js --config logo-config.json --output logo.svg
 *
 * Prerequisites:
 *   npm install text-to-svg commander
 *
 * The --config option accepts a JSON file describing a full logo layout:
 * {
 *   "width": 600,
 *   "height": 300,
 *   "background": "#4A6274",
 *   "backgroundRadius": 0,
 *   "elements": [
 *     {
 *       "type": "text",
 *       "text": "Aging Parent",
 *       "font": "fonts/Inter-ExtraBold.ttf",
 *       "size": 96,
 *       "color": "#FFFFFF",
 *       "x": 50,
 *       "y": 130,
 *       "letterSpacing": -2
 *     },
 *     {
 *       "type": "circle",
 *       "cx": 285,
 *       "cy": 215,
 *       "r": 38,
 *       "color": "#C4943D"
 *     },
 *     {
 *       "type": "text",
 *       "text": "Care",
 *       "font": "fonts/Inter-ExtraBold.ttf",
 *       "size": 96,
 *       "color": "#FFFFFF",
 *       "x": 310,
 *       "y": 250,
 *       "letterSpacing": -2
 *     }
 *   ]
 * }
 */

const fs = require('fs');
const path = require('path');

let TextToSVG;
try {
  TextToSVG = require('text-to-svg');
} catch (e) {
  console.error('Missing dependency. Run: npm install text-to-svg');
  process.exit(1);
}

function parseArgs(argv) {
  const args = {};
  for (let i = 2; i < argv.length; i++) {
    if (argv[i] === '--font') args.font = argv[++i];
    else if (argv[i] === '--size') args.size = parseFloat(argv[++i]);
    else if (argv[i] === '--text') args.text = argv[++i];
    else if (argv[i] === '--color') args.color = argv[++i];
    else if (argv[i] === '--output') args.output = argv[++i];
    else if (argv[i] === '--config') args.config = argv[++i];
    else if (argv[i] === '--spacing') args.spacing = parseFloat(argv[++i]);
  }
  return args;
}

function textToPath(fontPath, text, size, options = {}) {
  const textToSVG = TextToSVG.loadSync(fontPath);
  const attributes = { fill: options.color || '#000000' };
  const svgOptions = {
    x: options.x || 0,
    y: options.y || 0,
    fontSize: size,
    anchor: 'left top',
    letterSpacing: options.letterSpacing || 0,
    attributes: attributes
  };

  const pathData = textToSVG.getD(text, svgOptions);
  const metrics = textToSVG.getMetrics(text, svgOptions);

  return {
    path: `<path d="${pathData}" fill="${attributes.fill}"/>`,
    metrics: metrics
  };
}

function buildFromConfig(configPath) {
  const config = JSON.parse(fs.readFileSync(configPath, 'utf8'));
  const parts = [];

  // SVG header
  parts.push(`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${config.width} ${config.height}" width="${config.width}" height="${config.height}">`);

  // Background
  if (config.background) {
    const rx = config.backgroundRadius || 0;
    parts.push(`  <rect width="${config.width}" height="${config.height}" rx="${rx}" fill="${config.background}"/>`);
  }

  // Elements
  for (const el of config.elements) {
    if (el.type === 'text') {
      const result = textToPath(el.font, el.text, el.size, {
        x: el.x,
        y: el.y,
        color: el.color,
        letterSpacing: el.letterSpacing || 0
      });
      parts.push(`  ${result.path}`);
    } else if (el.type === 'circle') {
      parts.push(`  <circle cx="${el.cx}" cy="${el.cy}" r="${el.r}" fill="${el.color}"/>`);
    } else if (el.type === 'rect') {
      parts.push(`  <rect x="${el.x}" y="${el.y}" width="${el.width}" height="${el.height}" rx="${el.rx || 0}" fill="${el.color}"/>`);
    }
  }

  parts.push('</svg>');
  return parts.join('\n');
}

function buildSingle(args) {
  const result = textToPath(args.font, args.text, args.size || 72, {
    color: args.color || '#000000',
    letterSpacing: args.spacing || 0
  });

  return `<svg xmlns="http://www.w3.org/2000/svg">\n  ${result.path}\n</svg>`;
}

// Main
const args = parseArgs(process.argv);

if (!args.output) {
  console.error('Usage: node text-to-svg-convert.js --config config.json --output logo.svg');
  console.error('   or: node text-to-svg-convert.js --font font.ttf --size 96 --text "Text" --output logo.svg');
  process.exit(1);
}

let svg;
if (args.config) {
  svg = buildFromConfig(args.config);
} else if (args.font && args.text) {
  svg = buildSingle(args);
} else {
  console.error('Provide either --config or both --font and --text');
  process.exit(1);
}

fs.writeFileSync(args.output, svg, 'utf8');
console.log(`Written: ${args.output}`);
