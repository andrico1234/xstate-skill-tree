import { useService } from "@xstate/react";
import React from "react";
import { SkillService } from "../../machines/skillTreeMachine";

interface Props {
  skill: SkillService;
  skills: Record<string, SkillService>;
}

export function SkillNode(props: Props) {
  const { skill, skills } = props;

  const [state, send] = useService(skill);
  const isComplete = state.matches("active.completed");
  const isLocked = state.matches("disabled");
  const { parentIds } = state.context;

  const parentMachines = parentIds.map((id) => {
    return skills[id].state;
  });

  const areParentSkillsComplete = parentMachines.every((parentMachine) =>
    parentMachine.matches("active.completed")
  );

  // use effect are parent skills complete

  return (
    <div
      onClick={() => {
        if (isLocked) return;

        return send("TOGGLE");
      }}
    >
      <div />
      <div style={{ backgroundColor: isComplete ? "red" : "blue" }}>
        <p style={{ color: "white" }}>Skill</p>
      </div>
    </div>
  );
}
