<script>
  import { afterUpdate, createEventDispatcher } from "svelte";
  import { BLOCKED_NAMESPACES } from "$lib/utils/wikipedia";

  export let html;
  export let title;

  let container;

  afterUpdate(() => {
    container.querySelectorAll("a").forEach((el) => {
      const href = el.getAttribute("href");
      if (href && !href.startsWith("#")) {
        el.removeAttribute("href");
      }
    });
  });

  const dispatch = createEventDispatcher();

  function handleClick(e) {
    const el = e.target.closest("a");
    if (!el) return;

    e.preventDefault();

    const href = el.getAttribute("href");
    if (href) {
      container.querySelector(href)?.scrollIntoView();
      return;
    }

    const title = el.getAttribute("title");
    if (title) {
      const namespace = title.substr(0, title.indexOf(":"));

      if (!el.classList.contains("new") && !BLOCKED_NAMESPACES.has(namespace)) {
        dispatch("navigate", title);
      }
    }
  }
</script>

<h1 class="font-libertine text-3xl pb-2 mb-1 border-b border-gray-500">{title}</h1>
<div class="wiki-styles relative pt-3" bind:this={container} on:click={handleClick}>
  {@html html}
</div>
