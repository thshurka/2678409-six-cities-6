import { render, screen } from '@testing-library/react';
import PlaceCard from './place-card';
import { makeFakeOffer } from '../../utils/mocks';
import { withProviders, makeMockState } from '../../utils/test-utils';

describe('Component: PlaceCard', () => {
  it('должен отрисовать заголовок, цену и тип предложения', () => {
    const offer = {
      ...makeFakeOffer(),
      title: 'Beautiful apartment',
      price: 120,
      type: 'apartment' as const,
    };

    render(withProviders(<PlaceCard offer={offer} />, makeMockState()));

    expect(screen.getByText('Beautiful apartment')).toBeInTheDocument();
    expect(screen.getByText(/120/)).toBeInTheDocument();
    expect(screen.getByText('Apartment')).toBeInTheDocument();
  });

  it('должен отрисовать метку Premium для премиального предложения', () => {
    const offer = { ...makeFakeOffer(), isPremium: true };

    render(withProviders(<PlaceCard offer={offer} />, makeMockState()));

    expect(screen.getByText('Premium')).toBeInTheDocument();
  });

  it('не должен отрисовывать метку Premium для обычного предложения', () => {
    const offer = { ...makeFakeOffer(), isPremium: false };

    render(withProviders(<PlaceCard offer={offer} />, makeMockState()));

    expect(screen.queryByText('Premium')).not.toBeInTheDocument();
  });
});
