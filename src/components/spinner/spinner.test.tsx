import { render, screen } from '@testing-library/react';
import Spinner from './spinner';

describe('Component: Spinner', () => {
  it('должен корректно отрисоваться', () => {
    render(<Spinner />);
    expect(screen.getByText('Loading...')).toBeInTheDocument();
  });
});
