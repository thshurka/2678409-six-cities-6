import { renderHook } from '@testing-library/react';
import { Provider } from 'react-redux';
import { PropsWithChildren } from 'react';
import { useAppDispatch, useAppSelector } from './index';
import { withMockStore, makeMockState } from '../utils/test-utils';
import { changeCity } from '../store/slices/app-process';

describe('Custom hooks', () => {
  const state = makeMockState({ APP: { city: 'Amsterdam' } });
  const { mockStore } = withMockStore(<div />, state);

  const wrapper = ({ children }: PropsWithChildren) => (
    <Provider store={mockStore}>{children}</Provider>
  );

  it('useAppSelector возвращает значение из store', () => {
    const { result } = renderHook(() => useAppSelector((s) => s.APP.city), { wrapper });
    expect(result.current).toBe('Amsterdam');
  });

  it('useAppDispatch возвращает функцию dispatch', () => {
    const { result } = renderHook(() => useAppDispatch(), { wrapper });
    expect(typeof result.current).toBe('function');

    result.current(changeCity('Paris'));
    const actions = mockStore.getActions();
    expect(actions).toContainEqual(changeCity('Paris'));
  });
});
