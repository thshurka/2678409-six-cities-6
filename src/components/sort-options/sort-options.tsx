import { useState, memo } from 'react';
import { SortType } from '../../types/sort';

type SortOptionsProps = {
  currentSort: SortType;
  onSortChange: (sort: SortType) => void;
};

const SORT_TYPES = Object.values(SortType);

function SortOptions({ currentSort, onSortChange }: SortOptionsProps): JSX.Element {
  const [isOpen, setIsOpen] = useState(false);

  const handleSortSelect = (sort: SortType) => {
    onSortChange(sort);
    setIsOpen(false);
  };

  return (
    <form className="places__sorting" action="#" method="get">
      <span className="places__sorting-caption">Sort by </span>
      <span
        className="places__sorting-type"
        tabIndex={0}
        onClick={() => setIsOpen((prev) => !prev)}
      >
        {currentSort}
        <svg className="places__sorting-arrow" width="7" height="4">
          <use xlinkHref="#icon-arrow-select"></use>
        </svg>
      </span>
      <ul className={`places__options places__options--custom${isOpen ? ' places__options--opened' : ''}`}>
        {SORT_TYPES.map((sort) => (
          <li
            key={sort}
            className={`places__option${sort === currentSort ? ' places__option--active' : ''}`}
            tabIndex={0}
            onClick={() => handleSortSelect(sort)}
          >
            {sort}
          </li>
        ))}
      </ul>
    </form>
  );
}

const SortOptionsMemo = memo(SortOptions);
export default SortOptionsMemo;
