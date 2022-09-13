const defaultTheme = require('tailwindcss/defaultTheme')

const config = {
  content: [
    "./src/**/*.{html,js,svelte,ts}",
    "./node_modules/flowbite-svelte/**/*.{html,js,svelte,ts}",
  ],

  theme: {
    screens: {
      "xs": "600px",
      ...defaultTheme.screens,
    },
    colors: {
      "primary": {
        "50": "#409dda",
        "100": "#3693d0",
        "200": "#2c89c6",
        "300": "#227fbc",
        "400": "#1875b2",
        DEFAULT: "#0e6ba8",
        "500": "#0e6ba8",
        "600": "#04619e",
        "700": "#005794",
        "800": "#004d8a",
        "900": "#004380"
      },
      "secondary": {
        "50": "#a6d5ff",
        "100": "#9ccbf5",
        "200": "#92c1eb",
        "300": "#88b7e1",
        "400": "#7eadd7",
        "500": "#74a3cd",
        DEFAULT: "#74a3cd",
        "600": "#6a99c3",
        "700": "#608fb9",
        "800": "#5685af",
        "900": "#4c7ba5"
      },
      "tertiary": {
        "50": "#c8ecff",
        "100": "#bee2ff",
        "200": "#b4d8f8",
        "300": "#aaceee",
        "400": "#a0c4e4",
        "500": "#96bada",
        DEFAULT: "#96bada",
        "600": "#8cb0d0",
        "700": "#82a6c6",
        "800": "#789cbc",
        "900": "#6e92b2"
      },
      "accent": {
        "50": "#ff868d",
        "100": "#ff7c83",
        "200": "#ff7279",
        "300": "#ff686f",
        "400": "#fc5e65",
        "500": "#f2545b",
        DEFAULT: "#f2545b",
        "600": "#e84a51",
        "700": "#de4047",
        "800": "#d4363d",
        "900": "#ca2c33"
      },
      "ethereum": {
        "light": "#ecf0f1",
        "dark": "#3c3c3d"
      },
      "polygon": {
        "50": "#b479ff",
        "100": "#aa6fff",
        "200": "#a065ff",
        "300": "#965bf9",
        "400": "#8c51ef",
        "500": "#8247e5",
        DEFAULT: "#8247e5",
        "600": "#783ddb",
        "700": "#6e33d1",
        "800": "#6429c7",
        "900": "#5a1fbd"
      }
    },
    extend: {
    },
  },

  plugins: [
    require('flowbite/plugin')
  ],

  darkMode: 'class',
};

module.exports = config;

module.exports.theme = config.theme;