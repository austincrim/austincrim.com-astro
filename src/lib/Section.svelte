<script>
  export let title
</script>

<div class={`w-full pt-24 pb-12 leading-loose text-gray-700`}>
  <div class="max-w-6xl mx-auto">
    <h2 class="mb-6 text-3xl font-semibold text-left text-blue-800">
      {title}
    </h2>
    <slot />
  </div>
</div>
