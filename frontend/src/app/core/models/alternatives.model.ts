export interface DateAlternative {
  checkIn: string;
  checkOut: string;
  roomsLeft: number;
  totalAmount: number;
}

export interface HotelAlternative {
  hotelId: number;
  slug: string;
  name: string;
  city: string;
  imageUrl: string;
  roomTypeName: string;
  pricePerNight: number;
  roomsLeft: number;
  totalAmount: number;
}

export interface AlternativesResponse {
  hotelId: number;
  city: string;
  nights: number;
  nearbyDates: DateAlternative[];
  otherHotels: HotelAlternative[];
}
