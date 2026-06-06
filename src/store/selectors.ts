import { createSelector } from '@reduxjs/toolkit';
import { RootState } from '.';

// APP selectors
export const selectCity = (state: RootState) => state.APP.city;

// DATA selectors
export const selectOffers = (state: RootState) => state.DATA.offers;
export const selectIsLoading = (state: RootState) => state.DATA.isLoading;
export const selectCurrentOffer = (state: RootState) => state.DATA.currentOffer;
export const selectNearbyOffers = (state: RootState) => state.DATA.nearbyOffers;
export const selectReviews = (state: RootState) => state.DATA.reviews;
export const selectIsOfferLoading = (state: RootState) => state.DATA.isOfferLoading;
export const selectHasOfferLoadError = (state: RootState) => state.DATA.hasOfferLoadError;

// USER selectors
export const selectAuthorizationStatus = (state: RootState) => state.USER.authorizationStatus;
export const selectUserData = (state: RootState) => state.USER.userData;

// Memoized derived selectors
export const selectCityOffers = createSelector(
  selectOffers,
  selectCity,
  (offers, city) => offers.filter((offer) => offer.city.name === city)
);
