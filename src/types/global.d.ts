/**
 * global.d.ts — Ambient module declarations for non-TypeScript file types.
 *
 * Required so TypeScript doesn't complain when importing CSS files like:
 *   import "./globals.css"
 *
 * Next.js handles the actual CSS processing — this file only tells the
 * TypeScript compiler that .css files are valid importable modules.
 */

// Plain CSS imports (globals, resets, side-effect imports)
declare module "*.css" {
  const stylesheet: Record<string, string>;
  export default stylesheet;
}
