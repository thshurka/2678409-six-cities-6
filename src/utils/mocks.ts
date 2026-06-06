import { datatype, name, lorem, image, address, internet, date } from 'faker';
import { Offer, DetailedOffer } from '../types/offer';
import { Review } from '../types/review';
import { UserData } from '../types/user';

const OFFER_TYPES = ['apartment', 'room', 'house', 'hotel'] as const;

export const makeFakeLocation = () => ({
  latitude: Number(address.latitude()),
  longitude: Number(address.longitude()),
  zoom: datatype.number({ min: 10, max: 16 }),
});

export const makeFakeOffer = (): Offer => ({
  id: datatype.uuid(),
  title: lorem.words(3),
  type: OFFER_TYPES[datatype.number({ min: 0, max: 3 })],
  price: datatype.number({ min: 50, max: 500 }),
  previewImage: image.imageUrl(),
  city: {
    name: address.city(),
    location: makeFakeLocation(),
  },
  location: makeFakeLocation(),
  isFavorite: datatype.boolean(),
  isPremium: datatype.boolean(),
  rating: datatype.number({ min: 1, max: 5 }),
});

export const makeFakeDetailedOffer = (): DetailedOffer => ({
  ...makeFakeOffer(),
  description: lorem.paragraph(),
  images: Array.from({ length: 6 }, () => image.imageUrl()),
  goods: Array.from({ length: 3 }, () => lorem.word()),
  bedrooms: datatype.number({ min: 1, max: 4 }),
  maxAdults: datatype.number({ min: 1, max: 6 }),
  host: {
    isPro: datatype.boolean(),
    name: name.firstName(),
    avatarUrl: image.avatar(),
  },
});

export const makeFakeReview = (): Review => ({
  id: datatype.uuid(),
  user: {
    id: datatype.number(),
    isPro: datatype.boolean(),
    name: name.firstName(),
    avatarUrl: image.avatar(),
  },
  rating: datatype.number({ min: 1, max: 5 }),
  comment: lorem.paragraph(),
  date: date.past().toISOString(),
});

export const makeFakeUserData = (): UserData => ({
  id: datatype.number(),
  email: internet.email(),
  name: name.firstName(),
  avatarUrl: image.avatar(),
  isPro: datatype.boolean(),
  token: datatype.uuid(),
});

export const makeFakeOffers = (count = 4): Offer[] =>
  Array.from({ length: count }, makeFakeOffer);

export const makeFakeReviews = (count = 3): Review[] =>
  Array.from({ length: count }, makeFakeReview);
