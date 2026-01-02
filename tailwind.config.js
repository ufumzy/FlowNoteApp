/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./src/renderer/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        'nano-banana': '#FFE135', // Vibrant banana yellow
        'nano-obsidian': '#1C1C1E', // Deep dark background
        'nano-obsidian-light': '#2C2C2E', // Lighter dark for elements
        'nano-gray': '#8E8E93' // Soft gray for text
      }
    }
  },
  plugins: [require('@tailwindcss/typography')]
}
