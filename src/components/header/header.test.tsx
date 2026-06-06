import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import Header from './header';
import { withMockStore, makeMockState } from '../../utils/test-utils';
import { AuthorizationStatus } from '../../types/auth';
import { makeFakeUserData } from '../../utils/mocks';

describe('Component: Header', () => {
  it('гостю показывает ссылку «Sign in»', () => {
    const state = makeMockState({ USER: { authorizationStatus: AuthorizationStatus.NoAuth, userData: null } });
    const { withStoreComponent } = withMockStore(<Header />, state);
    render(withStoreComponent);

    expect(screen.getByText('Sign in')).toBeInTheDocument();
    expect(screen.queryByText('Sign out')).not.toBeInTheDocument();
  });

  it('авторизованному показывает email и кнопку выхода', () => {
    const userData = { ...makeFakeUserData(), email: 'user@test.ru' };
    const state = makeMockState({ USER: { authorizationStatus: AuthorizationStatus.Auth, userData } });
    const { withStoreComponent } = withMockStore(<Header />, state);
    render(withStoreComponent);

    expect(screen.getByText('user@test.ru')).toBeInTheDocument();
    expect(screen.getByText('Sign out')).toBeInTheDocument();
  });

  it('клик по «Sign out» инициирует выход', async () => {
    const userData = makeFakeUserData();
    const state = makeMockState({ USER: { authorizationStatus: AuthorizationStatus.Auth, userData } });
    const { withStoreComponent, mockStore, mockAxiosAdapter } = withMockStore(<Header />, state);
    mockAxiosAdapter.onDelete('/login').reply(204);
    render(withStoreComponent);

    await userEvent.click(screen.getByText('Sign out'));

    const actionTypes = mockStore.getActions().map((action) => action.type);
    expect(actionTypes.some((type) => type.startsWith('user/logout'))).toBe(true);
  });
});
