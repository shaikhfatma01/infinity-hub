import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { 
  X, 
  Sparkles, 
  ShoppingBag, 
  TrendingDown, 
  Sparkle, 
  ArrowRight, 
  Check, 
  RefreshCw,
  Palette
} from 'lucide-react';
import confetti from 'canvas-confetti';

export const BuildMyLookModal: React.FC = () => {
  const { 
    isBuildLookModalOpen, 
    setIsBuildLookModalOpen, 
    products, 
    addToCart, 
    showToast,
    setIsCartOpen 
  } = useApp();

  const [lookMode, setLookMode] = useState<'standard' | 'cheaper' | 'premium'>('standard');
  const [selectedOutfitType, setSelectedOutfitType] = useState<'college' | 'work' | 'evening'>('college');

  if (!isBuildLookModalOpen) return null;

  // Outfit pieces based on mode
  const outfitPieces = [
    {
      type: 'Structured Handbag / Purse',
      store: 'Myntra',
      name: lookMode === 'cheaper' 
        ? 'Baggit Everyday Tote' 
        : lookMode === 'premium' 
        ? 'Michael Kors Jet Set Tote' 
        : 'Lavie Luxe Black Vegan Satchel',
      price: lookMode === 'cheaper' ? 599 : lookMode === 'premium' ? 3499 : 899,
      image: products[0]?.image || 'https://images.unsplash.com/photo-1584917865442-de89df76afd3?auto=format&fit=crop&w=400&q=80',
    },
    {
      type: 'Comfortable Athletic Footwear',
      store: 'Myntra',
      name: lookMode === 'cheaper' 
        ? 'Red Tape Athleisure Sneaker' 
        : lookMode === 'premium' 
        ? 'Nike Air Jordan Retro' 
        : 'Nike Air Max Excee Running Shoes',
      price: lookMode === 'cheaper' ? 1299 : lookMode === 'premium' ? 8995 : 4599,
      image: products[3]?.image || 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=400&q=80',
    },
    {
      type: 'Smart Biometric Accessory',
      store: 'Amazon',
      name: lookMode === 'cheaper' 
        ? 'Fastrack Reflex Beat Watch' 
        : lookMode === 'premium' 
        ? 'Apple Watch SE GPS' 
        : 'Noise ColorFit Pro 5 Max AMOLED',
      price: lookMode === 'cheaper' ? 1199 : lookMode === 'premium' ? 24900 : 2999,
      image: products[6]?.image || 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=400&q=80',
    },
    {
      type: 'Daily Glow Skincare Protection',
      store: 'Nykaa',
      name: 'The Derma Co 1% Hyaluronic Sunscreen SPF 50',
      price: 429,
      image: products[4]?.image || 'https://images.unsplash.com/photo-1556228720-195a672e8a03?auto=format&fit=crop&w=400&q=80',
    }
  ];

  const totalCost = outfitPieces.reduce((sum, p) => sum + p.price, 0);

  const handleAddLookToCart = () => {
    confetti({
      particleCount: 70,
      spread: 60,
      origin: { y: 0.6 }
    });

    products.slice(0, 3).forEach(p => addToCart(p));
    showToast('👗 Complete Look Added!', `4 items added to your Infinity Cart for ₹${totalCost.toLocaleString('en-IN')}`, 'success');
    setIsBuildLookModalOpen(false);
    setIsCartOpen(true);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-chocolate-950/60 backdrop-blur-sm flex items-center justify-center p-2 sm:p-4">
      <div className="relative bg-white rounded-3xl max-w-4xl w-full max-h-[92vh] overflow-y-auto shadow-soft-lg border border-pink-200">
        
        {/* Header */}
        <div className="sticky top-0 z-20 bg-white/95 backdrop-blur-md px-6 py-4 border-b border-pink-100 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="bg-pink-100 text-chocolate-900 text-xs font-extrabold px-3 py-1 rounded-full border border-pink-300 flex items-center gap-1.5">
              <Palette className="w-3.5 h-3.5 text-pink-600" />
              Fashion & Lifestyle AI Stylist
            </span>
            <span className="text-xs text-chocolate-500 font-medium hidden sm:inline">
              Feature 19 • Build My Look
            </span>
          </div>

          <button
            onClick={() => setIsBuildLookModalOpen(false)}
            className="p-2 rounded-xl text-chocolate-400 hover:text-chocolate-950 hover:bg-pink-100 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body Content */}
        <div className="p-6 sm:p-8 space-y-6">
          
          {/* Top Style Selector */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-cream-100/70 p-4 rounded-2xl border border-pink-200">
            <div>
              <h3 className="font-serif text-lg font-bold text-chocolate-950">
                AI Coordinated Outfit & Accessories
              </h3>
              <p className="text-xs text-chocolate-600">
                Infinity AI creates balanced color palettes and synchronized multi-store pricing.
              </p>
            </div>

            {/* Quick Variation Controls (Feature 19) */}
            <div className="flex items-center gap-1.5 bg-white p-1 rounded-xl border border-pink-200">
              <button
                onClick={() => setLookMode('cheaper')}
                className={`px-3 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                  lookMode === 'cheaper' ? 'bg-chocolate-900 text-cream-50' : 'text-chocolate-700 hover:bg-pink-50'
                }`}
              >
                💰 Make Cheaper
              </button>
              <button
                onClick={() => setLookMode('standard')}
                className={`px-3 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                  lookMode === 'standard' ? 'bg-chocolate-900 text-cream-50' : 'text-chocolate-700 hover:bg-pink-50'
                }`}
              >
                ✨ Balanced
              </button>
              <button
                onClick={() => setLookMode('premium')}
                className={`px-3 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                  lookMode === 'premium' ? 'bg-chocolate-900 text-cream-50' : 'text-chocolate-700 hover:bg-pink-50'
                }`}
              >
                💎 Luxury
              </button>
            </div>
          </div>

          {/* Outfit Pieces Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
            {outfitPieces.map((piece, i) => (
              <div key={i} className="bg-white rounded-2xl p-4 border border-pink-200 shadow-soft flex flex-col justify-between">
                <div>
                  <div className="aspect-square bg-cream-50 rounded-xl p-2 mb-3 border border-pink-100 flex items-center justify-center">
                    <img src={piece.image} alt={piece.name} className="max-h-full max-w-full object-contain mix-blend-multiply" />
                  </div>
                  <span className="text-[10px] font-extrabold uppercase text-pink-600 block">{piece.type}</span>
                  <h4 className="font-serif text-xs font-bold text-chocolate-950 line-clamp-2 mt-0.5">{piece.name}</h4>
                </div>

                <div className="mt-3 pt-2 border-t border-pink-100 flex items-center justify-between">
                  <span className="text-[10px] bg-chocolate-900 text-cream-50 px-2 py-0.5 rounded font-bold">{piece.store}</span>
                  <span className="font-serif text-sm font-bold text-chocolate-950">₹{piece.price.toLocaleString('en-IN')}</span>
                </div>
              </div>
            ))}
          </div>

          {/* Bottom Total & CTA */}
          <div className="bg-gradient-to-r from-pink-100 via-pink-50 to-cream-100 p-6 rounded-3xl border border-pink-300 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div>
              <span className="text-xs font-bold text-chocolate-600 uppercase tracking-wider block">Coordinated Total Cost:</span>
              <span className="font-serif text-3xl font-bold text-chocolate-950">₹{totalCost.toLocaleString('en-IN')}</span>
              <span className="text-xs text-emerald-700 font-bold block mt-0.5">
                ✓ Includes Best Deal matching across 3 stores
              </span>
            </div>

            <button
              onClick={handleAddLookToCart}
              className="w-full sm:w-auto px-8 py-3 rounded-2xl bg-chocolate-900 hover:bg-chocolate-800 text-cream-50 text-xs sm:text-sm font-bold shadow-md hover:shadow-choc-glow transition-all flex items-center justify-center gap-2 cursor-pointer"
            >
              <ShoppingBag className="w-4 h-4 text-pink-300" />
              <span>Add Complete Look to Cart</span>
            </button>
          </div>

        </div>

      </div>
    </div>
  );
};
