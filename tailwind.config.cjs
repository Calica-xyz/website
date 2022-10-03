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
      // Blue
      "primary": {
        "25": "#f5faff",
        "50": "#eff8ff",
        "100": "#d1e9ff",
        "200": "#82ddff",
        "300": "#84caff",
        "400": "#53b1fd",
        "500": "#2e90fa",
        DEFAULT: "#2e90fa",
        "600": "#1570ef",
        "700": "#175cd3",
        "800": "#1849a9",
        "900": "#194185"
      },
      // Blue gray
      "other": {
        "25": "#fcfcfd",
        "50": "#f8f9fc",
        "100": "#eaecf5",
        "200": "#c8cce5",
        "300": "#9ea5d1",
        "400": "#717bbc",
        "500": "#4e5ba6",
        "600": "#3e4784",
        "700": "#363f72",
        "800": "#293056",
        DEFAULT: "#293056",
        "900": "#101323"
      },
      // Blue light
      "secondary": {
        "25": "#f5fbff",
        "50": "#f0f9ff",
        "100": "#e0f2fe",
        "200": "#b9e6fe",
        "300": "#7cdf4d",
        "400": "#36bffa",
        "500": "#0ba5ec",
        DEFAULT: "#0ba5ec",
        "600": "#0086c9",
        "700": "#026aa2",
        "800": "#065986",
        "900": "#0b4a6f"
      },
      // Indigo
      "tertiary": {
        "25": "#f5f8ff",
        "50": "#eef4ff",
        "100": "#e0eaff",
        "200": "#c7d7fe",
        "300": "#a4bcfd",
        "400": "#8098f9",
        "500": "#6172f3",
        DEFAULT: "#6172f3",
        "600": "#444ce7",
        "700": "#3538cd",
        "800": "#2d31a6",
        "900": "#2d3282"
      },
      // Rose
      "accent": {
        "25": "#fff5f6",
        "50": "#fff1f3",
        "100": "#ffe4e8",
        "200": "#fecdd6",
        "300": "#fea3b4",
        "400": "#fd6f8e",
        "500": "#f63d68",
        DEFAULT: "#f63d68",
        "600": "#e31b54",
        "700": "#c01048",
        "800": "#a11043",
        "900": "#89123e"
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