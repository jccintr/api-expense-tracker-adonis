import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'accounts'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id')
      table.string('name', 254).notNullable()
      table.bigInteger('user_id')
      table.timestamp('created_at')
      table.timestamp('updated_at')
      table.foreign('user_id').references('users.id')
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}