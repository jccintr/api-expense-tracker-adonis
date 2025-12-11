import { inject } from '@adonisjs/core'
import Account from '#models/account'


export class AccountService {
  // Your code here
  async findAllByUser(userId: number) {
    const accounts = await Account.query().where('user_id', userId).orderBy('name', 'asc')
    return accounts
  }
}
