import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        background: "var(--background)",
        foreground: "var(--foreground)",

        // Custom HSL-based color palette
        brand: {
          50: 'hsl(210, 100%, 97%)',
          100: 'hsl(210, 100%, 94%)',
          200: 'hsl(210, 100%, 88%)',
          300: 'hsl(210, 100%, 80%)',
          400: 'hsl(210, 100%, 70%)',
          500: 'hsl(210, 100%, 60%)',
          600: 'hsl(210, 100%, 50%)',
          700: 'hsl(210, 90%, 45%)',
          800: 'hsl(210, 80%, 35%)',
          900: 'hsl(210, 70%, 25%)',
        },
        success: {
          50: 'hsl(142, 76%, 95%)',
          100: 'hsl(142, 76%, 90%)',
          200: 'hsl(142, 71%, 80%)',
          300: 'hsl(142, 69%, 65%)',
          400: 'hsl(142, 69%, 50%)',
          500: 'hsl(142, 76%, 40%)',
          600: 'hsl(142, 77%, 32%)',
          700: 'hsl(142, 72%, 25%)',
          800: 'hsl(142, 64%, 20%)',
          900: 'hsl(142, 56%, 15%)',
        },
        danger: {
          50: 'hsl(0, 86%, 97%)',
          100: 'hsl(0, 93%, 94%)',
          200: 'hsl(0, 96%, 89%)',
          300: 'hsl(0, 94%, 82%)',
          400: 'hsl(0, 91%, 71%)',
          500: 'hsl(0, 84%, 60%)',
          600: 'hsl(0, 72%, 51%)',
          700: 'hsl(0, 74%, 42%)',
          800: 'hsl(0, 70%, 35%)',
          900: 'hsl(0, 63%, 31%)',
        },
        warning: {
          50: 'hsl(48, 100%, 96%)',
          100: 'hsl(48, 96%, 89%)',
          200: 'hsl(48, 97%, 77%)',
          300: 'hsl(46, 97%, 65%)',
          400: 'hsl(43, 96%, 56%)',
          500: 'hsl(38, 92%, 50%)',
          600: 'hsl(32, 95%, 44%)',
          700: 'hsl(26, 90%, 37%)',
          800: 'hsl(23, 83%, 31%)',
          900: 'hsl(22, 78%, 26%)',
        },
      },
      fontFamily: {
        sans: ['var(--font-inter)', 'system-ui', 'sans-serif'],
        heading: ['var(--font-outfit)', 'system-ui', 'sans-serif'],
        mono: ['var(--font-jetbrains)', 'Consolas', 'monospace'],
      },
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'gradient-conic': 'conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))',
        'gradient-income': 'linear-gradient(135deg, hsl(142, 76%, 50%) 0%, hsl(142, 76%, 40%) 100%)',
        'gradient-expense': 'linear-gradient(135deg, hsl(0, 84%, 65%) 0%, hsl(0, 84%, 55%) 100%)',
        'gradient-balance': 'linear-gradient(135deg, hsl(210, 100%, 60%) 0%, hsl(210, 100%, 50%) 100%)',
        'gradient-glass': 'linear-gradient(135deg, rgba(255, 255, 255, 0.1) 0%, rgba(255, 255, 255, 0.05) 100%)',
      },
      boxShadow: {
        'glass': '0 8px 32px 0 rgba(31, 38, 135, 0.15)',
        'glass-dark': '0 8px 32px 0 rgba(0, 0, 0, 0.3)',
        'hover': '0 10px 40px rgba(0, 0, 0, 0.12)',
        'card': '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
      },
      animation: {
        'fade-in': 'fadeIn 0.5s ease-in-out',
        'fade-in-up': 'fadeInUp 0.5s ease-out',
        'slide-in-right': 'slideInRight 0.3s ease-out',
        'scale-in': 'scaleIn 0.3s ease-out',
        'shimmer': 'shimmer 2s infinite',
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'bounce-subtle': 'bounceSubtle 2s infinite',
        'counter': 'counter 0.6s ease-out',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        fadeInUp: {
          '0%': { opacity: '0', transform: 'translateY(20px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        slideInRight: {
          '0%': { transform: 'translateX(100%)' },
          '100%': { transform: 'translateX(0)' },
        },
        scaleIn: {
          '0%': { transform: 'scale(0.9)', opacity: '0' },
          '100%': { transform: 'scale(1)', opacity: '1' },
        },
        shimmer: {
          '0%': { backgroundPosition: '-1000px 0' },
          '100%': { backgroundPosition: '1000px 0' },
        },
        bounceSubtle: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-5px)' },
        },
        counter: {
          '0%': { transform: 'scale(1.2)', opacity: '0' },
          '100%': { transform: 'scale(1)', opacity: '1' },
        },
      },
      transitionTimingFunction: {
        'smooth': 'cubic-bezier(0.4, 0.0, 0.2, 1)',
      },
      transitionDuration: {
        '400': '400ms',
      },
    },
  },
  plugins: [],
};
export default config;
