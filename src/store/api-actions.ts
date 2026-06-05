import { createAsyncThunk } from '@reduxjs/toolkit';
import { AxiosInstance } from 'axios';
import { Offer } from '../types/offer';
import { UserData } from '../types/user';
import { saveToken, dropToken } from '../services/token';

type LoginCredentials = {
  login: string;
  password: string;
};

export const fetchOffers = createAsyncThunk<Offer[], undefined, { extra: AxiosInstance }>(
  'data/fetchOffers',
  async (_arg, { extra: api }) => {
    const { data } = await api.get<Offer[]>('/offers');
    return data;
  }
);

export const checkAuth = createAsyncThunk<UserData, undefined, { extra: AxiosInstance }>(
  'user/checkAuth',
  async (_arg, { extra: api }) => {
    const { data } = await api.get<UserData>('/login');
    return data;
  }
);

export const login = createAsyncThunk<UserData, LoginCredentials, { extra: AxiosInstance }>(
  'user/login',
  async (credentials, { extra: api }) => {
    const { data } = await api.post<UserData>('/login', credentials);
    saveToken(data.token);
    return data;
  }
);

export const logout = createAsyncThunk<void, undefined, { extra: AxiosInstance }>(
  'user/logout',
  async (_arg, { extra: api }) => {
    await api.delete('/login');
    dropToken();
  }
);
