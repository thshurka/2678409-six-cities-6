import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Routes, Route } from 'react-router-dom';
import PlaceCard from './place-card';
import { makeFakeOffer } from '../../utils/mocks';
import { withMockStore, makeMockState } from '../../utils/test-utils';
import { AuthorizationStatus } from '../../types/auth';
import { toggleFavorite } from '../../store/api-actions';

describe('Component: PlaceCard', () => {
  it('должен отрисовать заголовок, цену и тип предложения', () => {
    const offer = { ...makeFakeOffer(), title: 'Beautiful apartment', price: 120, type: 'apartment' as const };
    const { withStoreComponent } = withMockStore(<PlaceCard offer={offer} />, makeMockState());
    render(withStoreComponent);

    expect(screen.getByText('Beautiful apartment')).toBeInTheDocument();
    expect(screen.getByText(/120/)).toBeInTheDocument();
    expect(screen.getByText('Apartment')).toBeInTheDocument();
  });

  it('должен отрисовать метку Premium для премиального предложения', () => {
    const offer = { ...makeFakeOffer(), isPremium: true };
    const { withStoreComponent } = withMockStore(<PlaceCard offer={offer} />, makeMockState());
    render(withStoreComponent);

    expect(screen.getByText('Premium')).toBeInTheDocument();
  });

  it('не должен отрисовывать метку Premium для обычного предложения', () => {
    const offer = { ...makeFakeOffer(), isPremium: false };
    const { withStoreComponent } = withMockStore(<PlaceCard offer={offer} />, makeMockState());
    render(withStoreComponent);

    expect(screen.queryByText('Premium')).not.toBeInTheDocument();
  });

  it('вызывает onHover при наведении на карточку', async () => {
    const offer = makeFakeOffer();
    const handleHover = vi.fn();
    const { withStoreComponent } = withMockStore(<PlaceCard offer={offer} onHover={handleHover} />, makeMockState());
    render(withStoreComponent);

    await userEvent.hover(screen.getByRole('article'));

    expect(handleHover).toHaveBeenCalledWith(offer.id);
  });

  it('авторизованный пользователь по клику на «Избранное» диспатчит toggleFavorite', async () => {
    const offer = { ...makeFakeOffer(), isFavorite: false };
    const state = makeMockState({ USER: { authorizationStatus: AuthorizationStatus.Auth, userData: null } });
    const { withStoreComponent, mockStore, mockAxiosAdapter } = withMockStore(<PlaceCard offer={offer} />, state);
    mockAxiosAdapter.onPost(`/favorite/${offer.id}/1`).reply(200, offer);
    render(withStoreComponent);

    await userEvent.click(screen.getByRole('button'));

    const actionTypes = mockStore.getActions().map((action) => action.type);
    expect(actionTypes).toContain(toggleFavorite.pending.type);
  });

  it('гостя по клику на «Избранное» перенаправляет на страницу входа', async () => {
    const offer = makeFakeOffer();
    const state = makeMockState({ USER: { authorizationStatus: AuthorizationStatus.NoAuth, userData: null } });
    const { withStoreComponent } = withMockStore(
      <Routes>
        <Route path="/" element={<PlaceCard offer={offer} />} />
        <Route path="/login" element={<h1>Login page</h1>} />
      </Routes>,
      state,
      '/'
    );
    render(withStoreComponent);

    await userEvent.click(screen.getByRole('button'));

    expect(screen.getByText('Login page')).toBeInTheDocument();
  });
});
