import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Controller, Control } from "react-hook-form"

interface Option {
  label: string
  value: string
}

interface Props {
  label: string
  name: string
  control: Control<any>
  options: Option[]
}

export default function RadioField({
  label,
  name,
  control,
  options
}: Props) {
  return (
    <div className="space-y-3">
      <Label>{label}</Label>

      <Controller
        control={control}
        name={name}
        render={({ field }) => (
          <RadioGroup
            onValueChange={field.onChange}
            value={field.value}
            className="flex gap-4"
          >
            {options.map(option => (
              <div
                key={option.value}
                className="flex items-center space-x-2"
              >
                <RadioGroupItem
                  value={option.value}
                  id={`${name}-${option.value}`}
                />
                <Label htmlFor={`${name}-${option.value}`}>
                  {option.label}
                </Label>
              </div>
            ))}
          </RadioGroup>
        )}
      />
    </div>
  )
}