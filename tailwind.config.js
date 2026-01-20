/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Colores Primarios - Counsel Logistic
        'counsel': {
          'green': '#2C5234',      // Verde Counsel - Principal
          'green-light': '#4A7C4E', // Verde Claro - Secundario
          'gold': '#D4AF37',        // Oro Corporativo - Acentos
        },
        // Colores Complementarios
        'counsel-gray': {
          'dark': '#1A1A1A',        // Negro
          'DEFAULT': '#666666',     // Gris
          'light': '#F5F5F5',       // Gris Claro
        }
      },
      fontFamily: {
        'sans': ['Arial', 'Calibri', 'sans-serif'],
      }
    },
  },
  plugins: [],
}
