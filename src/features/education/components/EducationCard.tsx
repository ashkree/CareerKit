import { useEffect, useState } from "react";
import { Plus } from "lucide-react";
import type { Education } from "../types";
import BadgeSection from "../../../shared/components/sections/BadgeSection";
import Card from "../../../shared/components/cards/Card";
import TextField from "../../../shared/components/forms/TextField";
import IconButton from "../../../shared/components/buttons/IconButton";
import { RemovableBadge } from "../../../shared/components/badges";
import { updateProp } from "../../../shared/utils/data_updates";
import {
  getEducation,
  insertEducation,
  updateEducation as updateEducationApi,
  deleteEducation,
} from "../api";

function BadgeListEditor({
  items,
  onChange,
  placeholder,
  inputId,
}: {
  items: string[];
  onChange: (next: string[]) => void;
  placeholder: string;
  inputId: string;
}) {
  const [input, setInput] = useState("");

  return (
    <div className="flex flex-col gap-2">
      <div className="flex gap-2 items-center">
        <div className="flex-1">
          <TextField
            id={inputId}
            type="text"
            placeholder={placeholder}
            value={input}
            onChange={setInput}
          />
        </div>
        <IconButton
          icon={Plus}
          text="Add"
          onClick={() => {
            if (!input.trim()) return;
            onChange([...items, input.trim()]);
            setInput("");
          }}
          defaultStyle="text-text-secondary"
          hoverStyle="hover:bg-layer-core hover:text-text-primary"
          activeStyle="bg-layer-mantle text-text-secondary"
          activeDuration={200}
        />
      </div>
      <ul className="flex flex-wrap gap-2">
        {items.map((item, i) => (
          <RemovableBadge
            key={i}
            name={item}
            onClick={() => {
              onChange(items.filter((_, j) => j !== i));
            }}
          />
        ))}
      </ul>
    </div>
  );
}

function EducationItem({
  draft,
  onChange,
  onSave,
  onCancel,
  onDelete,
  defaultEditing,
}: {
  draft: Education;
  onChange: (next: Education) => void;
  onSave: () => boolean | void | Promise<boolean | void>;
  onCancel: () => void;
  onDelete?: () => void;
  defaultEditing?: boolean;
}) {
  return (
    <Card
      onSave={onSave}
      onCancel={onCancel}
      onDelete={onDelete}
      defaultEditing={defaultEditing}
    >
      <Card.Section>
        <Card.Section.View>
          <h3 className="text-text-primary font-bold text-lg">
            {draft.qualification}
          </h3>
          <p className="text-text-secondary">
            {draft.school} &middot; {draft.location.city},{" "}
            {draft.location.country}
          </p>
        </Card.Section.View>

        <Card.Section.Edit>
          <div className="grid grid-cols-2 gap-2">
            <TextField
              id="schoolField"
              label="School"
              value={draft.school}
              onChange={(value) =>
                onChange(updateProp(draft, "school", value))
              }
              placeholder="University of Technology"
            />
            <TextField
              id="qualificationField"
              label="Qualification"
              value={draft.qualification}
              onChange={(value) =>
                onChange(updateProp(draft, "qualification", value))
              }
              placeholder="Bachelor of Science"
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
              placeholder="Boston"
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
              placeholder="USA"
            />
          </div>
        </Card.Section.Edit>
      </Card.Section>

      <Card.Section title="Duration">
        <Card.Section.View>
          <p className="text-text-secondary">
            {draft.duration.start_date} &ndash; {draft.duration.end_date}
          </p>
        </Card.Section.View>

        <Card.Section.Edit>
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
              placeholder="2017-09"
              helperText="e.g. 2017-09"
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
              placeholder="2021-06"
              helperText="e.g. 2021-06"
            />
          </div>
        </Card.Section.Edit>
      </Card.Section>

      <Card.Section title="Specializations">
        <Card.Section.View>
          <ul className="list-disc list-inside text-text-secondary">
            {draft.specializations.map((s, i) => (
              <li key={i}>{s}</li>
            ))}
          </ul>
        </Card.Section.View>

        <Card.Section.Edit>
          <BadgeListEditor
            items={draft.specializations}
            onChange={(specializations) =>
              onChange(updateProp(draft, "specializations", specializations))
            }
            placeholder="Computer Science"
            inputId="specializationInput"
          />
        </Card.Section.Edit>
      </Card.Section>

      <Card.Section title="Coursework">
        <Card.Section.View>
          <ul className="list-disc list-inside text-text-secondary">
            {draft.coursework.map((c, i) => (
              <li key={i}>{c}</li>
            ))}
          </ul>
        </Card.Section.View>

        <Card.Section.Edit>
          <BadgeListEditor
            items={draft.coursework}
            onChange={(coursework) =>
              onChange(updateProp(draft, "coursework", coursework))
            }
            placeholder="Data Structures"
            inputId="courseworkInput"
          />
        </Card.Section.Edit>
      </Card.Section>

      <BadgeSection
        fieldId="skillInput"
        title="Skills"
        placeholder="Skill"
        arr={draft.skills}
        getLabel={(skill: { name: string }) => skill.name}
        onAddBadge={(value) => onChange(updateProp(draft, "skills", [...draft.skills, { name: value }]))}
        onRemoveBadge={(index) => onChange(updateProp(draft, "skills", draft.skills.filter((_, i) => i !== index)))}
      />
    </Card>
  );
}

