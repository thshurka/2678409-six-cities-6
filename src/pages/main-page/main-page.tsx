import { useState, useMemo, useCallback } from 'react';
import { Link } from 'react-router-dom';
import OffersList from '../../components/offers-list/offers-list';
import Map from '../../components/map/map';
import CityList from '../../components/city-list/city-list';
import SortOptions from '../../components/sort-options/sort-options';
import Spinner from '../../components/spinner/spinner';
import { useAppSelector, useAppDispatch } from '../../hooks';
import { Location, Offer } from '../../types/offer';
import { SortType } from '../../types/sort';
import { AuthorizationStatus } from '../../types/auth';
import { logout } from '../../store/api-actions';
import {
  selectCity, selectIsLoading, selectCityOffers,
  selectAuthorizationStatus, selectUserData,
} from '../../store/selectors';

const CITY_CENTERS: Record<string, Location> = {
  Paris: { latitude: 48.85341, longitude: 2.3488, zoom: 12 },
  Cologne: { latitude: 50.938361, longitude: 6.959974, zoom: 12 },
  Brussels: { latitude: 50.846557, longitude: 4.351697, zoom: 12 },
  Amsterdam: { latitude: 52.37454, longitude: 4.897976, zoom: 12 },
  Hamburg: { latitude: 53.550341, longitude: 10.000654, zoom: 12 },
  Dusseldorf: { latitude: 51.225402, longitude: 6.776314, zoom: 12 },
};

const getSortedOffers = (offers: Offer[], sortType: SortType): Offer[] => {
  switch (sortType) {
    case SortType.PriceLowToHigh:
      return offers.slice().sort((a, b) => a.price - b.price);
    case SortType.PriceHighToLow:
      return offers.slice().sort((a, b) => b.price - a.price);
    case SortType.TopRatedFirst:
      return offers.slice().sort((a, b) => b.rating - a.rating);
    default:
      return offers;
  }
};

function MainPage(): JSX.Element {
  const dispatch = useAppDispatch();
  const city = useAppSelector(selectCity);
  const isLoading = useAppSelector(selectIsLoading);
  const authorizationStatus = useAppSelector(selectAuthorizationStatus);
  const userData = useAppSelector(selectUserData);
  const cityOffers = useAppSelector(selectCityOffers);
  const cityCenter = CITY_CENTERS[city] ?? CITY_CENTERS['Paris'];

  const [sortType, setSortType] = useState<SortType>(SortType.Popular);
  const [activeOfferId, setActiveOfferId] = useState<string | null>(null);

  const handleActiveOfferChange = useCallback((id: string | null) => {
    setActiveOfferId(id);
  }, []);

  const sortedOffers = useMemo(
    () => getSortedOffers(cityOffers, sortType),
    [cityOffers, sortType]
  );
  const isAuthorized = authorizationStatus === AuthorizationStatus.Auth;

  if (isLoading) {
    return <Spinner />;
  }

  return (
    <div className="page page--gray page--main">
      <header className="header">
        <div className="container">
          <div className="header__wrapper">
            <div className="header__left">
              <a className="header__logo-link header__logo-link--active" href="/">
                <img className="header__logo" src="img/logo.svg" alt="6 cities logo" width="81" height="41" />
              </a>
            </div>
            <nav className="header__nav">
              <ul className="header__nav-list">
                {isAuthorized ? (
                  <>
                    <li className="header__nav-item user">
                      <Link className="header__nav-link header__nav-link--profile" to="/favorites">
                        <div className="header__avatar-wrapper user__avatar-wrapper">
                        </div>
                        <span className="header__user-name user__name">{userData?.email}</span>
                        <span className="header__favorite-count">0</span>
                      </Link>
                    </li>
                    <li className="header__nav-item">
                      <button
                        className="header__nav-link button"
                        type="button"
                        onClick={() => {
                          dispatch(logout());
                        }}
                        style={{ background: 'none', border: 'none', cursor: 'pointer' }}
                      >
                        <span className="header__signout">Sign out</span>
                      </button>
                    </li>
                  </>
                ) : (
                  <li className="header__nav-item user">
                    <Link className="header__nav-link header__nav-link--profile" to="/login">
                      <div className="header__avatar-wrapper user__avatar-wrapper">
                      </div>
                      <span className="header__login header__user-name">Sign in</span>
                    </Link>
                  </li>
                )}
              </ul>
            </nav>
          </div>
        </div>
      </header>

      <main className="page__main page__main--index">
        <h1 className="visually-hidden">Cities</h1>
        <div className="tabs">
          <section className="locations container">
            <CityList activeCity={city} />
          </section>
        </div>
        <div className="cities">
          <div className="cities__places-container container">
            <section className="cities__places places">
              <h2 className="visually-hidden">Places</h2>
              <b className="places__found">{cityOffers.length} places to stay in {city}</b>
              <SortOptions currentSort={sortType} onSortChange={setSortType} />
              <OffersList
                offers={sortedOffers}
                onActiveOfferChange={handleActiveOfferChange}
              />
            </section>
            <div className="cities__right-section">
              <Map offers={cityOffers} city={cityCenter} activeOfferId={activeOfferId} />
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

export default MainPage;
