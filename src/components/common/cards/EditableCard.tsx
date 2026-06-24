import { useState } from "react";
import { X, Save, SquarePen } from "lucide-react";
import IconButton from "../buttons/IconButton";

type EditableCardRenderProps = {
  isEditing: boolean;
};

type EditableCardProps = {
  /** Renders the read-only view. Receives { isEditing: false } for convenience/symmetry. */
  view: (props: EditableCardRenderProps) => React.ReactNode;
  /** Renders the edit form. Only ever called while isEditing is true. */
  edit: (props: EditableCardRenderProps) => React.ReactNode;

  onSave?: () => boolean | void | Promise<boolean | void>;
  onCancel?: () => void;

  /** Controlled mode: pass these two together if a parent needs to own edit state. */
  isEditing?: boolean;
  onEditingChange?: (isEditing: boolean) => void;

  className?: string;
};

export default function EditableCard({
  view,
  edit,
  onSave,
  onCancel,
  isEditing: controlledIsEditing,
  onEditingChange,
  className = "",
}: EditableCardProps) {
  const [internalIsEditing, setInternalIsEditing] = useState(false);
  const isControlled = controlledIsEditing !== undefined;
  const isEditing = isControlled ? controlledIsEditing : internalIsEditing;

  const setIsEditing = (next: boolean) => {
    if (isControlled) onEditingChange?.(next);
    else setInternalIsEditing(next);
  };

  const handleSave = async () => {
    const result = await onSave?.();
    if (result === false) return; // validation failed, stay open
    setIsEditing(false);
  };

  const handleCancel = () => {
    onCancel?.();
    setIsEditing(false);
  };

  return (
    <div
      className={`relative bg-layer-crust p-4 border border-border-subtle rounded-xl flex flex-col gap-2 ${className}`}
    >
      {isEditing ? edit({ isEditing }) : view({ isEditing })}
      {isEditing ? (
        <div className="border-border-subtle flex items-center justify-end gap-2">
          <IconButton
            icon={X}
            text="Cancel"
            onClick={handleCancel}
            defaultStyle="text-text-secondary"
            hoverStyle="hover:bg-layer-mantle hover:text-text-primary"
          />
          <IconButton
            icon={Save}
            text="Save"
            onClick={handleSave}
            defaultStyle="text-success"
            hoverStyle="hover:bg-success-bg"
          />
        </div>
      ) : (
        <div className="absolute top-4 right-4">
          <IconButton
            icon={SquarePen}
            onClick={() => setIsEditing(!isEditing)}
            defaultStyle="text-text-secondary"
            hoverStyle="hover:bg-layer-mantle hover:text-brand-600"
          />
        </div>
      )}
    </div>
  );
}
