import { render, screen } from '@testing-library/react';
import { Routes, Route } from 'react-router-dom';
import PrivateRoute from './private-route';
import { withMockStore, makeMockState } from '../../utils/test-utils';
import { AuthorizationStatus } from '../../types/auth';

const PrivateContent = () => <h1>Private content</h1>;
const LoginContent = () => <h1>Login page</h1>;

const renderPrivateRoute = (authorizationStatus: AuthorizationStatus) => {
  const state = makeMockState({ USER: { authorizationStatus, userData: null } });
  const { withStoreComponent } = withMockStore(
    <Routes>
      <Route path="/login" element={<LoginContent />} />
      <Route
        path="/private"
        element={
          <PrivateRoute>
            <PrivateContent />
          </PrivateRoute>
        }
      />
    </Routes>,
    state,
    '/private'
  );
  render(withStoreComponent);
};

describe('Component: PrivateRoute', () => {
  it('показывает спиннер при статусе Unknown', () => {
    renderPrivateRoute(AuthorizationStatus.Unknown);
    expect(screen.getByText('Loading...')).toBeInTheDocument();
    expect(screen.queryByText('Private content')).not.toBeInTheDocument();
  });

  it('показывает приватный контент авторизованному пользователю', () => {
    renderPrivateRoute(AuthorizationStatus.Auth);
    expect(screen.getByText('Private content')).toBeInTheDocument();
  });

  it('перенаправляет гостя на страницу входа', () => {
    renderPrivateRoute(AuthorizationStatus.NoAuth);
    expect(screen.getByText('Login page')).toBeInTheDocument();
    expect(screen.queryByText('Private content')).not.toBeInTheDocument();
  });
});
