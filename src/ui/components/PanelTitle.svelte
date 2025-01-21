<script lang="ts">
  type Props = {
    title: string
  }
  const { title }: Props = $props()
</script>

<div
  class="w-full text-center text-secondary text-2xl p-1 bg-accent rounded-t-lg shadow-xl"
>
  {title}
</div>
