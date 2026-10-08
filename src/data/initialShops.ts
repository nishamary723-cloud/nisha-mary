import { Shop } from '../types';

export const BASE_LOCATIONS = [
  {
    id: 'college_hub',
    name: 'University Campus Gate & Market Gali',
    city: 'Bengaluru / Central College Hub',
    lat: 12.9716,
    lng: 77.5946,
  },
  {
    id: 'old_bazaar',
    name: 'Clock Tower & Street Food Bazaar',
    city: 'Old Delhi Heritage Market',
    lat: 28.6506,
    lng: 77.2300,
  },
  {
    id: 'coastal_market',
    name: 'Anna Nagar 4th Avenue Vendor Street',
    city: 'Chennai Central District',
    lat: 13.0827,
    lng: 80.2105,
  },
];

// Relative offsets in latitude/longitude degrees (~1 degree lat ≈ 111,000m)
// 0.001 deg lat ≈ 111m, 0.001 deg lng ≈ 108m
export const INITIAL_SHOPS_TEMPLATE: Omit<Shop, 'latitude' | 'longitude'>[] = [
  {
    id: 'shop-1',
    name: 'Raju Chai Tapri & Bun Maska',
    category: 'Chai & Snacks',
    stallType: 'Pushcart Stall',
    ownerName: 'Raju Bhai',
    landmark: 'Under the big Banyan tree, opposite Gate 3',
    address: 'Stall #14, College Road Corner',
    phone: '+91 98450 12345',
    whatsapp: '+919845012345',
    operatingHours: '06:00 AM - 10:30 PM',
    isOpen: true,
    rating: 4.8,
    reviewCount: 142,
    priceRange: '₹',
    upiAccepted: true,
    specialties: ['Adrak Cardamom Chai', 'Kadak Cutting Chai', 'Crispy Bun Maska', 'Fresh Samosa'],
    tags: ['Chai', 'Tea', 'Snacks', 'Breakfast', 'Budget', 'Student Favorite'],
    imageUrl: 'https://images.unsplash.com/photo-1544787219-7f47ccb76574?auto=format&fit=crop&w=600&q=80',
    vendorStory:
      'Serving piping hot ginger-infused cutting chai and fresh buttery bun maska since 2011. A favorite hangout for college students and morning walkers.',
    services: [
      { name: 'Special Adrak Elaichi Chai', price: '₹15' },
      { name: 'Kadak Cutting Chai', price: '₹10' },
      { name: 'Warm Bun Maska with Butter', price: '₹25' },
      { name: 'Hot Potato Samosa (2 pcs)', price: '₹20' },
      { name: 'Osmania Biscuits (3 pcs)', price: '₹15' },
    ],
    activeDeal: {
      id: 'deal-1',
      title: 'Morning Energy Combo',
      description: '1 Kadak Cutting Chai + 1 Fresh Bun Maska',
      discount: 'Only ₹30 (Save ₹5)',
      validUntil: '11:30 AM',
      badge: 'Bestseller',
    },
    reviews: [
      {
        id: 'r-1',
        userName: 'Ananya S.',
        rating: 5,
        comment: 'Best cutting chai in the entire street. Raju bhai is always smiling!',
        createdAt: 'Yesterday',
        helpfulCount: 12,
      },
      {
        id: 'r-2',
        userName: 'Karthik R.',
        rating: 5,
        comment: 'Fresh bun maska with melted butter right on point. UPI always works fast.',
        createdAt: '3 days ago',
        helpfulCount: 7,
      },
    ],
  },
  {
    id: 'shop-2',
    name: 'Campus Xerox & Spiral Binding Corner',
    category: 'Xerox & Stationery',
    stallType: 'Small Dukaan',
    ownerName: 'Murugan P.',
    landmark: 'Beside Bus Shelter, Lane 2',
    address: 'Shop 4B, Student Plaza Lane',
    phone: '+91 98451 23456',
    whatsapp: '+919845123456',
    operatingHours: '08:30 AM - 09:30 PM',
    isOpen: true,
    rating: 4.7,
    reviewCount: 98,
    priceRange: '₹',
    upiAccepted: true,
    specialties: ['Spiral Binding', 'Color Project Prints', 'Lamination', 'Passport Photo Print'],
    tags: ['Xerox', 'Printout', 'Stationery', 'College Project', 'Binding', 'Urgent'],
    imageUrl: 'https://images.unsplash.com/photo-1568667256549-094345857637?auto=format&fit=crop&w=600&q=80',
    vendorStory:
      'Murugan provides lifesaver last-minute lab record printing, fast thesis binding, and notes xerox at subsidized student rates.',
    services: [
      { name: 'B&W Photocopy / Print (Per page)', price: '₹1.50' },
      { name: 'Color Lab Record Print (Glossy)', price: '₹8.00' },
      { name: 'Hardbound / Spiral Binding', price: '₹40' },
      { name: 'A4 Document Lamination', price: '₹20' },
      { name: 'Immediate Passport Photos (8 pcs)', price: '₹60' },
    ],
    activeDeal: {
      id: 'deal-2',
      title: 'Project Submission Special',
      description: 'Free transparent cover + 10% off on spiral binding over 50 pages',
      discount: '10% OFF',
      validUntil: 'Today 8 PM',
      badge: 'Academic',
    },
    reviews: [
      {
        id: 'r-3',
        userName: 'Sebastin T.',
        rating: 5,
        comment: 'Printed my entire 80-page engineering report in 5 mins flat. Very reliable!',
        createdAt: '2 days ago',
        helpfulCount: 9,
      },
    ],
  },
  {
    id: 'shop-3',
    name: 'QuickFix Master Tailor & Alterations',
    category: 'Tailor & Alterations',
    stallType: 'Sidewalk Kiosk',
    ownerName: 'Master Anwar Hussain',
    landmark: 'Near the yellow postbox, next to medical store',
    address: 'Kiosk #7, Bazaar Cross Road',
    phone: '+91 98452 34567',
    whatsapp: '+919845234567',
    operatingHours: '10:00 AM - 08:30 PM',
    isOpen: true,
    rating: 4.9,
    reviewCount: 86,
    priceRange: '₹',
    upiAccepted: true,
    specialties: ['Jeans Hemming', 'Zip Replacement', 'Shirt Fitting', 'Curtain Stitching'],
    tags: ['Tailor', 'Stitching', 'Alteration', 'Jeans', 'Zipper', 'Emergency Repair'],
    imageUrl: 'https://images.unsplash.com/photo-1528458876861-544fd1761a91?auto=format&fit=crop&w=600&q=80',
    vendorStory:
      'With over 25 years on this vintage sewing machine, Anwar Master can fix broken pant zippers, tighten blazer shoulders, or hem jeans in under 15 minutes.',
    services: [
      { name: 'Denim Jeans Length Alteration', price: '₹50' },
      { name: 'Heavy Duty Zip Replacement', price: '₹60' },
      { name: 'Shirt / Kurti Slim-fit Tapering', price: '₹70' },
      { name: 'Emergency Button & Stitch Repair', price: '₹20' },
    ],
    reviews: [
      {
        id: 'r-4',
        userName: 'Divya M.',
        rating: 5,
        comment: 'Fixed my backpack zipper immediately before my bus journey. Such craftsmanship!',
        createdAt: 'Last week',
        helpfulCount: 5,
      },
    ],
  },
  {
    id: 'shop-4',
    name: 'Shree Ganesh Kirana & Daily Needs',
    category: 'Kirana & Grocery',
    stallType: 'Mom & Pop Store',
    ownerName: 'Ganeshram Patel',
    landmark: 'Opposite Community Temple, Gali 1',
    address: 'Shop 12, Temple Cross Street',
    phone: '+91 98453 45678',
    whatsapp: '+919845345678',
    operatingHours: '07:00 AM - 10:00 PM',
    isOpen: true,
    rating: 4.6,
    reviewCount: 110,
    priceRange: '₹₹',
    upiAccepted: true,
    specialties: ['Fresh Dairy & Milk', 'Loose Spices & Pulses', 'Cold Drinks', 'Snack Munchies'],
    tags: ['Kirana', 'Grocery', 'Milk', 'Spices', 'Snacks', 'Essentials'],
    imageUrl: 'https://images.unsplash.com/photo-1604719312566-8912e9227c64?auto=format&fit=crop&w=600&q=80',
    vendorStory:
      'A multi-generational neighborhood corner grocery stocking everything from morning milk packets to organic jaggery and instant noodles.',
    services: [
      { name: 'Fresh Milk & Curd Packets', price: 'MRP' },
      { name: 'Assorted Biscuits & Snacks', price: 'From ₹10' },
      { name: 'Loose Basmati Rice & Dals', price: 'By Kg' },
      { name: 'Quick WhatsApp Home Delivery within 500m', price: 'Free > ₹200' },
    ],
    reviews: [
      {
        id: 'r-5',
        userName: 'Pooja K.',
        rating: 4,
        comment: 'Has literally every household item. Uncle even keeps change ready for cash.',
        createdAt: '4 days ago',
        helpfulCount: 4,
      },
    ],
  },
  {
    id: 'shop-5',
    name: 'Sharmaji Chat & Crispy Pani Puri',
    category: 'Street Chaat & Food',
    stallType: 'Pushcart Stall',
    ownerName: 'Vikas Sharma',
    landmark: 'Evening spot by the Peepal tree circle',
    address: 'Cart #3, Evening Food Street',
    phone: '+91 98454 56789',
    whatsapp: '+919845456789',
    operatingHours: '04:00 PM - 10:00 PM',
    isOpen: true,
    rating: 4.9,
    reviewCount: 224,
    priceRange: '₹',
    upiAccepted: true,
    specialties: ['Hing Pudina Pani Puri', 'Dahi Puri', 'Sev Puri', 'Aloo Tikki Chaat'],
    tags: ['Street Food', 'Pani Puri', 'Golgappa', 'Chaat', 'Spicy', 'Evening Snack'],
    imageUrl: 'https://images.unsplash.com/photo-1601050690597-df0568f70950?auto=format&fit=crop&w=600&q=80',
    vendorStory:
      'Famous for using mineral water and homemade crushed roasted cumin-mint spices. Crispy puries made fresh daily at 2 PM.',
    services: [
      { name: 'Mineral Water Pani Puri (6 pcs)', price: '₹30' },
      { name: 'Sweet & Spicy Dahi Batata Puri', price: '₹50' },
      { name: 'Mumbai Style Sev Puri', price: '₹40' },
      { name: 'Crispy Hot Aloo Tikki with Chole', price: '₹60' },
    ],
    activeDeal: {
      id: 'deal-3',
      title: 'Pani Puri Gang Combo',
      description: 'Get 1 Free Sukha Puri with every 2 plates',
      discount: 'Bonus Treat',
      validUntil: '9:00 PM',
      badge: 'Crowd Favorite',
    },
    reviews: [
      {
        id: 'r-6',
        userName: 'Rahul V.',
        rating: 5,
        comment: 'Hygiene is unmatched. Gloves used and water is super chilled and tangy!',
        createdAt: 'Yesterday',
        helpfulCount: 15,
      },
    ],
  },
  {
    id: 'shop-6',
    name: 'Babu Cobbler & Bag Repair Stand',
    category: 'Cobbler & Leather',
    stallType: 'Sidewalk Kiosk',
    ownerName: 'Babu Ram',
    landmark: 'Near the auto rickshaw stand, tree shade',
    address: 'Corner Spot, Auto Stand Junction',
    phone: '+91 98455 67890',
    operatingHours: '09:00 AM - 07:30 PM',
    isOpen: true,
    rating: 4.8,
    reviewCount: 65,
    priceRange: '₹',
    upiAccepted: true,
    cashOnly: false,
    specialties: ['Sole Stitching', 'Heel Replacement', 'Leather Bag Polish', 'Belt Punching'],
    tags: ['Cobbler', 'Shoe Repair', 'Leather', 'Bag Fix', 'Zipper', 'Emergency Fix'],
    imageUrl: 'https://images.unsplash.com/photo-1549298916-b41d501d3772?auto=format&fit=crop&w=600&q=80',
    vendorStory:
      'Babu sits with his brass hammer, heavy thread, and sole adhesives. Can revive broken formal shoes or mend ripped collegiate rucksacks in minutes.',
    services: [
      { name: 'Shoe Sole Re-stitching (Pair)', price: '₹50' },
      { name: 'Instant Adhesive Sole Bonding', price: '₹30' },
      { name: 'Shoe Polish & Buffing', price: '₹25' },
      { name: 'Extra Belt Holes Punching', price: '₹10' },
    ],
    reviews: [
      {
        id: 'r-7',
        userName: 'Suraj N.',
        rating: 5,
        comment: 'Saved my sports shoe when the sole peeled off right before gym workout. 5 stars!',
        createdAt: '5 days ago',
        helpfulCount: 8,
      },
    ],
  },
  {
    id: 'shop-7',
    name: 'Sardarji Fresh Sugarcane & Seasonal Juices',
    category: 'Juice & Fruits',
    stallType: 'Pushcart Stall',
    ownerName: 'Gurpreet Singh',
    landmark: 'Near North Gate entrance, next to park',
    address: 'Mobile Cart #2, Green Park Verge',
    phone: '+91 98456 78901',
    whatsapp: '+919845678901',
    operatingHours: '08:00 AM - 09:00 PM',
    isOpen: true,
    rating: 4.7,
    reviewCount: 78,
    priceRange: '₹',
    upiAccepted: true,
    specialties: ['Ginger-Lemon Sugarcane Juice', 'Mausambi Juice', 'Fresh Watermelon Bowl', 'Tender Coconut'],
    tags: ['Juice', 'Sugarcane', 'Healthy', 'Cold Drink', 'Fresh', 'Hydration'],
    imageUrl: 'https://images.unsplash.com/photo-1534353473418-4cfa6c56fd38?auto=format&fit=crop&w=600&q=80',
    vendorStory:
      'Cold-crushed fresh sugarcane with lemon, ginger, and black salt served in hygienic biodegradable cups without artificial sweeteners.',
    services: [
      { name: 'Pure Sugarcane Juice (Tall Glass)', price: '₹25' },
      { name: 'Fresh Mosambi (Sweet Lime) Juice', price: '₹40' },
      { name: 'Diced Watermelon Fruit Plate', price: '₹30' },
      { name: 'Natural Tender Coconut Water', price: '₹50' },
    ],
    reviews: [
      {
        id: 'r-8',
        userName: 'Megha P.',
        rating: 5,
        comment: 'So refreshing in the afternoon heat. Clean machine and zero ice option available.',
        createdAt: '1 week ago',
        helpfulCount: 6,
      },
    ],
  },
  {
    id: 'shop-8',
    name: 'Meena Fresh Flowers & Puja Needs',
    category: 'Flowers & Puja',
    stallType: 'Sidewalk Kiosk',
    ownerName: 'Meenamma',
    landmark: 'Under the Temple Arch, South side',
    address: 'Stall #1, Temple Arch Road',
    phone: '+91 98457 89012',
    operatingHours: '06:00 AM - 08:30 PM',
    isOpen: true,
    rating: 4.9,
    reviewCount: 92,
    priceRange: '₹',
    upiAccepted: true,
    specialties: ['Jasmine Flower Garlands', 'Marigold Puja Strings', 'Incense & Camphor', 'Fresh Betel Leaves'],
    tags: ['Flowers', 'Jasmine', 'Puja', 'Temple', 'Garlands', 'Traditional'],
    imageUrl: 'https://images.unsplash.com/photo-1563245372-f21724e3856d?auto=format&fit=crop&w=600&q=80',
    vendorStory:
      'Weaving fragrant Madurai malli jasmine garlands and festive marigold ropes since morning 5:30 AM.',
    services: [
      { name: 'Fresh Jasmine String (Per Muzham / Hand)', price: '₹30' },
      { name: 'Marigold Puja Garland (Pair)', price: '₹50' },
      { name: 'Complete Daily Puja Flower Pack', price: '₹40' },
    ],
    reviews: [
      {
        id: 'r-9',
        userName: 'Radha N.',
        rating: 5,
        comment: 'The scent of real fresh jasmine is divine. Always gives extra tulsi leaves.',
        createdAt: '3 days ago',
        helpfulCount: 3,
      },
    ],
  },
  {
    id: 'shop-9',
    name: 'TimeCraft Watch Battery & Duplicate Keys',
    category: 'Watch & Key Repair',
    stallType: 'Small Dukaan',
    ownerName: 'Santosh Kumar',
    landmark: 'Behind the Bus Stop kiosk, Shop 3',
    address: 'Shop 3, Market Arcade Alley',
    phone: '+91 98458 90123',
    operatingHours: '10:30 AM - 08:30 PM',
    isOpen: false,
    rating: 4.6,
    reviewCount: 43,
    priceRange: '₹₹',
    upiAccepted: true,
    specialties: ['Precision Duplicate Keys', 'Watch Battery Replacement', 'Strap Resizing', 'Wall Clock Fix'],
    tags: ['Keymaker', 'Duplicate Keys', 'Watch Repair', 'Battery', 'Locksmith'],
    imageUrl: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=600&q=80',
    vendorStory:
      'Can cut duplicate door, locker, or scooter keys on high-precision machine in 2 minutes. Original Maxell/Sony watch cell batteries.',
    services: [
      { name: 'Brass Duplicate Key Cutting', price: '₹50' },
      { name: 'Swiss/Japanese Watch Battery', price: '₹120' },
      { name: 'Metal Watch Strap Link Removal', price: '₹30' },
      { name: 'Padlock / Bike Key Duplicate', price: '₹40' },
    ],
    reviews: [
      {
        id: 'r-10',
        userName: 'Arun K.',
        rating: 4,
        comment: 'Made a duplicate room key in literally 90 seconds. Worked perfectly.',
        createdAt: '2 weeks ago',
        helpfulCount: 4,
      },
    ],
  },
  {
    id: 'shop-10',
    name: 'ScreenShield & Mobile Accessories Cart',
    category: 'Mobile & Electronics',
    stallType: 'Pushcart Stall',
    ownerName: 'Imran Ali',
    landmark: 'Outside Metro Station Pillar 124',
    address: 'Mobile Stand, Station Promenade',
    phone: '+91 98459 01234',
    whatsapp: '+919845901234',
    operatingHours: '11:00 AM - 09:30 PM',
    isOpen: true,
    rating: 4.7,
    reviewCount: 115,
    priceRange: '₹',
    upiAccepted: true,
    specialties: ['11D Tempered Glass Installation', 'Silicone Phone Covers', 'Fast Charging Cables', 'OTG Adapters'],
    tags: ['Tempered Glass', 'Screen Guard', 'Mobile Cover', 'Charger', 'Earphones'],
    imageUrl: 'https://images.unsplash.com/photo-1580910051074-3eb694886505?auto=format&fit=crop&w=600&q=80',
    vendorStory:
      'Expert bubble-free tempered glass application in 60 seconds with dust removal wipes. Affordable protective cases for all phones.',
    services: [
      { name: '11D Edge-to-Edge Tempered Glass', price: '₹80' },
      { name: 'Anti-Peep Privacy Screen Guard', price: '₹150' },
      { name: 'Braided Type-C Fast Cable', price: '₹120' },
      { name: 'Matte Anti-drop Phone Cover', price: '₹100' },
    ],
    activeDeal: {
      id: 'deal-4',
      title: 'Student Screen Protection',
      description: 'Tempered Glass + Camera Lens Protector Combo',
      discount: 'Only ₹100 Flat',
      validUntil: '8:30 PM',
      badge: 'Hot Deal',
    },
    reviews: [
      {
        id: 'r-11',
        userName: 'Tanvi J.',
        rating: 5,
        comment: 'Zero bubbles on my phone screen! Imran bhaiya took extra care cleaning the dust.',
        createdAt: 'Yesterday',
        helpfulCount: 11,
      },
    ],
  },
];

