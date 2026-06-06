import dataProcess, { clearOfferData } from './data-process';
import {
  fetchOffers, fetchOffer, fetchNearbyOffers,
  fetchReviews, submitReview, fetchFavorites, toggleFavorite,
} from '../api-actions';
import { makeFakeOffer, makeFakeOffers, makeFakeDetailedOffer, makeFakeReviews } from '../../utils/mocks';

const makeInitialState = () => ({
  offers: [],
  isLoading: false,
  currentOffer: null,
  nearbyOffers: [],
  reviews: [],
  isOfferLoading: false,
  hasOfferLoadError: false,
  favorites: [],
});

describe('Reducer: dataProcess', () => {
  it('без дополнительных параметров возвращает начальное состояние', () => {
    const result = dataProcess(undefined, { type: 'UNKNOWN_ACTION' });
    expect(result).toEqual(makeInitialState());
  });

  it('fetchOffers.pending: isLoading = true', () => {
    const result = dataProcess(makeInitialState(), { type: fetchOffers.pending.type });
    expect(result.isLoading).toBe(true);
  });

  it('fetchOffers.fulfilled: заполняет offers и снимает isLoading', () => {
    const offers = makeFakeOffers(3);
    const state = { ...makeInitialState(), isLoading: true };
    const result = dataProcess(state, { type: fetchOffers.fulfilled.type, payload: offers });
    expect(result.offers).toEqual(offers);
    expect(result.isLoading).toBe(false);
  });

  it('fetchOffers.rejected: снимает isLoading', () => {
    const state = { ...makeInitialState(), isLoading: true };
    const result = dataProcess(state, { type: fetchOffers.rejected.type });
    expect(result.isLoading).toBe(false);
  });

  it('fetchOffer.pending: isOfferLoading = true, сбрасывает ошибку', () => {
    const state = { ...makeInitialState(), hasOfferLoadError: true };
    const result = dataProcess(state, { type: fetchOffer.pending.type });
    expect(result.isOfferLoading).toBe(true);
    expect(result.hasOfferLoadError).toBe(false);
  });

  it('fetchOffer.fulfilled: записывает currentOffer', () => {
    const offer = makeFakeDetailedOffer();
    const result = dataProcess(makeInitialState(), { type: fetchOffer.fulfilled.type, payload: offer });
    expect(result.currentOffer).toEqual(offer);
    expect(result.isOfferLoading).toBe(false);
  });

  it('fetchOffer.rejected: выставляет флаг ошибки', () => {
    const result = dataProcess(makeInitialState(), { type: fetchOffer.rejected.type });
    expect(result.hasOfferLoadError).toBe(true);
    expect(result.isOfferLoading).toBe(false);
  });

  it('fetchNearbyOffers.fulfilled: записывает максимум 3 предложения', () => {
    const offers = makeFakeOffers(5);
    const result = dataProcess(makeInitialState(), { type: fetchNearbyOffers.fulfilled.type, payload: offers });
    expect(result.nearbyOffers).toHaveLength(3);
  });

  it('fetchReviews.fulfilled: записывает отзывы', () => {
    const reviews = makeFakeReviews(2);
    const result = dataProcess(makeInitialState(), { type: fetchReviews.fulfilled.type, payload: reviews });
    expect(result.reviews).toEqual(reviews);
  });

  it('submitReview.fulfilled: обновляет список отзывов', () => {
    const reviews = makeFakeReviews(2);
    const result = dataProcess(makeInitialState(), { type: submitReview.fulfilled.type, payload: reviews });
    expect(result.reviews).toEqual(reviews);
  });

  it('fetchFavorites.fulfilled: записывает избранное', () => {
    const offers = makeFakeOffers(2);
    const result = dataProcess(makeInitialState(), { type: fetchFavorites.fulfilled.type, payload: offers });
    expect(result.favorites).toEqual(offers);
  });

  it('toggleFavorite.fulfilled: добавляет в избранное и обновляет offers', () => {
    const offer = { ...makeFakeOffer(), isFavorite: false };
    const state = { ...makeInitialState(), offers: [offer], favorites: [] };
    const updated = { ...offer, isFavorite: true };
    const result = dataProcess(state, { type: toggleFavorite.fulfilled.type, payload: updated });
    expect(result.favorites).toContainEqual(updated);
    expect(result.offers[0].isFavorite).toBe(true);
  });

  it('toggleFavorite.fulfilled: удаляет из избранного', () => {
    const offer = { ...makeFakeOffer(), isFavorite: true };
    const state = { ...makeInitialState(), offers: [offer], favorites: [offer] };
    const updated = { ...offer, isFavorite: false };
    const result = dataProcess(state, { type: toggleFavorite.fulfilled.type, payload: updated });
    expect(result.favorites).toHaveLength(0);
  });

  it('clearOfferData: очищает данные предложения', () => {
    const state = {
      ...makeInitialState(),
      currentOffer: makeFakeDetailedOffer(),
      nearbyOffers: makeFakeOffers(3),
      reviews: makeFakeReviews(2),
      hasOfferLoadError: true,
    };
    const result = dataProcess(state, clearOfferData());
    expect(result.currentOffer).toBeNull();
    expect(result.nearbyOffers).toHaveLength(0);
    expect(result.reviews).toHaveLength(0);
    expect(result.hasOfferLoadError).toBe(false);
  });
});
