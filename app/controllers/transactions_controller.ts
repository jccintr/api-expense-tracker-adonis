import Transaction from '#models/transaction';
import type { HttpContext } from '@adonisjs/core/http'
import { createTransactionValidator } from '#validators/transaction';
import db from '@adonisjs/lucid/services/db'

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

  async search({response,auth,request}: HttpContext) {
   
    const user_id = auth.user?.id!;
    var {minDate,maxDate,description,category,account} = request.qs();

    var finishDate,startDate;
    const today = new Date(Date.now());
    const y = today.getFullYear();
    const m =String(today.getMonth() + 1).padStart(2, '0');
    const d =  String(today.getDate()).padStart(2, '0');

    if(!description){
      var description:any = '';
    }
    if(!maxDate){
      const todayStr = y + '-' + m + '-' + d;
      finishDate = new Date(todayStr + 'T23:59:00.000Z');
    } else {
      finishDate = new Date(maxDate + 'T23:59:00.000Z');
    }

    if(!minDate){
      startDate = new Date(y+'-01-01'+'T00:00:00.000Z');
    } else {
       startDate = new Date(minDate+'T00:00:00.000Z');
    }
  var transactions: string | any[] = [];
   if(!category && !account){
     transactions = await Transaction.query()
     .where('user_id', user_id)
     .whereILike('description', '%'+description+'%')
     .whereBetween('createdAt',[startDate, finishDate]);
   } 
   if(category && account){
    transactions = await Transaction.query()
    .where('user_id', user_id)
    .whereILike('description', '%'+description+'%')
    .whereBetween('createdAt',[startDate, finishDate])
    .where('category_id', category)
    .where('account_id', account);
   }
  if(category && !account){
    transactions = await Transaction.query()
    .where('user_id', user_id)
    .whereILike('description', '%'+description+'%')
    .whereBetween('createdAt',[startDate, finishDate])
    .where('category_id', category);
  }
  if(!category && account){
    transactions = await Transaction.query()
    .where('user_id', user_id)
    .whereILike('description', '%'+description+'%')
    .whereBetween('createdAt',[startDate, finishDate])
    .where('account_id', account);
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

  async summaryByDay({response,auth,request}: HttpContext) {

    const user_id = auth.user?.id!;
    const {days} = request.qs();

    const minusDays = days || 10;
   

    const query = `SELECT DATE(created_at) AS transaction_date, SUM(amount) AS total_amount
                  FROM transactions
                  WHERE created_at >= CURRENT_DATE - INTERVAL '${minusDays} days'
                  AND user_id = ${user_id}
                  GROUP BY transaction_date
                  ORDER BY transaction_date;`;

    const summary = await db.rawQuery(query);


    return response.status(200).send(summary.rows)

  }

  async summaryByCategory({response,auth,request}: HttpContext) {

    const user_id = auth.user?.id!;
    var {month,year} = request.qs();
   
    const today = new Date(Date.now());
    if(!month || month > 12 || month < 1){
      month = today.getMonth() + 1;
    }

    if(!year){
      year =  today.getFullYear();
    }

    const query = `SELECT name AS category, SUM(amount) AS total_amount
                   FROM transactions
                   INNER JOIN categories ON transactions.category_id = categories.id
                   WHERE EXTRACT(MONTH FROM transactions.created_at) = ${month}
                   AND EXTRACT(YEAR FROM transactions.created_at) = ${year}
                   AND transactions.user_id = ${user_id}
                   GROUP BY name`
    
    const summary = await db.rawQuery(query);

    return response.status(200).send(summary.rows)
  }
}

