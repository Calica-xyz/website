const config = {
  content: [
    "./src/**/*.{html,js,svelte,ts}",
    "./node_modules/flowbite-svelte/**/*.{html,js,svelte,ts}",
  ],

  theme: {
    colors: {
      primary: 'rgb(var(--color-primary) / <alpha-value>)',
      secondary: 'rgb(var(--color-secondary) / <alpha-value>)',
      tertiary: 'rgb(var(--color-tertiary) / <alpha-value>)',
      accent: 'rgb(var(--color-accent) / <alpha-value>)',
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