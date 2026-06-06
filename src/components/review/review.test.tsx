import { render, screen } from '@testing-library/react';
import Review from './review';
import { makeFakeReview } from '../../utils/mocks';

describe('Component: Review', () => {
  it('должен отрисовать имя автора, текст и аватар', () => {
    const review = { ...makeFakeReview(), comment: 'Wonderful place', date: '2019-04-24T00:00:00.000Z' };
    review.user.name = 'Max';

    render(<Review review={review} />);

    expect(screen.getByText('Max')).toBeInTheDocument();
    expect(screen.getByText('Wonderful place')).toBeInTheDocument();
    expect(screen.getByAltText('Reviews avatar')).toBeInTheDocument();
  });

  it('должен отформатировать дату в виде "Месяц Год"', () => {
    const review = { ...makeFakeReview(), date: '2019-04-24T00:00:00.000Z' };

    render(<Review review={review} />);

    expect(screen.getByText('April 2019')).toBeInTheDocument();
  });
});
