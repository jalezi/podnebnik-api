import _ from 'lodash';

import { DataError } from '../Errors/ApplicationError/index.js';

import { Historical_URL, Projections_URL } from '../dicts/CSV_Url.js';
import fetchData from './fetchData.js';
import { getJSON, byKey } from './utils.js';

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
