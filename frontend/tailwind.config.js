/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
    "./node_modules/@shadcn/ui/dist/**/*.js", // ShadCN components include
  ],
  theme: {
    extend: {
      colors: {
        background: "var(--background)",
        foreground: "var(--foreground)",
        border: "var(--border)",
        primary: "var(--primary)",
        secondary: "var(--secondary)",
        // aur zarurat ke hisaab se aur tokens
      },
    },
  },
  plugins: [],
};

