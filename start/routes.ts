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
import TransactionsController from '#controllers/transactions_controller'
import UsersController from '#controllers/users_controller'

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
// Transactions Routes
router.get('transactions', [TransactionsController, 'index']).use(middleware.auth({guards: ['api']}))
router.get('transactions/search', [TransactionsController, 'search']).use(middleware.auth({guards: ['api']}))
router.get('transactions/summary/day', [TransactionsController, 'summaryByDay']).use(middleware.auth({guards: ['api']}))
router.get('transactions/summary/category', [TransactionsController, 'summaryByCategory']).use(middleware.auth({guards: ['api']}))
router.get('transactions/:id', [TransactionsController, 'show']).use(middleware.auth({guards: ['api']}))
router.post('transactions', [TransactionsController, 'store']).use(middleware.auth({guards: ['api']}))
router.put('transactions/:id', [TransactionsController, 'update']).use(middleware.auth({guards: ['api']}))
router.delete('transactions/:id', [TransactionsController, 'destroy']).use(middleware.auth({guards: ['api']}))
// Uers Routes
router.get('users/me', [UsersController, 'getLoggedUser']).use(middleware.auth({guards: ['api']}))