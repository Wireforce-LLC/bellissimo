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

    "bg-indigo-100",
    "bg-indigo-200",
    "bg-indigo-300",
    "bg-indigo-400",
    "bg-indigo-500",
    "bg-indigo-600",
    "bg-indigo-700",
    "bg-indigo-800",
    "bg-indigo-900",

    "bg-orange-100",
    "bg-orange-200",
    "bg-orange-300",
    "bg-orange-400",
    "bg-orange-500",
    "bg-orange-600",
    "bg-orange-700",
    "bg-orange-800",
    "bg-orange-900",

    "text-white"
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
