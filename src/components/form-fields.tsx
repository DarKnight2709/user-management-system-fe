import type {
  FieldErrors,
  FieldValues,
  Path,
  UseFormRegister,
} from "react-hook-form";
import { Input } from "./ui/input";
export interface FieldDefinition<T extends FieldValues> {
  name: Path<T>;
  label: string;
  type?: string;
  autoComplete?: string;
}
export function FormFields<T extends FieldValues>({
  fields,
  register,
  errors,
  disabled,
}: {
  fields: FieldDefinition<T>[];
  register: UseFormRegister<T>;
  errors: FieldErrors<T>;
  disabled?: boolean;
}) {
  return (
    <>
      {fields.map((field) => {
        const message = errors[field.name]?.message;
        return (
          <div className="space-y-2" key={field.name}>
            <label className="text-sm font-medium" htmlFor={field.name}>
              {field.label}
            </label>
            <Input
              id={field.name}
              type={field.type || "text"}
              autoComplete={field.autoComplete}
              disabled={disabled}
              aria-invalid={Boolean(message)}
              aria-describedby={message ? `${field.name}-error` : undefined}
              {...register(field.name)}
            />
            {typeof message === "string" && (
              <p
                id={`${field.name}-error`}
                role="alert"
                className="text-sm text-red-600"
              >
                {message}
              </p>
            )}
          </div>
        );
      })}
    </>
  );
}
