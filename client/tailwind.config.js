/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        orange: {
          500: '#f97316',
          600: '#ea580c',
        },
        green: {
          500: '#10b981',
          600: '#059669',
        },
        gray: {
          50: '#f9fafb',
          100: '#f3f4f6',
          600: '#4b5563',
          800: '#1f2937',
        },
        yellow: {
          500: '#f59e0b',
        },
      },
      backgroundImage: {
        'hero-pattern': "url('https://images.unsplash.com/photo-1546069901-eacef0df6022?ixlib=rb-1.2.1&auto=format&fit=crop&w=1650&q=80')",
      },
    },
  },
  plugins: [],
}