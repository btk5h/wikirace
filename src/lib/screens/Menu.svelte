<script lang="ts">
  import PageInput from "$lib/components/PageInput.svelte";
  import type { GameSetupActor } from "$lib/machines/setup";
  import { pageState } from "$lib/machines/setup";
  import Dice from "~icons/fa-solid/dice";

  export let state: GameSetupActor;
  const { send } = state;

  $: ({ title: fromPageTitle, error: fromPageError } = pageState($state.context.fromPage));
  $: ({ title: toPageTitle, error: toPageError } = pageState($state.context.toPage));

  send("RANDOM_FROM_PAGE");
  send("RANDOM_TO_PAGE");
</script>

<div class="flex flex-col items-center">
  <div class="font-libertine [font-variant:small-caps] text-6xl mb-6">WikiRace</div>
  <div class="text-xl">Navigate from</div>
  <div class="flex gap-2 pl-6">
    <PageInput
      title={fromPageTitle}
      hasError={!!fromPageError}
      on:change={(e) => send({ type: "CHANGE_FROM_PAGE", value: e.detail })}
    />
    <button on:click={() => send("RANDOM_FROM_PAGE")}><Dice /></button>
  </div>
  <div class="text-xl mt-2">to</div>
  <div class="flex gap-2 pl-6 mb-4">
    <PageInput
      title={toPageTitle}
      hasError={!!toPageError}
      on:change={(e) => send({ type: "CHANGE_TO_PAGE", value: e.detail })}
    />
    <button on:click={() => send("RANDOM_TO_PAGE")}><Dice /></button>
  </div>
  <button
    class="font-libertine [font-variant:small-caps] text-4xl"
    disabled={!$state.can("START_GAME")}
    on:click={() => send("START_GAME")}
  >
    Race!
  </button>
</div>
