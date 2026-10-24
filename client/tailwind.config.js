/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        anulok: {
          cream: '#FAF7F2',
          linen: '#F4EFEA',
          sand: '#EAE2D7',
          stone: '#D5C9B8',
          wood: '#8C6239',
          walnut: '#5C3D24',
          espresso: '#1F1D1B',
          charcoal: '#2D2A28',
          amber: '#C47B47',
          sage: '#6E8070',
          taupe: '#9C8F84'
        }
      },
      fontFamily: {
        serif: ['"Playfair Display"', '"Cormorant Garamond"', 'Georgia', 'serif'],
        sans: ['"Plus Jakarta Sans"', 'Inter', 'sans-serif'],
      },
      boxShadow: {
        'luxury': '0 20px 40px -15px rgba(31, 29, 27, 0.07)',
        'luxury-hover': '0 25px 50px -12px rgba(31, 29, 27, 0.15)',
        'drawer': '-10px 0 30px rgba(0, 0, 0, 0.15)',
      },
      animation: {
        'fade-in': 'fadeIn 0.3s ease-out forwards',
        'slide-up': 'slideUp 0.4s cubic-bezier(0.16, 1, 0.3, 1) forwards',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { transform: 'translateY(15px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        }
      }
    },
  },
  plugins: [],
}
