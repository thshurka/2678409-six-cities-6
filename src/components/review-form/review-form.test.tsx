import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import ReviewForm from './review-form';
import { withMockStore, makeMockState } from '../../utils/test-utils';
import { submitReview } from '../../store/api-actions';

const VALID_COMMENT = 'This is a really wonderful place to stay, I enjoyed every single moment here!';

describe('Component: ReviewForm', () => {
  it('кнопка отправки заблокирована, пока форма невалидна', () => {
    const { withStoreComponent } = withMockStore(<ReviewForm offerId="1" />, makeMockState());
    render(withStoreComponent);

    expect(screen.getByRole('button', { name: 'Submit' })).toBeDisabled();
  });

  it('кнопка разблокируется после выбора рейтинга и ввода текста нужной длины', async () => {
    const { withStoreComponent } = withMockStore(<ReviewForm offerId="1" />, makeMockState());
    render(withStoreComponent);

    await userEvent.click(screen.getByTitle('perfect'));
    await userEvent.type(screen.getByRole('textbox'), VALID_COMMENT);

    expect(screen.getByRole('button', { name: 'Submit' })).toBeEnabled();
  });

  it('при отправке валидной формы диспатчит submitReview', async () => {
    const offerId = 'offer-1';
    const state = makeMockState();
    const { withStoreComponent, mockStore, mockAxiosAdapter } = withMockStore(<ReviewForm offerId={offerId} />, state);
    mockAxiosAdapter.onPost(`/comments/${offerId}`).reply(200, []);
    render(withStoreComponent);

    await userEvent.click(screen.getByTitle('perfect'));
    await userEvent.type(screen.getByRole('textbox'), VALID_COMMENT);
    await userEvent.click(screen.getByRole('button', { name: 'Submit' }));

    const actionTypes = mockStore.getActions().map((action) => action.type);
    expect(actionTypes).toContain(submitReview.pending.type);
  });
});
