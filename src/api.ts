import axios, { AxiosError } from 'axios';
import { StatusCodes } from 'http-status-codes';
import { getToken, dropToken } from './services/token';

const BACKEND_URL = 'https://14.design.htmlacademy.pro/six-cities';
const TIMEOUT = 5000;

export const createAPI = () => {
  const api = axios.create({
    baseURL: BACKEND_URL,
    timeout: TIMEOUT,
  });

  api.interceptors.request.use((config) => {
    const token = getToken();
    if (token) {
      config.headers['X-Token'] = token;
    }
    return config;
  });

  api.interceptors.response.use(
    (response) => response,
    (error: AxiosError) => {
      if (error.response?.status === StatusCodes.UNAUTHORIZED) {
        dropToken();
      }
      return Promise.reject(error);
    }
  );

  return api;
};
