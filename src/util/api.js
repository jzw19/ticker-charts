import axios from 'axios';

const getTickerData = (tickers, from, to) => {
  const baseURL = 'http://137.184.195.46:8001/api/historical/';
  const queryParams = `?ticker=${tickers}&from=${from}&to=${to}`;
  return axios.get(
    `${baseURL}${queryParams}`,
    // 'http://137.184.195.46:8001/api/historical/?ticker=wmt,tgt&from=2020-01-01&to=2020-02-01',
    {
      headers: {
        'api-token': '1337-time'
      }
    }
  );
}

const getMockTickerData = () => {
  return Promise.resolve({
    "2018-01-02": {
      "WMT": {
        "ticker": "WMT",
        "name": "Walmart",
        "close": "98.59",
        "open": "99.30",
        "day_range": "1.27"
      },
      "TGT": {
        "ticker": "TGT",
        "name": "Target",
        "close": "67.63",
        "open": "65.95",
        "day_range": "2.18"
      }
    },
    "2018-01-03": {
      "WMT": {
        "ticker": "WMT",
        "name": "Walmart",
        "close": "99.45",
        "open": "98.85",
        "day_range": "1.23"
      },
      "TGT": {
        "ticker": "TGT",
        "name": "Target",
        "close": "67.17",
        "open": "68.63",
        "day_range": "1.74"
      }
    }
  });
}

export const api = {
  getTickerData: (tickers, from, to) => getTickerData(tickers, from, to),
  getMockTickerData: () => getMockTickerData()
};

export default api;