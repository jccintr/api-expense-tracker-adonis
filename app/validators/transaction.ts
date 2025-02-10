import vine from '@vinejs/vine'

export const createTransactionValidator = vine.compile(
    vine.object({
      description: vine.string().trim().minLength(3),
      amount: vine.number().min(0.01),
      category_id: vine.number().min(1),
      account_id: vine.number().min(1)
    })
  )
  