import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import LoginPage from './login-page';
import { withMockStore, makeMockState } from '../../utils/test-utils';
import { login } from '../../store/api-actions';
import { changeCity } from '../../store/slices/app-process';
import { CITIES } from '../../const';

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

  it('клик по кнопке случайного города диспатчит changeCity', async () => {
    const { withStoreComponent, mockStore } = withMockStore(<LoginPage />, makeMockState());
    render(withStoreComponent);

    const cityLink = screen.getByRole('link', { name: new RegExp(CITIES.join('|')) });
    await userEvent.click(cityLink);

    const cityActions = mockStore.getActions().filter((action) => action.type === changeCity.type) as unknown as { payload: string }[];
    expect(cityActions).toHaveLength(1);
    expect(CITIES).toContain(cityActions[0].payload);
  });
});