// Offsets in meters around center (within 500m radius)
// (xMeters, yMeters)
export const RELATIVE_POSITIONS = [
  { dx: 45, dy: 65 }, // ~79m away (Raju Chai)
  { dx: -120, dy: 80 }, // ~144m away (Murugan Xerox)
  { dx: 150, dy: -130 }, // ~198m away (Anwar Master Tailor)
  { dx: -90, dy: -95 }, // ~130m away (Ganesh Kirana)
  { dx: 180, dy: 210 }, // ~276m away (Sharmaji Chaat)
  { dx: -160, dy: -120 }, // ~200m away (Babu Cobbler)
  { dx: 220, dy: -190 }, // ~290m away (Sardarji Juice)
  { dx: -70, dy: 230 }, // ~240m away (Meena Flowers)
  { dx: 290, dy: 260 }, // ~389m away (TimeCraft Watch)
  { dx: -240, dy: 290 }, // ~376m away (ScreenShield Mobile)
];

// Generate localized shops around any given user coordinates
export function generateShopsForLocation(
  centerLat: number,
  centerLng: number
): Shop[] {
  // 1 deg lat ≈ 111,000m
  // 1 deg lng ≈ 111,000m * cos(lat)
  const metersPerDegLat = 111000;
  const metersPerDegLng = 111000 * Math.cos((centerLat * Math.PI) / 180);

  return INITIAL_SHOPS_TEMPLATE.map((template, index) => {
    const pos = RELATIVE_POSITIONS[index] || {
      dx: ((index * 67) % 350) - 175,
      dy: ((index * 91) % 350) - 175,
    };

    const shopLat = centerLat + pos.dy / metersPerDegLat;
    const shopLng = centerLng + pos.dx / metersPerDegLng;

    return {
      ...template,
      latitude: shopLat,
      longitude: shopLng,
    };
  });
}
