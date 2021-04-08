import { assign, Interpreter, Machine, spawn } from "xstate";
import { skillMachineFactory, SkillEvent } from "./skillMachine";

export type SkillService = Interpreter<Skill, StateSchema, SkillEvent>;

export interface Skill {
  id: string;
  parentIds: string[];
}

export interface Context {
  skills: Record<string, SkillService>;
}

type Events =
  | {
      type: "INIT";
      skills: Skill[];
    }
  | {
      type: "DISABLE";
    }
  | {
      type: "ENABLE";
    }
  | {
      type: "TOGGLE";
    };

interface StateSchema {
  states: {
    idle: {};
    active: {
      states: {
        opened: {};
        closed: {};
      };
    };
    disabled: {};
  };
}

export const skillTreeMachine = Machine<Context, StateSchema, Events>({
  id: "skill-tree",
  initial: "idle",
  context: {
    skills: {},
  },
  states: {
    idle: {
      on: {
        INIT: {
          target: "active",
          actions: assign((context, event) => {
            const { skills } = event;

            const skillActors = skills.reduce((acc, skill) => {
              return {
                ...acc,
                [skill.id]: spawn(skillMachineFactory(skill), {
                  sync: true,
                  name: skill.id,
                }),
              };
            }, {});

            return {
              skills: skillActors,
            };
          }),
        },
      },
    },
    active: {
      initial: "opened",
      on: {
        DISABLE: "disabled",
      },
      states: {
        opened: {
          on: {
            TOGGLE: "closed",
          },
        },
        closed: {
          on: {
            TOGGLE: "opened",
          },
        },
      },
    },
    disabled: {
      on: {
        ENABLE: "active",
      },
    },
  },
});
