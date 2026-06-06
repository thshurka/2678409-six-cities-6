import { memo } from 'react';
import { CITIES } from '../../const';
import { useAppDispatch } from '../../hooks';
import { changeCity } from '../../store/slices/app-process';

type CityListProps = {
  activeCity: string;
};

function CityList({ activeCity }: CityListProps): JSX.Element {
  const dispatch = useAppDispatch();

  return (
    <ul className="locations__list tabs__list">
      {CITIES.map((city) => (
        <li key={city} className="locations__item">
          <a
            className={`locations__item-link tabs__item${city === activeCity ? ' tabs__item--active' : ''}`}
            onClick={(e) => {
              e.preventDefault();
              dispatch(changeCity(city));
            }}
            href="#"
          >
            <span>{city}</span>
          </a>
        </li>
      ))}
    </ul>
  );
}

const CityListMemo = memo(CityList);
export default CityListMemo;
