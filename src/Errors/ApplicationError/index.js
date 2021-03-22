import ApplicationError from './ApplicationError.js';
import ValidationError, {
  DataError,
  QueryError,
} from './ValidationsError/index.js';
export { ValidationError };

ApplicationError.ValidationError = ValidationError;
ApplicationError.DataError = DataError;
ApplicationError.QueryError = QueryError;

export default ApplicationError;
