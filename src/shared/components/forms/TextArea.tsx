import FormField from "./FormField";

type TextAreaProps = {
  label?: string;
  id: string;
  placeholder?: string;
  value?: string;
  onChange?: (value: string) => void;
  error?: string;
  helperText?: string;
  disabled?: boolean;
  required?: boolean;
  className?: string;
};

export default function TextArea({
  label,
  id,
  placeholder,
  value,
  onChange,
  error,
  helperText,
  disabled,
  required,
  className,
}: TextAreaProps) {
  return (
    <FormField
      label={label}
      htmlFor={id}
      error={error}
      helperText={helperText}
      required={required}
      className={className}
    >
      <textarea
        id={id}
        placeholder={placeholder}
        value={value}
        disabled={disabled}
        onChange={(e) => onChange?.(e.target.value)}
        className="min-h-26 py-2 px-3 rounded-md text-sm outline-none border transition-colors duration-200"
        style={{
          backgroundColor: disabled
            ? "var(--color-interactive-disabled)"
            : "var(--color-layer-crust)",
          color: disabled
            ? "var(--color-interactive-disabled-text)"
            : "var(--color-text-primary)",
          borderColor: error
            ? "var(--color-danger)"
            : "var(--color-border-default)",
          cursor: disabled ? "not-allowed" : "text",
        }}
        onFocus={(e) => {
          if (disabled) return;
          e.currentTarget.style.borderColor = error
            ? "var(--color-danger)"
            : "var(--color-interactive-default)";
          e.currentTarget.style.boxShadow = `0 0 0 3px ${
            error ? "var(--color-danger-border)" : "var(--color-focus-ring)"
          }55`;
        }}
        onBlur={(e) => {
          e.currentTarget.style.boxShadow = "none";
          e.currentTarget.style.borderColor = error
            ? "var(--color-danger)"
            : "var(--color-border-default)";
        }}
      />
    </FormField>
  );
}
