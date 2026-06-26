import { useEffect, useState } from "react";
import { Plus } from "lucide-react";
import type { Experience } from "../types";
import EditableCard from "../../../shared/components/cards/EditableCard";
import TextField from "../../../shared/components/forms/TextField";
import IconButton from "../../../shared/components/buttons/IconButton";
import { RemovableBadge } from "../../../shared/components/badges";
import { updateProp } from "../../../shared/utils/data_updates";
import {
  getExperiences,
  insertExperience,
  updateExperience as updateExperienceApi,
  deleteExperience,
} from "../api";

function HighlightsEditor({
  highlights,
  onChange,
}: {
  highlights: string[];
  onChange: (next: string[]) => void;
}) {
  const [input, setInput] = useState("");

  return (
    <div className="flex flex-col gap-2">
      <div className="flex gap-2 items-center">
        <div className="flex-1">
          <TextField
            id="highlightInput"
            type="text"
            placeholder="Reduced load time by 40%"
            value={input}
            onChange={setInput}
          />
        </div>
        <IconButton
          icon={Plus}
          text="Add"
          onClick={() => {
            if (!input.trim()) return;
            onChange([...highlights, input.trim()]);
            setInput("");
          }}
          defaultStyle="text-text-secondary"
          hoverStyle="hover:bg-layer-core hover:text-text-primary"
          activeStyle="bg-layer-mantle text-text-secondary"
          activeDuration={200}
        />
      </div>
      <ul className="flex flex-wrap gap-2">
        {highlights.map((h, i) => (
          <RemovableBadge
            name={h}
            onClick={() => {
              onChange(highlights.filter((_, j) => j !== i));
            }}
          />
        ))}
      </ul>
    </div>
  );
}

function ExperienceItem({
  draft,
  onChange,
  onSave,
  onCancel,
  onDelete,
  defaultEditing,
}: {
  draft: Experience;
  onChange: (next: Experience) => void;
  onSave: () => boolean | void | Promise<boolean | void>;
  onCancel: () => void;
  onDelete?: () => void;
  defaultEditing?: boolean;
}) {
  return (
    <EditableCard
      onSave={onSave}
      onCancel={onCancel}
      onDelete={onDelete}
      defaultEditing={defaultEditing}
    >
      <EditableCard.Section>
        <EditableCard.Section.View>
          <h3 className="text-text-primary font-bold text-lg">{draft.role}</h3>
          <p className="text-text-secondary">
            {draft.company} &middot; {draft.location.city},{" "}
            {draft.location.country}
          </p>
        </EditableCard.Section.View>

        <EditableCard.Section.Edit>
          <div className="grid grid-cols-2 gap-2">
            <TextField
              id="roleField"
              label="Role"
              value={draft.role}
              onChange={(value) => onChange(updateProp(draft, "role", value))}
              placeholder="Software Engineer"
            />
            <TextField
              id="companyField"
              label="Company"
              value={draft.company}
              onChange={(value) => onChange(updateProp(draft, "company", value))}
              placeholder="Acme Corp"
            />
          </div>
          <div className="grid grid-cols-2 gap-2 mt-2">
            <TextField
              id="cityField"
              label="City"
              value={draft.location.city}
              onChange={(value) =>
                onChange(
                  updateProp(
                    draft,
                    "location",
                    updateProp(draft.location, "city", value),
                  ),
                )
              }
              placeholder="San Francisco"
            />
            <TextField
              id="countryField"
              label="Country"
              value={draft.location.country}
              onChange={(value) =>
                onChange(
                  updateProp(
                    draft,
                    "location",
                    updateProp(draft.location, "country", value),
                  ),
                )
              }
              placeholder="United States"
            />
          </div>
        </EditableCard.Section.Edit>
      </EditableCard.Section>

      <EditableCard.Section title="Duration">
        <EditableCard.Section.View>
          <p className="text-text-secondary">
            {draft.duration.start_date} &ndash; {draft.duration.end_date}
          </p>
        </EditableCard.Section.View>

        <EditableCard.Section.Edit>
          <div className="grid grid-cols-2 gap-2">
            <TextField
              id="startDateField"
              label="Start Date"
              value={draft.duration.start_date}
              onChange={(value) =>
                onChange(
                  updateProp(
                    draft,
                    "duration",
                    updateProp(draft.duration, "start_date", value),
                  ),
                )
              }
              placeholder="2021-03"
              helperText="e.g. 2021-03"
            />
            <TextField
              id="endDateField"
              label="End Date"
              value={draft.duration.end_date}
              onChange={(value) =>
                onChange(
                  updateProp(
                    draft,
                    "duration",
                    updateProp(draft.duration, "end_date", value),
                  ),
                )
              }
              placeholder="2024-11"
              helperText="e.g. 2024-11"
            />
          </div>
        </EditableCard.Section.Edit>
      </EditableCard.Section>

      <EditableCard.Section title="Description">
        <EditableCard.Section.View>
          <p className="text-text-secondary">{draft.description}</p>
        </EditableCard.Section.View>

        <EditableCard.Section.Edit>
          <TextField
            id="descriptionField"
            label="Description"
            value={draft.description}
            onChange={(value) => onChange(updateProp(draft, "description", value))}
            placeholder="Describe your responsibilities and achievements..."
          />
        </EditableCard.Section.Edit>
      </EditableCard.Section>

      <EditableCard.Section title="Highlights">
        <EditableCard.Section.View>
          <ul className="list-disc list-inside text-text-secondary">
            {draft.highlights.map((h, i) => (
              <li key={i}>{h}</li>
            ))}
          </ul>
        </EditableCard.Section.View>

        <EditableCard.Section.Edit>
          <HighlightsEditor
            highlights={draft.highlights}
            onChange={(highlights) =>
              onChange(updateProp(draft, "highlights", highlights))
            }
          />
        </EditableCard.Section.Edit>
      </EditableCard.Section>
    </EditableCard>
  );
}

