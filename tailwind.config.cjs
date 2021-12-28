const config = {
  content: ["./src/**/*.{html,js,svelte,ts}"],
  theme: {
    extend: {
      fontFamily: {
        libertine: ["'Linux Libertine'", "serif"],
      },
    },
  },
  important: "body",
  plugins: [],
  corePlugins: {
    preflight: true,
  },
};

module.exports = config;
