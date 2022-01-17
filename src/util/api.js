import axios from 'axios';

const authorizedAxios = axios.create({
  baseURL: 'https://ce-test-api.fly.dev/api',
  headers: {
    'api-token': '1337-time'
  }
});

const getTickerData = (tickers, from, to) => {
  const endpoint = '/historical';
  const queryParams = `/?ticker=${tickers}&from=${from}&to=${to}`;
  return authorizedAxios.get(
    `${endpoint}${queryParams}`
  );
}

const getTickerList = () => authorizedAxios.get('/tickers');

export const api = {
  getTickerData: (tickers, from, to) => getTickerData(tickers, from, to),
  getTickerList: () => getTickerList()
};

export default api;