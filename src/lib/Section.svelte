<script>
  export let title
</script>

<div class={`w-full pt-24 pb-12 leading-loose text-muted`}>
  <div class="max-w-6xl mx-auto">
    <h2 class="mb-6 text-3xl font-semibold text-left text-primary">
      {title}
    </h2>
    <slot />
  </div>
</div>
