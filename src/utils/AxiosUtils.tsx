import {AxiosStatic} from 'axios';

export function setupAxios(axios: AxiosStatic) {
  axios.defaults.headers.Accept = 'application/json';
  axios.defaults.baseURL = 'http://10.0.2.2:8002';
}
