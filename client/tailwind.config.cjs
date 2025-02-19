// eslint-disable-next-line @typescript-eslint/no-var-requires
const plugin = require('tailwindcss/plugin')

/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  corePlugins: {
    container: false
  },
  theme: {
    extend: {
      colors: {
        primary: '#ee4d2d',

        gray: {
          light: '#C4C4C4',
          dark: '#292D32',
          light6B: '#6b6b6b',
          darkF3: '#f3edff',
          grayF5: '#F5F5F5'
        },
        red: {
          dark: '#820005',
          light: '#f8d7da'
        },
        tertiary: '#3A1097'
      }
    }
  },
  plugins: [
    plugin(function ({ addComponents, theme }) {
      addComponents({
        '.container': {
          maxWidth: theme('columns.7xl'),
          marginLeft: 'auto',
          marginRight: 'auto',
          paddingLeft: theme('spacing.4'),
          paddingRight: theme('spacing.4'),
          width: 'fit-content'
        }
      })
    })
  ]
}
