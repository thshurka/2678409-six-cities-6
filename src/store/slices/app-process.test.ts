import appProcess, { changeCity } from './app-process';
import { DEFAULT_CITY } from '../../const';

describe('Reducer: appProcess', () => {
  it('без дополнительных параметров возвращает начальное состояние', () => {
    const result = appProcess(undefined, { type: 'UNKNOWN_ACTION' });
    expect(result).toEqual({ city: DEFAULT_CITY });
  });

  it('должен обновить город при changeCity', () => {
    const state = { city: 'Paris' };
    const result = appProcess(state, changeCity('Amsterdam'));
    expect(result).toEqual({ city: 'Amsterdam' });
  });

  it('не мутирует исходное состояние', () => {
    const state = { city: 'Paris' };
    appProcess(state, changeCity('Cologne'));
    expect(state).toEqual({ city: 'Paris' });
  });
});
