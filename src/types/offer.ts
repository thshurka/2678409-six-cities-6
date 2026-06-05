export type Location = {
  latitude: number;
  longitude: number;
  zoom: number;
};

export type Offer = {
  id: string;
  title: string;
  type: 'apartment' | 'room' | 'house' | 'hotel';
  price: number;
  previewImage: string;
  city: {
    name: string;
    location: Location;
  };
  location: Location;
  isFavorite: boolean;
  isPremium: boolean;
  rating: number;
};

export type DetailedOffer = Offer & {
  description: string;
  images: string[];
  goods: string[];
  bedrooms: number;
  maxAdults: number;
  host: {
    isPro: boolean;
    name: string;
    avatarUrl: string;
  };
};
