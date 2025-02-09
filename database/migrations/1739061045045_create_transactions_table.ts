import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'transactions'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id')
      table.string('description').notNullable()
      table.float('amount', 8, 2)
      table.bigInteger('category_id')
      table.bigInteger('account_id')
      table.bigInteger('user_id')
      table.timestamp('created_at')
      table.timestamp('updated_at')
      table.foreign('category_id').references('users.id')
      table.foreign('account_id').references('users.id')
      table.foreign('user_id').references('users.id')
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}