/** @type {import('tailwindcss').Config} */
const config = {
  content: ['./src/**/*.{js,jsx}'],
  theme: {
    container: {
      center: true,
      padding: {
        DEFAULT: '1.25rem',
        sm: '1.5rem',
        lg: '2rem',
        xl: '3rem',
      },
      screens: {
        '2xl': '1280px',
      },
    },
    extend: {
      colors: {
        // Brand palette extracted from the official Hackin' for Harden mark
        navy: {
          50: '#E7EAF0',
          100: '#C9CFDB',
          200: '#9BA5BC',
          300: '#5E6B89',
          400: '#3B4D6B',
          500: '#2D3F5C',
          600: '#243450',
          700: '#1F2F47',
          800: '#1B2A40',
          900: '#11192B',
          950: '#0A1424',
        },
        green: {
          50: '#EAF4EC',
          100: '#CFE6D4',
          200: '#9DCBA6',
          300: '#5BB46A',
          400: '#3F9E54',
          500: '#2E7D3F',
          600: '#1F5C2C',
          700: '#16461F',
          800: '#0F3215',
          900: '#08210C',
        },
        gold: {
          50: '#FAF1DC',
          100: '#F2DFB1',
          200: '#E5C679',
          300: '#D9A53A',
          400: '#C28A20',
          500: '#9C6E15',
          600: '#7A5610',
          700: '#5C400B',
          800: '#3D2A07',
        },
        crimson: {
          400: '#E25247',
          500: '#C8362B',
          600: '#A22920',
        },
        cream: {
          50: '#FAF6EC',
          100: '#F0E9D6',
          200: '#E2DAC4',
          300: '#D7CDB5',
          400: '#B8AC91',
          500: '#8B8169',
          600: '#6B6253',
          700: '#4D453A',
          800: '#2F2A22',
          900: '#1F1B14',
        },
      },
      fontFamily: {
        display: ['var(--font-display)', 'system-ui', 'sans-serif'],
        sans: ['var(--font-sans)', 'system-ui', 'sans-serif'],
        mono: ['var(--font-mono)', 'ui-monospace', 'monospace'],
      },
      fontSize: {
        'display-2xl': [
          'clamp(3.5rem, 8vw, 7rem)',
          { lineHeight: '0.92', letterSpacing: '-0.035em' },
        ],
        'display-xl': [
          'clamp(2.75rem, 6vw, 5rem)',
          { lineHeight: '0.96', letterSpacing: '-0.03em' },
        ],
        'display-lg': ['clamp(2rem, 4vw, 3rem)', { lineHeight: '1.05', letterSpacing: '-0.02em' }],
      },
      spacing: {
        section: 'clamp(4.5rem, 8vw, 8.75rem)',
      },
      borderRadius: {
        xl: '0.875rem',
        '2xl': '1.25rem',
      },
      boxShadow: {
        elev: '0 24px 60px -20px rgba(11, 18, 32, 0.45)',
        glow: '0 0 32px rgba(194, 138, 32, 0.35)',
      },
      backgroundImage: {
        'mesh-grid': 'radial-gradient(rgba(194,138,32,0.08) 1px, transparent 1px)',
      },
      backgroundSize: {
        'grid-32': '32px 32px',
      },
      transitionTimingFunction: {
        'out-soft': 'cubic-bezier(0.22, 1, 0.36, 1)',
      },
    },
  },
  plugins: [],
}

export default config
