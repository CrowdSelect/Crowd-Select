import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        'blue': {
          500: '#4285f4',
          600: '#3b78e7',
        },
        'green': {
          500: '#34a853',
          600: '#2e9648',
        },
      },
    },
  },
  plugins: [],
};
export default config;