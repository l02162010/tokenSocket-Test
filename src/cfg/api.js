import axios from 'axios'

var config = {
  baseURL: `http://test.comismart.com`,
  timeout: 60 * 1000,
  headers: {
    'Accept': 'application/json',
    'Content-Type': 'application/json',
  },
  transformResponse: [function (data) {
    return JSON.parse(data);
  }],
  defaultInterceptors: true
}

const ApiInstance =  axios.create(config);

export default ApiInstance;
