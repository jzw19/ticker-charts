import axios from 'axios';

const getTickerData = (tickers, from, to) => {
  const baseURL = 'http://ce-test-api.fly.dev/api/historical/';
  const queryParams = `?ticker=${tickers}&from=${from}&to=${to}`;
  return axios.get(
    // `${baseURL}${queryParams}`,
    'http://ce-test-api.fly.dev/api/historical/?ticker=wmt,tgt&from=2020-01-01&to=2020-02-01',
    {
      headers: {
        'api-token': '1337-time'
      }
    }
  );
}

const getTickerList = () => axios.get('https://ce-test-api.fly.dev/api/historical/');

export const api = {
  getTickerData: (tickers, from, to) => getTickerData(tickers, from, to),
  getTickerList: () => getTickerList()
};

export default api;