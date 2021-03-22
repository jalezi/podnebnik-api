import ApplicationError from '../ApplicationError.js';
export default class ValidationError extends ApplicationError {
  constructor(errors = [], message, ...params) {
    super(...params);

    Error.captureStackTrace(this, this.constructor);

    this.message = message;
    this.name = this.constructor.name;
    this.errors = errors;
  }
}
