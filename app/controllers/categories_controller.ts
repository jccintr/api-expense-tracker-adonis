import type { HttpContext } from '@adonisjs/core/http'
import Category from '#models/category'
import { createAccountValidator } from '#validators/account';

export default class CategoriesController {
  /**
   * Display a list of resource
   */
  async index({response,auth}: HttpContext) {
 
     const user_id = auth.user?.id;
     const categories = await  Category.findManyBy('user_id', user_id)
     return response.status(200).send(categories)
 
   }

  /**
   * Handle form submission for the create action
   */
 async store({ response, request, auth }: HttpContext) {
 
     const data = request.all()
     await createAccountValidator.validate(data)
     const {name} = request.body()
     const user_id = auth.user?.id;
     
     
     const newCategory = await Category.create({name,user_id})
       
     return response.status(201).send(newCategory)
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
    
       
       
        const category = await Category.find(id)
        if(!category){
          return response.status(404).send({error: 'Resource not found'})
        }
    
        if(category.user_id != user_id){
          return response.status(403).send({error: 'Access denied'})
        }
        
        category.name = name
        await category.save()
        return response.status(200).send(category)

  }

  /**
   * Delete record
   */
  async destroy({ params, response, auth }: HttpContext) {

    const id = params.id
    const user_id = auth.user?.id;

    const category = await Category.find(id)
    if(!category){
      return response.status(404).send({error: 'Resource not found'})
    }

    if(category.user_id != user_id){
      return response.status(403).send({error: 'Access denied'})
    }
    
    try {

      await category.delete()
      return response.status(200).send({message:'Resource deleted'})

    } catch (error) {

      return response.status(409).send({error:'Cannot delete this resource because it is being referenced in another table.'})
      
    }
   

   


  }
}