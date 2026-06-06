import { useState, useMemo, useCallback } from 'react';
import OffersList from '../../components/offers-list/offers-list';
import Map from '../../components/map/map';
import CityList from '../../components/city-list/city-list';
import SortOptions from '../../components/sort-options/sort-options';
import Spinner from '../../components/spinner/spinner';
import Header from '../../components/header/header';
import { useAppSelector } from '../../hooks';
import { Location, Offer } from '../../types/offer';
import { SortType } from '../../types/sort';
import MainEmpty from '../../components/main-empty/main-empty';
import {
  selectCity, selectIsLoading, selectCityOffers, selectHasOffersLoadError,
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
  const city = useAppSelector(selectCity);
  const isLoading = useAppSelector(selectIsLoading);
  const cityOffers = useAppSelector(selectCityOffers);
  const hasOffersLoadError = useAppSelector(selectHasOffersLoadError);
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

  if (isLoading) {
    return <Spinner />;
  }

  if (hasOffersLoadError) {
    return (
      <div className="page page--gray page--main">
        <Header isLogoActive />
        <main className="page__main page__main--index">
          <div className="cities__status-wrapper" style={{ margin: '60px auto', textAlign: 'center' }}>
            <b className="cities__status">Не удалось загрузить данные с сервера</b>
            <p className="cities__status-description">Проверьте подключение и попробуйте обновить страницу.</p>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="page page--gray page--main">
      <Header isLogoActive />

      <main className={`page__main page__main--index${cityOffers.length === 0 ? ' page__main--index-empty' : ''}`}>
        <h1 className="visually-hidden">Cities</h1>
        <div className="tabs">
          <section className="locations container">
            <CityList activeCity={city} />
          </section>
        </div>
        <div className="cities">
          {cityOffers.length === 0 ? (
            <MainEmpty city={city} />
          ) : (
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
          )}
        </div>
      </main>
    </div>
  );
}

export default MainPage;
