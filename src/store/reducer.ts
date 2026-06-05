import { createReducer } from '@reduxjs/toolkit';
import { changeCity, fillOffers, setAuthorizationStatus, clearOfferData } from './action';
import { fetchOffers, fetchOffer, fetchNearbyOffers, fetchReviews, submitReview, checkAuth, login, logout } from './api-actions';
import { Offer, DetailedOffer } from '../types/offer';
import { Review } from '../types/review';
import { UserData } from '../types/user';
import { AuthorizationStatus } from '../types/auth';
import { DEFAULT_CITY } from '../const';

type State = {
  city: string;
  offers: Offer[];
  isLoading: boolean;
  authorizationStatus: AuthorizationStatus;
  userData: UserData | null;
  currentOffer: DetailedOffer | null;
  nearbyOffers: Offer[];
  reviews: Review[];
  isOfferLoading: boolean;
  hasOfferLoadError: boolean;
};

const initialState: State = {
  city: DEFAULT_CITY,
  offers: [],
  isLoading: false,
  authorizationStatus: AuthorizationStatus.Unknown,
  userData: null,
  currentOffer: null,
  nearbyOffers: [],
  reviews: [],
  isOfferLoading: false,
  hasOfferLoadError: false,
};

const reducer = createReducer(initialState, (builder) => {
  builder
    .addCase(changeCity, (state, action) => {
      state.city = action.payload;
    })
    .addCase(fillOffers, (state, action) => {
      state.offers = action.payload;
    })
    .addCase(setAuthorizationStatus, (state, action) => {
      state.authorizationStatus = action.payload;
    })
    .addCase(clearOfferData, (state) => {
      state.currentOffer = null;
      state.nearbyOffers = [];
      state.reviews = [];
      state.hasOfferLoadError = false;
    })
    .addCase(fetchOffers.pending, (state) => {
      state.isLoading = true;
    })
    .addCase(fetchOffers.fulfilled, (state, action) => {
      state.offers = action.payload;
      state.isLoading = false;
    })
    .addCase(fetchOffers.rejected, (state) => {
      state.isLoading = false;
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
    .addCase(checkAuth.fulfilled, (state, action) => {
      state.authorizationStatus = AuthorizationStatus.Auth;
      state.userData = action.payload;
    })
    .addCase(checkAuth.rejected, (state) => {
      state.authorizationStatus = AuthorizationStatus.NoAuth;
    })
    .addCase(login.fulfilled, (state, action) => {
      state.authorizationStatus = AuthorizationStatus.Auth;
      state.userData = action.payload;
    })
    .addCase(login.rejected, (state) => {
      state.authorizationStatus = AuthorizationStatus.NoAuth;
    })
    .addCase(logout.fulfilled, (state) => {
      state.authorizationStatus = AuthorizationStatus.NoAuth;
      state.userData = null;
    });
});

export { reducer };
export type { State };
