import userProcess from './user-process';
import { checkAuth, login, logout } from '../api-actions';
import { AuthorizationStatus } from '../../types/auth';
import { makeFakeUserData } from '../../utils/mocks';

describe('Reducer: userProcess', () => {
  const initialState = {
    authorizationStatus: AuthorizationStatus.Unknown,
    userData: null,
  };

  it('без дополнительных параметров возвращает начальное состояние', () => {
    const result = userProcess(undefined, { type: 'UNKNOWN_ACTION' });
    expect(result).toEqual(initialState);
  });

  it('checkAuth.fulfilled: статус Auth и данные пользователя', () => {
    const user = makeFakeUserData();
    const result = userProcess(initialState, { type: checkAuth.fulfilled.type, payload: user });
    expect(result).toEqual({
      authorizationStatus: AuthorizationStatus.Auth,
      userData: user,
    });
  });

  it('checkAuth.rejected: статус NoAuth', () => {
    const result = userProcess(initialState, { type: checkAuth.rejected.type });
    expect(result.authorizationStatus).toBe(AuthorizationStatus.NoAuth);
  });

  it('login.fulfilled: статус Auth и данные пользователя', () => {
    const user = makeFakeUserData();
    const result = userProcess(initialState, { type: login.fulfilled.type, payload: user });
    expect(result).toEqual({
      authorizationStatus: AuthorizationStatus.Auth,
      userData: user,
    });
  });

  it('login.rejected: статус NoAuth', () => {
    const result = userProcess(initialState, { type: login.rejected.type });
    expect(result.authorizationStatus).toBe(AuthorizationStatus.NoAuth);
  });

  it('logout.fulfilled: статус NoAuth и сброс данных', () => {
    const authState = {
      authorizationStatus: AuthorizationStatus.Auth,
      userData: makeFakeUserData(),
    };
    const result = userProcess(authState, { type: logout.fulfilled.type });
    expect(result).toEqual({
      authorizationStatus: AuthorizationStatus.NoAuth,
      userData: null,
    });
  });
});
