/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        pink: {
          50: '#FFF7F9',
          100: '#FDEFF4',
          200: '#FCD8E5',
          300: '#FABCD4',
          400: '#F78FB9',
          500: '#EE6499',
          600: '#D83E7A',
        },
        chocolate: {
          50: '#F8F5F2',
          100: '#EFE9E4',
          200: '#DFCFC4',
          300: '#C7ADA0',
          400: '#9B7460',
          500: '#754E39',
          600: '#5A3A27',
          700: '#4A2E1B',
          800: '#3D2314',
          900: '#2C180B',
          950: '#1B0E06',
        },
        cream: {
          50: '#FFFDF9',
          100: '#FAF5EE',
          200: '#F4ECE0',
          300: '#E8DCcb',
          400: '#D7C3AD',
        },
        gold: {
          100: '#FDF7E7',
          200: '#F8E8B8',
          400: '#E5C058',
          500: '#D4AF37',
          600: '#B89425',
        }
      },
      fontFamily: {
        serif: ['"Playfair Display"', 'Georgia', 'serif'],
        sans: ['"Plus Jakarta Sans"', 'system-ui', 'sans-serif'],
        display: ['"Outfit"', '"Plus Jakarta Sans"', 'sans-serif'],
      },
      boxShadow: {
        'soft': '0 8px 30px rgba(61, 35, 20, 0.06)',
        'soft-lg': '0 16px 40px rgba(61, 35, 20, 0.09)',
        'pink-glow': '0 0 25px rgba(251, 188, 212, 0.45)',
        'choc-glow': '0 10px 30px rgba(44, 24, 11, 0.25)',
      },
      animation: {
        'pulse-subtle': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'float': 'float 4s ease-in-out infinite',
        'shimmer': 'shimmer 2s linear infinite',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-6px)' },
        },
        shimmer: {
          '0%': { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition: '200% 0' },
        }
      }
    },
  },
  plugins: [],
}
