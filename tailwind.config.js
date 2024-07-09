// tailwind.config.js
module.exports = {
  purge: ['./src/**/*.{js,jsx,ts,tsx}', './public/index.html'],
  darkMode: false,
  theme: {
    extend: {
      colors: {
        primary: '#f0f0f3', // Blanc cassé
        secondary: '#d1d9e6', // Gris clair
        text: '#333',
      },
      boxShadow: {
        neumorphism: '9px 9px 16px #d1d9e6, -9px -9px 16px #ffffff',
        'neumorphism-inset': 'inset 9px 9px 16px #d1d9e6, inset -9px -9px 16px #ffffff',
      },
    },
  },
  variants: {
    extend: {},
  },
  plugins: [],
};
