export class BadRequestException extends Error {
  statusCode: number

  constructor(message: string) {
    super(message)
    this.statusCode = 400
    this.name = 'BadRequestError'
  }
}

export class NotFoundException extends Error {
  statusCode: number

  constructor(message: string) {
    super(message)
    this.statusCode = 404
    this.name = 'NotFoundError'
  }
}

export class InternalServerError extends Error {
  statusCode: number

  constructor(message: string) {
    super(message)
    this.statusCode = 500
    this.name = 'InternalServerError'
  }
}
