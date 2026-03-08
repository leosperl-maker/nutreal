/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        display: ['Plus Jakarta Sans', 'system-ui', 'sans-serif'],
      },
      colors: {
        primary: {
          50: '#E8F4F8', 100: '#D1E9F1', 200: '#A3D3E3', 300: '#75BDD5',
          400: '#3D8BAD', 500: '#2A6B8A', 600: '#235A74', 700: '#1E5270',
          800: '#17405A', 900: '#102E42',
        },
        surface: { 50: '#FFFFFF', 100: '#F8FAFB', 200: '#F0F4F6', 300: '#E4EAED' },
        success: { 50: '#E6F7EF', 100: '#C2EBDA', 300: '#4DC490', 400: '#2E9E6B', 500: '#2E9E6B', 600: '#258A5C' },
        warning: { 50: '#FEF5E7', 100: '#FDE6BF', 300: '#E8A838', 400: '#E8A838', 500: '#D49530' },
        error: { 50: '#FDECE8', 100: '#FACFC7', 300: '#E85438', 400: '#E85438', 500: '#D44A30' },
        text: { primary: '#1A2F3A', secondary: '#5A7A8A', muted: '#8BA3B0', inverse: '#FFFFFF' },
      },
      borderRadius: { '2xl': '16px', '3xl': '24px' },
      boxShadow: {
        card: '0 1px 3px rgba(42,107,138,0.04), 0 1px 2px rgba(42,107,138,0.06)',
        float: '0 4px 24px rgba(42,107,138,0.08)',
        glass: '0 4px 24px rgba(42,107,138,0.08)',
        glow: '0 0 20px rgba(42,107,138,0.15)',
      },
      keyframes: { shimmer: { '0%': { backgroundPosition: '200% 0' }, '100%': { backgroundPosition: '-200% 0' } } },
      animation: { shimmer: 'shimmer 1.5s ease-in-out infinite' },
    },
  },
  plugins: [],
};
