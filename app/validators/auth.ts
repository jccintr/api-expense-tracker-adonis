import vine from '@vinejs/vine'


export const registerValidator = vine.compile(
    vine.object({
      name: vine.string().trim().minLength(3),
      email: vine.string().trim().email(),
      password: vine.string()
    })
  )

  export const loginValidator = vine.compile(
    vine.object({
      email: vine.string().trim().email(),
      password: vine.string()
    })
  )