<script lang="ts">
  export let img;
  export let title;
  export let text;
  export let author;
  export let date;
  export let readTime;
  export let link;

  let authorDetails = getAuthorDetails(author);

  function getAuthorDetails() {
    switch (author) {
      case "Adam":
        return {
          img: "/AdamPortTrait.png",
          name: "Adam Silver",
        };
      default:
        return {};
    }
  }
</script>

<div class="max-w-[500px] flex flex-col overflow-hidden rounded-lg shadow-lg">
  <div class="flex-shrink-0">
    <img class="h-48 w-full object-cover" src={img} alt="" />
  </div>
  <div class="flex flex-1 flex-col justify-between bg-white p-6">
    <div class="flex-1">
      <p class="text-sm font-medium text-primary-600">
        <a href={link} class="hover:underline">Article</a>
      </p>
      <a href={link} class="mt-2 block">
        <p class="text-xl font-semibold text-gray-900">
          {title}
        </p>
        <p class="mt-3 text-sm text-gray-500">
          {text}
        </p>
      </a>
    </div>
    <div class="mt-6 flex items-center">
      <div class="flex-shrink-0">
        <span class="sr-only">{authorDetails.name}</span>
        <img class="h-10 w-10 rounded-full" src={authorDetails.img} alt="" />
      </div>
      <div class="ml-3">
        <p class="text-sm font-medium text-gray-900">
          {authorDetails.name}
        </p>
        <div class="flex space-x-1 text-sm text-gray-500">
          <time datetime="2020-03-16">{date}</time>
          <span aria-hidden="true">&middot;</span>
          <span>{readTime} read</span>
        </div>
      </div>
    </div>
  </div>
</div>
