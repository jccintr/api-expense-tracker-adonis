import Category from '#models/category'

export class CategoryService {
  async findAllByUser(userId: number) {
    const categories = await Category.query().where('user_id', userId).orderBy('name', 'asc')
    return categories
  }
  async insert(newCategoryObj: {}) {
    const newCategory = await Category.create(newCategoryObj)
    return newCategory
  }
}
