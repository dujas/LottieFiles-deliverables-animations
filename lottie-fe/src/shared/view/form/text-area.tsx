import { Controller, useFormContext } from "react-hook-form";
import { Textarea } from "../components/ui/textarea";
import { Label } from "../components/ui/label";

type FormTextareaProps = {
  name: string;
  placeholder: string;
  max?: number;
};

export const FormTextarea = ({ name, placeholder, max }: FormTextareaProps) => {
  const { control } = useFormContext();
  return (
    <Controller
      control={control}
      name={name}
      render={({ field: { onChange, ...restField } }) => {
        return (
          <>
            <Label htmlFor={name} className="text-right">
              {placeholder}
            </Label>
            <Textarea
              {...restField}
              maxLength={max ?? 200}
              id={name}
              placeholder={placeholder}
              onChange={(event) => {
                onChange(event.target.value);
              }}
            />
          </>
        );
      }}
    />
  );
};
