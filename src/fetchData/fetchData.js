import axios from 'axios';
import ApplicationError from '../Errors/ApplicationError/ApplicationError.js';

const fetchCsv = async url => {
  try {
    const response = await axios.get(url, {
      headers: {
        'Content-Type': 'text/plain',
      },
    });
    return response.data;
  } catch (error) {
    return error;
  }
};

export default (url = {}) => {
  return Promise.all(
    Object.entries(url).map(async ([key, item]) => {
      try {
        const data = await fetchCsv(item.href);
        return [key, data];
      } catch (error) {
        throw new ApplicationError(error.message, error.stack);
      }
    })
  );
};
