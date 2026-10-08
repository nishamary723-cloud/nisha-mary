export type ShopCategory =
  | 'Chai & Snacks'
  | 'Kirana & Grocery'
  | 'Tailor & Alterations'
  | 'Xerox & Stationery'
  | 'Street Chaat & Food'
  | 'Cobbler & Leather'
  | 'Juice & Fruits'
  | 'Flowers & Puja'
  | 'Watch & Key Repair'
  | 'Mobile & Electronics'
  | 'Other';

export interface ShopReview {
  id: string;
  userName: string;
  userAvatar?: string;
  rating: number;
  comment: string;
  createdAt: string;
  helpfulCount: number;
}

export interface StreetDeal {
  id: string;
  title: string;
  description: string;
  discount: string;
  validUntil: string;
  badge?: string;
}

export interface Shop {
  id: string;
  name: string;
  category: ShopCategory;
  stallType: 'Pushcart Stall' | 'Small Dukaan' | 'Sidewalk Kiosk' | 'Mom & Pop Store';
  ownerName: string;
  landmark: string;
  address: string;
  latitude: number;
  longitude: number;
  phone: string;
  whatsapp?: string;
  operatingHours: string;
  isOpen: boolean;
  rating: number;
  reviewCount: number;
  priceRange: '₹' | '₹₹' | '₹₹₹';
  upiAccepted: boolean;
  cashOnly?: boolean;
  specialties: string[];
  tags: string[];
  imageUrl: string;
  vendorStory: string;
  services: { name: string; price: string }[];
  activeDeal?: StreetDeal;
  reviews: ShopReview[];
  distanceMeters?: number;
  aiMatchScore?: number;
  aiReason?: string;
  aiRecommendedItem?: string;
}

export interface UserLocation {
  latitude: number;
  longitude: number;
  name: string;
  accuracyMeters: number;
}

export interface AiRecommendationResult {
  id: string;
  matchScore: number;
  aiReason: string;
  recommendedItem: string;
}

export type LanguageCode = 'en' | 'hi' | 'ta' | 'te' | 'ml';
