import { assign, createMachine } from "xstate";
import type { ActorRef } from "xstate";
import { fetchPage } from "$lib/utils/wikipedia";

interface GameContext {
  startPage: string;
  currentPage: string;
  currentPageHtml: string;
  nextPage: string;
  targetPage: string;
  targetPageHtml: string;
  path: string[];
}

type GameEvent = { type: "NAVIGATE"; title: string };

export const gameMachine = createMachine<GameContext, GameEvent>({
  id: "game",
  context: {
    startPage: null,
    currentPage: null,
    currentPageHtml: null,
    nextPage: null,
    targetPage: null,
    targetPageHtml: null,
    path: [],
  },
  initial: "initialLoad",
  states: {
    initialLoad: {
      invoke: {
        src: (context) =>
          Promise.all([fetchPage(context.startPage), fetchPage(context.targetPage)]),
        onDone: {
          target: "waitingForInput",
          actions: assign((_, event) => ({
            currentPage: event.data[0].title,
            currentPageHtml: event.data[0].html,
            targetPageHtml: event.data[1].html,
            // TODO: figure out why this is needed, shouldn't the default context already set this?
            path: [],
          })),
        },
      },
    },
    navigating: {
      invoke: {
        src: (context) => fetchPage(context.nextPage),
        onDone: [
          {
            target: "victory",
            cond: (context, event) => context.targetPage === event.data.title,
          },
          {
            target: "waitingForInput",
            actions: assign((context, event) => ({
              currentPage: event.data.title,
              currentPageHtml: event.data.html,
              nextPage: null,
              path: [...context.path, event.data.title],
            })),
          },
        ],
      },
    },
    waitingForInput: {
      on: {
        NAVIGATE: {
          target: "navigating",
          actions: assign((_, event) => ({
            nextPage: event.title,
          })),
        },
      },
    },
    victory: {
      type: "final",
      data: (context) => ({
        path: [context.startPage, ...context.path, context.targetPage],
      }),
    },
  },
});

export type GameActor = ActorRef<GameEvent>;
