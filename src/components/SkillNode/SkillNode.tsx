import { useService } from "@xstate/react";
import React, { useEffect } from "react";
import { SkillService } from "../../machines/skillTreeMachine";

interface Props {
  skill: SkillService;
  skills: Record<string, SkillService>;
}

export function SkillNode(props: Props) {
  const { skill, skills } = props;

  const [state, send] = useService(skill);
  const { parentIds } = state.context;

  const parentMachines = parentIds.map((id) => {
    return skills[id].state;
  });

  const areParentSkillsComplete = parentMachines.every((parentMachine) => {
    return parentMachine.matches("active.completed");
  });

  useEffect(() => {
    if (areParentSkillsComplete) {
      return send("ENABLE");
    }

    return send("DISABLE");
  }, [areParentSkillsComplete, send]);

  return (
    <div onClick={() => send("TOGGLE")}>
      <div />
      <div data-state={state.toStrings().join(" ")}>
        <p style={{ color: "white" }}>Skill</p>
      </div>
    </div>
  );
}
