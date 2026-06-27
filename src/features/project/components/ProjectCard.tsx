import { useEffect, useState } from "react";
import { Plus } from "lucide-react";
import type { Project } from "../types";
import BadgeSection from "../../../shared/components/sections/BadgeSection";
import LinksSection from "../../../shared/components/sections/LinksSection";
import EditableCard from "../../../shared/components/cards/EditableCard";
import TextField from "../../../shared/components/forms/TextField";
import IconButton from "../../../shared/components/buttons/IconButton";
import { RemovableBadge } from "../../../shared/components/badges";
import { updateProp } from "../../../shared/utils/data_updates";
import {
  getProjects,
  insertProject,
  updateProject as updateProjectApi,
  deleteProject,
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
            placeholder="Implemented feature X"
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
            key={i}
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

function ProjectItem({
  draft,
  onChange,
  onSave,
  onCancel,
  onDelete,
  defaultEditing,
}: {
  draft: Project;
  onChange: (next: Project) => void;
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
          <h3 className="text-text-primary font-bold text-lg">{draft.name}</h3>
          <p className="text-text-secondary">{draft.status}</p>
        </EditableCard.Section.View>

        <EditableCard.Section.Edit>
          <div className="grid grid-cols-2 gap-2">
            <TextField
              id="nameField"
              label="Name"
              value={draft.name}
              onChange={(value) => onChange(updateProp(draft, "name", value))}
              placeholder="Portfolio Website"
            />
            <TextField
              id="statusField"
              label="Status"
              value={draft.status}
              onChange={(value) => onChange(updateProp(draft, "status", value))}
              placeholder="Completed"
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
              placeholder="2023-01"
              helperText="e.g. 2023-01"
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
              placeholder="2023-06"
              helperText="e.g. 2023-06"
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
            onChange={(value) =>
              onChange(updateProp(draft, "description", value))
            }
            placeholder="Describe the project..."
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

      <LinksSection
        title="Links"
        links={draft.links}
        onAddLink={() =>
          onChange(
            updateProp(draft, "links", [
              ...draft.links,
              { name: "", url: "" },
            ]),
          )
        }
        onUpdateLink={(index, link) => {
          const updated = draft.links.map((l, i) =>
            i === index ? link : l,
          );
          onChange(updateProp(draft, "links", updated));
        }}
        onRemoveLink={(index) =>
          onChange(
            updateProp(
              draft,
              "links",
              draft.links.filter((_, i) => i !== index),
            ),
          )
        }
      />

      <BadgeSection
        fieldId="skillInput"
        title="Skills"
        placeholder="Skill"
        arr={draft.skills}
        getLabel={(skill: { name: string }) => skill.name}
        onAddBadge={(value) => onChange(updateProp(draft, "skills", [...draft.skills, { name: value }]))}
        onRemoveBadge={(index) => onChange(updateProp(draft, "skills", draft.skills.filter((_, i) => i !== index)))}
      />
    </EditableCard>
  );
}

const emptyProject = (): Project => ({
  name: "",
  description: "",
  status: "",
  highlights: [],
  duration: { start_date: "", end_date: "" },
  links: [],
  skills: [],
});

export default function ProjectCard() {
  const [savedProjects, setSavedProjects] = useState<Project[]>([]);
  const [draft, setDraft] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadProjects();
  }, []);

  async function loadProjects() {
    try {
      const projects = await getProjects();
      const initial = projects ?? [];
      setSavedProjects(initial);
      setDraft(initial);
    } catch (err) {
      console.error(err);
      setSavedProjects([]);
      setDraft([]);
    } finally {
      setLoading(false);
    }
  }

  function addProject() {
    setDraft([...draft, emptyProject()]);
  }

  function updateProjectItem(index: number, updated: Project) {
    const next = [...draft];
    next[index] = updated;
    setDraft(next);
  }

  function removeProjectItem(index: number) {
    setDraft(draft.filter((_, i) => i !== index));
  }

  function handleSave(index: number) {
    return async () => {
      const proj = draft[index];
      if (proj.id === undefined) {
        await insertProject(proj);
      } else {
        await updateProjectApi(proj, proj.id);
      }
      await loadProjects();
    };
  }

  function handleCancel(index: number) {
    return () => {
      const saved = savedProjects.find((p) => p.id === draft[index]?.id);
      if (saved) {
        updateProjectItem(index, { ...saved });
      } else {
        removeProjectItem(index);
      }
    };
  }

  function handleDelete(index: number) {
    return async () => {
      const proj = draft[index];
      if (proj.id !== undefined) {
        await deleteProject(proj.id);
      }
      removeProjectItem(index);
      setSavedProjects(
        savedProjects.filter((p) => p.id !== proj.id),
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
        text="Add Project"
        onClick={addProject}
        defaultStyle="text-brand-600 border border-border-subtle rounded-lg py-2 px-4"
        hoverStyle="hover:bg-layer-mantle"
      />

      {draft.length === 0 ? (
        <p className="text-text-secondary">No projects added yet.</p>
      ) : (
        draft.map((proj, index) => (
          <ProjectItem
            key={proj.id ?? `new-${index}`}
            draft={proj}
            onChange={(updated) => updateProjectItem(index, updated)}
            onSave={handleSave(index)}
            onCancel={handleCancel(index)}
            onDelete={proj.id !== undefined ? handleDelete(index) : undefined}
            defaultEditing={proj.id === undefined}
          />
        ))
      )}
    </div>
  );
}
