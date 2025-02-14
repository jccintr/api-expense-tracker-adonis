import Transaction from '#models/transaction';
import type { HttpContext } from '@adonisjs/core/http'
import { createTransactionValidator } from '#validators/transaction';

export default class TransactionsController {
  /**
   * Display a list of resource
   */
  async index({response,auth,request}: HttpContext) {

    const user_id = auth.user?.id!;
    const {data} = request.qs();

    if(data){
      const minDate = new Date(data+'T00:00:00.000Z');
      const maxDate = new Date(data+'T23:59:00.000Z');
      var transactions = await Transaction.query().where('user_id', user_id).whereBetween('createdAt',[minDate, maxDate]);
    } else {
      var transactions = await  Transaction.findManyBy({user_id: user_id})
    }
 
   
    var trans: Transaction[] = []
 
    for(let i=0;i<transactions.length;i++){
        const t =  transactions[i]
        await t.load('account')
        await t.load('category')
        trans.push(t);
    }
  
    return response.status(200).send(trans)

  }

  /**
   * Handle form submission for the create action
   */
  async store({ request,response,auth }: HttpContext) {

        const data = request.all()
        await createTransactionValidator.validate(data)
       

         const {description,amount,category_id,account_id} = request.body()
         const user_id = auth.user?.id;
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
    
    await transaction.load('account')
    await transaction.load('category')
    return response.status(200).send(transaction)
  }

  /**
   * Handle form submission for the edit action
   */
  async update({ params,request,response,auth }: HttpContext) {

    const data = request.all()
    await createTransactionValidator.validate(data)

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