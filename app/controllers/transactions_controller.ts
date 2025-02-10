import Transaction from '#models/transaction';
import type { HttpContext } from '@adonisjs/core/http'

export default class TransactionsController {
  /**
   * Display a list of resource
   */
  async index({response,auth}: HttpContext) {

    const user_id = auth.user?.id;
    const transactions = await  Transaction.findManyBy('user_id', user_id)
    return response.status(200).send(transactions)

  }

  /**
   * Handle form submission for the create action
   */
  async store({ request,response,auth }: HttpContext) {

         const {description,amount,category_id,account_id} = request.body()
         const user_id = auth.user?.id;

         if(!description || !amount || !category_id || !account_id){
          return response.status(400).send({error: 'Bad request'})
    }

    if(amount <=0){
      return response.status(400).send({error: 'Field amount must be greater than zero'})
   }
         
         
         const newTransaction = await Transaction.create({description,amount,category_id,account_id,user_id})
           
         return response.status(201).send(newTransaction)

  }

  /**
   * Show individual record
   */
  async show({ params,response,auth }: HttpContext) {

    const id = params.id
    const user_id = auth.user?.id;

    const transaction = await Transaction.find(id)
    if(!transaction){
      return response.status(404).send({error: 'Resource not found'})
    }

    if(transaction.user_id != user_id){
      return response.status(403).send({error: 'Access denied'})
    }

    return response.status(200).send(transaction)
  }

  /**
   * Handle form submission for the edit action
   */
  async update({ params,request,response,auth }: HttpContext) {

    const {description,amount,category_id,account_id} = request.body()
    const id = params.id
    const user_id = auth.user?.id;

    const transaction = await Transaction.find(id)
    if(!transaction){
      return response.status(404).send({error: 'Resource not found'})
    }

    if(!description || !amount || !category_id || !account_id){
          return response.status(400).send({error: 'Bad request'})
    }

    if(amount <=0){
      return response.status(400).send({error: 'Field amount must be greater than zero'})
   }
       
    if(transaction.user_id != user_id){
      return response.status(403).send({error: 'Access denied'})
    }

    transaction.description = description;
    transaction.amount = amount;
    transaction.category_id = category_id;
    transaction.account_id = account_id;
    
    await transaction.save()
    return response.status(200).send(transaction)

  }

  /**
   * Delete record
   */
  async destroy({ params,response,auth }: HttpContext) {

      const id = params.id
        const user_id = auth.user?.id;
    
         
        const transaction = await Transaction.find(id)
        if(!transaction){
          return response.status(404).send({error: 'Resource not found'})
        }
    
        if(transaction.user_id != user_id){
          return response.status(403).send({error: 'Access denied'})
        }
        
        
        await transaction.delete()
        return response.status(200).send({message:'Resource deleted'})

  }
}