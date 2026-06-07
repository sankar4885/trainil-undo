/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        'train-primary': '#1E40AF',
        'train-secondary': '#F59E0B',
        'train-success': '#10B981',
        'train-danger': '#EF4444',
        'train-warning': '#F59E0B',
      },
    },
  },
  plugins: [],
}