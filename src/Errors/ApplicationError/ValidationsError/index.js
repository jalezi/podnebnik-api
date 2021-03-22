import ValidationError from './ValidationError.js';
import DataError from './DataError.js';
import QueryError from './QueryError.js';

export { DataError, QueryError };

ValidationError.DataError = DataError;
ValidationError.QueryError = QueryError;
export default ValidationError;