const emptyExperience = (): Experience => ({
  role: "",
  company: "",
  location: { city: "", country: "" },
  description: "",
  highlights: [],
  duration: { start_date: "", end_date: "" },
});

export default function ExperienceCard() {
  const [savedExperiences, setSavedExperiences] = useState<Experience[]>([]);
  const [draft, setDraft] = useState<Experience[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadExperiences();
  }, []);

  async function loadExperiences() {
    try {
      const exps = await getExperiences();
      const initial = exps ?? [];
      setSavedExperiences(initial);
      setDraft(initial);
    } catch (err) {
      console.error(err);
      setSavedExperiences([]);
      setDraft([]);
    } finally {
      setLoading(false);
    }
  }

  function addExperience() {
    setDraft([...draft, emptyExperience()]);
  }

  function updateExperienceItem(index: number, updated: Experience) {
    const next = [...draft];
    next[index] = updated;
    setDraft(next);
  }

  function removeExperienceItem(index: number) {
    setDraft(draft.filter((_, i) => i !== index));
  }

  function handleSave(index: number) {
    return async () => {
      const exp = draft[index];
      if (exp.id === undefined) {
        await insertExperience(exp);
      } else {
        await updateExperienceApi(exp, exp.id);
      }
      await loadExperiences();
    };
  }

  function handleCancel(index: number) {
    return () => {
      const saved = savedExperiences.find((e) => e.id === draft[index]?.id);
      if (saved) {
        updateExperienceItem(index, { ...saved });
      } else {
        removeExperienceItem(index);
      }
    };
  }

  function handleDelete(index: number) {
    return async () => {
      const exp = draft[index];
      if (exp.id !== undefined) {
        await deleteExperience(exp.id);
      }
      removeExperienceItem(index);
      setSavedExperiences(
        savedExperiences.filter((e) => e.id !== exp.id),
      );
    };
  }

  if (loading) {
    return <p>Loading...</p>;
  }

  return (
    <div className="flex flex-col gap-4">
      <IconButton
        icon={Plus}
        text="Add Experience"
        onClick={addExperience}
        defaultStyle="text-brand-600 border border-border-subtle rounded-lg py-2 px-4"
        hoverStyle="hover:bg-layer-mantle"
      />

      {draft.length === 0 ? (
        <p className="text-text-secondary">No experience added yet.</p>
      ) : (
        draft.map((exp, index) => (
          <ExperienceItem
            key={exp.id ?? `new-${index}`}
            draft={exp}
            onChange={(updated) => updateExperienceItem(index, updated)}
            onSave={handleSave(index)}
            onCancel={handleCancel(index)}
            onDelete={exp.id !== undefined ? handleDelete(index) : undefined}
            defaultEditing={exp.id === undefined}
          />
        ))
      )}
    </div>
  );
}
