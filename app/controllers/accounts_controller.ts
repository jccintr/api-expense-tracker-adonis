import type { HttpContext } from '@adonisjs/core/http'
import Account from '#models/account'
import { createAccountValidator } from '#validators/account';


export default class AccountsController {
  /**
   * Display a list of resource
   */
  async index({response,auth}: HttpContext) {

    const  user_id = auth.user!.id;
   // const accounts = await  Account.findManyBy('user_id', user_id).orderBy('name', 'desc');
    const accounts = await Account.query().where('user_id', user_id).orderBy('name', 'asc');
    return response.status(200).send(accounts)

  }

  /**
   * Handle form submission for the create action
   */
  async store({ response, request, auth }: HttpContext) {

    const data = request.all()
    await createAccountValidator.validate(data)
    const {name} = request.body()
    const user_id = auth.user?.id;
    
    
    const newAccount = await Account.create({name,user_id})
      
    return response.status(201).send(newAccount)
  }

  /**
   * Show individual record
   */
  async show({  }: HttpContext) {}

  /**
   * Handle form submission for the edit action
   */
  async update({ params, request, response, auth }: HttpContext) {

    const data = request.all()
    await createAccountValidator.validate(data)
    const {name} = request.body()
    const id = params.id
    const user_id = auth.user?.id;

   
   
    const account = await Account.find(id)
    if(!account){
      return response.status(404).send({error: 'Resource not found'})
    }

    if(account.user_id != user_id){
      return response.status(403).send({error: 'Access denied'})
    }
    
    account.name = name
    await account.save()
    return response.status(200).send(account)
   

  }

  /**
   * Delete record
   */
  async destroy({ params, response, auth }: HttpContext) {

    const id = params.id
    const user_id = auth.user?.id;

     
    const account = await Account.find(id)
    if(!account){
      return response.status(404).send({error: 'Resource not found'})
    }

    if(account.user_id != user_id){
      return response.status(403).send({error: 'Access denied'})
    }
    
    try {
      
      await account.delete()
      return response.status(200).send({message:'Resource deleted'})

    } catch (error) {

      return response.status(409).send({error:'Cannot delete this resource because it is being referenced in another table.'})
    }
   

  }
}