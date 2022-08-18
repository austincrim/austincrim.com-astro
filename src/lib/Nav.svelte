<script>
  import { GitHubLogo, TwitterLogo, YoutubeLogo } from './Icons'

  export let activeLink
</script>

<nav class="p-10 text-muted lg:max-w-5xl md:mx-auto md:max-w-3xl relative">
  <div class="flex items-baseline justify-between">
    <div class="text-xl">
      <a
        class:active={activeLink === 'home'}
        class="inline-block transition-colors hover:text-muted-hover mr-6 md:mr-14"
        href="/"
      >
        Home
      </a>
      <a
        class:active={activeLink === 'blog'}
        class="inline-block transition-colors hover:text-muted-hover"
        href="/blog"
      >
        Blog
      </a>
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

<style>
  .active {
    @apply border-b-2 border-b-blue-500 pb-1;
  }
</style>
