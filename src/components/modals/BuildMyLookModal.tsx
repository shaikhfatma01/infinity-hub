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

  // Looks the catalogue by id (never by position) so each piece shows and adds the right product.
  const byId = (id: string) => products.find(p => p.id === id);

  interface LookPiece {
    type: string;
    store: string;
    name: string;
    price: number;
    image: string;
    /** Catalogue product this piece maps to; undefined for style-only suggestions. */
    productId?: string;
  }

  const catalogPiece = (type: string, id: string, fallbackImage: string): LookPiece => {
    const p = byId(id);
    return {
      type,
      store: p?.store ?? '—',
      name: p?.name ?? 'Currently unavailable',
      price: p?.finalEstimatedPrice ?? 0,
      image: p?.image ?? fallbackImage,
      productId: p ? p.id : undefined,
    };
  };

  const suggestion = (type: string, store: string, name: string, price: number, image: string): LookPiece => ({
    type, store, name, price, image,
  });

  // Balanced = real catalogue products. Cheaper/Luxury are style suggestions that are not
  // in the catalogue, so they are labelled as such and cannot be added to the cart.
  const outfitPieces: LookPiece[] = [
    lookMode === 'cheaper'
      ? suggestion('Structured Handbag / Purse', 'Myntra', 'Baggit Everyday Tote', 599, byId('prod-purse-myntra')?.image ?? '')
      : lookMode === 'premium'
      ? suggestion('Structured Handbag / Purse', 'Myntra', 'Michael Kors Jet Set Tote', 3499, byId('prod-purse-myntra')?.image ?? '')
      : catalogPiece('Structured Handbag / Purse', 'prod-purse-myntra', ''),
    lookMode === 'cheaper'
      ? suggestion('Comfortable Athletic Footwear', 'Myntra', 'Red Tape Athleisure Sneaker', 1299, byId('prod-shoes-myntra')?.image ?? '')
      : lookMode === 'premium'
      ? suggestion('Comfortable Athletic Footwear', 'Myntra', 'Nike Air Jordan Retro', 8995, byId('prod-shoes-myntra')?.image ?? '')
      : catalogPiece('Comfortable Athletic Footwear', 'prod-shoes-myntra', ''),
    lookMode === 'cheaper'
      ? suggestion('Smart Biometric Accessory', 'Amazon', 'Fastrack Reflex Beat Watch', 1199, byId('prod-watch-amazon')?.image ?? '')
      : lookMode === 'premium'
      ? suggestion('Smart Biometric Accessory', 'Amazon', 'Apple Watch SE GPS', 24900, byId('prod-watch-amazon')?.image ?? '')
      : catalogPiece('Smart Biometric Accessory', 'prod-watch-amazon', ''),
    catalogPiece('Daily Glow Skincare Protection', 'prod-skincare-nykaa', ''),
  ];

  const totalCost = outfitPieces.reduce((sum, p) => sum + p.price, 0);
  const addablePieces = outfitPieces.filter(p => p.productId);
  const addableTotal = addablePieces.reduce((sum, p) => sum + p.price, 0);

  const handleAddLookToCart = () => {
    if (addablePieces.length === 0) {
      showToast('Nothing to add', 'This look has no catalogue items available right now.', 'warning');
      return;
    }

    confetti({
      particleCount: 70,
      spread: 60,
      origin: { y: 0.6 }
    });

    addablePieces.forEach(piece => {
      const product = byId(piece.productId!);
      if (product) addToCart(product);
    });

    const skipped = outfitPieces.length - addablePieces.length;
    showToast(
      '👗 Look Added!',
      `${addablePieces.length} catalogue item${addablePieces.length === 1 ? '' : 's'} added for ₹${addableTotal.toLocaleString('en-IN')}.` +
        (skipped > 0 ? ` ${skipped} style suggestion${skipped === 1 ? ' is' : 's are'} not in the catalogue.` : ''),
      'success'
    );
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
                  {!piece.productId && (
                    <span className="text-[9px] font-bold uppercase text-amber-700 bg-amber-50 border border-amber-200 rounded px-1.5 py-0.5 inline-block mt-0.5">
                      Style suggestion · not in catalogue
                    </span>
                  )}
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
                {addablePieces.length === outfitPieces.length
                  ? `✓ All ${outfitPieces.length} pieces are verified catalogue items`
                  : `✓ ${addablePieces.length} of ${outfitPieces.length} pieces can be added to your cart`}
              </span>
            </div>

            <button
              onClick={handleAddLookToCart}
              className="w-full sm:w-auto px-8 py-3 rounded-2xl bg-chocolate-900 hover:bg-chocolate-800 text-cream-50 text-xs sm:text-sm font-bold shadow-md hover:shadow-choc-glow transition-all flex items-center justify-center gap-2 cursor-pointer"
            >
              <ShoppingBag className="w-4 h-4 text-pink-300" />
              <span>{addablePieces.length === outfitPieces.length ? 'Add Complete Look to Cart' : `Add ${addablePieces.length} Catalogue Items to Cart`}</span>
            </button>
          </div>

        </div>

      </div>
    </div>
  );
};
