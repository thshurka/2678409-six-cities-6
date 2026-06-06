import { createAsyncThunk } from '@reduxjs/toolkit';
import { AxiosInstance } from 'axios';
import { Offer, DetailedOffer } from '../types/offer';
import { UserData } from '../types/user';
import { Review } from '../types/review';
import { saveToken, dropToken } from '../services/token';

type LoginCredentials = {
  email: string;
  password: string;
};

type ReviewData = {
  id: string;
  comment: string;
  rating: number;
};


export const fetchOffers = createAsyncThunk<Offer[], undefined, { extra: AxiosInstance }>(
  'data/fetchOffers',
  async (_arg, { extra: api }) => {
    const { data } = await api.get<Offer[]>('/offers');
    return data;
  }
);

export const fetchOffer = createAsyncThunk<DetailedOffer, string, { extra: AxiosInstance }>(
  'offer/fetchOffer',
  async (id, { extra: api }) => {
    const { data } = await api.get<DetailedOffer>(`/offers/${id}`);
    return data;
  }
);

export const fetchNearbyOffers = createAsyncThunk<Offer[], string, { extra: AxiosInstance }>(
  'offer/fetchNearbyOffers',
  async (id, { extra: api }) => {
    const { data } = await api.get<Offer[]>(`/offers/${id}/nearby`);
    return data;
  }
);

export const fetchReviews = createAsyncThunk<Review[], string, { extra: AxiosInstance }>(
  'offer/fetchReviews',
  async (id, { extra: api }) => {
    const { data } = await api.get<Review[]>(`/comments/${id}`);
    return data;
  }
);

export const submitReview = createAsyncThunk<Review[], ReviewData, { extra: AxiosInstance }>(
  'offer/submitReview',
  async ({ id, comment, rating }, { extra: api }) => {
    const { data } = await api.post<Review[]>(`/comments/${id}`, { comment, rating });
    return data;
  }
);

export const fetchFavorites = createAsyncThunk<Offer[], undefined, { extra: AxiosInstance }>(
  'data/fetchFavorites',
  async (_arg, { extra: api }) => {
    const { data } = await api.get<Offer[]>('/favorite');
    return data;
  }
);

export const toggleFavorite = createAsyncThunk<Offer, { id: string; status: 0 | 1 }, { extra: AxiosInstance }>(
  'data/toggleFavorite',
  async ({ id, status }, { extra: api }) => {
    const { data } = await api.post<Offer>(`/favorite/${id}/${status}`);
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
