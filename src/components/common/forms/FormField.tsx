import { forwardRef } from "react";

type FormFieldProps = {
  label?: string;
  htmlFor?: string;
  required?: boolean;
  error?: string;
  helperText?: string;
  className?: string;
  children: React.ReactNode;
};

const FormField = forwardRef<HTMLDivElement, FormFieldProps>(
  (
    { label, htmlFor, required, error, helperText, className, children },
    ref,
  ) => {
    return (
      <div
        ref={ref}
        className={`flex flex-col gap-1.5 ${className ?? ""}`}
      >
        {label ? (
          <label
            htmlFor={htmlFor}
            className="text-sm font-medium"
            style={{ color: "var(--color-text-primary)" }}
          >
            {label}
            {required ? (
              <span style={{ color: "var(--color-danger)" }}> *</span>
            ) : null}
          </label>
        ) : null}
        {children}
        {error ? (
          <p className="text-xs" style={{ color: "var(--color-danger)" }}>
            {error}
          </p>
        ) : helperText ? (
          <p className="text-xs" style={{ color: "var(--color-text-secondary)" }}>
            {helperText}
          </p>
        ) : null}
      </div>
    );
  },
);

export default FormField;
