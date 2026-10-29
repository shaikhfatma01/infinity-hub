import React, { createContext, useContext, useState, useEffect, useRef, useCallback } from 'react';
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
import { getMockProduct } from '../data/mockLookup';
import { optimizeCart, CartOptimizationReport, parseNaturalLanguageQuery } from '../services/aiEngine';
import { catalogService } from '../services/catalogService';
import { authService } from '../services/authService';
import { AUTH_EXPIRED_EVENT } from '../services/apiClient';
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
  /** Upper bound for the price slider: covers the most expensive product in the catalogue. */
  maxCatalogPrice: number;
  
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
  runCartOptimizer: () => Promise<CartOptimizationReport>;
  applyCartOptimizations: (report: CartOptimizationReport) => Promise<void>;
  
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

const DEFAULT_MAX_PRICE = 80000;

const initialFilters: FilterState = {
  searchQuery: '',
  selectedStores: [],
  selectedCategories: [],
  priceRange: [0, DEFAULT_MAX_PRICE],
  minRating: 0,
  minDiscount: 0,
  onlyInStock: false,
  onlyProductTwins: false,
  sortBy: 'best-match'
};

const OFFLINE_DEMO_USER: User = {
  id: 'user-demo-fatma',
  email: 'fatma.shaikh@infinityhub.ai',
  name: 'Fatma Shaikh',
  role: 'PRO_MEMBER',
  isDemo: true,
  createdAt: new Date().toISOString()
};

