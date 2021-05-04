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
    console.log({ config: error.config });
    if (error.response) {
      // The request was made and the server responded with a status code
      // that falls out of the range of 2xx
      const {
        response: { data, status, headers },
      } = error;
      console.log({ data, status, headers });
      return new ApplicationError('Axios response error!');
    }

    if (error.request) {
      // The request was made but no response was received
      // `error.request` is an instance of XMLHttpRequest in the browser and an instance of
      // http.ClientRequest in node.js
      console.log(error.request);
      return new ApplicationError('Axios request error!');
    }
    // Something happened in setting up the request that triggered an Error
    throw new ApplicationError('Axios setting error' + error.message);
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
