<script>
  export let post
</script>

<a class="group relative" href={`${post.url}`}>
  <article
    class="relative z-10 flex items-center transition-all ease-out mouse:group-hover:-translate-y-1 duration-100 mouse:group-active:translate-y-0 group-focus-visible:-translate-y-1"
  >
    <div
      class="flex flex-col flex-grow p-8 space-y-1 border border-gray-200 rounded bg-gray-50"
    >
      <div
        class="flex flex-col justify-between space-y-2 md:space-y-0 md:space-x-2 md:flex-row md:items-baseline"
      >
        <h3 class="text-xl font-bold tracking-wider underline sm:no-underline">
          {post.title}
        </h3>
        <div class="flex flex-col md:items-end md:pl-2">
          <span class="text-gray-700">
            {new Date(post.datePublished).toLocaleDateString()}
          </span>
        </div>
      </div>
      <p class="max-w-3xl leading-8">{post.lede}</p>
    </div>
  </article>
  <div
    class="w-full h-full translate-y-1 fancy-gradient shadow absolute rounded bg-red-500 top-0 left-0"
  />
</a>
