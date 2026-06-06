import { memo } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Offer } from '../../types/offer';
import { AuthorizationStatus } from '../../types/auth';
import { useAppDispatch, useAppSelector } from '../../hooks';
import { toggleFavorite } from '../../store/api-actions';
import { selectAuthorizationStatus } from '../../store/selectors';

type PlaceCardProps = {
  offer: Offer;
  block?: string;
  onHover?: (id: string | null) => void;
};

function PlaceCard({ offer, block = 'cities', onHover }: PlaceCardProps): JSX.Element {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const authorizationStatus = useAppSelector(selectAuthorizationStatus);
  const ratingWidth = Math.round(offer.rating) * 20;

  const handleBookmarkClick = () => {
    if (authorizationStatus !== AuthorizationStatus.Auth) {
      navigate('/login');
      return;
    }
    dispatch(toggleFavorite({ id: offer.id, status: offer.isFavorite ? 0 : 1 }));
  };

  return (
    <article
      className={`${block}__card place-card`}
      onMouseEnter={() => onHover?.(offer.id)}
      onMouseLeave={() => onHover?.(null)}
    >
      {offer.isPremium && (
        <div className="place-card__mark">
          <span>Premium</span>
        </div>
      )}
      <div className={`${block}__image-wrapper place-card__image-wrapper`}>
        <Link to={`/offer/${offer.id}`}>
          <img className="place-card__image" src={offer.previewImage} width="260" height="200" alt={offer.title} />
        </Link>
      </div>
      <div className="place-card__info">
        <div className="place-card__price-wrapper">
          <div className="place-card__price">
            <b className="place-card__price-value">&euro;{offer.price}</b>
            <span className="place-card__price-text">&#47;&nbsp;night</span>
          </div>
          <button
            className={`place-card__bookmark-button button${offer.isFavorite ? ' place-card__bookmark-button--active' : ''}`}
            type="button"
            onClick={handleBookmarkClick}
          >
            <svg className="place-card__bookmark-icon" width="18" height="19">
              <use xlinkHref="#icon-bookmark"></use>
            </svg>
            <span className="visually-hidden">{offer.isFavorite ? 'In bookmarks' : 'To bookmarks'}</span>
          </button>
        </div>
        <div className="place-card__rating rating">
          <div className="place-card__stars rating__stars">
            <span style={{ width: `${ratingWidth}%` }}></span>
            <span className="visually-hidden">Rating</span>
          </div>
        </div>
        <h2 className="place-card__name">
          <Link to={`/offer/${offer.id}`}>{offer.title}</Link>
        </h2>
        <p className="place-card__type">{offer.type.charAt(0).toUpperCase() + offer.type.slice(1)}</p>
      </div>
    </article>
  );
}

const PlaceCardMemo = memo(PlaceCard);
export default PlaceCardMemo;
