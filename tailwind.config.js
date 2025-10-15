module.exports = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
    "./app/**/*.{js,ts,jsx,tsx}",
    "./public/**/*.html"
  ],
  safelist: [
    {
      pattern: /^text-\[.+\]/,
    },
    {
      pattern: /^bg-\[.+\]/,
    },
    {
      pattern: /^hover:text-\[.+\]/,
    },
    {
      pattern: /^hover:bg-\[.+\]/,
    },
  ],
  theme: {
    extend: {
      borderColor: {
        border: 'hsl(var(--border) / <alpha-value>)',
      },
      backgroundColor: {
        background: 'hsl(var(--background) / <alpha-value>)',
      },
      textColor: {
        foreground: 'hsl(var(--foreground) / <alpha-value>)',
      }
    },
  },
  plugins: [],
} 