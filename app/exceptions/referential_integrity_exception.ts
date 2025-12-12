import { Exception } from '@adonisjs/core/exceptions'

export default class ReferentialIntegrityException extends Exception {
  constructor(message?: string) {
    super(message || 'Database integrity referencial error', {
      status: 409,
      code: 'E_REFERENTIAL_INTEGRITY',
    })
  }

  async report() {
    // para não registrar o log
  }
}
