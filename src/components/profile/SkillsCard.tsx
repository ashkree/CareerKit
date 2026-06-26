import { Dispatch, SetStateAction, useEffect, useState } from "react";
import type { Skill } from "../../types";
import { Badge, IconBadge } from "../common/badges";
import EditableCard from "../common/cards/EditableCard";
import TextField from "../common/forms/TextField";
import { Plus, X } from "lucide-react";
import IconButton from "../common/buttons/IconButton";
import { invoke } from "@tauri-apps/api/core";
import { diffArrays } from "../../utilities/helpers";

type EditingViewProps = {
  draft: Skill[];
  onChange: Dispatch<SetStateAction<Skill[]>>;
};

function EditingView({ draft, onChange }: EditingViewProps) {
  const [newSkill, setNewSkill] = useState<string>("");

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
            onClick={() => {
              if (!newSkill.trim()) return;
              onChange((prev) => [...prev, { name: newSkill }]);
              setNewSkill("");
            }}
            defaultStyle="text-text-secondary"
            hoverStyle="hover:bg-layer-core hover:text-text-primary"
            activeStyle="bg-layer-mantle text-text-secondary"
            activeDuration={200}
          />
        </div>
        <ul className="flex flex-wrap gap-2">
          {draft.map((skill, index) => (
            <IconBadge
              icon={X}
              name={skill.name}
              onClick={() => {
                onChange((prev) => prev.filter((_, i) => i != index));
              }}
            />
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

async function getSkills() {
  return await invoke<Skill[] | null>("get_skills");
}

async function insertSkills(skills: Skill[]) {
  return await invoke<void>("insert_skills", { skills });
}

async function deleteSkills(skills: Skill[]) {
  return await invoke<void>("delete_skills", { skills });
}
export default function SkillsCard() {
  const [savedSkills, setSavedSkills] = useState<Skill[]>([]);
  const [draft, setDraft] = useState<Skill[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadSkills() {
      try {
        const skills = await getSkills();
        const initialProfile = skills ?? [];

        setSavedSkills(initialProfile);
        setDraft(initialProfile);
      } catch (err) {
        console.error(err);

        setSavedSkills([]);
        setDraft([]);
      } finally {
        setLoading(false);
      }
    }

    loadSkills();
  }, []);

  function handleCancel() {
    setDraft(savedSkills);
  }

  async function handleSave() {
    const { toSave, toDelete } = diffArrays(
      draft,
      savedSkills,
      (skill) => skill.name,
    );

    await insertSkills(toSave);
    await deleteSkills(toDelete);
    setSavedSkills(draft);
  }

  if (loading) {
    return <p>Loading...</p>;
  }

  return (
    <EditableCard
      view={() => <DetailsView skills={savedSkills} />}
      edit={() => <EditingView draft={draft} onChange={setDraft} />}
      onSave={handleSave}
      onCancel={handleCancel}
    />
  );
}
