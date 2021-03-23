import ValidationError from './ValidationError.js';

export default class DataError extends ValidationError {
  constructor(data, message, ...params) {
    super(...params);

    Error.captureStackTrace(this, this.constructor);
    this.message = message;
    this.name = this.constructor.name;
    this.data = data;
    delete this.errors;
  }
}
