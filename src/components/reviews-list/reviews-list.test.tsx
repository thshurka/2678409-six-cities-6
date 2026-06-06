import { render, screen } from '@testing-library/react';
import ReviewsList from './reviews-list';
import { makeFakeReviews } from '../../utils/mocks';

describe('Component: ReviewsList', () => {
  it('должен отрисовать количество отзывов в заголовке', () => {
    const reviews = makeFakeReviews(3);

    render(<ReviewsList reviews={reviews} />);

    expect(screen.getByText('3')).toBeInTheDocument();
  });

  it('должен отрисовать не больше 10 отзывов', () => {
    const reviews = makeFakeReviews(15);

    render(<ReviewsList reviews={reviews} />);

    const items = screen.getAllByRole('listitem');
    expect(items).toHaveLength(10);
  });
});
