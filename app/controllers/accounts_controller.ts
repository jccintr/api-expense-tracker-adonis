import type { HttpContext } from '@adonisjs/core/http'
import { createAccountValidator } from '#validators/account'
import { AccountService } from '#services/account_service'
import { inject } from '@adonisjs/core'

@inject()
export default class AccountsController {
  constructor(protected service: AccountService) {}

  async index({ response, auth }: HttpContext) {
    const accounts = await this.service.findAllByUser(auth.user!.id)
    return response.status(200).send(accounts)
  }

  async store({ response, request, auth }: HttpContext) {
    const data = request.all()
    await createAccountValidator.validate(data)
    const { name } = request.body()
    // eslint-disable-next-line @typescript-eslint/naming-convention
    const user_id = auth.user?.id
    const newAccount = await this.service.store({ name, user_id })
    return response.status(201).send(newAccount)
  }

  async update({ params, request, response, auth }: HttpContext) {
    const data = request.all()
    await createAccountValidator.validate(data)
    const { name } = request.body()
    const id = params.id
    // eslint-disable-next-line @typescript-eslint/naming-convention
    const userId = auth.user!.id
    const account = await this.service.update(+id, { name }, userId)
    return response.status(200).send(account)
  }

  async destroy({ params, response, auth }: HttpContext) {
    const id = params.id
    // eslint-disable-next-line @typescript-eslint/naming-convention
    const userId = auth.user!.id

    const ret = await this.service.delete(id, userId)
    return response.status(200).send(ret)
  }
}
