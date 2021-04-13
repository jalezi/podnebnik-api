import _ from 'lodash';

import ApplicationError, {
  DataError,
} from '../Errors/ApplicationError/index.js';
import { isOfType } from './../helpers/index.js';

const isNotArray = value => !isOfType.array(value);
const isNotString = value => !isOfType.string(value);

const csvToJSON = (data = [], header = []) => {
  if (isNotArray(data) || isNotArray(header)) {
    throw new DataError({ data, header }, 'One argument is not an Array!');
  }

  const result = data.map(line => {
    try {
      const lineResult = line.reduce((acc, item, i) => {
        const keys = header[i].split('.');
        const key = keys[0];

        if (line.length !== header.length) {
          throw new DataError(
            { key, data: data.length, header: header.length },
            'Data length is not equal header length!'
          );
        }

        if (keys.length === 1) {
          acc[key] = item;
          return acc;
        }
        const newHeader = keys.slice(1, keys.length).join('.');
        const json = csvToJSON([[item]], [newHeader]);
        acc[key] = _.merge(acc[key], json[0]);

        return acc;
      }, {});
      return lineResult;
    } catch (error) {
      return { error: { msg: error.message, ...error } };
    }
  });
  return result;
};

const mapSortByYearAsc = (a, b) => a.year - b.year;

const getJSON = (acc, [key, data]) => {
  const lines = data.split('\n').map(item => item.split(','));
  const header = lines[0];
  const dataLines = lines.slice(1, -1);
  try {
    acc[key] = csvToJSON(dataLines, header).sort(mapSortByYearAsc);
    return acc;
  } catch (error) {
    acc[key] = [{ key, ...error }];
    return acc;
  }
};

const byKey = (data = [], property = '', include = [], setAs = '') => {
  if (isNotArray(data)) {
    throw new ApplicationError('First argument must be an array!');
  }
  if (isNotString(property)) {
    throw new ApplicationError('Second argument must be a string!');
  }
  if (isNotArray(include)) {
    throw new ApplicationError('Third argument must be an array!');
  }
  if (isNotString(setAs)) {
    throw new ApplicationError('Forth argument must be string!');
  }

  const onlyWithProperty = data.filter(
    item => isOfType.object(item) && item[property]
  );

  const result = onlyWithProperty.map(item => {
    const additionalData = include.reduce((acc, key) => {
      acc = { ...acc, [key]: item[key] };
      return acc;
    }, {});
    if (isOfType.object(item[property])) {
      const intermediate = setAs
        ? { [property]: { ...additionalData, [setAs]: item[property] } }
        : { [property]: { ...additionalData, ...item[property] } };

      return intermediate;
    }
    return { [item[property]]: { ...additionalData } };
  });
  return result;
};

export { csvToJSON, getJSON, byKey };
