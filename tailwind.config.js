/** @type {import('tailwindcss').Config} */
export default {
  // 1. Especifica los archivos que Tailwind debe analizar
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],

  // 2. Extiende el tema por defecto de Tailwind con nuestro Design System
  theme: {
    extend: {
      // 2a. Mapea nuestras variables de color de CSS a clases de Tailwind
      colors: {
        'pet-orange': 'var(--pet-orange)',
        'pet-teal': 'var(--pet-teal)',
        'pet-blue': 'var(--pet-blue)',
        'pet-green': 'var(--pet-green)',
        'pet-yellow': 'var(--pet-yellow)',
        success: 'var(--success)',
        warning: 'var(--warning)',
        error: 'var(--error)',
        info: 'var(--info)',
        // Mapeo completo de la paleta de neutrales
        neutral: {
          50: 'var(--neutral-50)',
          100: 'var(--neutral-100)',
          200: 'var(--neutral-200)',
          300: 'var(--neutral-300)',
          400: 'var(--neutral-400)',
          500: 'var(--neutral-500)',
          600: 'var(--neutral-600)',
          700: 'var(--neutral-700)',
          800: 'var(--neutral-800)',
          900: 'var(--neutral-900)',
        },
      },
      // 2b. Mapea nuestros gradientes a clases de background-image
      backgroundImage: {
        'gradient-primary': 'var(--gradient-primary)',
        'gradient-secondary': 'var(--gradient-secondary)',
        'gradient-nature': 'var(--gradient-nature)',
        'gradient-warm': 'var(--gradient-warm)',
      },
      // 2c. Mapea nuestras tipografías a clases de font-family
      fontFamily: {
        primary: ['var(--font-primary)'],
        display: ['var(--font-display)'],
      },
    },
  },

  // 3. Plugins (podemos añadir más en el futuro)
  plugins: [],
}