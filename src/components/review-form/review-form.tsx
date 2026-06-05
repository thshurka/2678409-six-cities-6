import { useState } from 'react';
import { useAppDispatch } from '../../hooks';
import { submitReview } from '../../store/api-actions';

type ReviewFormProps = {
  offerId: string;
};

const MIN_COMMENT_LENGTH = 50;
const MAX_COMMENT_LENGTH = 300;

const STAR_TITLES = ['terribly', 'badly', 'not bad', 'good', 'perfect'];

function ReviewForm({ offerId }: ReviewFormProps): JSX.Element {
  const dispatch = useAppDispatch();

  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const isValid =
    rating > 0 &&
    comment.length >= MIN_COMMENT_LENGTH &&
    comment.length <= MAX_COMMENT_LENGTH;

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!isValid) {
      return;
    }
    setIsSubmitting(true);
    dispatch(submitReview({ id: offerId, comment, rating }))
      .unwrap()
      .then(() => {
        setRating(0);
        setComment('');
      })
      .catch(() => {
        // Ошибка — форма разблокируется, пользователь может попробовать снова
      })
      .finally(() => {
        setIsSubmitting(false);
      });
  };

  return (
    <form className="reviews__form form" onSubmit={handleSubmit}>
      <label className="reviews__label form__label" htmlFor="review">Your review</label>
      <div className="reviews__rating-form form__rating">
        {[5, 4, 3, 2, 1].map((star) => (
          <div key={star}>
            <input
              className="form__rating-input visually-hidden"
              name="rating"
              value={star}
              id={`${star}-stars`}
              type="radio"
              checked={rating === star}
              onChange={() => setRating(star)}
              disabled={isSubmitting}
            />
            <label
              htmlFor={`${star}-stars`}
              className="reviews__rating-label form__rating-label"
              title={STAR_TITLES[star - 1]}
            >
              <svg className="form__star-image" width="37" height="33">
                <use xlinkHref="#icon-star" />
              </svg>
            </label>
          </div>
        ))}
      </div>
      <textarea
        className="reviews__textarea form__textarea"
        id="review"
        name="review"
        placeholder="Tell how was your stay, what you like and what can be improved"
        value={comment}
        minLength={MIN_COMMENT_LENGTH}
        maxLength={MAX_COMMENT_LENGTH}
        onChange={(e) => setComment(e.target.value)}
        disabled={isSubmitting}
      />
      <div className="reviews__button-wrapper">
        <p className="reviews__help">
          To submit review please make sure to set{' '}
          <span className="reviews__star">rating</span> and describe your stay with at least{' '}
          <b className="reviews__text-amount">{MIN_COMMENT_LENGTH} characters</b>.
        </p>
        <button
          className="reviews__submit form__submit button"
          type="submit"
          disabled={!isValid || isSubmitting}
        >
          Submit
        </button>
      </div>
    </form>
  );
}

export default ReviewForm;
