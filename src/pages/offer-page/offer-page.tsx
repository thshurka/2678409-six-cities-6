import { useEffect } from 'react';
import { useParams, Navigate, useNavigate } from 'react-router-dom';
import ReviewForm from '../../components/review-form/review-form';
import ReviewsList from '../../components/reviews-list/reviews-list';
import OffersList from '../../components/offers-list/offers-list';
import Map from '../../components/map/map';
import Spinner from '../../components/spinner/spinner';
import Header from '../../components/header/header';
import { useAppSelector, useAppDispatch } from '../../hooks';
import { fetchOffer, fetchNearbyOffers, fetchReviews, toggleFavorite } from '../../store/api-actions';
import { clearOfferData } from '../../store/slices/data-process';
import { AuthorizationStatus } from '../../types/auth';
import {
  selectCurrentOffer, selectNearbyOffers, selectReviews,
  selectIsOfferLoading, selectHasOfferLoadError,
  selectAuthorizationStatus,
} from '../../store/selectors';

const MAX_IMAGES_COUNT = 6;

const OFFER_TYPE_LABELS: Record<string, string> = {
  apartment: 'Apartment',
  room: 'Room',
  house: 'House',
  hotel: 'Hotel',
};

function OfferPage(): JSX.Element {
  const { id } = useParams<{ id: string }>();
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const currentOffer = useAppSelector(selectCurrentOffer);
  const nearbyOffers = useAppSelector(selectNearbyOffers);
  const reviews = useAppSelector(selectReviews);
  const isOfferLoading = useAppSelector(selectIsOfferLoading);
  const hasOfferLoadError = useAppSelector(selectHasOfferLoadError);
  const authorizationStatus = useAppSelector(selectAuthorizationStatus);
  const isAuthorized = authorizationStatus === AuthorizationStatus.Auth;

  useEffect(() => {
    if (id) {
      dispatch(fetchOffer(id));
      dispatch(fetchNearbyOffers(id));
      dispatch(fetchReviews(id));
    }
    return () => {
      dispatch(clearOfferData());
    };
  }, [id, dispatch]);

  if (hasOfferLoadError) {
    return <Navigate to="/404" />;
  }

  if (isOfferLoading || !currentOffer) {
    return <Spinner />;
  }

  const { title, type, price, rating, isPremium, isFavorite, images, description, goods, host, bedrooms, maxAdults, city } = currentOffer;
  const ratingPercent = Math.round(rating) * 20;
  const mapCenter = city.location;
  const mapOffers = [...nearbyOffers, currentOffer];

  const handleBookmarkClick = () => {
    if (!isAuthorized) {
      navigate('/login');
      return;
    }
    dispatch(toggleFavorite({ id: currentOffer.id, status: isFavorite ? 0 : 1 }));
  };

  return (
    <div className="page">
      <Header />

      <main className="page__main page__main--offer">
        <section className="offer">
          <div className="offer__gallery-container container">
            <div className="offer__gallery">
              {images.slice(0, MAX_IMAGES_COUNT).map((image) => (
                <div key={image} className="offer__image-wrapper">
                  <img className="offer__image" src={image} alt="Photo studio" />
                </div>
              ))}
            </div>
          </div>
          <div className="offer__container container">
            <div className="offer__wrapper">
              {isPremium && (
                <div className="offer__mark">
                  <span>Premium</span>
                </div>
              )}
              <div className="offer__name-wrapper">
                <h1 className="offer__name">{title}</h1>
                <button
                  className={`offer__bookmark-button button${isFavorite ? ' offer__bookmark-button--active' : ''}`}
                  type="button"
                  onClick={handleBookmarkClick}
                >
                  <svg className="offer__bookmark-icon" width="31" height="33">
                    <use xlinkHref="#icon-bookmark"></use>
                  </svg>
                  <span className="visually-hidden">{isFavorite ? 'In bookmarks' : 'To bookmarks'}</span>
                </button>
              </div>
              <div className="offer__rating rating">
                <div className="offer__stars rating__stars">
                  <span style={{ width: `${ratingPercent}%` }}></span>
                  <span className="visually-hidden">Rating</span>
                </div>
                <span className="offer__rating-value rating__value">{rating}</span>
              </div>
              <ul className="offer__features">
                <li className="offer__feature offer__feature--entire">
                  {OFFER_TYPE_LABELS[type] ?? type}
                </li>
                <li className="offer__feature offer__feature--bedrooms">
                  {bedrooms} {bedrooms === 1 ? 'Bedroom' : 'Bedrooms'}
                </li>
                <li className="offer__feature offer__feature--adults">
                  Max {maxAdults} {maxAdults === 1 ? 'adult' : 'adults'}
                </li>
              </ul>
              <div className="offer__price">
                <b className="offer__price-value">&euro;{price}</b>
                <span className="offer__price-text">&nbsp;night</span>
              </div>
              <div className="offer__inside">
                <h2 className="offer__inside-title">What&apos;s inside</h2>
                <ul className="offer__inside-list">
                  {goods.map((item) => (
                    <li key={item} className="offer__inside-item">{item}</li>
                  ))}
                </ul>
              </div>
              <div className="offer__host">
                <h2 className="offer__host-title">Meet the host</h2>
                <div className="offer__host-user user">
                  <div className={`offer__avatar-wrapper user__avatar-wrapper${host.isPro ? ' offer__avatar-wrapper--pro' : ''}`}>
                    <img className="offer__avatar user__avatar" src={host.avatarUrl} width="74" height="74" alt="Host avatar" />
                  </div>
                  <span className="offer__user-name">{host.name}</span>
                  {host.isPro && <span className="offer__user-status">Pro</span>}
                </div>
                <div className="offer__description">
                  <p className="offer__text">{description}</p>
                </div>
              </div>
              <section className="offer__reviews reviews">
                <ReviewsList reviews={reviews} />
                {isAuthorized && id && <ReviewForm offerId={id} />}
              </section>
            </div>
          </div>
          <Map
            offers={mapOffers}
            city={mapCenter}
            activeOfferId={currentOffer.id}
            className="offer__map map"
          />
        </section>
        <div className="container">
          <section className="near-places places">
            <h2 className="near-places__title">Other places in the neighbourhood</h2>
            <OffersList
              offers={nearbyOffers}
              block="near-places"
              className="near-places__list places__list"
            />
          </section>
        </div>
      </main>
    </div>
  );
}

export default OfferPage;
