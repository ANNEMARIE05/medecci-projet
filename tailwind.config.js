/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        medecci: {
          bleuRoyal: '#0B3C91',
          bleuClair: '#1E88E5',
          blanc: '#FFFFFF',
          or: '#D4AF37',
          fond: '#F8FAFC',
          texte: '#0F172A',
        }
      },
      fontFamily: {
        poppins: ['Poppins', 'sans-serif'],
        inter: ['Inter', 'sans-serif'],
        cormorant: ['Cormorant Garamond', 'serif'],
      },
      borderRadius: {
        '3xl': '10px',
        '2xl': '8px',
        'xl': '8px',
        'lg': '6px',
        'md': '4px',
      },
      boxShadow: {
        premium: '0 10px 30px -10px rgba(11, 60, 145, 0.1)',
        glass: '0 8px 32px 0 rgba(11, 60, 145, 0.08)',
      }
    },
  },
  plugins: [],
}

