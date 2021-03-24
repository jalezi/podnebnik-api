import { Router } from 'express';

import data from '../fetchData/index.js';
import YEAR from '../dicts/Year.js';

const router = Router();

const getFilteredData = (data, { yearFrom, yearTo }) => {
  return data instanceof Array
    ? data.filter(({ year }) => year >= yearFrom && year <= yearTo)
    : Object.entries(data).reduce((acc, [key, value]) => {
        acc[key] = value.filter(
          ({ year }) => year >= yearFrom && year <= yearTo
        );
        return acc;
      }, {});
};

router.get('/created', async (req, res, next) => {
  const { created } = await data;
  try {
    res.json({
      data: created,
    });
  } catch (error) {
    next(error);
  }
});

const isInRange = (year, { min, max }) => year >= min && year <= max;

const getQueryValidation = (property, query = { yearFrom: '', yearTo: '' }) => {
  const { YEAR_FROM, YEAR_TO } = YEAR[property];
  let yearFrom =
    !isNaN(query.yearFrom) &&
    isInRange(query.yearFrom, { min: YEAR_FROM, max: YEAR_TO });
  let yearTo =
    !isNaN(query.yearTo) &&
    isInRange(query.yearTo, { min: YEAR_FROM, max: YEAR_TO });
  return { yearFrom, yearTo };
};

const getYearsQuery = (property, query = { yearFrom: '', yearTo: '' }) => {
  const { YEAR_FROM, YEAR_TO } = YEAR[property];
  const queryValidation = getQueryValidation(property, query);
  const yearFrom = queryValidation.yearFrom ? +query.yearFrom : YEAR_FROM;
  const yearTo = queryValidation.yearTo ? +query.yearTo : YEAR_TO;
  const isDefaultQuery = yearFrom === YEAR_FROM && yearTo === YEAR_TO;
  return { yearFrom, yearTo, isDefaultQuery };
};

router.use(async (req, _res, next) => {
  try {
    const paths = req.path.split('/').filter(item => item);
    const path = paths[0];
    if (path === 'historical' || path === 'projections') {
      const { query } = req;
      const { yearFrom, yearTo, isDefaultQuery } = getYearsQuery(path, query);
      req.query = { yearFrom, yearTo };
      req.isDefaultQuery = isDefaultQuery;
      const resolvedData = await data;
      req.data = resolvedData[path];
    }
    next();
  } catch (error) {
    next(error);
  }
});

router.get('/historical', (req, res, next) => {
  const { data, query, isDefaultQuery, created } = req;
  const filteredData = isDefaultQuery ? data : getFilteredData(data, query);

  try {
    res.json({
      data: filteredData,
    });
  } catch (error) {
    next(error);
  }
});

const ALLOWED_FIELDS = [
  'total',
  'agriculture',
  'aviation',
  'biomass',
  'energy',
  'industrial_processes',
  'international',
  'lulucf',
  'waste',
];

router.get('/historical/:field', (req, res, next) => {
  try {
    const { data, query, isDefaultQuery, created } = req;
    if (ALLOWED_FIELDS.includes(req.params.field)) {
      const fieldData = data[req.params.field];
      const filteredData = isDefaultQuery
        ? fieldData
        : getFilteredData(fieldData, query);
      return res.json({
        data: filteredData,
      });
    }
    return res
      .status(404)
      .json({ msg: 'Data for this path does not exist!', try: ALLOWED_FIELDS });
  } catch (error) {
    next(error);
  }
});

router.get('/projections', (req, res, next) => {
  try {
    const { data, query, isDefaultQuery, created } = req;
    const filteredData = isDefaultQuery ? data : getFilteredData(data, query);

    res.json({
      data: filteredData,
    });
  } catch (error) {
    next(error);
  }
});

export default router;