const emptyEducation = (): Education => ({
  school: "",
  qualification: "",
  specializations: [],
  duration: { start_date: "", end_date: "" },
  location: { city: "", country: "" },
  coursework: [],
  skills: [],
});

export default function EducationCard() {
  const [savedEducation, setSavedEducation] = useState<Education[]>([]);
  const [draft, setDraft] = useState<Education[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadEducation();
  }, []);

  async function loadEducation() {
    try {
      const entries = await getEducation();
      const initial = entries ?? [];
      setSavedEducation(initial);
      setDraft(initial);
    } catch (err) {
      console.error(err);
      setSavedEducation([]);
      setDraft([]);
    } finally {
      setLoading(false);
    }
  }

  function addEducation() {
    setDraft([...draft, emptyEducation()]);
  }

  function updateEducationItem(index: number, updated: Education) {
    const next = [...draft];
    next[index] = updated;
    setDraft(next);
  }

  function removeEducationItem(index: number) {
    setDraft(draft.filter((_, i) => i !== index));
  }

  function handleSave(index: number) {
    return async () => {
      const entry = draft[index];
      if (entry.id === undefined) {
        await insertEducation(entry);
      } else {
        await updateEducationApi(entry, entry.id);
      }
      await loadEducation();
    };
  }

  function handleCancel(index: number) {
    return () => {
      const saved = savedEducation.find((e) => e.id === draft[index]?.id);
      if (saved) {
        updateEducationItem(index, { ...saved });
      } else {
        removeEducationItem(index);
      }
    };
  }

  function handleDelete(index: number) {
    return async () => {
      const entry = draft[index];
      if (entry.id !== undefined) {
        await deleteEducation(entry.id);
      }
      removeEducationItem(index);
      setSavedEducation(
        savedEducation.filter((e) => e.id !== entry.id),
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
        text="Add Education"
        onClick={addEducation}
        defaultStyle="text-brand-600 border border-border-subtle rounded-lg py-2 px-4"
        hoverStyle="hover:bg-layer-mantle"
      />

      {draft.length === 0 ? (
        <p className="text-text-secondary">No education added yet.</p>
      ) : (
        draft.map((entry, index) => (
          <EducationItem
            key={entry.id ?? `new-${index}`}
            draft={entry}
            onChange={(updated) => updateEducationItem(index, updated)}
            onSave={handleSave(index)}
            onCancel={handleCancel(index)}
            onDelete={
              entry.id !== undefined ? handleDelete(index) : undefined
            }
            defaultEditing={entry.id === undefined}
          />
        ))
      )}
    </div>
  );
}
