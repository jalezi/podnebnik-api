import { Router } from 'express';

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

router.get('/created', (req, res, next) => {
  try {
    res.json({
      data: req.body.data,
    });
  } catch (error) {
    next(error);
  }
});

export default router;
