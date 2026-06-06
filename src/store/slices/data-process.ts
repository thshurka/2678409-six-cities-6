import { createSlice } from '@reduxjs/toolkit';
import { Offer, DetailedOffer } from '../../types/offer';
import { Review } from '../../types/review';
import {
  fetchOffers, fetchOffer, fetchNearbyOffers,
  fetchReviews, submitReview,
  fetchFavorites, toggleFavorite,
} from '../api-actions';

type DataProcess = {
  offers: Offer[];
  isLoading: boolean;
  currentOffer: DetailedOffer | null;
  nearbyOffers: Offer[];
  reviews: Review[];
  isOfferLoading: boolean;
  hasOfferLoadError: boolean;
  hasOffersLoadError: boolean;
  favorites: Offer[];
};

const initialState: DataProcess = {
  offers: [],
  isLoading: false,
  currentOffer: null,
  nearbyOffers: [],
  reviews: [],
  isOfferLoading: false,
  hasOfferLoadError: false,
  hasOffersLoadError: false,
  favorites: [],
};

const dataProcess = createSlice({
  name: 'DATA',
  initialState,
  reducers: {
    clearOfferData: (state) => {
      state.currentOffer = null;
      state.nearbyOffers = [];
      state.reviews = [];
      state.hasOfferLoadError = false;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchOffers.pending, (state) => {
        state.isLoading = true;
        state.hasOffersLoadError = false;
      })
      .addCase(fetchOffers.fulfilled, (state, action) => {
        state.offers = action.payload;
        state.isLoading = false;
      })
      .addCase(fetchOffers.rejected, (state) => {
        state.isLoading = false;
        state.hasOffersLoadError = true;
      })
      .addCase(fetchOffer.pending, (state) => {
        state.isOfferLoading = true;
        state.hasOfferLoadError = false;
      })
      .addCase(fetchOffer.fulfilled, (state, action) => {
        state.currentOffer = action.payload;
        state.isOfferLoading = false;
      })
      .addCase(fetchOffer.rejected, (state) => {
        state.isOfferLoading = false;
        state.hasOfferLoadError = true;
      })
      .addCase(fetchNearbyOffers.fulfilled, (state, action) => {
        state.nearbyOffers = action.payload.slice(0, 3);
      })
      .addCase(fetchReviews.fulfilled, (state, action) => {
        state.reviews = action.payload;
      })
      .addCase(submitReview.fulfilled, (state, action) => {
        state.reviews = action.payload;
      })
      .addCase(fetchFavorites.fulfilled, (state, action) => {
        state.favorites = action.payload;
      })
      .addCase(toggleFavorite.fulfilled, (state, action) => {
        const updated = action.payload;
        // Обновляем в общем списке предложений
        const idx = state.offers.findIndex((o) => o.id === updated.id);
        if (idx !== -1) {
          state.offers[idx] = updated;
        }
        // Обновляем список избранного
        if (updated.isFavorite) {
          state.favorites = [...state.favorites.filter((o) => o.id !== updated.id), updated];
        } else {
          state.favorites = state.favorites.filter((o) => o.id !== updated.id);
        }
      });
  },
});

export const { clearOfferData } = dataProcess.actions;
export default dataProcess.reducer;
