import { Exception } from '@adonisjs/core/exceptions'

export default class ForbidenException extends Exception {
  constructor(message?: string) {
    super(message || 'Unauthorized access', {
      status: 403,
      code: 'E_UNAUTHORIZED',
    })
  }

  async report() {
    // para não registrar o log
  }
}
