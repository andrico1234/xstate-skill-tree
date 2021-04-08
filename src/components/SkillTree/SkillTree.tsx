import { useMachine } from "@xstate/react";
import React, { useEffect } from "react";
import { skillTreeMachine, Skill } from "../../machines/skillTreeMachine";
import { SkillNode } from "../SkillNode/SkillNode";

interface Props {
  title: string;
}

export function SkillTree(props: Props) {
  const { title } = props;
  const [state, send] = useMachine(skillTreeMachine);
  const { skills } = state.context;

  useEffect(() => {
    send("INIT", {
      skills: [
        { id: "html", parentIds: [], hasParent: false },
        { id: "css", parentIds: ["html"] },
      ] as Skill[],
    });
  }, []);

  return (
    <div>
      <div
        onClick={() => {
          send("TOGGLE");
        }}
      >
        <h2>{title}</h2>
      </div>
      {state.matches("active.opened") && (
        <div>
          {Object.entries(skills).map(([id, skill]) => {
            return <SkillNode key={id} skill={skill} skills={skills} />;
          })}
        </div>
      )}
    </div>
  );
}
