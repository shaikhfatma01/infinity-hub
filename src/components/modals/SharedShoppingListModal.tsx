import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { 
  X, 
  Users, 
  Plus, 
  Check, 
  ShoppingBag, 
  Sparkles, 
  Trash2,
  Share2
} from 'lucide-react';
import confetti from 'canvas-confetti';

export const SharedShoppingListModal: React.FC = () => {
  const { 
    isSharedListModalOpen, 
    setIsSharedListModalOpen, 
    sharedList, 
    addSharedItem, 
    toggleSharedItemPurchased,
    addToCart,
    showToast,
    setIsCartOpen
  } = useApp();

  const [itemName, setItemName] = useState('');
  const [userName, setUserName] = useState('Fatma');
  const [category, setCategory] = useState('Grocery');

  if (!isSharedListModalOpen) return null;

  const handleAddItem = (e: React.FormEvent) => {
    e.preventDefault();
    if (itemName.trim()) {
      addSharedItem(itemName.trim(), userName, category);
      setItemName('');
    }
  };

  const handleAddAllToCart = () => {
    confetti({
      particleCount: 60,
      spread: 60,
      origin: { y: 0.6 }
    });

    sharedList.forEach(item => {
      if (item.matchedProduct) {
        addToCart(item.matchedProduct);
      }
    });

    showToast('👨‍👩‍👧 Shared List Added to Infinity Cart', 'Combined and optimized across stores!', 'success');
    setIsSharedListModalOpen(false);
    setIsCartOpen(true);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-chocolate-950/60 backdrop-blur-sm flex items-center justify-center p-2 sm:p-4">
      <div className="relative bg-white rounded-3xl max-w-2xl w-full max-h-[92vh] overflow-y-auto shadow-soft-lg border border-pink-200">
        
        {/* Header */}
        <div className="sticky top-0 z-20 bg-white/95 backdrop-blur-md px-6 py-4 border-b border-pink-100 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-pink-100 text-pink-600 flex items-center justify-center">
              <Users className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-serif text-lg font-bold text-chocolate-950">
                Shared Family & Roommate Shopping List
              </h3>
              <p className="text-xs text-chocolate-600">
                Feature 26 • Collaborative Multi-Person Basket Optimizer
              </p>
            </div>
          </div>

          <button
            onClick={() => setIsSharedListModalOpen(false)}
            className="p-2 rounded-xl text-chocolate-400 hover:text-chocolate-950 hover:bg-pink-100 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body */}
        <div className="p-6 space-y-6">
          
          {/* Add Item Form */}
          <form onSubmit={handleAddItem} className="bg-cream-100/70 p-4 rounded-2xl border border-pink-200 space-y-3">
            <div className="flex flex-col sm:flex-row gap-2">
              <input
                type="text"
                value={itemName}
                onChange={(e) => setItemName(e.target.value)}
                placeholder="Item to add (e.g. Basmati Rice, Shampoo, Blanket)..."
                className="flex-1 px-4 py-2.5 rounded-xl bg-white border border-pink-200 text-xs sm:text-sm text-chocolate-950 focus:outline-none focus:ring-2 focus:ring-pink-400"
                required
              />

              <div className="flex gap-2">
                <select
                  value={userName}
                  onChange={(e) => setUserName(e.target.value)}
                  className="px-3 py-2.5 rounded-xl bg-white border border-pink-200 text-xs font-bold text-chocolate-900 focus:outline-none cursor-pointer"
                >
                  <option value="Fatma">👤 Fatma</option>
                  <option value="Amina">👤 Amina</option>
                  <option value="Mom">👤 Mom</option>
                  <option value="Roommate">👤 Roommate</option>
                </select>

                <button
                  type="submit"
                  className="px-4 py-2.5 rounded-xl bg-chocolate-900 text-cream-50 text-xs font-bold hover:bg-chocolate-800 transition-all flex items-center gap-1 cursor-pointer shrink-0"
                >
                  <Plus className="w-4 h-4 text-pink-300" />
                  <span>Add</span>
                </button>
              </div>
            </div>
          </form>

          {/* List Items */}
          <div className="space-y-2.5">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-chocolate-600 uppercase tracking-wider">
                Combined Household Shopping List ({sharedList.length} Items)
              </span>
              <span className="text-xs text-emerald-700 font-bold">
                ✓ Auto-matched with store prices
              </span>
            </div>

            <div className="divide-y divide-pink-100 bg-white rounded-2xl border border-pink-200 overflow-hidden">
              {sharedList.map((item) => (
                <div
                  key={item.id}
                  className={`p-3.5 flex items-center justify-between gap-3 transition-colors ${
                    item.isPurchased ? 'bg-cream-50/50 opacity-60' : 'hover:bg-pink-50/40'
                  }`}
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <button
                      onClick={() => toggleSharedItemPurchased(item.id)}
                      className={`w-5 h-5 rounded-lg border flex items-center justify-center cursor-pointer ${
                        item.isPurchased
                          ? 'bg-emerald-600 border-emerald-600 text-white'
                          : 'border-pink-300 bg-white hover:border-pink-500'
                      }`}
                    >
                      {item.isPurchased && <Check className="w-3.5 h-3.5" />}
                    </button>

                    <div className="min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="font-serif text-xs sm:text-sm font-bold text-chocolate-950">
                          {item.name}
                        </span>
                        <span className="text-[10px] bg-pink-100 text-chocolate-900 px-2 py-0.2 rounded-full font-bold">
                          Added by {item.addedBy}
                        </span>
                      </div>
                      {item.matchedProduct && (
                        <p className="text-[11px] text-chocolate-600 mt-0.5">
                          Best Store: <strong className="text-chocolate-950">{item.matchedProduct.store}</strong> (₹{item.matchedProduct.finalEstimatedPrice})
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Action to add all matched items to cart */}
          <div className="pt-4 border-t border-pink-100 flex flex-col sm:flex-row items-center justify-between gap-3">
            <span className="text-xs text-chocolate-700">
              InfinityHub will group these items to minimize total shipping costs across BigBasket, Zepto & Blinkit.
            </span>

            <button
              onClick={handleAddAllToCart}
              className="w-full sm:w-auto px-6 py-3 rounded-2xl bg-chocolate-900 hover:bg-chocolate-800 text-cream-50 text-xs sm:text-sm font-bold shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer"
            >
              <ShoppingBag className="w-4 h-4 text-pink-300" />
              <span>Add Optimized List to Cart</span>
            </button>
          </div>

        </div>

      </div>
    </div>
  );
};
