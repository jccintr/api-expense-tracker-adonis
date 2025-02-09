/*
|--------------------------------------------------------------------------
| Routes file
|--------------------------------------------------------------------------
|
| The routes file is used for defining the HTTP routes.
|
*/

import AuthController from '#controllers/auth_controller'
import router from '@adonisjs/core/services/router'
import { middleware } from '#start/kernel'
import AccountsController from '#controllers/accounts_controller'
import CategoriesController from '#controllers/categories_controller'

router.get('/', async () => {
  return {
    hello: 'world',
  }
})

router.post('auth/register', [AuthController, 'register'])
router.post('auth/login', [AuthController, 'login'])
// Accounts Routes
router.get('accounts', [AccountsController, 'index']).use(middleware.auth({guards: ['api']}))
router.post('accounts', [AccountsController, 'store']).use(middleware.auth({guards: ['api']}))
router.put('accounts/:id', [AccountsController, 'update']).use(middleware.auth({guards: ['api']}))
router.delete('accounts/:id', [AccountsController, 'destroy']).use(middleware.auth({guards: ['api']}))
// Categories Routes
router.get('categories', [CategoriesController, 'index']).use(middleware.auth({guards: ['api']}))
router.post('categories', [CategoriesController, 'store']).use(middleware.auth({guards: ['api']}))
router.put('categories/:id', [CategoriesController, 'update']).use(middleware.auth({guards: ['api']}))
router.delete('categories/:id', [CategoriesController, 'destroy']).use(middleware.auth({guards: ['api']}))
