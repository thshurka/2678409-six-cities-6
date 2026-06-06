import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import LoginPage from './login-page';
import { withMockStore, makeMockState } from '../../utils/test-utils';
import { login } from '../../store/api-actions';

describe('Component: LoginPage', () => {
  it('должен отрисовать форму входа', () => {
    const { withStoreComponent } = withMockStore(<LoginPage />, makeMockState());
    render(withStoreComponent);

    expect(screen.getByRole('heading', { name: 'Sign in' })).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Email')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Password')).toBeInTheDocument();
  });

  it('при отправке валидных данных диспатчит login', async () => {
    const state = makeMockState();
    const { withStoreComponent, mockStore, mockAxiosAdapter } = withMockStore(<LoginPage />, state);
    mockAxiosAdapter.onPost('/login').reply(200, { token: 'secret' });
    render(withStoreComponent);

    await userEvent.type(screen.getByPlaceholderText('Email'), 'test@test.ru');
    await userEvent.type(screen.getByPlaceholderText('Password'), 'pass123');
    await userEvent.click(screen.getByRole('button', { name: 'Sign in' }));

    const actionTypes = mockStore.getActions().map((action) => action.type);
    expect(actionTypes).toContain(login.pending.type);
  });
});
