/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        cream: '#FBF7F2',
        beige: '#EADFD6',
        blush: '#EEC9D2',
        sage: '#C9D8C5',
        deep: '#374151',
        accent: '#D9A7B0'
      },
      boxShadow: {
        soft: '0 10px 25px rgba(0,0,0,0.05)'
      },
      borderRadius: {
        xl: '1rem',
        '2xl': '1.5rem'
      },
      fontFamily: {
        display: ['"Quicksand"', 'ui-sans-serif', 'system-ui'],
        body: ['"Inter"', 'ui-sans-serif', 'system-ui']
      }
    }
  },
  plugins: []
};
