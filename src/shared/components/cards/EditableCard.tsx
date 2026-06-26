import { createContext, ReactNode, useContext, useState } from "react";
import IconButton from "../buttons/IconButton";
import { Save, SquarePen, X } from "lucide-react";

type EditableCardContextType = {
  isEditing: boolean;
  setIsEditing: (v: boolean) => void;
};

const EditableCardContext = createContext<EditableCardContextType | null>(null);

type EditableCardProps = {
  onSave: () => boolean | void | Promise<boolean | void>;
  onCancel: () => void;
  children: ReactNode;
};

function EditableCard({ onSave, onCancel, children }: EditableCardProps) {
  const [isEditing, setIsEditing] = useState(false);

  return (
    <EditableCardContext.Provider value={{ isEditing, setIsEditing }}>
      {children}
      <div className="relative bg-layer-crust p-4 border border-border-subtle rounded-xl flex flex-col gap-2">
        {isEditing ? (
          <div className="flex items-center justify-end gap-2">
            <IconButton
              icon={X}
              text="Cancel"
              onClick={onCancel}
              defaultStyle="text-text-secondary"
              hoverStyle="hover:bg-layer-mantle hover:text-text-primary"
            />
            <IconButton
              icon={Save}
              text="Save"
              onClick={onSave}
              defaultStyle="text-success"
              hoverStyle="hover:bg-success-bg"
            />
          </div>
        ) : (
          <div className="absolute top-4 right-4">
            <IconButton
              icon={SquarePen}
              onClick={() => setIsEditing(true)}
              defaultStyle="text-text-secondary"
              hoverStyle="hover:bg-layer-mantle hover:text-brand-600"
            />
          </div>
        )}
      </div>
    </EditableCardContext.Provider>
  );
}

type SectionProps = {
  title?: string | null;
  children: ReactNode;
};

function Section({ title, children }: SectionProps) {
  return (
    <div className="border-b border-border-subtle pb-3">
      {title && (
        <h3 className="text-text-secondary font-bold text-md pb-2">{title}</h3>
      )}
      {children}
    </div>
  );
}

function SectionView({ children }: { children: ReactNode }) {
  const ctx = useContext(EditableCardContext);
  if (!ctx) throw new Error("Section.View must be used inside EditableCard");
  if (ctx.isEditing) return null;
  return <>{children}</>;
}

function SectionEdit({ children }: { children: ReactNode }) {
  const ctx = useContext(EditableCardContext);
  if (!ctx) throw new Error("Section.Edit must be used inside EditableCard");
  if (!ctx.isEditing) return null;
  return <>{children}</>;
}

Section.View = SectionView;
Section.Edit = SectionEdit;
EditableCard.Section = Section;

export default EditableCard;
