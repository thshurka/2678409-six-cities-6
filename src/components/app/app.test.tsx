import { render, screen } from '@testing-library/react';
import App from './app';
import { withProviders, makeMockState } from '../../utils/test-utils';
import { AuthorizationStatus } from '../../types/auth';

describe('Routing: App', () => {
  it('по маршруту "/" должна отрисоваться главная страница', () => {
    render(withProviders(<App />, makeMockState(), '/'));

    expect(screen.getByText('No places to stay available')).toBeInTheDocument();
  });

  it('по маршруту "/login" должна отрисоваться страница входа', () => {
    render(withProviders(<App />, makeMockState(), '/login'));

    expect(screen.getByRole('heading', { name: 'Sign in' })).toBeInTheDocument();
  });

  it('по несуществующему маршруту перенаправляет на страницу 404', () => {
    render(withProviders(<App />, makeMockState(), '/non-existent-route'));

    expect(screen.getByText('404 Not Found')).toBeInTheDocument();
  });

  it('гостя по маршруту "/favorites" перенаправляет на страницу входа', () => {
    const state = makeMockState({ USER: { authorizationStatus: AuthorizationStatus.NoAuth, userData: null } });
    render(withProviders(<App />, state, '/favorites'));

    expect(screen.getByRole('heading', { name: 'Sign in' })).toBeInTheDocument();
  });
});
