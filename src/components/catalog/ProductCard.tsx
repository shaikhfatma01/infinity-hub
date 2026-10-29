import React from 'react';
import { Product } from '../../types';
import { useApp } from '../../context/AppContext';
import { 
  Star, 
  Heart, 
  Scale, 
  ShoppingBag, 
  Layers, 
  TrendingDown, 
  ShieldCheck, 
  Leaf, 
  Check, 
  Eye,
  Sparkles,
  Truck
} from 'lucide-react';

interface ProductCardProps {
  product: Product;
}

export const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  const { 
    setSelectedProduct, 
    addToCart, 
    toggleWishlist, 
    isInWishlist, 
    toggleCompare, 
    isInCompare,
    setIsCompareModalOpen
  } = useApp();

  const isFav = isInWishlist(product.id);
  const isCompared = isInCompare(product.id);

  // Best twin offer check
  const bestTwin = product.twinOffers?.find(o => o.isBestDeal);
  const totalTwinCount = product.twinOffers ? product.twinOffers.length : 0;
  const maxPriceInGroup = product.twinOffers ? Math.max(...product.twinOffers.map(o => o.finalPrice)) : product.finalEstimatedPrice;
  const potentialTwinSavings = maxPriceInGroup - product.finalEstimatedPrice;

  return (
    <div className="group relative bg-white rounded-3xl border border-pink-200/90 hover:border-pink-300 shadow-soft hover:shadow-soft-lg hover:-translate-y-1 transition-all duration-300 flex flex-col justify-between overflow-hidden">
      
      {/* Top Image & Floating Badges */}
      <div className="relative aspect-square overflow-hidden bg-cream-100/60 p-4">
        
        {/* Product Image */}
        <img
          src={product.image}
          alt={product.name}
          className="w-full h-full object-contain mix-blend-multiply group-hover:scale-105 transition-transform duration-500"
          loading="lazy"
        />

        {/* Top Badges */}
        <div className="absolute top-3 left-3 flex flex-col gap-1.5 items-start">
          
          {/* Store Badge */}
          <span className="bg-chocolate-900/90 backdrop-blur-md text-cream-50 text-[10px] uppercase font-extrabold tracking-wider px-2.5 py-1 rounded-lg shadow-sm border border-chocolate-700/60">
            {product.store}
          </span>

          {/* Discount Pill */}
          {product.discountPercent > 0 && (
            <span className="bg-rose-500 text-white text-[10px] font-extrabold px-2 py-0.5 rounded-md shadow-xs">
              {product.discountPercent}% OFF
            </span>
          )}

          {/* Deal Status Pill */}
          {product.dealStatus === 'REAL DEAL' && (
            <span className="bg-emerald-600/90 text-white text-[9px] font-bold px-2 py-0.5 rounded-md shadow-xs flex items-center gap-1">
              🔥 Real Deal
            </span>
          )}
        </div>

        {/* Top Right Quick Actions */}
        <div className="absolute top-3 right-3 flex flex-col gap-1.5">
          {/* Wishlist Button */}
          <button
            onClick={(e) => {
              e.stopPropagation();
              toggleWishlist(product);
            }}
            className={`p-2 rounded-xl backdrop-blur-md transition-all shadow-xs cursor-pointer ${
              isFav 
                ? 'bg-rose-50 text-rose-600 border border-rose-200' 
                : 'bg-white/90 text-chocolate-600 hover:text-rose-600 hover:bg-white border border-pink-200'
            }`}
            title={isFav ? 'Remove from Wishlist' : 'Add to Wishlist'}
          >
            <Heart className={`w-4 h-4 ${isFav ? 'fill-rose-500' : ''}`} />
          </button>

          {/* Compare Button */}
          <button
            onClick={(e) => {
              e.stopPropagation();
              toggleCompare(product);
            }}
            className={`p-2 rounded-xl backdrop-blur-md transition-all shadow-xs cursor-pointer ${
              isCompared 
                ? 'bg-chocolate-900 text-cream-50' 
                : 'bg-white/90 text-chocolate-600 hover:text-chocolate-950 hover:bg-white border border-pink-200'
            }`}
            title={isCompared ? 'In Compare Matrix' : 'Compare Product'}
          >
            <Scale className="w-4 h-4" />
          </button>
        </div>

        {/* Quick View Button Hover Overlay */}
        <div className="absolute inset-x-4 bottom-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          <button
            onClick={() => setSelectedProduct(product)}
            className="w-full py-2 rounded-xl bg-white/95 text-chocolate-950 text-xs font-bold shadow-md hover:bg-pink-100 border border-pink-300 flex items-center justify-center gap-1.5 cursor-pointer backdrop-blur-md"
          >
            <Eye className="w-3.5 h-3.5 text-pink-600" />
            <span>Inspect Intelligence & Deals</span>
          </button>
        </div>

      </div>

      {/* Body Content */}
      <div className="p-5 flex-1 flex flex-col justify-between">
        <div>
          {/* Brand, Category & Infinity Score */}
          <div className="flex items-center justify-between gap-2 mb-1.5">
            <span className="text-[11px] font-extrabold text-pink-600 uppercase tracking-wider">
              {product.brand}
            </span>
            <div className="flex items-center gap-1 bg-pink-100/90 text-chocolate-900 px-2 py-0.5 rounded-full text-[10px] font-extrabold border border-pink-200">
              <Sparkles className="w-3 h-3 text-pink-500" />
              <span>Score: {product.infinityScore}/100</span>
            </div>
          </div>

          {/* Product Title */}
          <h3 
            onClick={() => setSelectedProduct(product)}
            className="font-serif text-sm font-bold text-chocolate-950 line-clamp-2 hover:text-pink-600 transition-colors cursor-pointer leading-snug"
          >
            {product.name}
          </h3>

          {/* Rating & Delivery line */}
          <div className="flex items-center justify-between text-xs text-chocolate-600 mt-2">
            <div className="flex items-center gap-1">
              <div className="flex items-center text-amber-500 bg-amber-50 px-1.5 py-0.5 rounded border border-amber-200 text-[11px] font-bold">
                <Star className="w-3 h-3 fill-amber-400 mr-0.5" />
                <span>{product.rating}</span>
              </div>
              <span className="text-[10px] text-chocolate-400">({product.reviewCount.toLocaleString()})</span>
            </div>

            <span className="text-[11px] font-medium text-chocolate-700 flex items-center gap-1">
              <Truck className="w-3 h-3 text-emerald-600" />
              {product.deliveryDays === 0 ? 'Instant' : `${product.deliveryDays}d delivery`}
            </span>
          </div>

          {/* Product Twin Cross-Store Pill (Feature 8) */}
          {totalTwinCount > 1 && (
            <div 
              onClick={() => setSelectedProduct(product)}
              className="mt-3 p-2 rounded-xl bg-gradient-to-r from-pink-100/90 via-cream-100 to-pink-50 border border-pink-300 text-chocolate-950 text-[11px] flex items-center justify-between cursor-pointer hover:border-pink-400 transition-colors"
            >
              <div className="flex items-center gap-1.5 font-bold">
                <Layers className="w-3.5 h-3.5 text-pink-600" />
                <span>Product Twin™ ({totalTwinCount} Stores)</span>
              </div>
              {potentialTwinSavings > 0 ? (
                <span className="text-[10px] font-extrabold text-emerald-700 bg-emerald-100/80 px-1.5 py-0.5 rounded">
                  Save ₹{potentialTwinSavings}
                </span>
              ) : (
                <span className="text-[10px] font-extrabold text-chocolate-800">
                  🏆 Best Deal
                </span>
              )}
            </div>
          )}

          {/* Grocery Unit Price (Feature 21) */}
          {product.unitPriceText && (
            <div className="mt-2 text-[11px] font-bold text-chocolate-700 bg-cream-100 px-2 py-0.5 rounded border border-pink-200 inline-block">
              Unit Rate: <span className="text-pink-700">{product.unitPriceText}</span>
            </div>
          )}
        </div>

        {/* Price & Action Buttons */}
        <div className="mt-4 pt-3 border-t border-pink-100/80">
          <div className="flex items-baseline gap-2 mb-3">
            <span className="font-serif text-lg sm:text-xl font-bold text-chocolate-950">
              ₹{product.currentPrice.toLocaleString('en-IN')}
            </span>
            {product.originalPrice > product.currentPrice && (
              <span className="text-xs text-chocolate-400 line-through">
                ₹{product.originalPrice.toLocaleString('en-IN')}
              </span>
            )}
            {product.shippingFee > 0 ? (
              <span className="text-[10px] text-chocolate-500 font-medium">
                +₹{product.shippingFee} ship
              </span>
            ) : (
              <span className="text-[10px] text-emerald-700 font-bold">
                Free Delivery
              </span>
            )}
          </div>

          <div className="grid grid-cols-2 gap-2">
            <button
              onClick={() => setSelectedProduct(product)}
              className="px-3 py-2 rounded-xl bg-pink-100 hover:bg-pink-200 text-chocolate-900 text-xs font-bold border border-pink-300 transition-all text-center cursor-pointer"
            >
              View Deal
            </button>
            <button
              onClick={() => addToCart(product)}
              className="px-3 py-2 rounded-xl bg-chocolate-900 hover:bg-chocolate-800 text-cream-50 text-xs font-bold shadow-sm transition-all flex items-center justify-center gap-1 cursor-pointer"
            >
              <ShoppingBag className="w-3.5 h-3.5 text-pink-300" />
              <span>Add Cart</span>
            </button>
          </div>
        </div>

      </div>

    </div>
  );
};
