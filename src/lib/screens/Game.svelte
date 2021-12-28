<script lang="ts">
  import { getContext } from "svelte";
  import WikiPage from "$lib/components/WikiPage.svelte";
  import WikiPagePreview from "$lib/components/WikiPagePreview.svelte";
  import type { GameActor } from "$lib/machines/game";

  export let state: GameActor;
  const { send } = state;

  const { open } = getContext("simple-modal");

  $: currentPage = $state.context.currentPage;
  $: currentPage, window.scrollTo(0, 0);

  function showPreview() {
    open(WikiPagePreview, {
      title: $state.context.targetPage,
      html: $state.context.targetPageHtml,
    });
  }

  $: clicks = $state.context.path?.length ?? 0;
</script>

<svelte:window on:beforeunload|preventDefault={(e) => (e.returnValue = "")} />

<div class="max-w-6xl p-2 m-auto">
  <div class="pt-2 -mb-2">
    <div class="font-libertine [font-variant:small-caps] text-4xl">WikiRace</div>
  </div>
  <div class="flex justify-between sticky top-0 py-2 z-10 bg-white">
    <div>{clicks} {clicks === 1 ? "click" : "clicks"}</div>
    <div class="cursor-help" on:click={showPreview}>
      Goal: {$state.context.targetPage}
    </div>
  </div>
  <WikiPage
    title={currentPage}
    html={$state.context.currentPageHtml}
    on:navigate={(e) => send({ type: "NAVIGATE", title: e.detail })}
  />
</div>
