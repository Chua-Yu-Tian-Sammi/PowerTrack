// Resolves static exercise images bundled with the app.
// Place images under /src/assets/exercises/<exerciseId>.jpg|png|webp

const SUPPORTED_EXTENSIONS = ['webp', 'png', 'jpg', 'jpeg'];

// Inline minimal SVG fallback (blank unavailable picture)
export const UNAVAILABLE_DATA_URI =
  'data:image/svg+xml;utf8,' +
  encodeURIComponent(
    `<svg xmlns="http://www.w3.org/2000/svg" width="400" height="300" viewBox="0 0 400 300">
      <rect width="400" height="300" fill="#f2f2f2"/>
      <g fill="none" stroke="#cccccc" stroke-width="4">
        <rect x="60" y="40" width="280" height="200" rx="8"/>
        <circle cx="150" cy="110" r="28"/>
        <path d="M80 220 L160 160 L220 200 L280 150 L340 200"/>
      </g>
      <text x="200" y="270" font-family="Arial, sans-serif" font-size="16" fill="#999999" text-anchor="middle">Image Unavailable</text>
    </svg>`
  );

export function resolveExerciseImage(exerciseId) {
  if (!exerciseId) return UNAVAILABLE_DATA_URI;
  for (const ext of SUPPORTED_EXTENSIONS) {
    try {
      // Vite will transform this import into a URL at build time
      // eslint-disable-next-line import/no-dynamic-require
      const url = new URL(`../assets/exercises/${exerciseId}.${ext}`, import.meta.url).href;
      return url;
    } catch (_) {
      // continue trying next extension
    }
  }
  // Fall back to inline SVG placeholder
  return UNAVAILABLE_DATA_URI;
}

export default { resolveExerciseImage, UNAVAILABLE_DATA_URI };


