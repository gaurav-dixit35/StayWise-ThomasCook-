export interface Amenity {
  name: string;
  iconKey: string;
}

export interface Availability {
  available: boolean;
  roomsLeft: number;
  nights: number;
  totalAmount: number | null;
}

export interface HotelSummary {
  id: number;
  slug: string;
  name: string;
  city: string;
  state: string;
  starRating: number;
  description: string;
  imageUrl: string;
  imageAlt: string;
  imageFocus: string;
  amenities: Amenity[];
  roomTypeName: string;
  pricePerNight: number;
  availability: Availability | null;
}

export interface HotelDetail extends HotelSummary {
  address: string;
  images: HotelImage[];
}

export interface HotelImage { url: string; alt: string; creditName: string; creditUrl: string; license: string; }

export interface City {
  name: string;
  state: string;
}

export interface PriceBreakdown {
  nights: number;
  pricePerNight: number;
  subtotal: number;
  total: number;
  currency: 'INR';
}
