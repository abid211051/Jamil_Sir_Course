/** @type {import('tailwindcss').Config} */
import daisyui from 'daisyui'
export default {
  content: [
    "./*.html",
    "./*.js"
  ],
  daisyui: {
    themes: [
      "light",
      "dark",
      "cupcake",
      "bumblebee",
      "synthwave",
      "retro",
      "cyberpunk",
      "valentine",
    ]
  },
  plugins: [
    daisyui
  ],
}

