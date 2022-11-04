<script>
  import { GitHubLogo, Rss, TwitterLogo, YoutubeLogo } from './Icons'

  export let activeLink
</script>

<nav class="pb-10 relative">
  <div class="flex items-end justify-between">
    <div class="text-xl">
      <a
        class:active={activeLink === 'home'}
        class="text-gray-700 inline-block transition-colors hover:text-gray-500 mr-6"
        href="/"
      >
        Home
      </a>
      <a
        class:active={activeLink === 'blog'}
        class="text-gray-700 inline-block transition-colors hover:text-gray-500 mr-4"
        href="/blog"
      >
        Blog
      </a>
    </div>
    <div class="flex items-baseline space-x-6 sm:space-x-10">
      <a
        aria-label="austin crim's rss feed"
        href="/rss.xml"
        class="inline-block w-8 h-8 transition-colors hover:text-gray-600"
      >
        {@html Rss()}
      </a>
      <a
        aria-label="austin crim's github profile"
        href="https://github.com/austincrim"
        class="inline-block w-8 h-8 transition-colors hover:text-gray-600"
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
