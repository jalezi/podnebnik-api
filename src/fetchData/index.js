import _ from 'lodash';

import { DataError } from '../Errors/ApplicationError/index.js';

import { Historical_URL, Projections_URL } from '../dicts/CSV_Url.js';
import fetchData from './fetchData.js';

const isNotArray = value => !(value instanceof Array);

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

const fetchAll = async () => {
  const historicalData = await fetchData(Historical_URL);
  const historical = [...historicalData].reduce(getJSON, {});

  const projectionsData = await fetchData(Projections_URL);
  const projections = [...projectionsData].reduce(getJSON, {});

  return Object.freeze({
    historical,
    projections,
    created: Date.now(),
  });
};

const data = fetchAll();

export { csvToJSON, getJSON };

export default data;
