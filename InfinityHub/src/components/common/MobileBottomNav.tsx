import React from 'react';
import { useApp } from '../../context/AppContext';
import { Home, Search, Sparkles, Heart, ShoppingBag, Target } from 'lucide-react';

export const MobileBottomNav: React.FC = () => {
  const { 
    activeTab, 
    setActiveTab, 
    cartItems, 
    wishlist, 
    setIsCartOpen, 
    setIsWishlistOpen,
    setIsAskAiOpen,
    setIsMissionsModalOpen
  } = useApp();

  return (
    <div className="lg:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-md border-t border-pink-200 shadow-soft-lg px-2 py-2">
      <div className="grid grid-cols-5 items-center text-center">
        
        {/* Home */}
        <button
          onClick={() => setActiveTab('home')}
          className={`flex flex-col items-center py-1 cursor-pointer ${
            activeTab === 'home' ? 'text-pink-600 font-bold' : 'text-chocolate-600 hover:text-chocolate-900'
          }`}
        >
          <Home className="w-5 h-5 mb-0.5" />
          <span className="text-[10px]">Home</span>
        </button>

        {/* Shop */}
        <button
          onClick={() => setActiveTab('shop')}
          className={`flex flex-col items-center py-1 cursor-pointer ${
            activeTab === 'shop' ? 'text-pink-600 font-bold' : 'text-chocolate-600 hover:text-chocolate-900'
          }`}
        >
          <Search className="w-5 h-5 mb-0.5" />
          <span className="text-[10px]">Shop</span>
        </button>

        {/* Floating Infinity AI */}
        <div className="flex justify-center -mt-5">
          <button
            onClick={() => setIsAskAiOpen(true)}
            className="w-12 h-12 rounded-full bg-gradient-to-tr from-pink-500 via-pink-400 to-pink-300 text-white flex items-center justify-center shadow-pink-glow border-2 border-white hover:scale-105 transition-transform cursor-pointer"
          >
            <Sparkles className="w-6 h-6 animate-pulse" />
          </button>
        </div>

        {/* Missions */}
        <button
          onClick={() => setIsMissionsModalOpen(true)}
          className={`flex flex-col items-center py-1 cursor-pointer ${
            activeTab === 'missions' ? 'text-pink-600 font-bold' : 'text-chocolate-600 hover:text-chocolate-900'
          }`}
        >
          <Target className="w-5 h-5 mb-0.5" />
          <span className="text-[10px]">Missions</span>
        </button>

        {/* Cart */}
        <button
          onClick={() => setIsCartOpen(true)}
          className="flex flex-col items-center py-1 relative text-chocolate-600 hover:text-chocolate-900 cursor-pointer"
        >
          <div className="relative">
            <ShoppingBag className="w-5 h-5 mb-0.5" />
            {cartItems.length > 0 && (
              <span className="absolute -top-1.5 -right-2 bg-pink-500 text-white text-[9px] font-extrabold w-4 h-4 rounded-full flex items-center justify-center">
                {cartItems.length}
              </span>
            )}
          </div>
          <span className="text-[10px]">Cart</span>
        </button>

      </div>
    </div>
  );
};
