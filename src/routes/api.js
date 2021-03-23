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

router.get('/historical', async (req, res, next) => {
  const { data, query, isDefaultQuery } = req;
  const filteredDate = isDefaultQuery ? data : getFilteredData(data, query);

  try {
    res.json({
      data: filteredDate,
    });
  } catch (error) {
    next(error);
  }
});

router.get('/projections', async (req, res, next) => {
  const { data, query, isDefaultQuery } = req;
  const filteredDate = isDefaultQuery ? data : getFilteredData(data, query);

  try {
    res.json({
      data: filteredDate,
    });
  } catch (error) {
    next(error);
  }
});

export default router;
