// Theme constants that match your Tailwind config
// This ensures consistency between Tailwind classes and JavaScript styling
export const colors = {
  charcoal: {
    light: '#4A5063',
    DEFAULT: '#404654',
    dark: '#373C48',
  },
  lavender: {
    100: '#DEDBEB',
    200: '#A59CC9',
    300: '#897EB2',
    400: '#706394',
    500: '#4E406D',
    600: '#3E3359',
  },
  // Standard colors used in your components
  gray: {
    300: '#d1d5db',
    400: '#9ca3af',
    600: '#4b5563',
    700: '#374151',
  },
  white: '#ffffff',
  green: {
    100: '#dcfce7',
    300: '#86efac',
    700: '#15803d',
  },
  red: {
    100: '#fee2e2',
    300: '#fca5a5',
    700: '#b91c1c',
  },
} as const;

// Type for accessing colors
export type ColorKey = keyof typeof colors;
export type ColorShade = keyof typeof colors.lavender;