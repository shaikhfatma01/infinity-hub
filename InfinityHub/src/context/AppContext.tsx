import React, { createContext, useContext, useState, useEffect } from 'react';
import { 
  Product, 
  StoreName, 
  ProductCategory, 
  FilterState, 
  CartItem, 
  ShoppingMission, 
  PriceAlert, 
  SharedListItem, 
  SortOption,
  User 
} from '../types';
import { MOCK_PRODUCTS } from '../data/mockProducts';
import { MOCK_SHOPPING_MISSIONS } from '../data/mockMissions';
import { optimizeCart, CartOptimizationReport, parseNaturalLanguageQuery } from '../services/aiEngine';
import { catalogService } from '../services/catalogService';
import { authService } from '../services/authService';
import confetti from 'canvas-confetti';

export interface ToastMessage {
  id: string;
  title: string;
  message: string;
  type: 'success' | 'info' | 'warning';
}

interface AppContextType {
  // Navigation & View
  activeTab: string;
  setActiveTab: (tab: string) => void;
  
  // Catalog & Search
  products: Product[];
  filteredProducts: Product[];
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  filters: FilterState;
  setFilters: React.Dispatch<React.SetStateAction<FilterState>>;
  updateFilter: <K extends keyof FilterState>(key: K, value: FilterState[K]) => void;
  resetFilters: () => void;
  handleSearchSubmit: (query?: string) => void;
  isSearching: boolean;
  refreshCatalog: () => Promise<void>;
  isLiveBackend: boolean;
  
  // Auth & Profile
  currentUser: User | null;
  setCurrentUser: (user: User | null) => void;
  login: (email: string, password: string) => Promise<boolean>;
  register: (email: string, password: string, name: string) => Promise<boolean>;
  logout: () => void;
  
  // Modals & Drawers
  selectedProduct: Product | null;
  setSelectedProduct: (product: Product | null) => void;
  isCartOpen: boolean;
  setIsCartOpen: (open: boolean) => void;
  isWishlistOpen: boolean;
  setIsWishlistOpen: (open: boolean) => void;
  isCompareModalOpen: boolean;
  setIsCompareModalOpen: (open: boolean) => void;
  isAskAiOpen: boolean;
  setIsAskAiOpen: (open: boolean) => void;
  isVoiceModalOpen: boolean;
  setIsVoiceModalOpen: (open: boolean) => void;
  isSnapShopModalOpen: boolean;
  setIsSnapShopModalOpen: (open: boolean) => void;
  isMissionsModalOpen: boolean;
  setIsMissionsModalOpen: (open: boolean) => void;
  isBuildLookModalOpen: boolean;
  setIsBuildLookModalOpen: (open: boolean) => void;
  isSharedListModalOpen: boolean;
  setIsSharedListModalOpen: (open: boolean) => void;
  isPriceAlertModalOpen: boolean;
  setIsPriceAlertModalOpen: (open: boolean) => void;
  isProfileModalOpen: boolean;
  setIsProfileModalOpen: (open: boolean) => void;
  priceAlertTargetProduct: Product | null;
  setPriceAlertTargetProduct: (product: Product | null) => void;

  // Cart
  cartItems: CartItem[];
  addToCart: (product: Product, store?: StoreName, price?: number, shipping?: number) => void;
  removeFromCart: (cartItemId: string) => void;
  updateCartQuantity: (cartItemId: string, qty: number) => void;
  cartStoreCount: number;
  cartTotal: number;
  cartPotentialSavings: number;
  runCartOptimizer: () => CartOptimizationReport;
  applyCartOptimizations: (report: CartOptimizationReport) => void;
  
  // Wishlist
  wishlist: Product[];
  toggleWishlist: (product: Product) => void;
  isInWishlist: (productId: string) => boolean;

  // Compare List (up to 4 products)
  compareList: Product[];
  toggleCompare: (product: Product) => void;
  removeFromCompare: (productId: string) => void;
  isInCompare: (productId: string) => boolean;
  clearCompare: () => void;

