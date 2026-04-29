module.exports = {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        primary: '#7c3aed',
        accent: '#06b6d4',
        glass: 'rgba(255,255,255,0.06)'
      },
      backdropBlur: {
        xs: '2px'
      }
    }
  },
  plugins: []
}

