const fs = require('fs');
const path = require('path');

const TOKENS_DIR = __dirname;
const OUTPUT_CSS_FILE = path.join(__dirname, 'design-variables.css');
const REM_BASE = 16;
const PILL_THRESHOLD = 9999;

const TOKEN_FILES = [
  'design-tokens.token.json',
  'design-tokens.tokens.json',
  'design-tokens.tokenss.json',
  'design-tokens.radius.json',
  'additional-color-roles.json',
];

const COLOUR_GROUPS_EXCLUDED = [];

const FONT_FALLBACKS = {
  poppins: "'Poppins', system-ui, sans-serif",
  'dm sans': "'DM Sans', system-ui, sans-serif",
};

const normalizeName = (name) =>
  String(name).toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');

const clean = (n) => String(parseFloat(n.toFixed(7)));

function formatRem(value) {
  if (typeof value !== 'number') return value;
  if (value === 0) return '0';
  return `${clean(value / REM_BASE)}rem`;
}

function formatPx(value) {
  if (typeof value !== 'number') return value;
  return value === 0 ? '0' : `${clean(value)}px`;
}

function mergeTokens(files) {
  const merged = {};
  for (const file of files) {
    const filePath = path.join(TOKENS_DIR, file);
    if (!fs.existsSync(filePath)) {
      throw new Error(`Required token file not found: ${file}. Build stopped so output is never silently incomplete.`);
    }
    const data = JSON.parse(fs.readFileSync(filePath, 'utf8'));
    for (const key of Object.keys(data)) {
      if (key in merged) throw new Error(`Top-level group "${key}" exists in more than one file.`);
    }
    Object.assign(merged, data);
    console.log(`Loaded ${file}`);
  }
  return merged;
}

const isLeaf = (node) =>
  node && typeof node === 'object' && (typeof node.type === 'string' || node.fontSize);

function* walk(node, trail) {
  for (const [key, child] of Object.entries(node)) {
    if (!child || typeof child !== 'object') continue;
    if (key === 'extensions') continue;
    const next = [...trail, key];
    if (isLeaf(child)) yield { trail: next, key, token: child };
    else yield* walk(child, next);
  }
}

