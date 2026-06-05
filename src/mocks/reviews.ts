import { Review } from '../types/review';

export const mockReviews: Review[] = [
  {
    id: '1',
    user: {
      id: 1,
      isPro: false,
      name: 'Max',
      avatarUrl: 'img/avatar-max.jpg'
    },
    rating: 4,
    comment: 'A quiet cozy and picturesque that hides behind a a river by the unique lightness of Amsterdam. The building is green and from 18th century.',
    date: '2019-04-24'
  },
  {
    id: '2',
    user: {
      id: 2,
      isPro: true,
      name: 'Angelina',
      avatarUrl: 'img/avatar-angelina.jpg'
    },
    rating: 5,
    comment: 'The house is very good, very happy with the choice. Quiet neighbourhood, friendly host and great location near the canal.',
    date: '2019-05-12'
  },
  {
    id: '3',
    user: {
      id: 3,
      isPro: false,
      name: 'Isabella',
      avatarUrl: 'img/avatar-angelina.jpg'
    },
    rating: 3,
    comment: 'Nice apartment, but a bit noisy in the evening. Overall a decent stay for the price.',
    date: '2019-06-08'
  }
];
