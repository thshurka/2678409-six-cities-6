import { render, screen } from '@testing-library/react';
import NotFoundPage from './not-found-page';

describe('Component: NotFoundPage', () => {
  it('должен отрисовать сообщение 404 и ссылку на главную', () => {
    render(<NotFoundPage />);

    expect(screen.getByText('404 Not Found')).toBeInTheDocument();
    expect(screen.getByText('Go to the main page')).toBeInTheDocument();
  });
});
