import { vitePreprocess } from "@sveltejs/vite-plugin-svelte"

export default {
  preprocess: vitePreprocess(),
  onwarn(warning, defaultHandler) {
    // ignore accessability warnings cause they're annoying :/
    if (/^a11y/.test(warning.code)) {
      return
    }

    defaultHandler(warning)
  },
}
