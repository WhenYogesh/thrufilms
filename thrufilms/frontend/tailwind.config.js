/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          blue: "#0052cc",     // Strong professional blue (Backstage style)
          "blue-dark": "#0747a6",
          "blue-light": "#deebff",
          black: "#172b4d",    // Deep professional black/navy
          white: "#ffffff",
          bg: "#f4f5f7",       // Light gray background
          border: "#dfe1e6",   // Clean subtle borders
          "text-primary": "#172b4d",
          "text-secondary": "#5e6c84",
          "text-muted": "#97a0af",
        },
      },
      fontFamily: {
        sans: ["Inter", "-apple-system", "BlinkMacSystemFont", "Segoe UI", "Roboto", "sans-serif"],
        display: ["Inter", "-apple-system", "sans-serif"], // Backstage uses clean sans-serif for everything
      },
      boxShadow: {
        'card': '0 1px 1px rgba(9, 30, 66, 0.25), 0 0 1px rgba(9, 30, 66, 0.31)',
        'card-hover': '0 4px 8px -2px rgba(9, 30, 66, 0.25), 0 0 1px rgba(9, 30, 66, 0.31)',
      },
      animation: {
        "fade-in": "fadeIn 0.3s ease forwards",
        "slide-up": "slideUp 0.3s ease forwards",
      },
      keyframes: {
        fadeIn: {
          from: { opacity: "0" },
          to: { opacity: "1" },
        },
        slideUp: {
          from: { opacity: "0", transform: "translateY(12px)" },
          to: { opacity: "1", transform: "translateY(0)" },
        },
      },
    },
  },
  plugins: [],
};
