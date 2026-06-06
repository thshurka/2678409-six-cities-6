import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import CityList from './city-list';
import { CITIES } from '../../const';
import { withMockStore, makeMockState } from '../../utils/test-utils';
import { changeCity } from '../../store/slices/app-process';

describe('Component: CityList', () => {
  it('должен отрисовать все шесть городов', () => {
    const { withStoreComponent } = withMockStore(<CityList activeCity="Paris" />, makeMockState());
    render(withStoreComponent);

    CITIES.forEach((city) => {
      expect(screen.getByText(city)).toBeInTheDocument();
    });
  });

  it('клик по городу диспатчит changeCity с выбранным городом', async () => {
    const { withStoreComponent, mockStore } = withMockStore(<CityList activeCity="Paris" />, makeMockState());
    render(withStoreComponent);

    await userEvent.click(screen.getByText('Amsterdam'));

    expect(mockStore.getActions()).toContainEqual(changeCity('Amsterdam'));
  });
});
