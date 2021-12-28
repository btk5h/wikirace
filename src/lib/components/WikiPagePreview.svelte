<script>
  import WikiPage from "$lib/components/WikiPage.svelte";

  export let html;
  export let title;
</script>

<div class="bg-yellow-200 p-4 mb-4">
  This is the page you're trying to reach. You can't click any links here!
</div>
<WikiPage {html} {title} />
