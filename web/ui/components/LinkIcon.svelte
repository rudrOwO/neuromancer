<script lang="ts">
  type Props = {
    href: string
    iconSrc: string
  }

  const { href, iconSrc }: Props = $props()
</script>

<a {href} target="_blank" class="w-10 mx-2 sm:mx-6 grid place-items-center">
  <img class="h-8" src={iconSrc} alt="Github Icon" />
</a>
