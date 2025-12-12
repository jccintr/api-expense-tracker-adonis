// app/exceptions/handler.ts
import { HttpContext, ExceptionHandler } from '@adonisjs/core/http'
import app from '@adonisjs/core/services/app'
import ResourceNotFoundException from '#exceptions/resource_not_found_exception'
import ForbidenException from './forbiden_exception.js'
import ReferentialIntegrityException from './referential_integrity_exception.js'

export default class HttpExceptionHandler extends ExceptionHandler {
  protected debug = !app.inProduction
  protected dontFlash = ['password', 'password_confirmation']

  async handle(error: any, ctx: HttpContext) {
    if (error instanceof ResourceNotFoundException) {
      return ctx.response.status(404).json({
        error: 'Resource not found',
        message: error.message || 'Recurso não encontrado',
      })
    }
    if (error instanceof ForbidenException) {
      return ctx.response.status(403).json({
        error: 'Forbiden',
        message: error.message || 'Unauthorized access',
      })
    }
    if (error instanceof ReferentialIntegrityException) {
      return ctx.response.status(409).json({
        error: 'Database Integrity Referencial Violation',
        message: error.message || 'Integrity Referencial Violation',
      })
    }

    // Para todos os outros erros, usa o comportamento padrão (útil em dev)
    return super.handle(error, ctx)
  }
}