  // Shopping Missions
  missions: ShoppingMission[];
  activeMission: ShoppingMission | null;
  setActiveMission: (mission: ShoppingMission | null) => void;
  startMission: (missionId: string) => void;

  // Price Alerts
  priceAlerts: PriceAlert[];
  addPriceAlert: (product: Product, targetPrice: number) => void;
  removePriceAlert: (alertId: string) => void;

  // Shared List
  sharedList: SharedListItem[];
  addSharedItem: (name: string, addedBy: string, category: string) => void;
  toggleSharedItemPurchased: (id: string) => void;

  // Toast Notifications
  toasts: ToastMessage[];
  showToast: (title: string, message: string, type?: 'success' | 'info' | 'warning') => void;
  removeToast: (id: string) => void;
}

const initialFilters: FilterState = {
  searchQuery: '',
  selectedStores: [],
  selectedCategories: [],
  priceRange: [0, 80000],
  minRating: 0,
  minDiscount: 0,
  onlyInStock: false,
  onlyProductTwins: false,
  sortBy: 'best-match'
};

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [activeTab, setActiveTab] = useState<string>('home');
  const [products, setProducts] = useState<Product[]>(MOCK_PRODUCTS);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [filters, setFilters] = useState<FilterState>(initialFilters);
  const [isSearching, setIsSearching] = useState<boolean>(false);
  const [isLiveBackend, setIsLiveBackend] = useState<boolean>(false);

  // Auth state
  const [currentUser, setCurrentUser] = useState<User | null>({
    id: 'user-demo-fatma',
    email: 'fatma.shaikh@infinityhub.ai',
    name: 'Fatma Shaikh',
    role: 'PRO_MEMBER',
    isDemo: true,
    createdAt: new Date().toISOString()
  });

  // Modals
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [isCartOpen, setIsCartOpen] = useState<boolean>(false);
  const [isWishlistOpen, setIsWishlistOpen] = useState<boolean>(false);
  const [isCompareModalOpen, setIsCompareModalOpen] = useState<boolean>(false);
  const [isAskAiOpen, setIsAskAiOpen] = useState<boolean>(false);
  const [isVoiceModalOpen, setIsVoiceModalOpen] = useState<boolean>(false);
  const [isSnapShopModalOpen, setIsSnapShopModalOpen] = useState<boolean>(false);
  const [isMissionsModalOpen, setIsMissionsModalOpen] = useState<boolean>(false);
  const [isBuildLookModalOpen, setIsBuildLookModalOpen] = useState<boolean>(false);
  const [isSharedListModalOpen, setIsSharedListModalOpen] = useState<boolean>(false);
  const [isPriceAlertModalOpen, setIsPriceAlertModalOpen] = useState<boolean>(false);
  const [isProfileModalOpen, setIsProfileModalOpen] = useState<boolean>(false);
  const [priceAlertTargetProduct, setPriceAlertTargetProduct] = useState<Product | null>(null);

  // Cart
  const [cartItems, setCartItems] = useState<CartItem[]>([
    {
      id: 'cart-init-1',
      productId: 'prod-purse-amazon',
      product: MOCK_PRODUCTS[1],
      selectedStore: 'Amazon',
      selectedPrice: 999,
      selectedShipping: 40,
      quantity: 1
    },
    {
      id: 'cart-init-2',
      productId: 'prod-skincare-nykaa',
      product: MOCK_PRODUCTS[4],
      selectedStore: 'Nykaa',
      selectedPrice: 429,
      selectedShipping: 0,
      quantity: 1
    },
    {
      id: 'cart-init-3',
      productId: 'prod-shoes-myntra',
      product: MOCK_PRODUCTS[3],
      selectedStore: 'Myntra',
      selectedPrice: 4599,
      selectedShipping: 0,
      quantity: 1
    }
  ]);

  // Wishlist
  const [wishlist, setWishlist] = useState<Product[]>([
    MOCK_PRODUCTS[0],
    MOCK_PRODUCTS[2]
  ]);

  // Compare List
 const [compareList, setCompareList] = useState<Product[]>([]);

  // Shopping Missions
  const [missions, setMissions] = useState<ShoppingMission[]>(MOCK_SHOPPING_MISSIONS);
  const [activeMission, setActiveMission] = useState<ShoppingMission | null>(MOCK_SHOPPING_MISSIONS[0]);

  // Price Alerts
  const [priceAlerts, setPriceAlerts] = useState<PriceAlert[]>([
    {
      id: 'alert-1',
      productId: 'prod-laptop-croma',
      productName: 'ASUS Vivobook 15 OLED (16GB RAM)',
      productImage: MOCK_PRODUCTS[1]?.image || '',
      currentPrice: 54990,
      targetPrice: 52000,
      store: 'Croma',
      createdAt: 'Yesterday',
      status: 'ACTIVE'
    }
  ]);

  // Shared List
  const [sharedList, setSharedList] = useState<SharedListItem[]>([
    { id: 'shared-1', name: 'Daawat Basmati Rice (5kg)', addedBy: 'Fatma', category: 'Grocery', matchedProduct: MOCK_PRODUCTS[5], quantity: 1, isPurchased: false },
    { id: 'shared-2', name: 'Fortune Sunflower Oil (1L)', addedBy: 'Amina', category: 'Grocery', matchedProduct: MOCK_PRODUCTS[6], quantity: 2, isPurchased: false },
    { id: 'shared-3', name: 'Wakefit Winter Double Blanket', addedBy: 'Mom', category: 'Bedding', matchedProduct: MOCK_PRODUCTS[4], quantity: 1, isPurchased: true }
  ]);

  // Toasts
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  const showToast = (title: string, message: string, type: 'success' | 'info' | 'warning' = 'info') => {
    const id = Date.now().toString() + Math.random().toString();
    setToasts(prev => [...prev, { id, title, message, type }]);
    setTimeout(() => {
      removeToast(id);
    }, 4500);
  };

  const removeToast = (id: string) => {
    setToasts(prev => prev.filter(t => t.id !== id));
  };

  // Sync with Backend on initialization
  const refreshCatalog = async () => {
    try {
      const data = await catalogService.getProducts();
      if (data && data.products && data.products.length > 0) {
        setProducts(data.products);
        setIsLiveBackend(true);
      }
    } catch {
      // Backend not running yet or unreachable, gracefully retain mock catalog
    }
  };

  useEffect(() => {
    const initAppData = async () => {
      // 1. Check if user is logged in
      if (authService.isAuthenticated()) {
        try {
          const authData = await authService.getMe();
          if (authData?.user) {
            setCurrentUser(authData.user);
          }
        } catch {
          // Token expired or invalid
          authService.logout();
        }
      }

      // 2. Load live products from backend
      try {
        const prodData = await catalogService.getProducts();
        if (prodData && prodData.products && prodData.products.length > 0) {
          setProducts(prodData.products);
          setIsLiveBackend(true);
        }
      } catch {
        // Fallback to MOCK_PRODUCTS
      }

      // 3. Load live cart from backend
      try {
        const cartData = await catalogService.getCart();
        if (cartData && cartData.items && cartData.items.length > 0) {
          setCartItems(cartData.items);
        }
      } catch {
        // Fallback to initial cart items
      }

      // 4. Load live wishlist
      try {
        const wishData = await catalogService.getWishlist();
        if (wishData && wishData.wishlist) {
          const mappedWish = wishData.wishlist.map(w => w.product).filter(Boolean);
          if (mappedWish.length > 0) {
            setWishlist(mappedWish);
          }
        }
      } catch {
        // Keep initial wishlist
      }

      // 5. Load live alerts
      try {
        const alertData = await catalogService.getPriceAlerts();
        if (alertData && alertData.alerts && alertData.alerts.length > 0) {
          setPriceAlerts(alertData.alerts);
        }
      } catch {
        // Keep initial alerts
      }

      // 6. Load live shopping missions
      try {
        const missionData = await catalogService.getMissions();
        if (missionData && missionData.missions && missionData.missions.length > 0) {
          setMissions(missionData.missions);
          setActiveMission(missionData.missions[0]);
        }
      } catch {
        // Keep initial missions
      }

      // 7. Load live shared list
      try {
        const listData = await catalogService.getSharedList();
        if (listData && listData.items && listData.items.length > 0) {
          setSharedList(listData.items);
        }
      } catch {
        // Keep initial shared items
      }
    };

    initAppData();
  }, []);

  // Auth actions
  const login = async (email: string, password: string): Promise<boolean> => {
    try {
      const res = await authService.login({ email, password });
      if (res && res.user) {
        setCurrentUser(res.user);
        showToast('👋 Welcome back!', `Signed in as ${res.user.name}`, 'success');
        // Refresh cart & wishlist for this user
        try {
          const cartData = await catalogService.getCart();
          if (cartData?.items) setCartItems(cartData.items);
          const wishData = await catalogService.getWishlist();
          if (wishData?.wishlist) setWishlist(wishData.wishlist.map(w => w.product).filter(Boolean));
        } catch {
          // Ignore sync errors
        }
        return true;
      }
      return false;
    } catch (err: any) {
      showToast('Authentication Error', err.message || 'Login failed', 'warning');
      return false;
    }
  };

  const register = async (email: string, password: string, name: string): Promise<boolean> => {
    try {
      const res = await authService.register({ email, password, name });
      if (res && res.user) {
        setCurrentUser(res.user);
        showToast('🎉 Account Created', `Welcome to InfinityHub, ${res.user.name}!`, 'success');
        return true;
      }
      return false;
    } catch (err: any) {
      showToast('Registration Error', err.message || 'Sign up failed', 'warning');
      return false;
    }
  };

  const logout = () => {
    authService.logout();
    setCurrentUser(null);
    showToast('Signed Out', 'You have been logged out of InfinityHub.', 'info');
  };

  // Search Submit with simulated AI scanning
  const handleSearchSubmit = (customQuery?: string) => {
    const q = customQuery !== undefined ? customQuery : searchQuery;
    setSearchQuery(q);
    setIsSearching(true);
    setActiveTab('shop');

    const parsed = parseNaturalLanguageQuery(q);
    setFilters(prev => ({
      ...prev,
      searchQuery: q,
      selectedCategories: parsed.category ? [parsed.category as ProductCategory] : prev.selectedCategories,
      minRating: parsed.minRating ? parsed.minRating : prev.minRating,
      priceRange: parsed.maxBudget ? [0, parsed.maxBudget] : prev.priceRange
    }));

    setTimeout(() => {
      setIsSearching(false);
      showToast('✨ Infinity AI Scan Complete', `Found matching products across 16 monitored stores for "${q || 'All Products'}".`, 'success');
    }, 600);
  };

  const updateFilter = <K extends keyof FilterState>(key: K, value: FilterState[K]) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  };

  const resetFilters = () => {
    setFilters(initialFilters);
    setSearchQuery('');
  };

  // Filtered Products computation
  const filteredProducts = React.useMemo(() => {
    const { searchQuery: query, selectedStores, selectedCategories, priceRange, minRating, minDiscount, onlyInStock, onlyProductTwins, sortBy } = filters;
    const queryLower = query.toLowerCase().trim();
    const parsed = query.trim() ? parseNaturalLanguageQuery(query) : null;

    let results = products.filter(product => {
      if (queryLower) {
        const nameMatch = product.name?.toLowerCase().includes(queryLower);
        const brandMatch = product.brand?.toLowerCase().includes(queryLower);
        const categoryMatch = product.category?.toLowerCase().includes(queryLower);
        const tagMatch = product.tags?.some(t => t.toLowerCase().includes(queryLower));
        const descMatch = product.description?.toLowerCase().includes(queryLower);

        let nlMatch = false;
        if (parsed) {
          if (parsed.category && product.category === parsed.category) nlMatch = true;
          if (parsed.color && product.tags?.includes(parsed.color)) nlMatch = true;
          if (parsed.purpose && product.tags?.includes(parsed.purpose.toLowerCase())) nlMatch = true;
        }

        if (!nameMatch && !brandMatch && !categoryMatch && !tagMatch && !descMatch && !nlMatch) {
          return false;
        }
      }

      if (parsed?.maxBudget && product.currentPrice > parsed.maxBudget) return false;
      if (parsed?.minRating && product.rating < parsed.minRating) return false;

      if (selectedStores.length > 0 && !selectedStores.includes(product.store)) return false;
      if (selectedCategories.length > 0 && !selectedCategories.includes(product.category)) return false;
      if (product.currentPrice < priceRange[0] || product.currentPrice > priceRange[1]) return false;
      if (product.rating < minRating) return false;
      if (product.discountPercent < minDiscount) return false;
      if (onlyInStock && !product.inStock) return false;
      if (onlyProductTwins && (!product.twinOffers || product.twinOffers.length <= 1)) return false;

      return true;
    });

    switch (sortBy) {
      case 'lowest-price':
        results.sort((a, b) => a.finalEstimatedPrice - b.finalEstimatedPrice);
        break;
      case 'highest-rating':
        results.sort((a, b) => b.rating - a.rating);
        break;
      case 'biggest-discount':
        results.sort((a, b) => b.discountPercent - a.discountPercent);
        break;
      case 'fastest-delivery':
        results.sort((a, b) => a.deliveryDays - b.deliveryDays);
        break;
      case 'best-value':
      case 'highest-infinity-score':
      case 'best-match':
      default:
        results.sort((a, b) => b.infinityScore - a.infinityScore);
        break;
    }

    return results;
  }, [products, filters]);

  // Cart operations
  const addToCart = (product: Product, store?: StoreName, price?: number, shipping?: number) => {
    const finalStore = store || product.store;
    const finalPrice = price !== undefined ? price : product.currentPrice;
    const finalShipping = shipping !== undefined ? shipping : product.shippingFee;

    const tempId = `cart-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`;
    setCartItems(prev => {
      const existing = prev.find(item => item.productId === product.id && item.selectedStore === finalStore);
      if (existing) {
        return prev.map(item => item.id === existing.id ? { ...item, quantity: item.quantity + 1 } : item);
      }
      return [
        ...prev,
        {
          id: tempId,
          productId: product.id,
          product,
          selectedStore: finalStore,
          selectedPrice: finalPrice,
          selectedShipping: finalShipping,
          quantity: 1
        }
      ];
    });

    showToast('🛒 Added to Infinity Cart', `${product.name.slice(0, 32)}... (${finalStore})`, 'success');

    // Async persist to backend
    catalogService.addToCart({
      productId: product.id,
      selectedStore: finalStore,
      selectedPrice: finalPrice,
      selectedShipping: finalShipping,
      quantity: 1
    }).then(res => {
      if (res?.item?.id) {
        setCartItems(prev => prev.map(item => item.id === tempId ? { ...item, id: res.item.id } : item));
      }
    }).catch(() => {
      // Offline fallback retained seamlessly
    });
  };

  const removeFromCart = (cartItemId: string) => {
    setCartItems(prev => prev.filter(item => item.id !== cartItemId));
    catalogService.removeCartItem(cartItemId).catch(() => {});
  };

  const updateCartQuantity = (cartItemId: string, qty: number) => {
    if (qty <= 0) {
      removeFromCart(cartItemId);
      return;
    }
    setCartItems(prev => prev.map(item => item.id === cartItemId ? { ...item, quantity: qty } : item));
    catalogService.updateCartItem(cartItemId, qty).catch(() => {});
  };

  // Cart aggregates
  const cartStoreCount = React.useMemo(() => {
    const stores = new Set(cartItems.map(item => item.selectedStore));
    return stores.size;
  }, [cartItems]);

  const cartTotal = React.useMemo(() => {
    return cartItems.reduce((sum, item) => sum + (item.selectedPrice + item.selectedShipping) * item.quantity, 0);
  }, [cartItems]);

  const cartPotentialSavings = React.useMemo(() => {
    const opt = optimizeCart(cartItems);
    return opt.totalSavings;
  }, [cartItems]);

  const runCartOptimizer = () => {
    return optimizeCart(cartItems);
  };

  const applyCartOptimizations = (report: CartOptimizationReport) => {
    if (report.optimizations.length === 0) {
      showToast('✨ Cart Already Optimal', 'Your Infinity Cart is already at maximum savings!', 'info');
      return;
    }

    setCartItems(prev => {
      return prev.map(item => {
        const opt = report.optimizations.find(o => o.cartItemId === item.id);
        if (opt) {
          return {
            ...item,
            selectedStore: opt.recommendedStore,
            selectedPrice: opt.recommendedPrice,
            selectedShipping: 0
          };
        }
        return item;
      });
    });

    // Launch confetti!
    confetti({
      particleCount: 80,
      spread: 70,
      origin: { y: 0.6 },
      colors: ['#F78FB9', '#3D2314', '#D4AF37', '#FAF5EE']
    });

    showToast('🎉 Cart Optimized!', `Successfully saved ₹${report.totalSavings.toLocaleString('en-IN')} across your cart!`, 'success');

    // Async persist to backend
    catalogService.applyOptimizations(report.optimizations).catch(() => {});
  };

  // Wishlist operations
  const toggleWishlist = (product: Product) => {
    const exists = wishlist.some(p => p.id === product.id);
    if (exists) {
      showToast('Removed from Wishlist', product.name.slice(0, 30) + '...', 'info');
      setWishlist(prev => prev.filter(p => p.id !== product.id));
    } else {
      showToast('❤️ Saved to Wishlist', product.name.slice(0, 30) + '...', 'success');
      setWishlist(prev => [...prev, product]);
    }
    catalogService.toggleWishlist(product.id).catch(() => {});
  };

  const isInWishlist = (productId: string) => {
    return wishlist.some(p => p.id === productId);
  };

  // Compare operations
  const toggleCompare = (product: Product) => {
    setCompareList(prev => {
      const exists = prev.some(p => p.id === product.id);
      if (exists) {
        return prev.filter(p => p.id !== product.id);
      }
      if (prev.length >= 4) {
        showToast('Comparison Limit Reached', 'You can compare up to 4 products side-by-side.', 'warning');
        return prev;
      }
      showToast('Added to Comparison Matrix', `${product.name.slice(0, 28)} (${prev.length + 1}/4)`, 'info');
      return [...prev, product];
    });
  };

  const removeFromCompare = (productId: string) => {
    setCompareList(prev => prev.filter(p => p.id !== productId));
  };

  const isInCompare = (productId: string) => {
    return compareList.some(p => p.id === productId);
  };

  const clearCompare = () => {
    setCompareList([]);
  };

  // Shopping Mission operations
  const startMission = (missionId: string) => {
    const mission = missions.find(m => m.id === missionId);
    if (mission) {
      setActiveMission(mission);
      setIsMissionsModalOpen(true);
    }
  };

  // Price Alerts
  const addPriceAlert = (product: Product, targetPrice: number) => {
    const newAlert: PriceAlert = {
      id: `alert-${Date.now()}`,
      productId: product.id,
      productName: product.name,
      productImage: product.image,
      currentPrice: product.currentPrice,
      targetPrice,
      store: product.store,
      createdAt: 'Just now',
      status: 'ACTIVE'
    };
    setPriceAlerts(prev => [newAlert, ...prev]);
    showToast('🔔 Price Alert Activated', `We'll notify you when ${product.name.slice(0, 24)} drops to ₹${targetPrice}!`, 'success');

    catalogService.createPriceAlert({
      productId: product.id,
      productName: product.name,
      productImage: product.image,
      currentPrice: product.currentPrice,
      targetPrice,
      store: product.store
    }).catch(() => {});
  };

  const removePriceAlert = (alertId: string) => {
    setPriceAlerts(prev => prev.filter(a => a.id !== alertId));
    showToast('Price Alert Removed', 'Notification cancelled.', 'info');
    catalogService.deletePriceAlert(alertId).catch(() => {});
  };

  // Shared List operations
  const addSharedItem = (name: string, addedBy: string, category: string) => {
    const matched = products.find(p => p.name?.toLowerCase().includes(name.toLowerCase()) || p.tags?.some(t => t.toLowerCase().includes(name.toLowerCase())));
    const tempId = `shared-${Date.now()}`;
    const newItem: SharedListItem = {
      id: tempId,
      name,
      addedBy,
      category,
      matchedProduct: matched,
      quantity: 1,
      isPurchased: false
    };
    setSharedList(prev => [...prev, newItem]);
    showToast('Item Added to Shared List', `${name} added by ${addedBy}`, 'success');

    catalogService.addSharedItem({
      name,
      addedBy,
      category,
      productId: matched?.id,
      quantity: 1
    }).then(res => {
      if (res?.item?.id) {
        setSharedList(prev => prev.map(item => item.id === tempId ? { ...item, id: res.item.id } : item));
      }
    }).catch(() => {});
  };

  const toggleSharedItemPurchased = (id: string) => {
    let nextPurchased = false;
    setSharedList(prev => prev.map(item => {
      if (item.id === id) {
        nextPurchased = !item.isPurchased;
        return { ...item, isPurchased: nextPurchased };
      }
      return item;
    }));
    catalogService.toggleSharedItem(id, nextPurchased).catch(() => {});
  };

  return (
    <AppContext.Provider
      value={{
        activeTab,
        setActiveTab,
        products,
        filteredProducts,
        searchQuery,
        setSearchQuery,
        filters,
        setFilters,
        updateFilter,
        resetFilters,
        handleSearchSubmit,
        isSearching,
        refreshCatalog,
        isLiveBackend,

        currentUser,
        setCurrentUser,
        login,
        register,
        logout,

        selectedProduct,
        setSelectedProduct,
        isCartOpen,
        setIsCartOpen,
        isWishlistOpen,
        setIsWishlistOpen,
        isCompareModalOpen,
        setIsCompareModalOpen,
        isAskAiOpen,
        setIsAskAiOpen,
        isVoiceModalOpen,
        setIsVoiceModalOpen,
        isSnapShopModalOpen,
        setIsSnapShopModalOpen,
        isMissionsModalOpen,
        setIsMissionsModalOpen,
        isBuildLookModalOpen,
        setIsBuildLookModalOpen,
        isSharedListModalOpen,
        setIsSharedListModalOpen,
        isPriceAlertModalOpen,
        setIsPriceAlertModalOpen,
        isProfileModalOpen,
        setIsProfileModalOpen,
        priceAlertTargetProduct,
        setPriceAlertTargetProduct,

        cartItems,
        addToCart,
        removeFromCart,
        updateCartQuantity,
        cartStoreCount,
        cartTotal,
        cartPotentialSavings,
        runCartOptimizer,
        applyCartOptimizations,

        wishlist,
        toggleWishlist,
        isInWishlist,

        compareList,
        toggleCompare,
        removeFromCompare,
        isInCompare,
        clearCompare,

        missions,
        activeMission,
        setActiveMission,
        startMission,

        priceAlerts,
        addPriceAlert,
        removePriceAlert,

        sharedList,
        addSharedItem,
        toggleSharedItemPurchased,

        toasts,
        showToast,
        removeToast
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
