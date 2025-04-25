// Necessary for editor to recognize tailwind classes
import type { Config } from 'tailwindcss';
//@typescript-eslint/ban-ts-comment
const config: Config = {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {},
  },
  plugins: [],
};

export default config;
