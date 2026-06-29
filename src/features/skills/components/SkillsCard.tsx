import { useEffect, useState } from "react";
import type { Skill } from "../types";
import Card from "../../../shared/components/cards/Card";
import BadgeSection from "../../../shared/components/sections/BadgeSection";
import { diffArrays } from "../../../shared/utils/helpers";
import { getSkills, insertSkills, deleteSkills } from "../api";

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
    <Card onSave={handleSave} onCancel={handleCancel}>
      <BadgeSection
        fieldId="skillInput"
        title="Skills"
        placeholder="Skill"
        arr={draft}
        getLabel={(skill: Skill) => skill.name}
        onAddBadge={(value) => setDraft([...draft, { name: value }])}
        onRemoveBadge={(index) => setDraft(draft.filter((_, i) => i !== index))}
      />
    </Card>
  );
}
