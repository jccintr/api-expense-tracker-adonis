import { BaseSeeder } from '@adonisjs/lucid/seeders'
import Account from '#models/account'

export default class extends BaseSeeder {
  async run() {
    
 await Account.createMany([
      {
        name: 'virk@adonisjs.com'
      },
      {
        name: 'romain@adonisjs.com'
      
      },
    ])

  }
}

// node ace db:seed -i
