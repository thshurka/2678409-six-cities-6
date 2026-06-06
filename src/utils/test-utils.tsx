import { ReactElement } from 'react';
import { Provider } from 'react-redux';
import { MemoryRouter } from 'react-router-dom';
import { configureStore } from '@reduxjs/toolkit';
import { AuthorizationStatus } from '../types/auth';
import { RootState } from '../store';

export const makeMockState = (initial: Partial<{
  APP: Partial<RootState['APP']>;
  DATA: Partial<RootState['DATA']>;
  USER: Partial<RootState['USER']>;
}> = {}): RootState => ({
  APP: {
    city: 'Paris',
    ...initial.APP,
  },
  DATA: {
    offers: [],
    isLoading: false,
    currentOffer: null,
    nearbyOffers: [],
    reviews: [],
    isOfferLoading: false,
    hasOfferLoadError: false,
    favorites: [],
    ...initial.DATA,
  },
  USER: {
    authorizationStatus: AuthorizationStatus.NoAuth,
    userData: null,
    ...initial.USER,
  },
});

export const withProviders = (
  component: ReactElement,
  state: RootState = makeMockState(),
  initialRoute = '/'
) => {
  const store = configureStore({
    reducer: (s: RootState = state): RootState => s,
  });

  return (
    <Provider store={store}>
      <MemoryRouter initialEntries={[initialRoute]}>
        {component}
      </MemoryRouter>
    </Provider>
  );
};
