import { BaseSeeder } from '@adonisjs/lucid/seeders'
import Category from '#models/category'

export default class extends BaseSeeder {
  async run() {
   
    
    await Category.createMany([
      {
        name: 'virk@adonisjs.com'
      },
      {
        name: 'romain@adonisjs.com'
      
      },
    ])




  }
}