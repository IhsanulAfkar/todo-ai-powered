import { Controller, Control } from "react-hook-form"
import { Label } from "@/components/ui/label"

type Option = {
  label: string
  value: string
  color: string
}

interface Props {
  label: string
  name: string
  control: Control<any>
  options: Option[]
}

export const PriorityRadioField = ({
  label,
  name,
  control,
  options,
}: Props) => {
  return (
    <div className="space-y-2">
      <Label>{label}</Label>

      <Controller
        name={name}
        control={control}
        render={({ field }) => (
          <div className="grid grid-cols-2 gap-2">
            {options.map((opt) => (
              <label
                key={opt.value}
                className={`flex items-center gap-2 border rounded-md px-3 py-2 cursor-pointer transition 
                ${field.value === opt.value ? "ring-2 ring-primary" : ""}
                `}
              >
                <input
                  type="radio"
                  value={opt.value}
                  checked={field.value === opt.value}
                  onChange={() => field.onChange(opt.value)}
                  className="hidden"
                />

                <span
                  className="w-3 h-3 rounded-full"
                  style={{ backgroundColor: opt.color }}
                />

                <span className="text-sm font-medium">{opt.label}</span>
              </label>
            ))}
          </div>
        )}
      />
    </div>
  )
}