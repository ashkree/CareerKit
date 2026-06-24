import FormField from "./FormField";

type TextFieldProps = {
  label?: string;
  id: string;
  type?: "text" | "email" | "tel" | "url";
  placeholder?: string;
  value?: string;
  onChange?: (value: string) => void;
  error?: string;
  helperText?: string;
  disabled?: boolean;
  required?: boolean;
  className?: string;
};

export default function TextField({
  label,
  id,
  type = "text",
  placeholder,
  value,
  onChange,
  error,
  helperText,
  disabled,
  required,
  className,
}: TextFieldProps) {
  return (
    <FormField
      label={label}
      htmlFor={id}
      error={error}
      helperText={helperText}
      required={required}
      className={className}
    >
      <input
        id={id}
        type={type}
        placeholder={placeholder}
        value={value}
        disabled={disabled}
        onChange={(e) => onChange?.(e.target.value)}
        className="h-9 px-3 rounded-md text-sm outline-none border transition-colors duration-200"
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
