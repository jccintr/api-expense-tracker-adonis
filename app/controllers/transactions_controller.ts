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

  async summaryByWeek({response,auth,request}: HttpContext) {

    const user_id = auth.user?.id!;
    let {week_number} = request.qs();
    
    let weekRange;
    if(!week_number){
      week_number = this.getWeekNumber(new Date());
    }
      weekRange = this.getWeekRange(week_number)
   
     
     const firstDay = new Date(weekRange.firstDay+'T00:00:00.000Z');
     const lastDay = new Date(weekRange.lastDay+'T00:00:00.000Z');

     const query = `SELECT EXTRACT(DOW FROM created_at) AS day_of_week, SUM(amount) AS total_amount
                    FROM transactions
                    WHERE created_at BETWEEN '${weekRange.firstDay}' AND '${weekRange.lastDay}'
                    AND user_id = ${user_id}
                    GROUP BY day_of_week
                    ORDER BY day_of_week
     `;

     const query_ret = await db.rawQuery(query);

     const week = query_ret.rows;

     let fullWeek = [];
     let total = 0;
     for(let i=0;i<7;i++){
         const result = week.find(t => t.day_of_week == i);
         if(result){
           total += result.total_amount;
         }
         fullWeek.push({
            day_of_week: i,
            total_amount: result?result.total_amount:0
        });
     }
   
     const obj = {
      week_number,
      first_day: firstDay,
      last_day:lastDay,
      total_amount: total, 
      week_days: fullWeek
     }
     return response.status(200).send(obj)
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
   
    return response.status(200).send(summary)
  }

   getWeekRange (weekNumber)  {
    const currentYear = new Date().getFullYear();
    const firstDayOfYear = new Date(currentYear, 0, 1);
    const daysOffset = (weekNumber - 1) * 7;
    const firstDayOfWeek = new Date(firstDayOfYear.getTime() + daysOffset * 24 * 60 * 60 * 1000);
    
    // Ajustar para o início da semana (domingo ou segunda, dependendo da região)
    const dayOfWeek = firstDayOfWeek.getDay();
    const firstDay = new Date(firstDayOfWeek);
    firstDay.setDate(firstDayOfWeek.getDate() - dayOfWeek); // Ajuste para o domingo
    
    const lastDay = new Date(firstDay);
    lastDay.setDate(firstDay.getDate() + 6); // Último dia da semana
    
    return {
        firstDay: firstDay.toISOString().split('T')[0],
        lastDay: lastDay.toISOString().split('T')[0]
    };
}

getWeekNumber(date) {
  const firstDayOfYear = new Date(date.getFullYear(), 0, 1);
  const pastDays = (date - firstDayOfYear) / (24 * 60 * 60 * 1000);
  return Math.ceil((pastDays + firstDayOfYear.getDay() + 1) / 7);
}

}


  /*
    // console.log(summary.rows.length)
     let weekArray = [];
    for (let d = new Date(firstDay); d <= lastDay; d.setUTCDate(d.getUTCDate() + 1)) {
      console.log(d.toISOString()+' '+summary.rows[0].transaction_date);
      
    //  for(let i=0;i<summary.rows.length;i++){
         
    //     if(d.toISOString() == summary.rows[i].transaction_date){
     //     console.log(d)
     //    }
     //  }
        weekArray.push({
            transaction_date: d.toISOString().split('T')[0] + "T00:00:00.000Z",
            total_amount: 0
        });
    }
    */

