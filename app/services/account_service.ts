import ForbidenException from '#exceptions/forbiden_exception'
import ReferentialIntegrityException from '#exceptions/referential_integrity_exception'
import ResourceNotFoundException from '#exceptions/resource_not_found_exception'
import Account from '#models/account'

export class AccountService {
  async findAllByUser(userId: number) {
    const accounts = await Account.query().where('user_id', userId).orderBy('name', 'asc')
    return accounts
  }

  async store(newAccountObj: {}) {
    const newAccount = await Account.create(newAccountObj)
    return newAccount
  }

  async update(id: number, updateObj: { name: string }, userId: number) {
    const account = await Account.find(id)

    if (!account) {
      throw new ResourceNotFoundException(`Account with ID ${id} not found`)
    }

    if (+account.user_id !== userId) {
      throw new ForbidenException(`Access denied for account with ID ${id}`)
    }

    account.name = updateObj.name
    await account.save()
    return account
  }
  async delete(id: number, userId: number) {
    const account = await Account.find(id)

    if (!account) {
      throw new ResourceNotFoundException(`Account with ID ${id} not found`)
    }

    if (+account.user_id !== userId) {
      throw new ForbidenException(`Access denied for account with ID ${id}`)
    }

    try {
      await account.delete()
      return { message: 'Resource deleted' }
    } catch (error) {
      throw new ReferentialIntegrityException(`Account with ID ${id} is referenced in other table`)
    }
  }
}
