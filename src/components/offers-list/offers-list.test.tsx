import { render, screen } from '@testing-library/react';
import OffersList from './offers-list';
import { makeFakeOffers } from '../../utils/mocks';
import { withProviders, makeMockState } from '../../utils/test-utils';

describe('Component: OffersList', () => {
  it('должен отрисовать столько карточек, сколько передано предложений', () => {
    const offers = makeFakeOffers(4);

    render(withProviders(<OffersList offers={offers} />, makeMockState()));

    const cards = screen.getAllByRole('article');
    expect(cards).toHaveLength(4);
  });

  it('не должен отрисовывать карточки для пустого списка', () => {
    render(withProviders(<OffersList offers={[]} />, makeMockState()));

    expect(screen.queryByRole('article')).not.toBeInTheDocument();
  });
});
