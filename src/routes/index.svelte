<script>
  import { rootMachine } from "$lib/machines/root";
  import { useMachine } from "@xstate/svelte";
  import Modal from "svelte-simple-modal";
  import Menu from "$lib/screens/Menu.svelte";
  import Game from "$lib/screens/Game.svelte";
  import Results from "$lib/screens/Results.svelte";

  const { state } = useMachine(rootMachine);
</script>

<svelte:head>
  <title>WikiRace</title>
</svelte:head>

<Modal>
  {#if $state.value === "menu"}
    <Menu state={$state.children.gameSetup} />
  {:else if $state.value === "playing"}
    <Game state={$state.children.game} />
  {:else if $state.value === "viewingResults"}
    <Results state={$state.children.results} />
  {/if}
</Modal>
