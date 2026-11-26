export interface DestinationConfig { image: string; tagline: string; alt: string; }

export const DESTINATIONS: Record<string, DestinationConfig> = {
  Mumbai: { image: 'mumbai.jpg', tagline: 'Gothic grandeur by the harbour', alt: 'Ornate Chhatrapati Shivaji Maharaj Terminus in Mumbai' },
  Goa: { image: 'goa.jpg', tagline: 'Palm-lined shores and easy days', alt: 'Palm-fringed Arabian Sea shore at Palolem, Goa' },
  Jaipur: { image: 'jaipur.jpg', tagline: 'Rose sandstone and royal detail', alt: 'Hawa Mahal arches and golden finials in Jaipur' },
  Udaipur: { image: 'udaipur.jpg', tagline: 'Palace views beside the lake', alt: 'Udaipur City Palace beside Lake Pichola' },
  'New Delhi': { image: 'delhi.jpg', tagline: 'Garden monuments and city calm', alt: 'Historic Lakkarwala Burj beside a garden fountain in Delhi' },
  Kochi: { image: 'kochi.jpg', tagline: 'Harbour stories and coastal ease', alt: 'Chinese fishing nets along the Fort Kochi waterfront' },
  Shimla: { image: 'shimla.jpg', tagline: 'Pine air and Himalayan views', alt: 'Shimla hillside town nestled in a mountain valley' },
  Bengaluru: { image: 'bengaluru.jpg', tagline: 'Garden city energy under old trees', alt: 'Vidhana Soudha facade in Bengaluru' },
};
