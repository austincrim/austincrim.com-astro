/**
 * @type {import('tailwindcss').Config}
 */
module.exports = {
  content: ['./src/**/*.{html,svelte,astro}'],
  darkMode: 'media',
  theme: {
    extend: {
      screens: {
        touch: { raw: '(pointer: coarse)' },
        mouse: { raw: '(pointer: fine)' },
      },
      fontFamily: {
        merriweather: 'Merriweather',
      },
    },
  },
  plugins: [require('@tailwindcss/typography')],
}
