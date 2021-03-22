import _ from 'lodash';

import { Historical_URL, Projections_URL } from '../dicts/CSV_Url.js';
import fetchData from './fetchData.js';

const csvToJson = (data, header) =>
  data.map(line => {
    const currentLine = line.split(',');
    const obj = currentLine.reduce((acc, item, i) => {
      const keys = header[i].split('.');

      if (keys.length === 0 || typeof keys === 'string') {
        return acc;
      }
      if (keys.length === 1) {
        acc[keys[0]] = item;
        return acc;
      }

      const newItems = item + '';
      const newKeys = keys.slice(1, keys.length).join('.');
      const json = csvToJson([newItems], [newKeys])[0];
      acc[keys[0]] = _.merge(acc[keys[0]], json);
      return acc;
    }, {});
    return obj;
  });

const mapSortByYearAsc = (a, b) => a.year - b.year;

const getJSON = (acc, [key, data]) => {
  const lines = data.split('\n');
  const header = lines[0].split(',');
  const dataLines = lines.slice(1, -1);
  acc[key] = csvToJson(dataLines, header).sort(mapSortByYearAsc);
  return acc;
};

const fetchAll = async () => {
  const historicalData = await fetchData(Historical_URL);
  const historical = historicalData.reduce(getJSON, {});

  const projectionsData = await fetchData(Projections_URL);
  const projections = [...projectionsData].reduce(getJSON, {});

  return Object.freeze({
    historical,
    projections,
    created: Date.now(),
  });
};

const data = fetchAll();

export default data;