/** Starter data shown only when the backend cannot be reached (frontend-only demo mode). */
function buildOfflineDemoData() {
  return {
    cart: [
      { id: 'cart-demo-1', productId: 'prod-purse-amazon', product: getMockProduct('prod-purse-amazon'), selectedStore: 'Amazon' as StoreName, selectedPrice: 999, selectedShipping: 40, quantity: 1 },
      { id: 'cart-demo-2', productId: 'prod-skincare-nykaa', product: getMockProduct('prod-skincare-nykaa'), selectedStore: 'Nykaa' as StoreName, selectedPrice: 429, selectedShipping: 0, quantity: 1 },
      { id: 'cart-demo-3', productId: 'prod-shoes-myntra', product: getMockProduct('prod-shoes-myntra'), selectedStore: 'Myntra' as StoreName, selectedPrice: 4599, selectedShipping: 0, quantity: 1 }
    ] as CartItem[],
    wishlist: [getMockProduct('prod-purse-myntra'), getMockProduct('prod-laptop-croma')],
    alerts: [
      {
        id: 'alert-demo-1',
        productId: 'prod-laptop-croma',
        productName: getMockProduct('prod-laptop-croma').name,
        productImage: getMockProduct('prod-laptop-croma').image,
        currentPrice: getMockProduct('prod-laptop-croma').currentPrice,
        targetPrice: 52000,
        store: 'Croma' as StoreName,
        createdAt: 'Yesterday',
        status: 'ACTIVE' as const
      }
    ] as PriceAlert[],
    shared: [
      { id: 'shared-demo-1', name: 'Daawat Basmati Rice (5kg)', addedBy: 'Fatma', category: 'Grocery', matchedProduct: getMockProduct('prod-rice-bigbasket'), quantity: 1, isPurchased: false },
      { id: 'shared-demo-2', name: 'Fortune Sunflower Oil (1L)', addedBy: 'Amina', category: 'Grocery', matchedProduct: getMockProduct('prod-oil-blinkit'), quantity: 2, isPurchased: false },
      { id: 'shared-demo-3', name: 'Wakefit Winter Double Blanket', addedBy: 'Mom', category: 'Bedding', matchedProduct: getMockProduct('prod-blanket-flipkart'), quantity: 1, isPurchased: true }
    ] as SharedListItem[]
  };
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [activeTab, setActiveTab] = useState<string>('home');
  // The bundled demo catalogue is shown instantly and replaced by the database catalogue once loaded.
  const [products, setProducts] = useState<Product[]>(MOCK_PRODUCTS);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [filters, setFilters] = useState<FilterState>(initialFilters);
  const [isSearching, setIsSearching] = useState<boolean>(false);
  const [isLiveBackend, setIsLiveBackend] = useState<boolean>(false);
  // Mirrors isLiveBackend for use inside async callbacks without stale closures.
  const liveRef = useRef<boolean>(false);

  // Auth state: a visitor is a guest (null) until they sign in; the demo user only exists offline.
  const [currentUser, setCurrentUser] = useState<User | null>(null);

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

  // Per-user data: starts empty and is filled from the server (or the offline demo set).
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [wishlist, setWishlist] = useState<Product[]>([]);
  const [compareList, setCompareList] = useState<Product[]>([]);
  const [missions, setMissions] = useState<ShoppingMission[]>(MOCK_SHOPPING_MISSIONS);
  const [activeMission, setActiveMission] = useState<ShoppingMission | null>(MOCK_SHOPPING_MISSIONS[0] ?? null);
  const [priceAlerts, setPriceAlerts] = useState<PriceAlert[]>([]);
  const [sharedList, setSharedList] = useState<SharedListItem[]>([]);

  // Toasts
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  const removeToast = useCallback((id: string) => {
    setToasts(prev => prev.filter(t => t.id !== id));
  }, []);

  const showToast = useCallback((title: string, message: string, type: 'success' | 'info' | 'warning' = 'info') => {
    const id = Date.now().toString() + Math.random().toString();
    setToasts(prev => [...prev, { id, title, message, type }]);
    setTimeout(() => {
      removeToast(id);
    }, 4500);
  }, [removeToast]);

  const errorMessage = (err: unknown, fallback: string) =>
    err instanceof Error && err.message ? err.message : fallback;

  // ── Server → UI synchronisation ───────────────────────────────────────────
  const syncCart = useCallback(async () => {
    try {
      const { items } = await catalogService.getCart();
      setCartItems(items);
    } catch { /* keep the optimistic state if the refresh itself fails */ }
  }, []);

  const syncWishlist = useCallback(async () => {
    try {
      setWishlist(await catalogService.getWishlist());
    } catch { /* ignore */ }
  }, []);

  const syncAlerts = useCallback(async () => {
    try {
      setPriceAlerts(await catalogService.getPriceAlerts());
    } catch { /* ignore */ }
  }, []);

  const syncSharedList = useCallback(async () => {
    try {
      const { items } = await catalogService.getSharedList();
      setSharedList(items);
    } catch { /* ignore */ }
  }, []);

  /** Reloads everything that belongs to the current identity (guest or signed-in user). */
  const loadUserData = useCallback(async () => {
    await Promise.allSettled([syncCart(), syncWishlist(), syncAlerts(), syncSharedList()]);
  }, [syncCart, syncWishlist, syncAlerts, syncSharedList]);

  const applyOfflineDemoData = useCallback(() => {
    const demo = buildOfflineDemoData();
    setCartItems(demo.cart);
    setWishlist(demo.wishlist);
    setPriceAlerts(demo.alerts);
    setSharedList(demo.shared);
    setMissions(MOCK_SHOPPING_MISSIONS);
    setActiveMission(MOCK_SHOPPING_MISSIONS[0] ?? null);
  }, []);

  const loadCatalog = useCallback(async (): Promise<boolean> => {
    try {
      const all = await catalogService.getAllProducts();
      setProducts(all);
      liveRef.current = true;
      setIsLiveBackend(true);
      return true;
    } catch {
      liveRef.current = false;
      setIsLiveBackend(false);
      return false;
    }
  }, []);

  const refreshCatalog = async () => {
    await loadCatalog();
  };

  useEffect(() => {
    let cancelled = false;

    const initAppData = async () => {
      // 1. Restore the session first so every later request is made as the right identity.
      if (authService.isAuthenticated()) {
        try {
          const authData = await authService.getMe();
          if (!cancelled && authData?.user) {
            setCurrentUser(authData.user);
          }
        } catch {
          // Expired/invalid token (apiClient already cleared it) or server unreachable.
          if (!cancelled) setCurrentUser(null);
        }
      }

      // 2. Catalogue decides whether we are live or in offline demo mode.
      const live = await loadCatalog();
      if (cancelled) return;

      if (!live) {
        setCurrentUser(prev => prev ?? OFFLINE_DEMO_USER);
        applyOfflineDemoData();
        return;
      }

      // 3. Live: everything below comes from the database, including genuinely empty states.
      try {
        const liveMissions = await catalogService.getMissions();
        if (!cancelled) {
          setMissions(liveMissions);
          setActiveMission(liveMissions[0] ?? null);
        }
      } catch { /* keep bundled missions */ }

      await loadUserData();
    };

    initAppData();

    // If the server rejects our token later on, fall back to guest mode cleanly.
    const handleAuthExpired = () => {
      setCurrentUser(null);
      showToast('Session expired', 'Please sign in again to sync your account.', 'warning');
      if (liveRef.current) loadUserData();
    };
    window.addEventListener(AUTH_EXPIRED_EVENT, handleAuthExpired);

    return () => {
      cancelled = true;
      window.removeEventListener(AUTH_EXPIRED_EVENT, handleAuthExpired);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Keep the price slider usable if the catalogue contains items above the default ceiling.
  const maxCatalogPrice = React.useMemo(() => {
    const top = products.reduce((m, p) => Math.max(m, p.currentPrice || 0), 0);
    return Math.max(DEFAULT_MAX_PRICE, Math.ceil(top / 10000) * 10000);
  }, [products]);

  useEffect(() => {
    setFilters(prev =>
      prev.priceRange[1] === DEFAULT_MAX_PRICE && maxCatalogPrice > DEFAULT_MAX_PRICE
        ? { ...prev, priceRange: [prev.priceRange[0], maxCatalogPrice] }
        : prev
    );
  }, [maxCatalogPrice]);

  // ── Auth actions ──────────────────────────────────────────────────────────
  const login = async (email: string, password: string): Promise<boolean> => {
    try {
      const res = await authService.login({ email, password });
      if (res && res.user) {
        setCurrentUser(res.user);
        showToast('👋 Welcome back!', `Signed in as ${res.user.name}`, 'success');
        // The server merged any guest cart/wishlist/alerts into this account; reload them.
        liveRef.current = true;
        setIsLiveBackend(true);
        await loadUserData();
        return true;
      }
      return false;
    } catch (err) {
      showToast('Authentication Error', errorMessage(err, 'Login failed'), 'warning');
      return false;
    }
  };

  const register = async (email: string, password: string, name: string): Promise<boolean> => {
    try {
      const res = await authService.register({ email, password, name });
      if (res && res.user) {
        setCurrentUser(res.user);
        showToast('🎉 Account Created', `Welcome to InfinityHub, ${res.user.name}!`, 'success');
        liveRef.current = true;
        setIsLiveBackend(true);
        await loadUserData();
        return true;
      }
      return false;
    } catch (err) {
      showToast('Registration Error', errorMessage(err, 'Sign up failed'), 'warning');
      return false;
    }
  };

  const logout = () => {
    authService.logout();
    setCurrentUser(null);
    showToast('Signed Out', 'You have been logged out of InfinityHub.', 'info');
    if (liveRef.current) {
      loadUserData();
    } else {
      setCartItems([]);
      setWishlist([]);
      setPriceAlerts([]);
      setSharedList([]);
    }
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
      showToast('✨ Infinity AI Scan Complete', `Searched 16 monitored stores for "${q || 'All Products'}".`, 'success');
    }, 600);
  };

  const updateFilter = <K extends keyof FilterState>(key: K, value: FilterState[K]) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  };

  const resetFilters = () => {
    setFilters({ ...initialFilters, priceRange: [0, maxCatalogPrice] });
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

  // ── Cart operations ───────────────────────────────────────────────────────
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

    if (!liveRef.current) return; // offline demo mode: local only

    catalogService.addToCart({ productId: product.id, store: finalStore, quantity: 1 })
      .then(serverItem => {
        // Swap the optimistic line for the authoritative one (real id, server-side price & quantity).
        setCartItems(prev => {
          const withoutTemp = prev.filter(item => item.id !== tempId);
          return withoutTemp.some(item => item.id === serverItem.id)
            ? withoutTemp.map(item => item.id === serverItem.id ? serverItem : item)
            : [...withoutTemp, serverItem];
        });
      })
      .catch(err => {
        showToast('Could not add to cart', errorMessage(err, 'Please try again.'), 'warning');
        syncCart();
      });
  };

  const removeFromCart = (cartItemId: string) => {
    setCartItems(prev => prev.filter(item => item.id !== cartItemId));
    if (!liveRef.current) return;
    catalogService.removeCartItem(cartItemId).catch(err => {
      showToast('Could not remove item', errorMessage(err, 'Please try again.'), 'warning');
      syncCart();
    });
  };

  const updateCartQuantity = (cartItemId: string, qty: number) => {
    if (qty <= 0) {
      removeFromCart(cartItemId);
      return;
    }
    setCartItems(prev => prev.map(item => item.id === cartItemId ? { ...item, quantity: qty } : item));
    if (!liveRef.current) return;
    catalogService.updateCartItem(cartItemId, qty).catch(err => {
      showToast('Could not update quantity', errorMessage(err, 'Please try again.'), 'warning');
      syncCart();
    });
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
    const opt = optimizeCart(cartItems, products);
    return opt.totalSavings;
  }, [cartItems, products]);

  const runCartOptimizer = async (): Promise<CartOptimizationReport> => {
    if (liveRef.current) {
      try {
        // Server-side analysis over the persisted cart (same Product Twin data as the catalogue).
        return (await catalogService.optimizeCart()) as CartOptimizationReport;
      } catch (err) {
        showToast('Using local analysis', errorMessage(err, 'Server optimizer unavailable.'), 'info');
      }
    }
    return optimizeCart(cartItems, products);
  };

  const applyCartOptimizations = async (report: CartOptimizationReport): Promise<void> => {
    if (report.optimizations.length === 0) {
      showToast('✨ Cart Already Optimal', 'Your Infinity Cart is already at maximum savings!', 'info');
      return;
    }

    let savedAmount = report.totalSavings;

    if (liveRef.current) {
      try {
        const result = await catalogService.applyOptimizations();
        savedAmount = result.totalSavings;
        await syncCart();
      } catch (err) {
        showToast('Could not apply savings', errorMessage(err, 'Please try again.'), 'warning');
        await syncCart();
        return;
      }
    } else {
      setCartItems(prev =>
        prev.map(item => {
          const opt = report.optimizations.find(o => o.cartItemId === item.id);
          return opt
            ? {
                ...item,
                selectedStore: opt.recommendedStore,
                selectedPrice: opt.recommendedBasePrice,
                selectedShipping: opt.recommendedShipping
              }
            : item;
        })
      );
    }

    // Launch confetti!
    confetti({
      particleCount: 80,
      spread: 70,
      origin: { y: 0.6 },
      colors: ['#F78FB9', '#3D2314', '#D4AF37', '#FAF5EE']
    });

    showToast('🎉 Cart Optimized!', `Successfully saved ₹${savedAmount.toLocaleString('en-IN')} across your cart!`, 'success');
  };

  // ── Wishlist operations ───────────────────────────────────────────────────
  const toggleWishlist = (product: Product) => {
    const exists = wishlist.some(p => p.id === product.id);
    if (exists) {
      showToast('Removed from Wishlist', product.name.slice(0, 30) + '...', 'info');
      setWishlist(prev => prev.filter(p => p.id !== product.id));
    } else {
      showToast('❤️ Saved to Wishlist', product.name.slice(0, 30) + '...', 'success');
      setWishlist(prev => [...prev, product]);
    }

    if (!liveRef.current) return;
    catalogService.toggleWishlist(product.id)
      .then(isSaved => {
        // If the server disagrees with our optimistic guess (e.g. double-click race), trust the server.
        if (isSaved === exists) syncWishlist();
      })
      .catch(err => {
        showToast('Could not update wishlist', errorMessage(err, 'Please try again.'), 'warning');
        syncWishlist();
      });
  };

  const isInWishlist = (productId: string) => {
    return wishlist.some(p => p.id === productId);
  };

  // ── Compare operations ────────────────────────────────────────────────────
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

  // ── Shopping Mission operations ───────────────────────────────────────────
  const startMission = (missionId: string) => {
    const mission = missions.find(m => m.id === missionId);
    if (mission) {
      setActiveMission(mission);
      setIsMissionsModalOpen(true);
    } else {
      showToast('Mission unavailable', 'That shopping mission could not be found.', 'warning');
    }
  };

  // ── Price Alerts ──────────────────────────────────────────────────────────
  const addPriceAlert = (product: Product, targetPrice: number) => {
    if (!liveRef.current) {
      const localAlert: PriceAlert = {
        id: `alert-${Date.now()}`,
        productId: product.id,
        productName: product.name,
        productImage: product.image,
        currentPrice: product.currentPrice,
        targetPrice,
        store: product.store,
        createdAt: new Date().toLocaleDateString('en-IN'),
        status: product.currentPrice <= targetPrice ? 'TRIGGERED' : 'ACTIVE'
      };
      setPriceAlerts(prev => [localAlert, ...prev.filter(a => a.productId !== product.id)]);
      showToast('🔔 Price Alert Activated', `We'll notify you when ${product.name.slice(0, 24)} drops to ₹${targetPrice}!`, 'success');
      return;
    }

    catalogService.createPriceAlert(product.id, targetPrice)
      .then(alert => {
        // The server keeps one tracker per product, so replace any existing one.
        setPriceAlerts(prev => [alert, ...prev.filter(a => a.id !== alert.id && a.productId !== alert.productId)]);
        if (alert.status === 'TRIGGERED') {
          showToast('🎯 Target Already Reached', `${product.name.slice(0, 24)} is already at or below ₹${targetPrice}!`, 'success');
        } else {
          showToast('🔔 Price Alert Activated', `We'll notify you when ${product.name.slice(0, 24)} drops to ₹${targetPrice}!`, 'success');
        }
      })
      .catch(err => showToast('Could not create alert', errorMessage(err, 'Please try again.'), 'warning'));
  };

  const removePriceAlert = (alertId: string) => {
    setPriceAlerts(prev => prev.filter(a => a.id !== alertId));
    showToast('Price Alert Removed', 'Notification cancelled.', 'info');
    if (!liveRef.current) return;
    catalogService.deletePriceAlert(alertId).catch(err => {
      showToast('Could not remove alert', errorMessage(err, 'Please try again.'), 'warning');
      syncAlerts();
    });
  };

  // ── Shared List operations ────────────────────────────────────────────────
  const addSharedItem = (name: string, addedBy: string, category: string) => {
    const lowered = name.toLowerCase();
    const matched = products.find(p => p.name?.toLowerCase().includes(lowered) || p.tags?.some(t => t.toLowerCase().includes(lowered)));
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

    if (!liveRef.current) return;
    catalogService.addSharedItem({ name, addedBy, category, productId: matched?.id, quantity: 1 })
      .then(serverItem => {
        setSharedList(prev => prev.map(item => item.id === tempId ? serverItem : item));
      })
      .catch(err => {
        setSharedList(prev => prev.filter(item => item.id !== tempId));
        showToast('Could not add item', errorMessage(err, 'Please try again.'), 'warning');
      });
  };

  const toggleSharedItemPurchased = (id: string) => {
    setSharedList(prev => prev.map(item => item.id === id ? { ...item, isPurchased: !item.isPurchased } : item));

    if (!liveRef.current) return;
    catalogService.toggleSharedItem(id)
      .then(isPurchased => {
        setSharedList(prev => prev.map(item => item.id === id ? { ...item, isPurchased } : item));
      })
      .catch(err => {
        showToast('Could not update item', errorMessage(err, 'Please try again.'), 'warning');
        syncSharedList();
      });
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
        maxCatalogPrice,

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
