import { Offer } from '../../types/offer';
import PlaceCard from '../place-card/place-card';

type OffersListProps = {
  offers: Offer[];
  block?: string;
  className?: string;
  onActiveOfferChange?: (id: number | null) => void;
};

function OffersList({
  offers,
  block = 'cities',
  className = 'cities__places-list places__list tabs__content',
  onActiveOfferChange,
}: OffersListProps): JSX.Element {
  return (
    <div className={className}>
      {offers.map((offer) => (
        <PlaceCard
          key={offer.id}
          offer={offer}
          block={block}
          onHover={onActiveOfferChange}
        />
      ))}
    </div>
  );
}

export default OffersList;
