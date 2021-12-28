import { createMachine } from "xstate";
import type { ActorRef } from "xstate";

interface ResultsContext {
  path: string[];
}

export const resultsMachine = createMachine<ResultsContext>({
  id: "results",
  initial: "showingResults",
  context: {
    path: [],
  },
  states: {
    showingResults: {},
  },
});

export type ResultsActor = ActorRef<never>;
