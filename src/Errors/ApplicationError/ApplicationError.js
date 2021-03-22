export default class ApplicationError extends Error {
  constructor(...params) {
    super(...params);

    Error.captureStackTrace(this, this.constructor);

    this.name = this.constructor.name;
  }
}
