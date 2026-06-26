import { Dispatch, SetStateAction, useEffect, useState } from "react";
import type { Skill } from "../types";
import { Badge, IconBadge } from "../../../shared/components/badges";
import EditableCard from "../../../shared/components/cards/EditableCard";
import TextField from "../../../shared/components/forms/TextField";
import { Plus, X } from "lucide-react";
import IconButton from "../../../shared/components/buttons/IconButton";
import { diffArrays } from "../../../shared/utils/helpers";
import { getSkills, insertSkills, deleteSkills } from "../api";

function SkillsSection({
  draft,
  onChange,
}: {
  draft: Skill[];
  onChange: Dispatch<SetStateAction<Skill[]>>;
}) {
  const [newSkill, setNewSkill] = useState("");

  return (
    <EditableCard.Section>
      <EditableCard.Section.View>
        {draft.length === 0 ? (
          <p className="text-text-secondary">No skills added yet. Click the edit button to add your first skill.</p>
        ) : (
          <ul className="flex flex-wrap gap-2">
            {draft.map((skill) => (
              <Badge name={skill.name} />
            ))}
          </ul>
        )}
      </EditableCard.Section.View>

      <EditableCard.Section.Edit>
        <div className="flex flex-col gap-2">
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
      </EditableCard.Section.Edit>
    </EditableCard.Section>
  );
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
    <EditableCard onSave={handleSave} onCancel={handleCancel}>
      <SkillsSection draft={draft} onChange={setDraft} />
    </EditableCard>
  );
}
