/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{html,ts}",
     "./node_modules/flowbite/**/*.js"
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          50:  '#FFF5EB',
          100: '#FFE7D1',
          200: '#FFCB9E',
          300: '#FFA870',
          400: '#FF833C',
          500: '#FF6500',  // Color base
          600: '#E65A00',
          700: '#B74600',
          800: '#8A3500',
          900: '#662800',
        },
        'black': '#212121',
      }
    },
  },
  plugins: [
    require('flowbite/plugin') // add this line
  ],
}

