import { ShoppingMission } from '../types';
import { MOCK_PRODUCTS } from './mockProducts';

export const MOCK_SHOPPING_MISSIONS: ShoppingMission[] = [
  {
    id: 'mission-college-setup',
    title: '🎓 College Setup',
    icon: 'GraduationCap',
    tagline: 'Everything a university student needs under ₹15,000',
    targetBudget: 15000,
    category: 'College & Study Setup',
    description: 'A curated starter kit for college freshers and hostel life — ergonomic backpack, wireless ANC audio, study lamp, stainless water bottle, power bank, and smart grooming.',
    tips: [
      'InfinityHub grouped your cart across 3 stores to save ₹1,300 on shipping and bundle discounts.',
      'All electronics include 1+ year on-site manufacturer warranty.'
    ],
    items: [
      {
        id: 'item-backpack',
        category: 'Bags & Accessories',
        name: 'Wildcraft 32L Ergonomic Laptop Backpack',
        allocatedBudget: 1200,
        selectedProduct: MOCK_PRODUCTS.find(p => p.id === 'prod-backpack-myntra') || MOCK_PRODUCTS[0],
        alternatives: [MOCK_PRODUCTS[0]],
        isRequired: true
      },
      {
        id: 'item-headphones',
        category: 'Electronics',
        name: 'Sony WH-CH720N Active Noise Cancelling Headphones',
        allocatedBudget: 7990,
        selectedProduct: MOCK_PRODUCTS.find(p => p.id === 'prod-headphone-amazon') || MOCK_PRODUCTS[2],
        alternatives: [],
        isRequired: true
      },
      {
        id: 'item-shoes',
        category: 'Fashion & Footwear',
        name: 'Nike Air Max Excee Running Shoes',
        allocatedBudget: 4599,
        selectedProduct: MOCK_PRODUCTS.find(p => p.id === 'prod-shoes-myntra') || MOCK_PRODUCTS[3],
        alternatives: [],
        isRequired: true
      },
      {
        id: 'item-skincare',
        category: 'Personal Care',
        name: 'The Derma Co 1% Hyaluronic Sunscreen SPF 50',
        allocatedBudget: 429,
        selectedProduct: MOCK_PRODUCTS.find(p => p.id === 'prod-skincare-nykaa') || MOCK_PRODUCTS[4],
        alternatives: [],
        isRequired: false
      }
    ]
  },
  {
    id: 'mission-bedroom-decor',
    title: '🏠 Cozy Bedroom Setup',
    icon: 'Home',
    tagline: 'Transform your room into an aesthetic sanctuary under ₹15,000',
    targetBudget: 15000,
    category: 'Home & Living',
    description: 'Warm lighting, ultra-soft winter mink bedding, ambient aromatherapy, and organized storage for modern bedrooms.',
    tips: [
      'IKEA + Flipkart combo gives you premium Scandinavian aesthetic with maximum thermal comfort.',
      'Estimated combined savings of ₹1,850 vs standalone retail.'
    ],
    items: [
      {
        id: 'item-lamp',
        category: 'Lighting',
        name: 'IKEA TÄRNABY Dimmable Mood Table Lamp',
        allocatedBudget: 1490,
        selectedProduct: MOCK_PRODUCTS.find(p => p.id === 'prod-lamp-ikea') || MOCK_PRODUCTS[5],
        alternatives: [],
        isRequired: true
      },
      {
        id: 'item-blanket',
        category: 'Bedding',
        name: 'Wakefit 500 GSM Double Bed Mink Blanket',
        allocatedBudget: 1199,
        selectedProduct: MOCK_PRODUCTS.find(p => p.id === 'prod-blanket-flipkart') || MOCK_PRODUCTS[4],
        alternatives: [],
        isRequired: true
      }
    ]
  },
  {
    id: 'mission-coding-setup',
    title: '💻 Developer Power Setup',
    icon: 'Laptop',
    tagline: 'High-performance workstation essentials under ₹65,000',
    targetBudget: 65000,
    category: 'Laptops',
    description: '16GB RAM OLED laptop, ergonomic wireless mouse, and high-fidelity noise-cancelling headphones for intense coding sprints.',
    tips: [
      'Buying the laptop from Croma saves ₹2,000 compared to other electronics portals.',
      'Includes accidental damage protection for peace of mind.'
    ],
    items: [
      {
        id: 'item-laptop',
        category: 'Laptops',
        name: 'ASUS Vivobook 15 OLED (16GB RAM / Core i5)',
        allocatedBudget: 54990,
        selectedProduct: MOCK_PRODUCTS.find(p => p.id === 'prod-laptop-croma') || MOCK_PRODUCTS[1],
        alternatives: [],
        isRequired: true
      },
      {
        id: 'item-audio',
        category: 'Audio',
        name: 'Sony WH-CH720N Noise Cancelling Headphones',
        allocatedBudget: 7990,
        selectedProduct: MOCK_PRODUCTS.find(p => p.id === 'prod-headphone-amazon') || MOCK_PRODUCTS[2],
        alternatives: [],
        isRequired: true
      }
    ]
  },
  {
    id: 'mission-makeup-kit',
    title: '💄 Everyday Glow Makeup Kit',
    icon: 'Sparkles',
    tagline: 'Complete skincare-infused beauty routine under ₹3,500',
    targetBudget: 3500,
    category: 'Skincare & Beauty',
    description: 'Broad-spectrum sun protection, hydration serums, tinted lip oils, and luxury travel cosmetic bag.',
    tips: [
      'Nykaa + Myntra beauty sales synchronized for maximum discount authenticity.'
    ],
    items: [
      {
        id: 'item-sunscreen',
        category: 'Skincare',
        name: 'The Derma Co 1% Hyaluronic Sunscreen SPF 50',
        allocatedBudget: 429,
        selectedProduct: MOCK_PRODUCTS.find(p => p.id === 'prod-skincare-nykaa') || MOCK_PRODUCTS[4],
        alternatives: [],
        isRequired: true
      },
      {
        id: 'item-purse',
        category: 'Accessories',
        name: 'Lavie Luxe Black Structured Satchel Handbag',
        allocatedBudget: 899,
        selectedProduct: MOCK_PRODUCTS.find(p => p.id === 'prod-purse-myntra') || MOCK_PRODUCTS[0],
        alternatives: [],
        isRequired: true
      }
    ]
  },
  {
    id: 'mission-gym-fitness',
    title: '🏋️ Gym & Fitness Kickstart',
    icon: 'Dumbbell',
    tagline: 'High-traction training shoes, smart biometric watch & shaker under ₹8,000',
    targetBudget: 8000,
    category: 'Sports & Fitness',
    description: 'Track your heart rate, sleep, and workouts with AMOLED accuracy and Nike Air impact absorption.',
    tips: [
      'Myntra shoe deal offers 42% discount with free exchange.'
    ],
    items: [
      {
        id: 'item-gym-shoes',
        category: 'Footwear',
        name: 'Nike Air Max Excee Running Shoes',
        allocatedBudget: 4599,
        selectedProduct: MOCK_PRODUCTS.find(p => p.id === 'prod-shoes-myntra') || MOCK_PRODUCTS[3],
        alternatives: [],
        isRequired: true
      },
      {
        id: 'item-gym-watch',
        category: 'Wearables',
        name: 'Noise ColorFit Pro 5 Max AMOLED Smartwatch',
        allocatedBudget: 2999,
        selectedProduct: MOCK_PRODUCTS.find(p => p.id === 'prod-watch-amazon') || MOCK_PRODUCTS[6],
        alternatives: [],
        isRequired: true
      }
    ]
  }
];
