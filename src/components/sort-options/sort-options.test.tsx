import { render, screen } from '@testing-library/react';
import SortOptions from './sort-options';
import { SortType } from '../../types/sort';

describe('Component: SortOptions', () => {
  it('должен отрисовать все варианты сортировки', () => {
    render(<SortOptions currentSort={SortType.Popular} onSortChange={() => undefined} />);

    expect(screen.getByText('Price: low to high')).toBeInTheDocument();
    expect(screen.getByText('Price: high to low')).toBeInTheDocument();
    expect(screen.getByText('Top rated first')).toBeInTheDocument();
    expect(screen.getAllByText('Popular').length).toBeGreaterThan(0);
  });
});
