import { useState } from "react";
import type { Skill } from "../../types";
import { Badge, IconBadge } from "../common/badges";
import EditableCard from "../common/cards/EditableCard";
import TextField from "../common/forms/TextField";
import { Edit, Plus } from "lucide-react";
import IconButton from "../common/buttons/IconButton";

type EditingViewProps = {
  draft: Skill[];
  onChange: (next: Skill[]) => void;
};

function EditingView({ draft, onChange }: EditingViewProps) {
  const [newSkill, setNewSkill] = useState("");

  return (
    <form className="flex flex-col gap-4">
      <div className="flex flex-col gap-2 border-b border-border-subtle pb-3">
        <div className="flex gap-2 items-center">
          <div className="flex-1">
            <TextField
              id="skillInput"
              type="text"
              placeholder="Python"
              value={newSkill}
              onChange={setNewSkill}
            />
          </div>
          <IconButton
            icon={Plus}
            text="Add"
            onClick={() => {}}
            defaultStyle="text-text-secondary"
            hoverStyle="hover:bg-layer-core hover:text-text-primary"
            activeStyle="bg-layer-mantle text-text-secondary"
            activeDuration={200}
          />
        </div>
        <ul className="flex flex-wrap gap-2">
          {draft.map((name) => (
            <IconBadge icon={Edit} name={name.name} onClick={() => {}} />
          ))}
        </ul>
      </div>
    </form>
  );
}

type DefailsViewProps = {
  skills: Skill[];
};

function DetailsView({ skills }: DefailsViewProps) {
  console.log(skills);
  return (
    <div className="flex flex-col gap-4">
      <div className="border-b border-border-subtle pb-3 pr-8">
        <ul className="flex flex-wrap gap-2">
          {skills.map((skill) => (
            <Badge name={skill.name} />
          ))}
        </ul>
      </div>
    </div>
  );
}

type SkillsProps = {
  skills: Skill[];
};

export default function SkillsCard({ skills }: SkillsProps) {
  const [savedSkills, setSavedSkills] = useState(skills);
  const [draft, setDraft] = useState(skills);

  return (
    <EditableCard
      view={() => <DetailsView skills={savedSkills} />}
      edit={() => <EditingView draft={draft} onChange={setDraft} />}
      onSave={() => {
        setSavedSkills(draft);
      }}
      onCancel={() => setDraft(savedSkills)}
    />
  );
}
