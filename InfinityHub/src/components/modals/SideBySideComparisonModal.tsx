import React from 'react';
import { useApp } from '../../context/AppContext';
import { Product } from '../../types';
import { 
  X, 
  Scale, 
  Trash2, 
  ShoppingBag, 
  Sparkles, 
  Star, 
  Truck, 
  ShieldCheck, 
  RotateCcw, 
  Award,
  DollarSign,
  Zap
} from 'lucide-react';

export const SideBySideComparisonModal: React.FC = () => {
  const { 
    isCompareModalOpen, 
    setIsCompareModalOpen, 
    compareList, 
    removeFromCompare, 
    clearCompare,
    addToCart,
    setSelectedProduct
  } = useApp();

  if (!isCompareModalOpen) return null;

  if (compareList.length === 0) {
    return (
      <div className="fixed inset-0 z-50 overflow-y-auto bg-chocolate-950/60 backdrop-blur-sm flex items-center justify-center p-4">
        <div className="bg-white rounded-3xl p-8 max-w-md w-full text-center border border-pink-200 shadow-soft-lg">
          <div className="w-16 h-16 rounded-full bg-pink-100 text-pink-600 flex items-center justify-center mx-auto mb-4">
            <Scale className="w-8 h-8" />
          </div>
          <h3 className="font-serif text-xl font-bold text-chocolate-950 mb-2">
            Comparison Matrix Empty
          </h3>
          <p className="text-xs text-chocolate-700 leading-relaxed mb-6">
            Click the <Scale className="w-3.5 h-3.5 inline mx-1 text-chocolate-600" /> icon on any product cards to compare up to 4 items side-by-side.
          </p>
          <button
            onClick={() => setIsCompareModalOpen(false)}
            className="px-6 py-2.5 rounded-2xl bg-chocolate-900 text-cream-50 text-xs font-bold hover:bg-chocolate-800 transition-all cursor-pointer"
          >
            Explore Products
          </button>
        </div>
      </div>
    );
  }

  // Calculate Winners
  const lowestPriceItem = [...compareList].sort((a, b) => a.finalEstimatedPrice - b.finalEstimatedPrice)[0];
  const highestRatedItem = [...compareList].sort((a, b) => b.rating - a.rating)[0];
  const highestScoreItem = [...compareList].sort((a, b) => b.infinityScore - a.infinityScore)[0];
  const fastestDeliveryItem = [...compareList].sort((a, b) => a.deliveryDays - b.deliveryDays)[0];

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-chocolate-950/60 backdrop-blur-sm flex items-center justify-center p-2 sm:p-4">
      <div className="relative bg-white rounded-3xl max-w-6xl w-full max-h-[92vh] overflow-y-auto shadow-soft-lg border border-pink-200">
        
        {/* Header */}
        <div className="sticky top-0 z-20 bg-white/95 backdrop-blur-md px-6 py-4 border-b border-pink-100 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-pink-100 text-pink-600 flex items-center justify-center">
              <Scale className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-serif text-lg font-bold text-chocolate-950">
                Multi-Product Comparison Matrix ({compareList.length}/4)
              </h3>
              <p className="text-xs text-chocolate-600">
                Cross-store feature, price, and warranty comparison.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={clearCompare}
              className="text-xs font-bold text-chocolate-500 hover:text-rose-600 flex items-center gap-1 cursor-pointer"
            >
              <Trash2 className="w-3.5 h-3.5" /> Clear All
            </button>
            <button
              onClick={() => setIsCompareModalOpen(false)}
              className="p-2 rounded-xl text-chocolate-400 hover:text-chocolate-950 hover:bg-pink-100 transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Matrix Table */}
        <div className="p-6 overflow-x-auto">
          <div className="grid grid-cols-5 gap-4 min-w-[750px]">
            
            {/* Criteria Column */}
            <div className="space-y-6 pt-36 text-xs font-bold text-chocolate-800 uppercase tracking-wider">
              <div className="h-10 flex items-center">Store & Seller</div>
              <div className="h-10 flex items-center">Final Estimated Cost</div>
              <div className="h-10 flex items-center">Customer Rating</div>
              <div className="h-10 flex items-center">Delivery Estimate</div>
              <div className="h-10 flex items-center">Infinity Score</div>
              <div className="h-10 flex items-center">Seller Trust</div>
              <div className="h-10 flex items-center">Return Policy</div>
              <div className="h-10 flex items-center">Eco Score</div>
              <div className="h-12 flex items-center">Action</div>
            </div>

            {/* Compared Product Columns */}
            {compareList.map((product) => {
              const isBestOverall = product.id === highestScoreItem.id;
              const isCheapest = product.id === lowestPriceItem.id;
              const isHighestRated = product.id === highestRatedItem.id;
              const isFastest = product.id === fastestDeliveryItem.id;

              return (
                <div 
                  key={product.id}
                  className="bg-cream-50/70 rounded-3xl p-4 border border-pink-200 relative flex flex-col justify-between"
                >
                  {/* Remove Button */}
                  <button
                    onClick={() => removeFromCompare(product.id)}
                    className="absolute top-2 right-2 p-1.5 rounded-full bg-white text-chocolate-400 hover:text-rose-600 shadow-xs cursor-pointer"
                    title="Remove item"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>

                  {/* Header info */}
                  <div className="text-center h-32 flex flex-col items-center justify-between">
                    <img 
                      src={product.image} 
                      alt={product.name} 
                      className="w-16 h-16 object-contain mix-blend-multiply cursor-pointer hover:scale-105 transition-transform"
                      onClick={() => setSelectedProduct(product)}
                    />
                    <div>
                      <span className="text-[10px] font-extrabold uppercase text-pink-600 block">{product.brand}</span>
                      <h5 
                        onClick={() => setSelectedProduct(product)}
                        className="font-serif text-xs font-bold text-chocolate-950 truncate max-w-[140px] cursor-pointer hover:text-pink-600"
                      >
                        {product.name}
                      </h5>
                    </div>
                  </div>

                  {/* Matrix Rows */}
                  <div className="space-y-6 pt-4 text-xs">
                    
                    {/* Store & Seller */}
                    <div className="h-10 flex flex-col justify-center">
                      <span className="font-extrabold text-chocolate-950">{product.store}</span>
                      <span className="text-[10px] text-chocolate-500 truncate">{product.seller}</span>
                    </div>

                    {/* Final Cost */}
                    <div className="h-10 flex flex-col justify-center">
                      <div className="flex items-center gap-1">
                        <span className="font-serif font-bold text-base text-chocolate-950">
                          ₹{product.finalEstimatedPrice.toLocaleString('en-IN')}
                        </span>
                        {isCheapest && (
                          <span className="bg-emerald-100 text-emerald-900 text-[9px] font-extrabold px-1.5 py-0.5 rounded">
                            💰 Lowest
                          </span>
                        )}
                      </div>
                      <span className="text-[10px] text-chocolate-500">
                        {product.shippingFee === 0 ? 'Free Shipping' : `+₹${product.shippingFee} ship`}
                      </span>
                    </div>

                    {/* Rating */}
                    <div className="h-10 flex items-center gap-1">
                      <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-500" />
                      <span className="font-bold text-chocolate-950">{product.rating}</span>
                      {isHighestRated && (
                        <span className="bg-amber-100 text-amber-900 text-[9px] font-extrabold px-1.5 py-0.5 rounded">
                          ⭐ Top
                        </span>
                      )}
                    </div>

                    {/* Delivery */}
                    <div className="h-10 flex items-center gap-1">
                      <Truck className="w-3.5 h-3.5 text-pink-600" />
                      <span className="text-[11px] font-medium text-chocolate-800">
                        {product.deliveryDays === 0 ? 'Instant' : `${product.deliveryDays}d delivery`}
                      </span>
                    </div>

                    {/* Infinity Score */}
                    <div className="h-10 flex items-center gap-1">
                      <Sparkles className="w-3.5 h-3.5 text-pink-500" />
                      <span className="font-extrabold text-chocolate-950">{product.infinityScore}/100</span>
                      {isBestOverall && (
                        <span className="bg-pink-500 text-white text-[9px] font-extrabold px-1.5 py-0.5 rounded">
                          🏆 Winner
                        </span>
                      )}
                    </div>

                    {/* Seller Trust */}
                    <div className="h-10 flex items-center gap-1">
                      <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                      <span className="font-bold text-chocolate-800">{product.sellerTrust} ({product.sellerTrustScore}%)</span>
                    </div>

                    {/* Return Policy */}
                    <div className="h-10 flex items-center text-[11px] text-chocolate-700 truncate">
                      {product.returnPolicy}
                    </div>

                    {/* Eco Score */}
                    <div className="h-10 flex items-center gap-1 text-[11px] text-emerald-800 font-bold">
                      🌱 {product.ecoScore}/100
                    </div>

                    {/* Action Button */}
                    <div className="h-12 flex items-center">
                      <button
                        onClick={() => addToCart(product)}
                        className="w-full py-2 rounded-xl bg-chocolate-900 hover:bg-chocolate-800 text-cream-50 font-bold text-xs shadow-sm flex items-center justify-center gap-1 cursor-pointer"
                      >
                        <ShoppingBag className="w-3.5 h-3.5 text-pink-300" />
                        <span>Add Cart</span>
                      </button>
                    </div>

                  </div>
                </div>
              );
            })}

          </div>
        </div>

      </div>
    </div>
  );
};
