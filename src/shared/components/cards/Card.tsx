import { createContext, ReactNode, useContext, useState } from "react";
import IconButton from "../buttons/IconButton";
import IconText from "../IconText";
import { Save, SquarePen, Trash, X } from "lucide-react";

type CardContextType = {
  isEditing: boolean;
  setIsEditing: (v: boolean) => void;
};

const CardContext = createContext<CardContextType | null>(null);

type CardProps = {
  onSave: () => boolean | void | Promise<boolean | void>;
  onCancel?: () => void;
  onDelete?: () => void;
  defaultEditing?: boolean;
  variant?: "editable" | "form";
  saveDisabled?: boolean;
  children: ReactNode;
};

function Card({
  onSave,
  onCancel,
  onDelete,
  defaultEditing = false,
  variant = "editable",
  saveDisabled,
  children,
}: CardProps) {
  const [isEditing, setIsEditing] = useState(defaultEditing);

  const effectiveIsEditing = variant === "form" ? true : isEditing;

  return (
    <CardContext.Provider
      value={{ isEditing: effectiveIsEditing, setIsEditing }}
    >
      <div className="relative bg-layer-crust p-4 border border-border-subtle rounded-xl flex flex-col gap-2">
        {children}
        {variant === "form" ? (
          <div className="flex items-center justify-end gap-2">
            {saveDisabled ? (
              <span
                className="flex items-center gap-2 p-1.5 rounded-md opacity-40 cursor-not-allowed select-none"
                style={{ color: "var(--color-success)" }}
              >
                <IconText icon={Save} text="Save" />
              </span>
            ) : (
              <IconButton
                icon={Save}
                text="Save"
                onClick={() => {
                  onSave();
                }}
                defaultStyle="text-success"
                hoverStyle="hover:bg-success-bg"
              />
            )}
          </div>
        ) : effectiveIsEditing ? (
          <div className="flex items-center justify-end gap-2">
            {onDelete && (
              <IconButton
                icon={Trash}
                text="Delete"
                onClick={onDelete}
                defaultStyle="text-danger"
                hoverStyle="hover:bg-danger-bg"
              />
            )}
            <IconButton
              icon={X}
              text="Cancel"
              onClick={() => {
                setIsEditing(false);
                onCancel?.();
              }}
              defaultStyle="text-text-secondary"
              hoverStyle="hover:bg-layer-mantle hover:text-text-primary"
            />
            {saveDisabled ? (
              <span
                className="flex items-center gap-2 p-1.5 rounded-md opacity-40 cursor-not-allowed select-none"
                style={{ color: "var(--color-success)" }}
              >
                <IconText icon={Save} text="Save" />
              </span>
            ) : (
              <IconButton
                icon={Save}
                text="Save"
                onClick={() => {
                  setIsEditing(false);
                  onSave();
                }}
                defaultStyle="text-success"
                hoverStyle="hover:bg-success-bg"
              />
            )}
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
    </CardContext.Provider>
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
        <h4 className="text-text-secondary font-bold text-lg pb-2">{title}</h4>
      )}
      {children}
    </div>
  );
}

function SectionView({ children }: { children: ReactNode }) {
  const ctx = useContext(CardContext);
  if (!ctx) throw new Error("Section.View must be used inside Card");
  if (ctx.isEditing) return null;
  return <>{children}</>;
}

function SectionEdit({ children }: { children: ReactNode }) {
  const ctx = useContext(CardContext);
  if (!ctx) throw new Error("Section.Edit must be used inside Card");
  if (!ctx.isEditing) return null;
  return <>{children}</>;
}

Section.View = SectionView;
Section.Edit = SectionEdit;
Card.Section = Section;

export default Card;
