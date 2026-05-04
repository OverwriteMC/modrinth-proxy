/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: 'class',
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './lib/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        'version-release-bg': 'rgba(27, 217, 106, 0.2)',
        'version-release-fg': '#1bd96a',
        'version-beta-bg': 'rgba(255, 163, 71, 0.2)',
        'version-beta-fg': '#ffa347',
        black: 'var(--bg-black)',
        modrinth: {
          green: 'var(--color-green)',
          'green-light': 'var(--color-green-light)',
          dark: 'var(--bg-secondary)',
          darker: 'var(--bg-primary)',
          darkest: 'var(--bg-darker)',
          border: 'var(--border-color)',
        },
        gray: {
          400: 'var(--text-gray)',
          800: 'var(--border-color)',
        }
      },
      borderColor: {
        DEFAULT: 'var(--border-color)',
      },
      keyframes: {
        shimmer: {
          '0%': { transform: 'translateX(-100%) translateY(-100%) rotate(45deg)' },
          '100%': { transform: 'translateX(100%) translateY(100%) rotate(45deg)' },
        }
      },
      animation: {
        shimmer: 'shimmer 3s ease-in-out infinite',
      }
    },
    container: {
      center: true,
      padding: '1rem',
      screens: {
        sm: '640px',
        md: '768px',
        lg: '1024px',
        xl: '1280px',
        '2xl': '1280px',
      },
    },
  },
  plugins: [],
}

