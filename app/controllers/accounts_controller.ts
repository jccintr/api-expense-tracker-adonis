import type { HttpContext } from '@adonisjs/core/http'
import Account from '#models/account'


export default class AccountsController {
  /**
   * Display a list of resource
   */
  async index({response,auth}: HttpContext) {

    const user_id = auth.user?.id;
    const accounts = await  Account.findManyBy('user_id', user_id)
    return response.status(200).send(accounts)

  }

  /**
   * Handle form submission for the create action
   */
  async store({ response, request, auth }: HttpContext) {

   
    const {name} = request.body()
    const user_id = auth.user?.id;
    
    
    const newAccount = await Account.create({name,user_id})
      
    return response.status(201).send(newAccount)
  }

  /**
   * Show individual record
   */
  async show({ params }: HttpContext) {}

  /**
   * Handle form submission for the edit action
   */
  async update({ params, request }: HttpContext) {}

  /**
   * Delete record
   */
  async destroy({ params }: HttpContext) {}
}