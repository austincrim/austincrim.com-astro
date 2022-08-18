<script>
  export let post
</script>

<a class="group" href={`${post.url}`}>
  <article
    class="relative flex items-center transition-all ease-out mouse:group-hover:-translate-y-1 mouse:group-active:translate-y-0 mouse:group-active:shadow-none mouse:group-hover:shadow-md group-focus-visible:-translate-y-1"
  >
    <div
      class="flex flex-col flex-grow p-8 space-y-1 text-base border border-gray-200 rounded shadow bg-off-base"
    >
      <div
        class="flex flex-col justify-between space-y-2 md:space-y-0 md:space-x-2 md:flex-row md:items-baseline"
      >
        <h3 class="text-xl font-bold tracking-wider underline sm:no-underline">
          {post.title}
        </h3>
        <div class="flex flex-col md:items-end md:pl-2">
          <span class="text-muted">
            {new Date(post.datePublished).toLocaleDateString()}
          </span>
        </div>
      </div>
      <p class="max-w-3xl leading-8">{post.lede}</p>
    </div>
  </article>
</a>
