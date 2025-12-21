export default {
  content: [
    "./index.html",
    "./src/**/*.{js,jsx}",
  ],
  theme: {
    extend: {
      colors: {
        'risk-low': '#10b981',
        'risk-medium': '#f59e0b',
        'risk-high': '#ef4444',
        'accent-blue': '#3b82f6',
        'dark-bg': '#1f2937',
        'dark-card': '#2d3748',
      },
      spacing: {
        'safe': '2rem',
      },
      fontSize: {
        'heading': '2rem',
        'subheading': '1.5rem',
      },
    },
  },
  plugins: [],
}
