/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Luxury art gallery palette
        charcoal:  { DEFAULT: '#1C1C1E', 50: '#F5F5F5', 100: '#E8E8E8', 200: '#D0D0D0', 900: '#1C1C1E' },
        ivory:     { DEFAULT: '#F8F5F0', dark: '#EDE9E1' },
        gold:      { DEFAULT: '#C9A84C', light: '#DEC06E', dark: '#A07A28' },
        sage:      { DEFAULT: '#7C8C72', light: '#9BAD90' },
        slate:     { DEFAULT: '#4A4A5A', light: '#6B6B80' },
      },
      fontFamily: {
        // Display: Cormorant for editorial elegance
        display: ['Cormorant Garamond', 'Georgia', 'serif'],
        // Body: Inter for clean readability  
        body: ['Inter', 'system-ui', 'sans-serif'],
        // Utility: tracking for labels
        label: ['Inter', 'sans-serif'],
      },
      spacing: {
        '18': '4.5rem',
        '88': '22rem',
        '128': '32rem',
      },
      animation: {
        'fade-in': 'fadeIn 0.5s ease-in-out',
        'slide-up': 'slideUp 0.4s ease-out',
        'slide-in-right': 'slideInRight 0.3s ease-out',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { opacity: '0', transform: 'translateY(20px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        slideInRight: {
          '0%': { opacity: '0', transform: 'translateX(-20px)' },
          '100%': { opacity: '1', transform: 'translateX(0)' },
        },
      },
    },
  },
  plugins: [],
}
