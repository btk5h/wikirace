import adapter from "@sveltejs/adapter-auto";
import preprocess from "svelte-preprocess";
import Icons from "unplugin-icons/vite";

/** @type {import('@sveltejs/kit').Config} */
const config = {
  // Consult https://github.com/sveltejs/svelte-preprocess
  // for more information about preprocessors
  preprocess: [preprocess({})],

  kit: {
    adapter: adapter(),
    // hydrate the <div id="svelte"> element in src/app.html
    target: "#svelte",
    ssr: false,
    vite: {
      plugins: [
        Icons({
          compiler: "svelte",
        }),
      ],
    },
  },
};

export default config;
