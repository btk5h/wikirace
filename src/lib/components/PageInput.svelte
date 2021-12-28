<script>
  import { createEventDispatcher } from "svelte";

  export let title;
  export let hasError;

  const dispatch = createEventDispatcher();

  $: inputState = title;
  $: borderColor =
    inputState !== title ? "border-yellow-500" : hasError ? "border-red-500" : "border-black";

  function sendChange() {
    if (inputState !== title) {
      dispatch("change", inputState);
    }
  }
</script>

<div class="sizer inline-grid" data-value={inputState}>
  <input
    class="text-center p-2 border-dotted border-b-4 {borderColor}"
    size={1}
    bind:value={inputState}
    on:blur={sendChange}
  />
</div>

<style>
  .sizer::after {
    @apply px-2;
    content: attr(data-value);
    visibility: hidden;
    white-space: pre;
    height: 0;
  }
</style>
