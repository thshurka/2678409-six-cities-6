import { createReducer } from '@reduxjs/toolkit';
import { changeCity, fillOffers } from './action';
import { fetchOffers } from './api-actions';
import { Offer } from '../types/offer';
import { DEFAULT_CITY } from '../const';

type State = {
  city: string;
  offers: Offer[];
  isLoading: boolean;
};

const initialState: State = {
  city: DEFAULT_CITY,
  offers: [],
  isLoading: false,
};

const reducer = createReducer(initialState, (builder) => {
  builder
    .addCase(changeCity, (state, action) => {
      state.city = action.payload;
    })
    .addCase(fillOffers, (state, action) => {
      state.offers = action.payload;
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
    });
});

export { reducer };
export type { State };
