export default {
  content: [
    "./index.html",
    "./src/**/*.{js,jsx}"
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          50: "#eff6ff",
          100: "#dbeafe",
          500: "#2563eb",
          700: "#1d4ed8"
        },
        hospital: {
          100: "#eff9f6",
          500: "#0f766e",
          700: "#115e59"
        }
      }
    }
  },
  plugins: []
};
