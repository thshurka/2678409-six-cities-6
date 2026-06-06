import { configureStore } from '@reduxjs/toolkit';
import MockAdapter from 'axios-mock-adapter';
import { createAPI } from '../api';
import {
  fetchOffers, fetchOffer, fetchNearbyOffers,
  fetchReviews, submitReview, fetchFavorites, toggleFavorite,
} from './api-actions';
import { makeFakeOffer, makeFakeOffers, makeFakeDetailedOffer, makeFakeReviews } from '../utils/mocks';

describe('Async actions', () => {
  const api = createAPI();
  const mockApi = new MockAdapter(api);

  const createMockStore = () =>
    configureStore({
      reducer: { test: (state: Record<string, never> = {}) => state },
      middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware({ thunk: { extraArgument: api } }),
    });

  it('fetchOffers: при 200 диспатчит fulfilled с данными', async () => {
    const offers = makeFakeOffers(3);
    mockApi.onGet('/offers').reply(200, offers);
    const store = createMockStore();

    const result = await store.dispatch(fetchOffers());

    expect(result.type).toBe(fetchOffers.fulfilled.type);
    expect(result.payload).toEqual(offers);
  });

  it('fetchOffers: при 400 диспатчит rejected', async () => {
    mockApi.onGet('/offers').reply(400, []);
    const store = createMockStore();

    const result = await store.dispatch(fetchOffers());
    expect(result.type).toBe(fetchOffers.rejected.type);
  });

  it('fetchOffer: запрашивает предложение по id', async () => {
    const offer = makeFakeDetailedOffer();
    mockApi.onGet(`/offers/${offer.id}`).reply(200, offer);
    const store = createMockStore();

    const result = await store.dispatch(fetchOffer(offer.id));
    expect(result.type).toBe(fetchOffer.fulfilled.type);
    expect(result.payload).toEqual(offer);
  });

  it('fetchNearbyOffers: запрашивает предложения неподалёку', async () => {
    const id = 'test-id';
    const offers = makeFakeOffers(3);
    mockApi.onGet(`/offers/${id}/nearby`).reply(200, offers);
    const store = createMockStore();

    const result = await store.dispatch(fetchNearbyOffers(id));
    expect(result.type).toBe(fetchNearbyOffers.fulfilled.type);
    expect(result.payload).toEqual(offers);
  });

  it('fetchReviews: запрашивает комментарии по id', async () => {
    const id = 'test-id';
    const reviews = makeFakeReviews(2);
    mockApi.onGet(`/comments/${id}`).reply(200, reviews);
    const store = createMockStore();

    const result = await store.dispatch(fetchReviews(id));
    expect(result.type).toBe(fetchReviews.fulfilled.type);
    expect(result.payload).toEqual(reviews);
  });

  it('submitReview: отправляет комментарий POST-запросом', async () => {
    const id = 'test-id';
    const reviews = makeFakeReviews(1);
    mockApi.onPost(`/comments/${id}`).reply(200, reviews);
    const store = createMockStore();

    const result = await store.dispatch(submitReview({ id, comment: 'Great place to stay for a long time', rating: 5 }));
    expect(result.type).toBe(submitReview.fulfilled.type);
    expect(result.payload).toEqual(reviews);
  });

  it('fetchFavorites: запрашивает избранное', async () => {
    const offers = makeFakeOffers(2);
    mockApi.onGet('/favorite').reply(200, offers);
    const store = createMockStore();

    const result = await store.dispatch(fetchFavorites());
    expect(result.type).toBe(fetchFavorites.fulfilled.type);
    expect(result.payload).toEqual(offers);
  });

  it('toggleFavorite: меняет статус избранного POST-запросом', async () => {
    const offer = makeFakeOffer();
    mockApi.onPost(`/favorite/${offer.id}/1`).reply(200, offer);
    const store = createMockStore();

    const result = await store.dispatch(toggleFavorite({ id: offer.id, status: 1 }));
    expect(result.type).toBe(toggleFavorite.fulfilled.type);
    expect(result.payload).toEqual(offer);
  });
});
