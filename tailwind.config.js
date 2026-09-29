/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./index.html", "./js/app*.js"],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Outfit', 'sans-serif'],
      },
      colors: {
        brand: {
          // Vermelho do "p" do logo. Fundo de botão (texto branco em cima passa no contraste).
          red: '#E3151E',
          // Mesmo vermelho, mais claro: para TEXTO sobre fundo preto (o escuro não passa no contraste).
          'red-claro': '#F2353D',
          dark: '#111111',
          light: '#F8F9FA'
        }
      },
      animation: {
        'blob': 'blob 7s infinite',
        'ping-slow': 'ping 3s cubic-bezier(0, 0, 0.2, 1) infinite',
        'flutuar': 'flutuar 6s ease-in-out infinite',
        'faixa': 'faixa 40s linear infinite',
      },
      keyframes: {
        blob: {
          '0%': { transform: 'translate(0px, 0px) scale(1)' },
          '33%': { transform: 'translate(30px, -50px) scale(1.1)' },
          '66%': { transform: 'translate(-20px, 20px) scale(0.9)' },
          '100%': { transform: 'translate(0px, 0px) scale(1)' }
        },
        flutuar: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-12px)' }
        },
        faixa: {
          '0%': { transform: 'translateX(0)' },
          '100%': { transform: 'translateX(-50%)' }
        }
      }
    },
  },
  plugins: [],
}
