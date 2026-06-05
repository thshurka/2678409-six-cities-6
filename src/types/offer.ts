export type Location = {
  latitude: number;
  longitude: number;
  zoom: number;
};

export type Offer = {
  id: number;
  title: string;
  type: 'apartment' | 'room' | 'house' | 'hotel';
  price: number;
  rating: number;
  isPremium: boolean;
  previewImage: string;
  isFavorite: boolean;
  description: string;
  images: string[];
  bedrooms: number;
  maxAdults: number;
  goods: string[];
  host: {
    name: string;
    avatarUrl: string;
    isPro: boolean;
  };
  city: {
    name: string;
    location: Location;
  };
  location: Location;
};
