import Joi from "joi"

export function validate<T>(schema: Joi.Schema, data: unknown): T {
  const { error, value } = schema.validate(data, {
    abortEarly: false,
    stripUnknown: true
  })

  if (error) {
    const message = error.details.map(d => d.message).join(", ")
    throw new Error(message)
  }

  return value as T
}