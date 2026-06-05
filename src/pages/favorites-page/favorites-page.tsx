import { Link } from 'react-router-dom';
import { Offer } from '../../types/offer';

type FavoritesPageProps = {
  offers: Offer[];
};

function FavoritesPage({ offers }: FavoritesPageProps): JSX.Element {
  const favoriteOffers = offers.filter((offer) => offer.isFavorite);

  const groupedByCity = favoriteOffers.reduce(
    (acc, offer) => {
      const cityName = offer.city.name;
      if (!acc[cityName]) {
        acc[cityName] = [];
      }
      acc[cityName].push(offer);
      return acc;
    },
    {} as Record<string, Offer[]>
  );

  return (
    <div className="page">
      <header className="header">
        <div className="container">
          <div className="header__wrapper">
            <div className="header__left">
              <a className="header__logo-link" href="/">
                <img className="header__logo" src="img/logo.svg" alt="6 cities logo" width="81" height="41" />
              </a>
            </div>
            <nav className="header__nav">
              <ul className="header__nav-list">
                <li className="header__nav-item user">
                  <a className="header__nav-link header__nav-link--profile" href="/favorites">
                    <div className="header__avatar-wrapper user__avatar-wrapper">
                    </div>
                    <span className="header__user-name user__name">Oliver.conner@gmail.com</span>
                    <span className="header__favorite-count">{favoriteOffers.length}</span>
                  </a>
                </li>
                <li className="header__nav-item">
                  <a className="header__nav-link" href="#todo">
                    <span className="header__signout">Sign out</span>
                  </a>
                </li>
              </ul>
            </nav>
          </div>
        </div>
      </header>

      <main className="page__main page__main--favorites">
        <div className="page__favorites-container container">
          <section className="favorites">
            <h1 className="favorites__title">Saved listing</h1>
            {favoriteOffers.length === 0 ? (
              <p className="favorites__empty">Nothing yet saved</p>
            ) : (
              <ul className="favorites__list">
                {Object.entries(groupedByCity).map(([city, cityOffers]) => (
                  <li key={city} className="favorites__locations-items">
                    <div className="favorites__locations locations locations--current">
                      <div className="locations__item">
                        <a className="locations__item-link" href="/">
                          <span>{city}</span>
                        </a>
                      </div>
                    </div>
                    <div className="favorites__places">
                      {cityOffers.map((offer) => (
                        <article key={offer.id} className="favorites__card place-card">
                          {offer.isPremium && (
                            <div className="place-card__mark">
                              <span>Premium</span>
                            </div>
                          )}
                          <div className="favorites__image-wrapper place-card__image-wrapper">
                            <Link to={`/offer/${offer.id}`}>
                              <img className="place-card__image" src={offer.previewImage} width="150" height="110" alt={offer.title} />
                            </Link>
                          </div>
                          <div className="favorites__card-info place-card__info">
                            <div className="place-card__price-wrapper">
                              <div className="place-card__price">
                                <b className="place-card__price-value">&euro;{offer.price}</b>
                                <span className="place-card__price-text">&#47;&nbsp;night</span>
                              </div>
                              <button className="place-card__bookmark-button place-card__bookmark-button--active button" type="button">
                                <svg className="place-card__bookmark-icon" width="18" height="19">
                                  <use xlinkHref="#icon-bookmark"></use>
                                </svg>
                                <span className="visually-hidden">In bookmarks</span>
                              </button>
                            </div>
                            <div className="place-card__rating rating">
                              <div className="place-card__stars rating__stars">
                                <span style={{ width: `${(offer.rating / 5) * 100}%` }}></span>
                                <span className="visually-hidden">Rating</span>
                              </div>
                            </div>
                            <h2 className="place-card__name">
                              <Link to={`/offer/${offer.id}`}>{offer.title}</Link>
                            </h2>
                            <p className="place-card__type">{offer.type.charAt(0).toUpperCase() + offer.type.slice(1)}</p>
                          </div>
                        </article>
                      ))}
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </section>
        </div>
      </main>
      <footer className="footer container">
        <a className="footer__logo-link" href="/">
          <img className="footer__logo" src="img/logo.svg" alt="6 cities logo" width="64" height="33" />
        </a>
      </footer>
    </div>
  );
}

export default FavoritesPage;
