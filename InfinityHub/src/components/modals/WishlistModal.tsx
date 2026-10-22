import React from 'react';
import { useApp } from '../../context/AppContext';
import { 
  X, 
  Heart, 
  ShoppingBag, 
  Trash2, 
  Bell, 
  Sparkles, 
  ExternalLink,
  Layers
} from 'lucide-react';

export const WishlistModal: React.FC = () => {
  const { 
    isWishlistOpen, 
    setIsWishlistOpen, 
    wishlist, 
    toggleWishlist, 
    addToCart, 
    setSelectedProduct,
    setPriceAlertTargetProduct,
    setIsPriceAlertModalOpen
  } = useApp();

  if (!isWishlistOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-chocolate-950/60 backdrop-blur-sm flex items-center justify-center p-2 sm:p-4">
      <div className="relative bg-white rounded-3xl max-w-3xl w-full max-h-[90vh] overflow-y-auto shadow-soft-lg border border-pink-200">
        
        {/* Header */}
        <div className="sticky top-0 z-20 bg-white/95 backdrop-blur-md px-6 py-4 border-b border-pink-100 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-pink-100 text-pink-600 flex items-center justify-center">
              <Heart className="w-4 h-4 fill-pink-500 text-pink-500" />
            </div>
            <div>
              <h3 className="font-serif text-lg font-bold text-chocolate-950">
                My Saved Wishlist & Price Tracker ({wishlist.length})
              </h3>
              <p className="text-xs text-chocolate-600">
                Monitored continuously for price drops and cross-store deals.
              </p>
            </div>
          </div>

          <button
            onClick={() => setIsWishlistOpen(false)}
            className="p-2 rounded-xl text-chocolate-400 hover:text-chocolate-950 hover:bg-pink-100 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body Content */}
        <div className="p-6 space-y-4">
          {wishlist.length > 0 ? (
            <div className="divide-y divide-pink-100">
              {wishlist.map(product => (
                <div 
                  key={product.id}
                  className="py-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 hover:bg-cream-50/60 p-3 rounded-2xl transition-colors"
                >
                  <div 
                    className="flex items-center gap-3.5 min-w-0 cursor-pointer"
                    onClick={() => {
                      setSelectedProduct(product);
                      setIsWishlistOpen(false);
                    }}
                  >
                    <img 
                      src={product.image} 
                      alt={product.name} 
                      className="w-16 h-16 object-contain rounded-xl bg-white p-1 border border-pink-100 shrink-0 mix-blend-multiply" 
                    />
                    <div className="min-w-0">
                      <span className="text-[10px] uppercase font-bold text-pink-600 block">
                        {product.brand} • {product.store}
                      </span>
                      <h4 className="font-serif text-xs sm:text-sm font-bold text-chocolate-950 truncate max-w-sm">
                        {product.name}
                      </h4>
                      <div className="flex items-center gap-2 mt-1">
                        <span className="font-serif text-sm font-bold text-chocolate-950">
                          ₹{product.finalEstimatedPrice.toLocaleString('en-IN')}
                        </span>
                        {product.originalPrice > product.currentPrice && (
                          <span className="text-xs text-chocolate-400 line-through">
                            ₹{product.originalPrice.toLocaleString('en-IN')}
                          </span>
                        )}
                        <span className="text-[10px] text-emerald-700 bg-emerald-50 px-1.5 py-0.5 rounded font-bold">
                          {product.dealStatus}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
                    <button
                      onClick={() => {
                        setPriceAlertTargetProduct(product);
                        setIsPriceAlertModalOpen(true);
                      }}
                      className="p-2 rounded-xl text-chocolate-700 hover:bg-pink-100 border border-pink-200 text-xs font-bold flex items-center gap-1 cursor-pointer"
                      title="Set Price Alert"
                    >
                      <Bell className="w-3.5 h-3.5 text-pink-600" />
                      <span className="hidden sm:inline">Alert</span>
                    </button>

                    <button
                      onClick={() => addToCart(product)}
                      className="px-3.5 py-2 rounded-xl bg-chocolate-900 hover:bg-chocolate-800 text-cream-50 text-xs font-bold flex items-center gap-1.5 cursor-pointer shadow-sm"
                    >
                      <ShoppingBag className="w-3.5 h-3.5 text-pink-300" />
                      <span>Add to Cart</span>
                    </button>

                    <button
                      onClick={() => toggleWishlist(product)}
                      className="p-2 rounded-xl text-chocolate-400 hover:text-rose-600 hover:bg-rose-50 cursor-pointer"
                      title="Remove"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="py-16 text-center space-y-3">
              <div className="w-16 h-16 rounded-full bg-pink-100 text-pink-600 flex items-center justify-center mx-auto text-2xl">
                ❤️
              </div>
              <h4 className="font-serif text-lg font-bold text-chocolate-950">
                Your Wishlist is Empty
              </h4>
              <p className="text-xs text-chocolate-600 max-w-xs mx-auto">
                Save items while browsing to track price changes and get alerted when deals drop!
              </p>
            </div>
          )}
        </div>

      </div>
    </div>
  );
};
