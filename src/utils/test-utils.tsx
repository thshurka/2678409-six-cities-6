import { ReactElement } from 'react';
import { Provider } from 'react-redux';
import { MemoryRouter } from 'react-router-dom';
import { configureStore } from '@reduxjs/toolkit';
import { Action } from 'redux';
import thunk, { ThunkDispatch } from 'redux-thunk';
import MockAdapter from 'axios-mock-adapter';
import { configureMockStore, MockStoreEnhanced } from '@jedmao/redux-mock-store';
import { AxiosInstance } from 'axios';
import { createAPI } from '../api';
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

type AppThunkDispatch = ThunkDispatch<RootState, AxiosInstance, Action>;

type MockStoreResult = {
  withStoreComponent: JSX.Element;
  mockStore: MockStoreEnhanced<RootState, Action<string>, AppThunkDispatch>;
  mockAxiosAdapter: MockAdapter;
};

export const withMockStore = (
  component: ReactElement,
  state: RootState = makeMockState(),
  initialRoute = '/'
): MockStoreResult => {
  const axios = createAPI();
  const mockAxiosAdapter = new MockAdapter(axios);
  const middleware = [thunk.withExtraArgument(axios)];
  const mockStoreCreator = configureMockStore<RootState, Action<string>, AppThunkDispatch>(middleware);
  const mockStore = mockStoreCreator(state);

  return {
    withStoreComponent: (
      <Provider store={mockStore}>
        <MemoryRouter initialEntries={[initialRoute]}>
          {component}
        </MemoryRouter>
      </Provider>
    ),
    mockStore,
    mockAxiosAdapter,
  };
};
