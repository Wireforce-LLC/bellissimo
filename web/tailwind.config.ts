import type { Config } from "tailwindcss";

/** @type {import('tailwindcss').Config} */
export default {
  safelist: [
    "text-blue-800",
    "text-blue-500",
    "bg-blue-50",
    "border-b-blue-100",

    "text-yellow-800",
    "text-yellow-500",
    "bg-yellow-50",
    "border-b-yellow-100",

    "text-green-800",
    "text-green-500",
    "bg-green-50",
    "border-b-green-100",
  ],
  darkMode: "selector",
  content: [
    "./app/**/*.{js,jsx,ts,tsx}",
    "./app/components/*.{js,jsx,ts,tsx}",
    "./app/routes/*.{js,jsx,ts,tsx}",
    "./node_modules/preline/preline.js",
  ],
  theme: {
    extend: {},
  },
  plugins: [require("preline/plugin")],
} satisfies Config;
