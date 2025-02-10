import { DateTime } from 'luxon'
import { BaseModel, column,belongsTo } from '@adonisjs/lucid/orm'
import Account from './account.js'
import Category from './category.js'
import type { BelongsTo } from '@adonisjs/lucid/types/relations'


export default class Transaction extends BaseModel {

  @column({ isPrimary: true })
  declare id: number

  @column()
  declare description: string

  @column()
  declare amount: number

  @column({serializeAs: null})
  declare category_id: number

  @column({serializeAs: null})
  declare account_id: number

  @column({serializeAs: null})
  declare user_id: number

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true, serializeAs: null })
  declare updatedAt: DateTime

 

  @belongsTo(() => Account, {
    foreignKey: 'account_id', 
  })
  declare account: BelongsTo<typeof Account>

  @belongsTo(() => Category, {
    foreignKey: 'category_id', 
  })
  declare category: BelongsTo<typeof Category>

}