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
        mvx: {
          bg: '#0D0D0D',
          surface: '#1A1A1A',
          card: '#222222',
          hover: '#333333',
          accent: '#FF6B00',
          'accent-hover': '#E65A00',
          text: '#F5F5F5',
          muted: '#94A3B8',
          dim: '#64748B',
          border: '#333333',
          blue: '#4EA8FF',
          green: '#22C55E',
          red: '#EF4444',
        }
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
      animation: {
        'fade-in': 'fadeIn 0.3s ease-in-out',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
      },
    },
  },
  plugins: [],
};
export default config;
