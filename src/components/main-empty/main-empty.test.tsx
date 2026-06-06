import { render, screen } from '@testing-library/react';
import MainEmpty from './main-empty';

describe('Component: MainEmpty', () => {
  it('должен отрисовать сообщение об отсутствии предложений с названием города', () => {
    render(<MainEmpty city="Amsterdam" />);

    expect(screen.getByText('No places to stay available')).toBeInTheDocument();
    expect(screen.getByText(/We could not find any property available at the moment in Amsterdam/)).toBeInTheDocument();
  });
});
