import { Machine, sendUpdate } from "xstate";
import { Skill } from "./skillTreeMachine";

export type SkillContext = Skill;

export type SkillEvent =
  | {
      type: "TOGGLE";
    }
  | {
      type: "DISABLE";
    }
  | { type: "ENABLE" }
  | { type: "PARENT_UPDATE" };

interface StateSchema {
  states: {
    active: {
      states: {
        uncompleted: {};
        completed: {};
      };
    };
    disabled: {};
  };
}

export const skillMachineFactory = (skill: Skill) => {
  return Machine<SkillContext, StateSchema, SkillEvent>({
    id: skill.id,
    context: {
      id: skill.id,
      parentIds: skill.parentIds,
    },
    initial: "active",
    states: {
      active: {
        initial: "uncompleted",
        on: {
          DISABLE: "disabled",
        },
        states: {
          uncompleted: {
            on: {
              TOGGLE: {
                target: "completed",
                actions: [sendUpdate()],
              },
            },
          },
          completed: {
            on: {
              TOGGLE: {
                target: "uncompleted",
                actions: [sendUpdate()],
              },
            },
          },
        },
      },
      disabled: {
        on: {
          ENABLE: "disabled",
        },
      },
    },
  });
};
