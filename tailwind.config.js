/** @type {import('tailwindcss').Config} */
export const content = ["./src/**/*.{js,jsx,ts,tsx}"];
export const theme = {
  extend: {
    animation: {
      scroll: 'scroll 200s linear infinite', /* FUNCIONAAAAAAAAAAAA CAMBIARRRRRRR IMPORTANTEEEEEEEEE !!!!!!!!! */
    },
    keyframes: {
      scroll: {
        '0%': { transform: 'translateX(0)' },
        '100%': { transform: 'translateX(-50%)' }
      },
    },
  },
};
export const plugins = [require('daisyui')];
export const daisyui = {
  themes: ["dark"],
  darkTheme: "dark",
};