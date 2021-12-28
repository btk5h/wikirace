import { assign, createMachine, send, spawn } from "xstate";
import type { ActorRef } from "xstate";
import { randomPage, resolvePage } from "$lib/utils/wikipedia";

interface PageValidationContext {
  title: string;
  error: string | null;
}

type PageValidationEvent = { type: "CHANGE"; title: string } | { type: "CHANGE_RANDOM" };

const pageValidationMachine = createMachine<PageValidationContext, PageValidationEvent>({
  initial: "validating",
  context: {
    title: "",
    error: null,
  },
  states: {
    validating: {
      invoke: {
        src: (context, _) => resolvePage(context.title),
        onDone: [
          {
            target: "validated",
            actions: assign((_, event) => ({ title: event.data })),
            cond: (_, event) => !!event.data,
          },
          {
            target: "validated",
            actions: assign({ error: "Page doesn't exist" }),
          },
        ],
      },
    },
    selectingRandom: {
      invoke: {
        src: randomPage,
        onDone: {
          target: "validated",
          actions: assign((_, event) => ({ title: event.data, error: null })),
        },
      },
    },
    validated: {},
  },
  on: {
    CHANGE: {
      target: "validating",
      actions: assign((_, event) => ({
        title: event.title,
        error: null,
      })),
    },
    CHANGE_RANDOM: "selectingRandom",
  },
});

type PageValidationActor = ActorRef<PageValidationEvent>;

function isPageReady(pageActor: PageValidationActor) {
  const state = pageActor.getSnapshot();
  return state.value === "validated" && !!state.context.title && !state.context.error;
}

export function pageState(pageActor: PageValidationActor): PageValidationContext {
  return pageActor.getSnapshot().context;
}

interface GameSetupContext {
  fromPage: PageValidationActor;
  toPage: PageValidationActor;
}

type GameSetupEvent =
  | { type: "CHANGE_FROM_PAGE"; value: string }
  | { type: "RANDOM_FROM_PAGE" }
  | { type: "CHANGE_TO_PAGE"; value: string }
  | { type: "RANDOM_TO_PAGE" }
  | { type: "START_GAME" };

export const gameSetupMachine = createMachine<GameSetupContext, GameSetupEvent>({
  id: "gameSetup",
  initial: "inMenu",
  context: {
    fromPage: null,
    toPage: null,
  },
  entry: assign({
    fromPage: () => spawn(pageValidationMachine, { name: "fromPage", sync: true }),
    toPage: () => spawn(pageValidationMachine, { name: "toPage", sync: true }),
  }),
  states: {
    inMenu: {
      on: {
        START_GAME: {
          target: "ready",
          cond: (context, _) => isPageReady(context.fromPage) && isPageReady(context.toPage),
        },
      },
    },
    ready: {
      type: "final",
      data: (context, _) => ({
        fromPage: pageState(context.fromPage).title,
        toPage: pageState(context.toPage).title,
      }),
    },
  },
  on: {
    CHANGE_FROM_PAGE: {
      actions: send((_, event) => ({ type: "CHANGE", title: event.value }), { to: "fromPage" }),
    },
    RANDOM_FROM_PAGE: {
      actions: send("CHANGE_RANDOM", { to: "fromPage" }),
    },
    CHANGE_TO_PAGE: {
      actions: send((_, event) => ({ type: "CHANGE", title: event.value }), { to: "toPage" }),
    },
    RANDOM_TO_PAGE: {
      actions: send("CHANGE_RANDOM", { to: "toPage" }),
    },
  },
});

export type GameSetupActor = ActorRef<GameSetupEvent>;
