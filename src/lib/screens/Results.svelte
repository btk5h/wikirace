<script lang="ts">
  import type { GameActor } from "$lib/machines/game";

  export let state: GameActor;

  $: clicks = $state.context.path?.length - 1 ?? 0;
</script>

<div class="max-w-6xl p-2 m-auto">
  <div class="pt-2 mb-2">
    <div class="font-libertine [font-variant:small-caps] text-4xl">WikiRace</div>
  </div>
  <p>
    You reached the goal in {clicks}
    {clicks === 1 ? "click" : "clicks"}!
  </p>
  <ol>
    {#each $state.context.path as page}
      <li>{page}</li>
    {/each}
  </ol>
</div>
