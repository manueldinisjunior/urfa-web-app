import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './app/**/*.{js,ts,jsx,tsx}',
    './components/**/*.{js,ts,jsx,tsx}',
    './styles/**/*.{css}',
  ],
  theme: {
    extend: {
      colors: {
        primary: '#FF5733', // Example primary color
        secondary: '#C70039', // Example secondary color
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'], // Example font family
      },
    },
  },
  plugins: [],
};

export default config;