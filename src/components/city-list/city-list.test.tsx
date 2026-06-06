import { render, screen } from '@testing-library/react';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import CityList from './city-list';
import { CITIES } from '../../const';

describe('Component: CityList', () => {
  const store = configureStore({
    reducer: { APP: (state: { city: string } = { city: 'Paris' }) => state },
  });

  it('должен отрисовать все шесть городов', () => {
    render(
      <Provider store={store}>
        <CityList activeCity="Paris" />
      </Provider>
    );

    CITIES.forEach((city) => {
      expect(screen.getByText(city)).toBeInTheDocument();
    });
  });
});
