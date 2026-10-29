import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Product, StoreOffer } from '../../types';
import { 
  X, 
  Star, 
  Heart, 
  Scale, 
  ShoppingBag, 
  Layers, 
  TrendingDown, 
  TrendingUp, 
  ShieldCheck, 
  Leaf, 
  Sparkles, 
  CheckCircle2, 
  AlertCircle, 
  Clock, 
  Truck, 
  RotateCcw, 
  Bell, 
  ArrowRight,
  ExternalLink,
  Cpu
} from 'lucide-react';

export const ProductDetailModal: React.FC = () => {
  const { 
    selectedProduct, 
    setSelectedProduct, 
    addToCart, 
    toggleWishlist, 
    isInWishlist, 
    toggleCompare, 
    isInCompare,
    setPriceAlertTargetProduct,
    setIsPriceAlertModalOpen,
    products
  } = useApp();

  const [selectedGalleryImg, setSelectedGalleryImg] = useState<string>('');

  if (!selectedProduct) return null;

  const activeImage = selectedGalleryImg || selectedProduct.image;
  const isFav = isInWishlist(selectedProduct.id);
  const isCompared = isInCompare(selectedProduct.id);

  // Best deal twin
  const bestTwin = selectedProduct.twinOffers?.find(o => o.isBestDeal) || {
    store: selectedProduct.store,
    finalPrice: selectedProduct.finalEstimatedPrice,
    price: selectedProduct.currentPrice,
    shippingFee: selectedProduct.shippingFee,
    rating: selectedProduct.rating,
    deliveryText: selectedProduct.deliveryEstimate,
    returnPolicy: selectedProduct.returnPolicy
  };

  const highestPriceInTwin = selectedProduct.twinOffers 
    ? Math.max(...selectedProduct.twinOffers.map(o => o.finalPrice))
    : selectedProduct.finalEstimatedPrice;
  const maxSavings = highestPriceInTwin - bestTwin.finalPrice;

  // Alternative recommendations
  const relatedProducts = products.filter(p => p.id !== selectedProduct.id && p.category === selectedProduct.category).slice(0, 3);

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-chocolate-950/60 backdrop-blur-sm flex items-center justify-center p-2 sm:p-4">
      
      {/* Modal Container */}
      <div className="relative bg-white rounded-3xl max-w-5xl w-full max-h-[92vh] overflow-y-auto shadow-soft-lg border border-pink-200 animate-scale-up">
        
        {/* Sticky Header Bar */}
        <div className="sticky top-0 z-20 bg-white/95 backdrop-blur-md px-6 py-4 border-b border-pink-100 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="bg-pink-100 text-chocolate-900 text-xs font-extrabold px-3 py-1 rounded-full border border-pink-300 flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-pink-600" />
              Infinity Intelligence Report
            </span>
            <span className="text-xs text-chocolate-500 font-medium hidden sm:inline">
              Multi-Store Verification & Analytics
            </span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => {
                setPriceAlertTargetProduct(selectedProduct);
                setIsPriceAlertModalOpen(true);
              }}
              className="p-2 rounded-xl text-chocolate-700 hover:bg-pink-100 border border-pink-200 transition-colors cursor-pointer"
              title="Set Price Drop Alert"
            >
              <Bell className="w-4 h-4" />
            </button>

            <button
              onClick={() => toggleWishlist(selectedProduct)}
              className="p-2 rounded-xl text-chocolate-700 hover:bg-pink-100 border border-pink-200 transition-colors cursor-pointer"
              title="Save to Wishlist"
            >
              <Heart className={`w-4 h-4 ${isFav ? 'fill-rose-500 text-rose-500' : ''}`} />
            </button>

            <button
              onClick={() => toggleCompare(selectedProduct)}
              className="p-2 rounded-xl text-chocolate-700 hover:bg-pink-100 border border-pink-200 transition-colors cursor-pointer"
              title="Compare Side-by-Side"
            >
              <Scale className={`w-4 h-4 ${isCompared ? 'text-pink-600 font-bold' : ''}`} />
            </button>

            <button
              onClick={() => setSelectedProduct(null)}
              className="p-2 rounded-xl text-chocolate-400 hover:text-chocolate-950 hover:bg-pink-100 transition-colors cursor-pointer ml-1"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Modal Body */}
        <div className="p-6 sm:p-8 space-y-8">
          
          {/* Main Top Section: Image Gallery + Core Buy Box */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-start">
            
            {/* Gallery Column */}
            <div className="space-y-4">
              <div className="aspect-square bg-cream-100/70 rounded-3xl p-6 border border-pink-200 flex items-center justify-center relative overflow-hidden">
                <img
                  src={activeImage}
                  alt={selectedProduct.name}
                  className="max-h-full max-w-full object-contain mix-blend-multiply transition-all duration-300"
                />
                
                {/* Store Badge */}
                <div className="absolute top-4 left-4">
                  <span className="bg-chocolate-900 text-cream-50 text-xs font-extrabold uppercase px-3 py-1 rounded-xl shadow-sm">
                    {selectedProduct.store}
                  </span>
                </div>

                {/* Score Pill */}
                <div className="absolute bottom-4 right-4 bg-white/90 backdrop-blur-md px-3 py-1.5 rounded-2xl border border-pink-200 shadow-sm flex items-center gap-1.5 text-xs font-extrabold text-chocolate-950">
                  <Sparkles className="w-4 h-4 text-pink-500" />
                  <span>Infinity Score: {selectedProduct.infinityScore}/100</span>
                </div>
              </div>

              {/* Thumbnails */}
              {selectedProduct.galleryImages && selectedProduct.galleryImages.length > 1 && (
                <div className="flex items-center gap-3">
                  {selectedProduct.galleryImages.map((img, i) => (
                    <button
                      key={i}
                      onClick={() => setSelectedGalleryImg(img)}
                      className={`w-16 h-16 rounded-2xl bg-cream-100 p-2 border-2 transition-all cursor-pointer overflow-hidden ${
                        activeImage === img ? 'border-pink-500 shadow-sm scale-105' : 'border-pink-200 opacity-70 hover:opacity-100'
                      }`}
                    >
                      <img src={img} alt="thumb" className="w-full h-full object-contain mix-blend-multiply" />
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Product Overview & Action Box */}
            <div className="space-y-5">
              <div>
                <span className="text-xs font-extrabold text-pink-600 uppercase tracking-wider">
                  {selectedProduct.brand} • {selectedProduct.category}
                </span>
                <h2 className="font-serif text-2xl sm:text-3xl font-bold text-chocolate-950 mt-1 leading-snug">
                  {selectedProduct.name}
                </h2>

                {/* Rating & Seller Trust Tag */}
                <div className="flex items-center gap-3 mt-3 flex-wrap">
                  <div className="flex items-center bg-amber-50 border border-amber-200 px-2.5 py-1 rounded-xl text-xs font-bold text-amber-800">
                    <Star className="w-4 h-4 fill-amber-400 text-amber-500 mr-1" />
                    <span>{selectedProduct.rating}</span>
                    <span className="text-chocolate-400 font-normal ml-1">({selectedProduct.reviewCount.toLocaleString()} reviews)</span>
                  </div>

                  <div className="flex items-center gap-1 text-xs font-bold text-emerald-800 bg-emerald-50 px-2.5 py-1 rounded-xl border border-emerald-200">
                    <ShieldCheck className="w-4 h-4 text-emerald-600" />
                    <span>Seller Trust: {selectedProduct.sellerTrust} ({selectedProduct.sellerTrustScore}%)</span>
                  </div>

                  <div className="flex items-center gap-1 text-xs font-bold text-emerald-800 bg-emerald-50 px-2.5 py-1 rounded-xl border border-emerald-200">
                    <Leaf className="w-4 h-4 text-emerald-600" />
                    <span>Eco Score: {selectedProduct.ecoScore}/100 🌱</span>
                  </div>
                </div>
              </div>

              {/* Price & Final Cost Box */}
              <div className="bg-gradient-to-br from-cream-100 via-pink-50 to-cream-50 p-5 rounded-3xl border border-pink-200 space-y-3">
                <div className="flex items-baseline justify-between">
                  <div>
                    <span className="text-[11px] font-bold text-chocolate-600 uppercase tracking-wider block">Estimated Final Cost</span>
                    <span className="font-serif text-3xl sm:text-4xl font-bold text-chocolate-950">
                      ₹{selectedProduct.finalEstimatedPrice.toLocaleString('en-IN')}
                    </span>
                    {selectedProduct.originalPrice > selectedProduct.currentPrice && (
                      <span className="text-xs text-chocolate-400 line-through ml-2">
                        MRP ₹{selectedProduct.originalPrice.toLocaleString('en-IN')}
                      </span>
                    )}
                  </div>

                  <div className="text-right">
                    {selectedProduct.discountPercent > 0 && (
                      <span className="bg-rose-500 text-white text-xs font-extrabold px-2.5 py-1 rounded-lg">
                        {selectedProduct.discountPercent}% OFF
                      </span>
                    )}
                    <span className="text-[11px] text-chocolate-600 font-medium block mt-1">
                      {selectedProduct.shippingFee === 0 ? 'Free Shipping Included' : `+ ₹${selectedProduct.shippingFee} Shipping`}
                    </span>
                  </div>
                </div>

                <div className="pt-3 border-t border-pink-200/60 flex items-center justify-between text-xs text-chocolate-800">
                  <span className="flex items-center gap-1 font-medium">
                    <Truck className="w-4 h-4 text-pink-600" />
                    Delivery: <strong className="text-chocolate-950">{selectedProduct.deliveryEstimate}</strong>
                  </span>
                  <span className="flex items-center gap-1 font-medium">
                    <RotateCcw className="w-4 h-4 text-pink-600" />
                    {selectedProduct.returnPolicy}
                  </span>
                </div>

                {/* Primary Add to Cart Action */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                  <button
                    onClick={() => addToCart(selectedProduct)}
                    className="w-full py-3 rounded-2xl bg-chocolate-900 hover:bg-chocolate-800 text-cream-50 font-bold text-xs sm:text-sm shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer"
                  >
                    <ShoppingBag className="w-4 h-4 text-pink-300" />
                    <span>Add to Infinity Cart</span>
                  </button>

                  <button
                    onClick={() => {
                      if (bestTwin && bestTwin.store !== selectedProduct.store) {
                        addToCart(selectedProduct, bestTwin.store, bestTwin.price, bestTwin.shippingFee);
                      } else {
                        addToCart(selectedProduct);
                      }
                    }}
                    className="w-full py-3 rounded-2xl bg-gradient-to-r from-pink-200 to-pink-300 hover:from-pink-300 hover:to-pink-400 text-chocolate-950 font-bold text-xs sm:text-sm border border-pink-400 shadow-sm transition-all flex items-center justify-center gap-1.5 cursor-pointer"
                  >
                    <Sparkles className="w-4 h-4 text-chocolate-900" />
                    <span>Add Best Deal ({bestTwin.store})</span>
                  </button>
                </div>
              </div>

              {/* Description */}
              <p className="text-xs sm:text-sm text-chocolate-800 leading-relaxed font-light">
                {selectedProduct.description}
              </p>

            </div>

          </div>

          {/* Section 8 & 9: PRODUCT TWIN™ Cross-Store Table */}
          {selectedProduct.twinOffers && selectedProduct.twinOffers.length > 0 && (
            <div className="bg-white rounded-3xl p-6 border-2 border-pink-300 shadow-soft">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-4 pb-3 border-b border-pink-200">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-xl bg-pink-100 text-pink-600 flex items-center justify-center">
                    <Layers className="w-4 h-4" />
                  </div>
                  <div>
                    <h3 className="font-serif text-lg font-bold text-chocolate-950">
                      Product Twin™ — Cross-Store Price Intelligence
                    </h3>
                    <p className="text-xs text-chocolate-600">
                      Same verified product detected across {selectedProduct.twinOffers.length} online stores.
                    </p>
                  </div>
                </div>

                {maxSavings > 0 && (
                  <div className="bg-emerald-100 text-emerald-900 px-3 py-1 rounded-xl text-xs font-extrabold border border-emerald-300">
                    💰 Save up to ₹{maxSavings.toLocaleString('en-IN')} with {bestTwin.store}
                  </div>
                )}
              </div>

              {/* Cross-Store Table */}
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead>
                    <tr className="bg-cream-100 text-chocolate-900 font-extrabold uppercase tracking-wider text-[10px]">
                      <th className="p-3 rounded-l-xl">Store</th>
                      <th className="p-3">Product Price</th>
                      <th className="p-3">Shipping</th>
                      <th className="p-3 font-bold text-chocolate-950">Final Cost</th>
                      <th className="p-3">Rating</th>
                      <th className="p-3">Delivery</th>
                      <th className="p-3 rounded-r-xl text-right">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-pink-100">
                    {selectedProduct.twinOffers.map((offer) => (
                      <tr 
                        key={offer.store}
                        className={`transition-colors ${
                          offer.isBestDeal ? 'bg-pink-50/80 font-semibold' : 'hover:bg-cream-50'
                        }`}
                      >
                        <td className="p-3 font-bold text-chocolate-950 flex items-center gap-1.5">
                          <span>{offer.store}</span>
                          {offer.isBestDeal && (
                            <span className="bg-chocolate-900 text-cream-50 text-[9px] uppercase px-2 py-0.5 rounded-full font-extrabold">
                              🏆 Best Deal
                            </span>
                          )}
                        </td>
                        <td className="p-3">₹{offer.price.toLocaleString('en-IN')}</td>
                        <td className="p-3 text-chocolate-600">
                          {offer.shippingFee === 0 ? 'Free' : `₹${offer.shippingFee}`}
                        </td>
                        <td className="p-3 font-serif font-bold text-sm text-chocolate-950">
                          ₹{offer.finalPrice.toLocaleString('en-IN')}
                        </td>
                        <td className="p-3 text-amber-700">★ {offer.rating}</td>
                        <td className="p-3 text-chocolate-700">{offer.deliveryText}</td>
                        <td className="p-3 text-right">
                          <button
                            onClick={() => addToCart(selectedProduct, offer.store, offer.price, offer.shippingFee)}
                            className={`px-3 py-1 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                              offer.isBestDeal
                                ? 'bg-chocolate-900 hover:bg-chocolate-800 text-cream-50 shadow-xs'
                                : 'bg-white hover:bg-pink-100 text-chocolate-800 border border-pink-200'
                            }`}
                          >
                            Add Deal
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* Section 10 & 11: INFINITY DEAL ANALYZER & PRICE HISTORY */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            
            {/* Deal Analyzer Box */}
            <div className="bg-cream-100/70 rounded-3xl p-6 border border-pink-200 space-y-4">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-xl bg-pink-200 text-chocolate-900 flex items-center justify-center">
                  <Sparkles className="w-4 h-4 text-pink-600" />
                </div>
                <div>
                  <h4 className="font-serif text-base font-bold text-chocolate-950">
                    Infinity Deal Analyzer™
                  </h4>
                  <span className="text-[11px] text-chocolate-600">Historical Discount Verification</span>
                </div>
              </div>

              <div className="p-4 rounded-2xl bg-white border border-pink-200 space-y-2">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-chocolate-600">Advertised Discount:</span>
                  <span className="font-bold text-chocolate-950">{selectedProduct.discountPercent}% OFF</span>
                </div>
                <div className="flex items-center justify-between text-xs">
                  <span className="text-chocolate-600">30-Day Average Price:</span>
                  <span className="font-bold text-chocolate-950">₹{selectedProduct.recentAveragePrice.toLocaleString('en-IN')}</span>
                </div>
                <div className="flex items-center justify-between text-xs">
                  <span className="text-chocolate-600">Lowest Recorded Price:</span>
                  <span className="font-bold text-emerald-700">₹{selectedProduct.lowestRecordedPrice.toLocaleString('en-IN')}</span>
                </div>
              </div>

              <p className="text-xs text-chocolate-800 bg-pink-100/60 p-3 rounded-2xl border border-pink-200/80 leading-relaxed font-medium">
                💬 <strong>AI Deal Insight:</strong> {selectedProduct.dealAnalysisText}
              </p>
            </div>

            {/* Should I Buy This Now? & Price History Chart */}
            <div className="bg-white rounded-3xl p-6 border border-pink-200 space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Clock className="w-4 h-4 text-pink-600" />
                  <h4 className="font-serif text-base font-bold text-chocolate-950">
                    Should I Buy This Now?
                  </h4>
                </div>
                <span className={`text-xs font-extrabold px-3 py-1 rounded-full border ${
                  selectedProduct.buyRecommendation === 'BUY NOW'
                    ? 'bg-emerald-100 text-emerald-900 border-emerald-300'
                    : 'bg-amber-100 text-amber-900 border-amber-300'
                }`}>
                  {selectedProduct.buyRecommendation === 'BUY NOW' ? '🟢 BUY NOW' : '🟡 CONSIDER WAITING'}
                </span>
              </div>

              <p className="text-xs text-chocolate-700 leading-relaxed">
                {selectedProduct.buyRecommendationReason}
              </p>

              {/* Visual 30-Day Price Trend Bars */}
              <div className="pt-3 border-t border-pink-100">
                <span className="text-[11px] font-bold text-chocolate-600 uppercase tracking-wider block mb-2">
                  30-Day Price Curve Trend
                </span>
                <div className="grid grid-cols-5 gap-2 items-end h-24 bg-cream-50 p-3 rounded-2xl border border-pink-100">
                  {selectedProduct.priceHistory?.map((pt, idx) => {
                    const heightPercent = Math.max(30, Math.min(100, Math.round((pt.price / selectedProduct.highestRecordedPrice) * 100)));
                    return (
                      <div key={idx} className="flex flex-col items-center justify-end h-full">
                        <span className="text-[9px] font-bold text-chocolate-900 mb-1">₹{pt.price}</span>
                        <div 
                          style={{ height: `${heightPercent}%` }}
                          className={`w-full rounded-t-lg transition-all ${
                            idx === selectedProduct.priceHistory.length - 1
                              ? 'bg-pink-500'
                              : 'bg-chocolate-800/40'
                          }`}
                        />
                        <span className="text-[8px] text-chocolate-500 mt-1">{pt.date}</span>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>

          </div>

          {/* Section 29: AI Review Summary & Seller Trust */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            
            {/* AI Review Summary */}
            <div className="bg-white rounded-3xl p-6 border border-pink-200 space-y-3">
              <div className="flex items-center justify-between">
                <h4 className="font-serif text-base font-bold text-chocolate-950 flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-pink-600" />
                  Infinity AI Review Summary
                </h4>
                <span className="text-xs font-extrabold text-pink-700 bg-pink-100 px-2.5 py-0.5 rounded-full border border-pink-200">
                  {selectedProduct.aiReviewSummary.positiveSentimentPercent}% Positive Sentiment
                </span>
              </div>

              <p className="text-xs text-chocolate-700 leading-relaxed italic">
                "{selectedProduct.aiReviewSummary.summaryParagraph}"
              </p>

              <div className="grid grid-cols-2 gap-3 pt-2">
                <div className="bg-emerald-50/70 p-3 rounded-2xl border border-emerald-200">
                  <span className="text-[11px] font-bold text-emerald-800 block mb-1.5">✓ Key Pros:</span>
                  <ul className="text-[11px] text-emerald-950 space-y-1">
                    {selectedProduct.aiReviewSummary.pros.map((pro, i) => (
                      <li key={i}>• {pro}</li>
                    ))}
                  </ul>
                </div>

                <div className="bg-rose-50/70 p-3 rounded-2xl border border-rose-200">
                  <span className="text-[11px] font-bold text-rose-800 block mb-1.5">× Watch Out:</span>
                  <ul className="text-[11px] text-rose-950 space-y-1">
                    {selectedProduct.aiReviewSummary.cons.map((con, i) => (
                      <li key={i}>• {con}</li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>

            {/* Specifications & Eco Profile */}
            <div className="bg-cream-100/70 rounded-3xl p-6 border border-pink-200 space-y-3">
              <h4 className="font-serif text-base font-bold text-chocolate-950">
                Detailed Specifications
              </h4>

              <div className="bg-white p-3 rounded-2xl border border-pink-200 divide-y divide-pink-100 text-xs">
                {Object.entries(selectedProduct.specs || {}).map(([key, val]) => (
                  <div key={key} className="py-1.5 flex justify-between">
                    <span className="text-chocolate-500 font-medium">{key}</span>
                    <span className="text-chocolate-950 font-bold text-right">{val}</span>
                  </div>
                ))}
              </div>

              <div className="text-[11px] text-chocolate-700 flex items-center justify-between pt-1">
                <span>Eco Material: <strong>{selectedProduct.ecoFactors.material}</strong></span>
                <span>Expected Lifespan: <strong>{selectedProduct.ecoFactors.lifespan}</strong></span>
              </div>
            </div>

          </div>

          {/* Section 31: Compatibility Checker (if available) */}
          {selectedProduct.compatibleItems && selectedProduct.compatibleItems.length > 0 && (
            <div className="bg-gradient-to-r from-cream-100 to-pink-50 rounded-3xl p-6 border border-pink-200">
              <div className="flex items-center gap-2 mb-4">
                <Cpu className="w-5 h-5 text-pink-600" />
                <div>
                  <h4 className="font-serif text-base font-bold text-chocolate-950">
                    Recommended Compatible Accessories
                  </h4>
                  <p className="text-xs text-chocolate-600">
                    AI-verified compatible gear for your {selectedProduct.name}
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                {selectedProduct.compatibleItems.map((item, idx) => (
                  <div key={idx} className="bg-white p-3.5 rounded-2xl border border-pink-200 shadow-xs flex items-center gap-3">
                    <img src={item.image} alt={item.name} className="w-12 h-12 object-cover rounded-xl shrink-0" />
                    <div className="min-w-0 flex-1">
                      <span className="text-[10px] uppercase font-bold text-pink-600 block">{item.category}</span>
                      <h5 className="text-xs font-bold text-chocolate-950 truncate">{item.name}</h5>
                      <span className="text-xs font-bold text-chocolate-800">₹{item.price} ({item.store})</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Section 15: Find Something Better Alternatives */}
          {relatedProducts.length > 0 && (
            <div>
              <h4 className="font-serif text-lg font-bold text-chocolate-950 mb-3 flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-pink-600" />
                Find Something Better — AI Alternatives
              </h4>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                {relatedProducts.map(rel => (
                  <div 
                    key={rel.id}
                    onClick={() => setSelectedProduct(rel)}
                    className="p-3.5 rounded-2xl bg-white border border-pink-200 hover:border-pink-300 shadow-xs hover:shadow-soft transition-all cursor-pointer flex items-center gap-3"
                  >
                    <img src={rel.image} alt={rel.name} className="w-14 h-14 object-contain rounded-xl shrink-0 bg-cream-50" />
                    <div className="min-w-0 flex-1">
                      <span className="text-[10px] uppercase font-bold text-pink-600 block">{rel.brand}</span>
                      <h5 className="text-xs font-bold text-chocolate-950 truncate">{rel.name}</h5>
                      <div className="flex items-center justify-between mt-1">
                        <span className="text-xs font-bold text-chocolate-900">₹{rel.currentPrice}</span>
                        <span className="text-[10px] bg-pink-100 text-chocolate-900 px-1.5 py-0.5 rounded font-extrabold">
                          Score: {rel.infinityScore}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

        </div>

      </div>

    </div>
  );
};
