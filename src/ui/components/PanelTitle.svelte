<script lang="ts">
  type Props = {
    title: string
  }
  const { title }: Props = $props()
</script>

<div
  class="w-full text-center text-text-color text-2xl p-2 bg-accent rounded-lg shadow-xl"
>
  {title}
</div>
