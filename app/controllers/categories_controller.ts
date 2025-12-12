import type { HttpContext } from '@adonisjs/core/http'
import Category from '#models/category'
import { createAccountValidator } from '#validators/account'
import { inject } from '@adonisjs/core'
import { CategoryService } from '#services/category_service'

@inject()
export default class CategoriesController {
  constructor(protected service: CategoryService) {}

  async index({ response, auth }: HttpContext) {
    const categories = await this.service.findAllByUser(auth.user!.id)
    return response.status(200).send(categories)
  }

  /**
   * Handle form submission for the create action
   */
  async store({ response, request, auth }: HttpContext) {
    const data = request.all()
    await createAccountValidator.validate(data)
    const { name } = request.body()
    // eslint-disable-next-line @typescript-eslint/naming-convention
    const user_id = auth.user?.id
    const newCategory = await this.service.insert({ name, user_id })
    return response.status(201).send(newCategory)
  }

  /**
   * Show individual record
   */
  async show({}: HttpContext) {}

  /**
   * Handle form submission for the edit action
   */
  async update({ params, request, response, auth }: HttpContext) {

    const data = request.all()
    await createAccountValidator.validate(data)
    const {name} = request.body()
        const id = params.id
        const user_id = auth.user?.id
    
       
       
        const category = await Category.find(id)
        if(!category){
          return response.status(404).send({error: 'Resource not found'})
        }
    
        if(+category.user_id !== user_id){
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
    // eslint-disable-next-line @typescript-eslint/naming-convention
    const user_id = auth.user?.id

    const category = await Category.find(id)
    if (!category) {
      return response.status(404).send({ error: 'Resource not found' })
    }

    if (+category.user_id !== user_id) {
      return response.status(403).send({ error: 'Access denied' })
    }

    try {

      await category.delete()
      return response.status(200).send({ message: 'Resource deleted' })
    } catch (error) {

      return response.status(409).send({error:'Cannot delete this resource because it is being referenced in another table.'})
      
    }
  }
}
