<script>
  import { GitHubLogo, TwitterLogo, YoutubeLogo } from './Icons'
  import { spring } from 'svelte/motion'

  export let route

  let activeBorderPosition = spring(-10, {
      stiffness: 0.13,
      damping: 0.2,
      precision: 0.1
    }),
    activeLink,
    linkEls = {},
    linkBorderEl,
    navEl
  $: {
    activeLink = route.includes('/blog') ? 'blog' : 'home'
    if (linkBorderEl) {
      linkBorderEl.style.width = `${
        linkEls[activeLink].getBoundingClientRect().width
      }px`
      activeBorderPosition.set(
        linkEls[activeLink].getBoundingClientRect().x -
          navEl.getBoundingClientRect().x
      )
    }
  }

  function nudgeBorder(link, value) {
    if (link === activeLink) return

    activeBorderPosition.update((pos) => pos + value)
  }
</script>

<nav
  bind:this={navEl}
  class="p-10 text-muted lg:max-w-5xl md:mx-auto md:max-w-3xl relative"
>
  <div class="flex items-baseline justify-between">
    <div class="text-xl">
      <a
        bind:this={linkEls['home']}
        class="inline-block transition-colors hover:text-muted-hover mr-6 md:mr-14"
        href="/"
        on:mouseenter={() => nudgeBorder('home', -10)}
        on:focus={() => nudgeBorder('home', -10)}
        on:mouseout={() => nudgeBorder('home', 10)}
        on:blur={() => nudgeBorder('home', 10)}
      >
        Home
      </a>
      <a
        bind:this={linkEls['blog']}
        class="inline-block transition-colors hover:text-muted-hover"
        href="/blog"
        on:mouseenter={() => nudgeBorder('blog', 10)}
        on:focus={() => nudgeBorder('blog', 10)}
        on:mouseout={() => nudgeBorder('blog', -10)}
        on:blur={() => nudgeBorder('blog', -10)}
      >
        Blog
      </a>
      <div
        bind:this={linkBorderEl}
        style="transform: translatex({$activeBorderPosition}px)"
        class="linkBorder transition-[width] absolute bottom-8 left-0 h-[2px] bg-blue-500"
      />
    </div>
    <div class="flex items-baseline space-x-8">
      <a
        aria-label="austin crim's github profile"
        href="https://github.com/austincrim"
        class="inline-block w-8 h-8 transition-colors hover:text-muted-hover"
      >
        {@html GitHubLogo()}
      </a>
      <a
        aria-label="austin crim's twitter profile"
        href="https://twitter.com/crim_codes"
        class="inline-block w-8 h-8 transition-colors text-[#1D9BF0] hover:text-[#2EACF1] "
      >
        {@html TwitterLogo()}
      </a>
      <a
        aria-label="austin crim's youtube channel"
        href="https://youtube.com/austincrim"
        class="inline-block w-8 h-8 transition-colors text-[#dd0000] hover:text-[#cc0000]"
      >
        {@html YoutubeLogo()}
      </a>
    </div>
  </div>
</nav>
