import axios from 'axios'

export var config = {
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

export const ApiInstance =  axios.create(config);
