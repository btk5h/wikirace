import { createMachine } from "xstate";
import { gameSetupMachine } from "$lib/machines/setup";
import { gameMachine } from "$lib/machines/game";
import { resultsMachine } from "$lib/machines/results";

export const rootMachine = createMachine<any, any>({
  id: "wikirace-root",
  initial: "menu",
  states: {
    menu: {
      invoke: {
        id: "gameSetup",
        src: gameSetupMachine,
        onDone: "playing",
      },
    },
    playing: {
      invoke: {
        id: "game",
        src: gameMachine,
        data: (_, event) => ({
          startPage: event.data.fromPage,
          targetPage: event.data.toPage,
        }),
        onDone: "viewingResults",
      },
    },
    viewingResults: {
      invoke: {
        id: "results",
        src: resultsMachine,
        data: (_, event) => ({
          path: event.data.path,
        }),
      },
    },
  },
});
