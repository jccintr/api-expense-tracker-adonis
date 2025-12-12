import { Exception } from '@adonisjs/core/exceptions'

export default class ResourceNotFoundException extends Exception {
  constructor(message?: string) {
    super(message || 'Recurso não encontrado', {
      status: 404,
      code: 'E_ROW_NOT_FOUND',
    })
  }

  async report() {
    // para não registrar o log
  }
}
