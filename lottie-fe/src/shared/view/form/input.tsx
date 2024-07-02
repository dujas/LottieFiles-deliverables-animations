import { Controller, useFormContext } from "react-hook-form";
import { Label } from "../components/ui/label";
import { Input } from "../components/ui/input";

type FormInputProps = {
  name: string;
  placeholder: string;
  type?: "text" | "number";
};

export const FormInput = ({
  name,
  placeholder,
  type = "text",
}: FormInputProps) => {
  const { control } = useFormContext();
  return (
    <Controller
      control={control}
      name={name}
      render={({ field: { onChange, ...restField }, fieldState }) => {
        const hasError = Boolean(fieldState.error?.message);
        return (
          <>
            <Label htmlFor={name}>{placeholder}</Label>
            <Input
              {...restField}
              id={name}
              type={type}
              placeholder={placeholder}
              className={`${hasError ? "border border-red-400" : ""}`}
              onChange={(event) => {
                if ("number" === type) {
                  onChange(event.target.valueAsNumber);
                } else {
                  onChange(event.target.value);
                }
              }}
            />
          </>
        );
      }}
    />
  );
};
