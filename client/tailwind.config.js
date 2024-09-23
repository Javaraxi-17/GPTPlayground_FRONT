/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      animation: {
        'spin-scale': 'spinScale 2s linear infinite', // Animación combinada de giro y escalado
      },
      keyframes: {
        spinScale: {
          '0%, 100%': { transform: 'rotate(0deg) scale(1)' },  // Comienza y termina en su tamaño normal
          '50%': { transform: 'rotate(180deg) scale(1.5)' },   // A la mitad, el logo está girado 180 grados y más grande
          '100%': { transform: 'rotate(360deg) scale(1)' },    // Completa la rotación en 360 grados y vuelve a su tamaño normal
        },
      },
    },
  },
  plugins: [],
}
