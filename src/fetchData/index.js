import _ from 'lodash';
import { Historical_URL, Projections_URL } from '../dicts/CSV_Url.js';
import ApplicationError from '../Errors/ApplicationError/ApplicationError.js';
import fetchData from './fetchData.js';
import { getJSON, byKey } from './utils.js';

const fetchAll = async () => {
  const historicalData = await fetchData(Historical_URL);

  const historical = [...historicalData].reduce(getJSON, {});

  const historicalByEmissions = Object.entries(historical).reduce(
    (acc, [key, data]) => {
      const dataByKey = byKey(data, 'emissions_CO2_equiv', ['year'], key);
      acc.historical = acc.historical
        ? _.merge(
            acc.historical,
            dataByKey.map(item => item['emissions_CO2_equiv'])
          )
        : dataByKey.map(item => item['emissions_CO2_equiv']);
      return acc;
    },
    {}
  );
  const historicalByYear = _.keyBy(historicalByEmissions.historical, 'year');

  const projectionsData = await fetchData(Projections_URL);
  const projections = [...projectionsData].reduce(getJSON, {});
  const projectionsByEmissions = Object.entries(projections).reduce(
    (acc, [key, data], i) => {
      const dataByKey = byKey(data, 'emissions_CO2_equiv', ['year'], key);
      acc.projections = acc.projections
        ? _.merge(
            acc.projections,
            dataByKey.map(item => item['emissions_CO2_equiv'])
          )
        : dataByKey.map(item => item['emissions_CO2_equiv']);
      i === 1 && console.log(JSON.stringify(acc, null, 2));
      return acc;
    },
    {}
  );
  const projectionsByYear = _.keyBy(projectionsByEmissions.projections, 'year');

  return Object.freeze({
    historical,
    projections,
    created: Date.now(),
    emissions_CO2_equiv: Object.values(
      _.merge(historicalByYear, projectionsByYear)
    ),
  });
};

const data = fetchAll();

export default data;
