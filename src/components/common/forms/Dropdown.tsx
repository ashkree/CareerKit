import { useEffect, useRef, useState } from "react";
import { ChevronDown, Check } from "lucide-react";
import FormField from "./FormField";

export type DropdownOption<T extends string = string> = {
  value: T;
  label: string;
  /** Optional leading content, e.g. a flag emoji or icon */
  prefix?: React.ReactNode;
  /** Optional secondary text shown next to the label (e.g. "+971") */
  meta?: string;
};

type DropdownProps<T extends string = string> = {
  label?: string;
  id: string;
  options: DropdownOption<T>[];
  value?: T;
  onChange?: (value: T) => void;
  placeholder?: string;
  error?: string;
  helperText?: string;
  disabled?: boolean;
  required?: boolean;
  /** Renders only the prefix/value in the trigger (no label text) — used when paired inline with another field */
  compact?: boolean;
  className?: string;
};

export default function Dropdown<T extends string = string>({
  label,
  id,
  options,
  value,
  onChange,
  placeholder = "Select...",
  error,
  helperText,
  disabled,
  required,
  compact = false,
  className = "",
}: DropdownProps<T>) {
  const [open, setOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const selected = options.find((o) => o.value === value);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (
        containerRef.current &&
        !containerRef.current.contains(e.target as Node)
      ) {
        setOpen(false);
      }
    }
    function handleEscape(e: KeyboardEvent) {
      if (e.key === "Escape") setOpen(false);
    }
    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("keydown", handleEscape);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleEscape);
    };
  }, []);

  const toggleOpen = () => {
    if (disabled) return;
    setOpen((prev) => !prev);
  };

  const handleSelect = (option: DropdownOption<T>) => {
    onChange?.(option.value);
    setOpen(false);
  };

  return (
    <FormField
      ref={containerRef}
      label={label}
      htmlFor={id}
      error={error}
      helperText={helperText}
      required={required}
      className={className}
    >
      <div className="relative">
        <button
          type="button"
          id={id}
          disabled={disabled}
          aria-haspopup="listbox"
          aria-expanded={open}
          onClick={toggleOpen}
          className="h-9 w-full flex items-center justify-between gap-2 px-3 rounded-md text-sm outline-none border transition-colors duration-200"
          style={{
            backgroundColor: disabled
              ? "var(--color-interactive-disabled)"
              : "var(--color-layer-crust)",
            color: disabled
              ? "var(--color-interactive-disabled-text)"
              : "var(--color-text-primary)",
            borderColor: error
              ? "var(--color-danger)"
              : open
                ? "var(--color-interactive-default)"
                : "var(--color-border-default)",
            boxShadow: open
              ? `0 0 0 3px ${
                  error
                    ? "var(--color-danger-border)"
                    : "var(--color-focus-ring)"
                }55`
              : "none",
            cursor: disabled ? "not-allowed" : "pointer",
          }}
        >
          <span className="flex items-center gap-2 truncate">
            {selected?.prefix}
            {!compact && (
              <span className="truncate">
                {selected ? selected.label : placeholder}
              </span>
            )}
            {compact && selected?.meta ? <span>{selected.meta}</span> : null}
          </span>
          <ChevronDown
            size="1em"
            style={{
              color: "var(--color-text-secondary)",
              transform: open ? "rotate(180deg)" : "none",
              transition: "transform 150ms",
              flexShrink: 0,
            }}
          />
        </button>

        {open ? (
          <ul
            role="listbox"
            className="absolute z-10 mt-1 max-h-60 w-full min-w-fit overflow-auto rounded-md border py-1 text-sm shadow-lg"
            style={{
              backgroundColor: "var(--color-layer-crust)",
              borderColor: "var(--color-border-default)",
            }}
          >
            {options.length === 0 ? (
              <li
                className="px-3 py-2"
                style={{ color: "var(--color-text-tertiary)" }}
              >
                No options
              </li>
            ) : (
              options.map((option) => {
                const isSelected = option.value === value;
                return (
                  <li
                    key={option.value}
                    role="option"
                    aria-selected={isSelected}
                    onClick={() => handleSelect(option)}
                    className="flex items-center justify-between gap-2 px-3 py-2 cursor-pointer transition-colors duration-200"
                    style={{
                      backgroundColor: isSelected
                        ? "var(--color-layer-crust-accent)"
                        : "transparent",
                      color: "var(--color-text-primary)",
                    }}
                    onMouseEnter={(e) => {
                      if (!isSelected)
                        e.currentTarget.style.backgroundColor =
                          "var(--color-layer-mantle)";
                    }}
                    onMouseLeave={(e) => {
                      if (!isSelected)
                        e.currentTarget.style.backgroundColor = "transparent";
                    }}
                  >
                    <span className="flex items-center gap-2 truncate">
                      {option.prefix}
                      <span className="truncate">{option.label}</span>
                      {option.meta ? (
                        <span
                          style={{ color: "var(--color-text-secondary)" }}
                        >
                          {option.meta}
                        </span>
                      ) : null}
                    </span>
                    {isSelected ? (
                      <Check
                        size="1em"
                        style={{ color: "var(--color-brand-600)" }}
                      />
                    ) : null}
                  </li>
                );
              })
            )}
          </ul>
        ) : null}
      </div>
    </FormField>
  );
}
