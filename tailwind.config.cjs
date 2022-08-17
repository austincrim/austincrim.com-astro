/**
 * @type {import('tailwindcss').Config}
 */
module.exports = {
  content: ['./src/**/*.{html,svelte,astro}'],
  variants: {},
  theme: {
    extend: {
      backgroundColor: {
        base: 'rgb(var(--color-base) / <alpha-value>)',
        'off-base': 'rgb(var(--color-off-base) / <alpha-value>)',
        primary: 'rgb(var(--color-primary) / <alpha-value>)',
        secondary: 'rgb(var(--color-secondary) / <alpha-value>)',
        muted: 'rgb(var(--color-text-muted) / <alpha-value>)'
      },
      textColor: {
        base: 'rgb(var(--color-text-base) / <alpha-value>)',
        muted: 'rgb(var(--color-text-muted) / <alpha-value>)',
        'muted-hover': 'rgb(var(--color-text-muted-hover) / <alpha-value>)',
        primary: 'rgb(var(--color-primary) / <alpha-value>)',
        secondary: 'rgb(var(--color-secondary) / <alpha-value>)'
      },
      borderColor: {
        primary: 'rgb(var(--color-primary))'
      },
      screens: {
        touch: { raw: '(pointer: coarse)' },
        mouse: { raw: '(pointer: fine)' }
      },
      typography: (theme) => ({
        theme: {
          css: [
            {
              color: 'var(--color-text-base)',
              'font-weight': '300',
              'font-family': 'Inter, sans-serif',
              '[class~="lead"]': {
                color: 'var(color-text-muted)'
              },
              a: {
                color: 'var(--color-primary)',
                transition: 'color 150ms ease'
              },
              'a:hover': {
                color: theme('textColor.muted-hover')
              },
              strong: {
                color: 'var(--color-text-base)'
              },
              'ol > li::before': {
                color: 'var(--color-text-muted)'
              },
              'ul > li::before': {
                backgroundColor: theme('textColor.primary')
              },
              hr: {
                borderColor: 'var(--color-text-muted)'
              },
              blockquote: {
                color: 'var(--color-text-muted)',
                borderLeftColor: theme('colors.gray.600')
              },
              h1: {
                color: 'var(--color-text-base)'
              },
              h2: {
                color: 'var(--color-text-base)'
              },
              h3: {
                color: 'var(--color-text-base)'
              },
              h4: {
                color: 'var(--color-text-base)'
              },
              'figure figcaption': {
                color: 'var(--color-text-muted)'
              },
              code: {
                color: 'var(--color-text-base)'
              },
              'a code': {
                color: 'var(--color-text-base)'
              },
              pre: {
                color: 'hsl(0, 50%, 10%)',
                backgroundColor: 'hsl(0, 0%, 98%)'
              },
              thead: {
                color: 'var(--color-text-base)',
                borderBottomColor: 'var(--color-text-muted)'
              },
              'tbody tr': {
                borderBottomColor: theme('colors.gray.600')
              }
            }
          ]
        }
      })
    }
  },
  plugins: [require('@tailwindcss/typography')]
}
