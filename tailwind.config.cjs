/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  darkMode: 'class',
  theme: {
    extend: {
      fontFamily: {
        sans: ['Epilogue', 'Inter', 'system-ui', 'sans-serif'],
        display: ['Exo 2', 'Plus Jakarta Sans', 'system-ui', 'sans-serif'],
      },
      colors: {
        primary: {
          50: '#e8f5ed', 100: '#c2ebda', 200: '#8fd44a', 300: '#2ea05a',
          400: '#1a6b3f', 500: '#0d3d22', 600: '#0a3019', 700: '#082510',
          800: '#051a0a', 900: '#030f05',
        },
        forest: '#0d3d22',
        palm: '#1a6b3f',
        leaf: '#2ea05a',
        lime: '#8fd44a',
        mango: '#f0a500',
        sand: '#f5f0e8',
        cream: '#faf8f4',
        // surface & text now use CSS custom properties for automatic dark mode
        surface: {
          50:  'rgb(var(--c-surface-50)  / <alpha-value>)',
          100: 'rgb(var(--c-surface-100) / <alpha-value>)',
          200: 'rgb(var(--c-surface-200) / <alpha-value>)',
          300: 'rgb(var(--c-surface-300) / <alpha-value>)',
        },
        text: {
          primary:   'rgb(var(--c-text-primary)   / <alpha-value>)',
          secondary: 'rgb(var(--c-text-secondary) / <alpha-value>)',
          muted:     'rgb(var(--c-text-muted)     / <alpha-value>)',
          inverse:   'rgb(var(--c-text-inverse)   / <alpha-value>)',
        },
        success: { 50: '#E6F7EF', 100: '#C2EBDA', 300: '#4DC490', 400: '#2E9E6B', 500: '#2E9E6B', 600: '#258A5C' },
        warning: { 50: '#FEF5E7', 100: '#FDE6BF', 300: '#E8A838', 400: '#E8A838', 500: '#D49530' },
        error:   { 50: '#FDECE8', 100: '#FACFC7', 300: '#E85438', 400: '#E85438', 500: '#D44A30' },
      },
      borderRadius: { '2xl': '16px', '3xl': '24px' },
      boxShadow: {
        card:  '0 1px 3px rgba(13,61,34,0.04), 0 1px 2px rgba(13,61,34,0.06)',
        float: '0 16px 50px rgba(13,61,34,0.16), 0 2px 10px rgba(13,61,34,0.06)',
        glass: '0 4px 24px rgba(13,61,34,0.08)',
        glow:  '0 0 20px rgba(13,61,34,0.15)',
      },
      keyframes: {
        shimmer: { '0%': { backgroundPosition: '200% 0' }, '100%': { backgroundPosition: '-200% 0' } },
        floatMascot: { '0%, 100%': { transform: 'translateY(0px)' }, '50%': { transform: 'translateY(-8px)' } },
        riseUp: { from: { opacity: '0', transform: 'translateY(24px)' }, to: { opacity: '1', transform: 'translateY(0)' } },
      },
      animation: {
        shimmer: 'shimmer 1.5s ease-in-out infinite',
        'float-mascot': 'floatMascot 3.8s ease-in-out infinite',
        'rise-up': 'riseUp 0.6s cubic-bezier(0.23,1,0.32,1) both',
      },
    },
  },
  plugins: [],
};

