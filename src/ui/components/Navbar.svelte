<script lang="ts">
  import githubIcon from "/github-icon.svg?inline"
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
  <div class="flex flex-col text-text-color text-center">
    <span class="font-title text-lg sm:text-xl"> Neuromancer </span>
    <span class="text-base"> 3D Neural Network Visualizer </span>
  </div>
  <a
    href="https://github.com/rudrowo/Neuromancer"
    target="_blank"
    class="mr-2 sm:mr-6"
  >
    <img class="h-8 mx-2" src={githubIcon} alt="Github Icon" />
  </a>
</nav>