function generateCSSVariables() {
  const tokens = mergeTokens(TOKEN_FILES);

  const out = { primitives: [], roles: [], fontFamilies: [], typography: [], spacing: [], radius: [], effects: [] };
  const seen = new Set();
  const seenDark = new Set();
  const unhandled = [];
  const skipped = [];
  const primitiveMap = new Map();
  const roleQueue = [];
  const darkRoleQueue = [];
  const fontFamilyTokens = [];
  const typoQueue = [];

  const claim = (name) => {
    if (seen.has(name)) throw new Error(`Duplicate CSS variable: ${name}`);
    seen.add(name);
  };

  const claimDark = (name) => {
    if (seenDark.has(name)) throw new Error(`Duplicate CSS variable in [data-theme="dark"] scope: ${name}`);
    seenDark.add(name);
  };

  for (const { trail, key, token } of walk(tokens, [])) {
    const group = trail[0].toLowerCase();
    const base = normalizeName(key);
    // "color roles dark" is emitted into its own [data-theme="dark"] selector,
    // deliberately reusing the SAME variable names as "color roles" (not "-dark"
    // suffixed) so the cascade actually overrides the light value at runtime.
    const isDarkRoleGroup = group === 'color roles dark';
    const isRole = !isDarkRoleGroup && (group.includes('role') || group.includes('rule'));

    if (trail.some((t) => COLOUR_GROUPS_EXCLUDED.includes(t.toLowerCase()))) {
      skipped.push(trail.join(' > '));
      continue;
    }

    if (group.includes('font') && group.includes('family') && token.type === 'fontFamily') {
      const name = `--font-family-${base}`;
      claim(name);
      const stack = FONT_FALLBACKS[String(token.value).toLowerCase()] || `'${token.value}', sans-serif`;
      out.fontFamilies.push(`  ${name}: ${stack};`);
      fontFamilyTokens.push({ value: String(token.value).toLowerCase(), varName: name });
    } else if (group.includes('typography') && token.fontSize) {
      typoQueue.push({ base, token });
    } else if ((group.includes('effect') || group.includes('shadow')) && token.type === 'custom-shadow') {
      const { offsetX, offsetY, radius, spread, color } = token.value;
      const name = `--shadow-${base}`;
      claim(name);
      out.effects.push(`  ${name}: ${formatPx(offsetX)} ${formatPx(offsetY)} ${formatPx(radius)} ${formatPx(spread)} ${color};`);
    } else if (group.includes('radius') && token.type === 'dimension') {
      const name = `--radius-${base}`;
      claim(name);
      const v = token.value >= PILL_THRESHOLD ? `${token.value}px` : formatRem(token.value);
      out.radius.push(`  ${name}: ${v};`);
    } else if (group.includes('spacing') && token.type === 'dimension') {
      const name = `--spacing-${base}`;
      claim(name);
      out.spacing.push(`  ${name}: ${formatRem(token.value)};`);
    } else if (token.type === 'color') {
      const name = `--color-${base}`;
      if (isDarkRoleGroup) {
        claimDark(name);
        darkRoleQueue.push({ name, value: token.value });
      } else {
        claim(name);
        if (isRole) {
          roleQueue.push({ name, value: token.value });
        } else {
          out.primitives.push(`  ${name}: ${token.value};`);
          const hexKey = String(token.value).toLowerCase();
          if (primitiveMap.has(hexKey)) {
            console.warn(`Duplicate primitive hex ${token.value}: keeping ${primitiveMap.get(hexKey)}, ignoring ${name} for role lookups.`);
          } else {
            primitiveMap.set(hexKey, name);
          }
        }
      }
    } else {
      unhandled.push(trail.join(' > '));
    }
  }

  for (const { name, value } of roleQueue) {
    const p = primitiveMap.get(String(value).toLowerCase());
    out.roles.push(p
      ? `  ${name}: var(${p}); /* mapped from foundational color: ${value} */`
      : `  ${name}: ${value}; /* direct value (no primitive match) */`);
  }

  const darkRolesOut = [];
  for (const { name, value } of darkRoleQueue) {
    const p = primitiveMap.get(String(value).toLowerCase());
    darkRolesOut.push(p
      ? `  ${name}: var(${p}); /* mapped from foundational color: ${value} */`
      : `  ${name}: ${value}; /* direct value (no primitive match) */`);
  }

  for (const { base, token } of typoQueue) {
    for (const [prop, data] of Object.entries(token)) {
      if (!data || typeof data !== 'object' || data.value === undefined) continue;
      const name = `--font-${base}-${normalizeName(prop)}`;
      claim(name);
      let v = data.value;
      if (prop === 'fontFamily') {
        const matches = fontFamilyTokens.filter((f) => f.value === String(v).toLowerCase());
        if (matches.length !== 1) {
          throw new Error(`Style "${base}": fontFamily "${v}" matches ${matches.length} family tokens (need exactly 1).`);
        }
        v = `var(${matches[0].varName})`;
      } else if (data.type === 'dimension') {
        v = formatRem(v);
      }
      out.typography.push(`  ${name}: ${v};`);
    }
  }

  if (unhandled.length) {
    throw new Error(`Unhandled tokens (not emitted):\n  - ${unhandled.join('\n  - ')}`);
  }

  const section = (title, lines) => lines.length
    ? `  /* ${'-'.repeat(40)} */\n  /* ${title.padEnd(40)} */\n  /* ${'-'.repeat(40)} */\n${lines.join('\n')}\n\n`
    : '';

  let css = `/**\n * DESIGN SYSTEM CSS VARIABLES\n * Auto-generated from design tokens by convertTokens.js (v3). Do not edit by hand.\n * Dimensions in rem (1rem = ${REM_BASE}px) except shadows (px) and pill radius (px).\n */\n\n:root {\n`;
  css += section('Primitive / Reference Colors', out.primitives);
  css += section('Color Roles', out.roles);
  css += section('Font Families', out.fontFamilies);
  css += section('Typography', out.typography);
  css += section('Spacing', out.spacing);
  css += section('Border Radius', out.radius);
  css += section('Effects & Shadows', out.effects);
  css = css.trimEnd() + '\n}\n';

  if (darkRolesOut.length) {
    css += `\n/* Dark theme overrides — set data-theme="dark" on a root element (e.g. <html data-theme="dark">) to activate. */\n[data-theme="dark"] {\n`;
    css += darkRolesOut.join('\n') + '\n';
    css += '}\n';
  }

  fs.writeFileSync(OUTPUT_CSS_FILE, css, 'utf8');
  if (skipped.length) console.log(`Skipped by colour standing order: ${skipped.length} token(s)`);
  console.log(`Wrote ${OUTPUT_CSS_FILE}`);
  for (const [k, v] of Object.entries(out)) console.log(`- ${k}: ${v.length}`);
  console.log(`- darkRoles: ${darkRolesOut.length}`);
}

try {
  generateCSSVariables();
} catch (err) {
  console.error(`ERROR: ${err.message}`);
  process.exit(1);
}
