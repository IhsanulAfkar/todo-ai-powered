import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { FieldError, UseFormRegisterReturn } from "react-hook-form"

interface Props {
  label: string
  placeholder?: string
  type?: string
  register: UseFormRegisterReturn
  error?: FieldError
}

export default function InputField({
  label,
  placeholder,
  type = "text",
  register,
  error
}: Props) {
  return (
    <div className="space-y-2">
      <Label>{label}</Label>

      <Input
        type={type}
        placeholder={placeholder}
        {...register}
      />

      {error && (
        <p className="text-sm text-destructive">
          {error.message}
        </p>
      )}
    </div>
  )
}