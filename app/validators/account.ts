
import vine from '@vinejs/vine'

export const createAccountValidator = vine.compile(
    vine.object({
      name: vine.string().trim().minLength(3),
    })
  )
  