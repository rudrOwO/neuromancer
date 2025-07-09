<script lang="ts">
  import Processing from "./Processing.svelte"

  type Props = {
    isAnimating: boolean
  }

  const { isAnimating }: Props = $props()
</script>

<nav class="flex fixed top-0 w-[100vw] flex-row justify-between z-10 py-4">
  <div class="w-10 ml-2 sm:ml-6">
    <Processing {isAnimating} />
  </div>
  <span class="font-title text-text-color text-lg sm:text-xl">
    Neuromancer
  </span>
  <a href="https://github.com/rudrowo/Neuromancer" class="mr-2 sm:mr-6">
    <img class="h-8 mx-2" src="/github-icon.svg" alt="Github Icon" />
  </a>
</nav>
