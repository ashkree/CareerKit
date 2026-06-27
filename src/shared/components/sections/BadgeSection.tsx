import { useState } from "react";
import EditableCard from "../cards/EditableCard";

import { Badge, RemovableBadge } from "../badges";
import TextField from "../forms/TextField";
import { Plus } from "lucide-react";
import IconButton from "../buttons/IconButton";

type BadgeSectionProps<T> = {
  fieldId: string;
  placeholder: string;
  title: string;
  arr: T[];
  getLabel: (item: T) => string;
  onAddBadge: (value: string) => void;
  onRemoveBadge: (index: number) => void;
};

export default function BadgeSection<T>({
  fieldId,
  placeholder,
  title,
  arr,
  getLabel,
  onAddBadge,
  onRemoveBadge,
}: BadgeSectionProps<T>) {
  const [newBadge, setNewBadge] = useState("");

  return (
    <EditableCard.Section title={title}>
      <EditableCard.Section.View>
        <ul className="flex gap-2">
          {arr.map((item, index) => (
            <Badge key={index} name={getLabel(item)} />
          ))}
        </ul>
      </EditableCard.Section.View>

      <EditableCard.Section.Edit>
        <div className="flex flex-col gap-2">
          <div className="flex gap-2 items-center">
            <div className="flex-1">
              <TextField
                id={fieldId}
                type="text"
                placeholder={placeholder}
                value={newBadge}
                onChange={setNewBadge}
              />
            </div>
            <IconButton
              icon={Plus}
              text="Add"
              onClick={() => {
                if (!newBadge.trim()) return;
                onAddBadge(newBadge.trim());
                setNewBadge("");
              }}
              defaultStyle="text-text-secondary"
              hoverStyle="hover:bg-layer-core hover:text-text-primary"
              activeStyle="bg-layer-mantle text-text-secondary"
              activeDuration={200}
            />
          </div>
          <ul className="flex gap-2">
            {arr.map((item, index) => (
              <RemovableBadge
                key={index}
                name={getLabel(item)}
                onClick={() => onRemoveBadge(index)}
              />
            ))}
          </ul>
        </div>
      </EditableCard.Section.Edit>
    </EditableCard.Section>
  );
}
