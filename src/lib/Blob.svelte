<script>
  import { onMount } from 'svelte'

  /** @type {HTMLElement} */
  let blob
  export let speedX = Math.random()
  export let speedY = Math.random()
  export let color

  function moveBlob() {
    if (blob) {
      let parentBounds = blob.parentElement.getBoundingClientRect()
      let bounds = blob.getBoundingClientRect()
      let leftPx = +blob.style.left.split('px')[0]
      let topPx = +blob.style.top.split('px')[0]
      if (
        bounds.x + bounds.width + 5 > parentBounds.right ||
        bounds.x < parentBounds.left
      ) {
        speedX = -speedX
      }
      if (
        bounds.y + bounds.height + 5 > parentBounds.bottom ||
        bounds.y < parentBounds.top
      ) {
        speedY = -speedY
      }

      let newLeft = leftPx + speedX
      let newTop = topPx + speedY
      blob.style.left = `${newLeft}px`
      blob.style.top = `${newTop}px`
      requestAnimationFrame(moveBlob)
    }
  }

  onMount(() => {
    let parentBounds = blob.parentElement.getBoundingClientRect()
    let initialX = Math.floor(Math.random() * parentBounds.width)
    let initialY = Math.floor(Math.random() * parentBounds.height) - blob.height
    blob.style.left = `${initialX}px`
    blob.style.top = `${initialY}px`
    blob.style.display = 'block'
    moveBlob()
  })
</script>

<div bind:this={blob} class="dvd w-20 h-20 absolute rounded-full p-2 {color}" />

<style>
  @supports not (backdrop-filter: blur(24px)) {
    div {
      filter: blur(24px);
    }
  }
  div {
    display: none;
  }
</style>
