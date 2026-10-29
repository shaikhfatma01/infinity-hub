import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { 
  Sparkles, 
  ShoppingBag, 
  Heart, 
  Scale, 
  Search, 
  Compass, 
  Target, 
  Tag, 
  User, 
  Layers,
  Mic,
  Camera,
  ShoppingBasket,
  ShieldCheck
} from 'lucide-react';

export const Navbar: React.FC = () => {
  const { 
    activeTab, 
    setActiveTab, 
    cartItems, 
    cartStoreCount,
    cartTotal,
    wishlist, 
    compareList, 
    setIsCartOpen, 
    setIsWishlistOpen, 
    setIsCompareModalOpen, 
    setIsAskAiOpen,
    setIsVoiceModalOpen,
    setIsSnapShopModalOpen,
    setIsProfileModalOpen,
    setIsMissionsModalOpen,
    setIsBuildLookModalOpen,
    searchQuery,
    setSearchQuery,
    handleSearchSubmit,
    isLiveBackend,
    currentUser
  } = useApp();

  const [isSearchExpanded, setIsSearchExpanded] = useState(false);

  const navLinks = [
    { id: 'home', label: 'Home' },
    { id: 'shop', label: 'Universal Shop' },
    { id: 'missions', label: 'Shopping Missions', badge: 'Flagship' },
    { id: 'deals', label: 'Deals & Price Drops', badge: 'Real' },
    { id: 'grocery', label: 'Grocery Value Engine' },
  ];

  return (
    <header className="sticky top-0 z-40 w-full transition-all duration-300">
      {/* Top Utility Ribbon */}
      <div className="bg-gradient-to-r from-chocolate-900 via-chocolate-800 to-chocolate-950 text-cream-100 text-xs py-1.5 px-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="inline-flex items-center gap-1 bg-pink-500/20 text-pink-200 px-2 py-0.5 rounded-full text-[11px] font-medium border border-pink-400/30">
              <Sparkles className="w-3 h-3 text-pink-300 animate-pulse" />
              AI Multi-Store Engine
            </span>
            <span
              title={isLiveBackend ? 'Connected to the InfinityHub server and database' : 'Server unreachable: showing bundled demo data'}
              className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-medium border ${
                isLiveBackend ? 'bg-emerald-500/15 text-emerald-200 border-emerald-400/30' : 'bg-amber-500/15 text-amber-200 border-amber-400/30'
              }`}
            >
              <span className={`w-1.5 h-1.5 rounded-full ${isLiveBackend ? 'bg-emerald-400' : 'bg-amber-400'}`} />
              {isLiveBackend ? 'Live data' : 'Offline demo'}
            </span>
            <span className="hidden md:inline text-cream-300 font-light">
              Aggregating live prices from Amazon, Flipkart, Myntra, Nykaa, Croma & 10+ stores
            </span>
          </div>

          <div className="flex items-center gap-4 text-cream-200">
            {currentUser?.role === 'ADMIN' && (
              <>
                <button
                  onClick={() => setActiveTab('admin')}
                  aria-current={activeTab === 'admin' ? 'page' : undefined}
                  className={`inline-flex items-center gap-1 font-medium transition-colors ${activeTab === 'admin' ? 'text-pink-300' : 'hover:text-pink-300'}`}
                >
                  <ShieldCheck className="w-3.5 h-3.5" />
                  <span>Admin Panel</span>
                </button>
                <span className="hidden sm:inline text-chocolate-700">|</span>
              </>
            )}
            <button 
              onClick={() => setIsBuildLookModalOpen(true)}
              className="hover:text-pink-300 transition-colors hidden sm:inline-flex items-center gap-1 cursor-pointer"
            >
              👗 Build My Look
            </button>
            <span className="hidden sm:inline text-chocolate-700">|</span>
            <button 
              onClick={() => setIsMissionsModalOpen(true)}
              className="hover:text-pink-300 transition-colors inline-flex items-center gap-1 cursor-pointer"
            >
              🎓 College Setup Demo
            </button>
            <span className="hidden sm:inline text-chocolate-700">|</span>
            <button 
              onClick={() => setIsProfileModalOpen(true)}
              className="hover:text-pink-300 transition-colors inline-flex items-center gap-1 cursor-pointer font-medium"
            >
              <User className="w-3.5 h-3.5" />
              <span>{currentUser ? currentUser.name : 'Sign In / Profile'}</span>
            </button>
          </div>
        </div>
      </div>

      {/* Main Sticky Navbar */}
      <nav className="glass-white border-b border-pink-200/60 shadow-soft">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-20 gap-4">
            
            {/* Logo */}
            <button 
              onClick={() => { setActiveTab('home'); }}
              className="flex items-center gap-3 group text-left cursor-pointer focus:outline-none"
            >
              <div className="w-11 h-11 rounded-2xl bg-gradient-to-tr from-pink-300 via-pink-200 to-cream-100 flex items-center justify-center shadow-md shadow-pink-300/40 border border-pink-300/60 group-hover:scale-105 transition-transform">
                <span className="text-2xl font-serif text-chocolate-900 leading-none">♾️</span>
              </div>
              <div>
                <div className="flex items-center gap-1.5">
                  <span className="font-serif text-2xl font-bold tracking-tight text-chocolate-950">
                    Infinity<span className="text-pink-500 font-sans font-extrabold">Hub</span>
                  </span>
                  <span className="bg-pink-100 text-chocolate-800 text-[10px] uppercase font-bold tracking-wider px-1.5 py-0.5 rounded border border-pink-300/60">
                    AI
                  </span>
                </div>
                <p className="text-[11px] text-chocolate-600 font-medium tracking-wide hidden sm:block">
                  One Search. Every Store. Best Deal.
                </p>
              </div>
            </button>

            {/* Desktop Nav Links */}
            <div className="hidden lg:flex items-center space-x-1">
              {navLinks.map((link) => {
                const isActive = activeTab === link.id;
                return (
                  <button
                    key={link.id}
                    onClick={() => setActiveTab(link.id)}
                    className={`relative px-3.5 py-2 rounded-xl text-sm font-semibold transition-all cursor-pointer ${
                      isActive 
                        ? 'text-chocolate-950 bg-pink-100/90 shadow-sm border border-pink-300/50' 
                        : 'text-chocolate-700 hover:text-chocolate-950 hover:bg-pink-50/70'
                    }`}
                  >
                    {link.label}
                    {link.badge && (
                      <span className="ml-1.5 text-[10px] font-extrabold bg-gradient-to-r from-pink-500 to-pink-600 text-white px-1.5 py-0.5 rounded-full uppercase tracking-wider">
                        {link.badge}
                      </span>
                    )}
                  </button>
                );
              })}
            </div>

            {/* Right Action Icons & AI CTA */}
            <div className="flex items-center gap-2 sm:gap-3">
              
              {/* Quick AI Search trigger button for mobile / tablet */}
              <div className="hidden md:flex items-center bg-cream-100 rounded-full border border-pink-200/80 px-3 py-1.5 w-64 focus-within:ring-2 focus-within:ring-pink-300 focus-within:w-80 transition-all">
                <Search className="w-4 h-4 text-chocolate-400 mr-2 shrink-0" />
                <input
                  type="text"
                  placeholder="Search products & stores..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleSearchSubmit()}
                  className="bg-transparent text-xs text-chocolate-900 placeholder:text-chocolate-400 focus:outline-none w-full"
                />
                <button 
                  onClick={() => setIsVoiceModalOpen(true)}
                  title="Voice Search"
                  className="text-chocolate-400 hover:text-chocolate-700 p-0.5 rounded ml-1"
                >
                  <Mic className="w-3.5 h-3.5" />
                </button>
                <button 
                  onClick={() => setIsSnapShopModalOpen(true)}
                  title="Snap & Shop"
                  className="text-chocolate-400 hover:text-chocolate-700 p-0.5 rounded"
                >
                  <Camera className="w-3.5 h-3.5" />
                </button>
              </div>

              {/* Ask Infinity AI Button */}
              <button
                onClick={() => setIsAskAiOpen(true)}
                className="relative inline-flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs sm:text-sm font-bold text-chocolate-950 bg-gradient-to-r from-pink-200 via-pink-100 to-cream-100 hover:from-pink-300 hover:to-pink-200 border border-pink-300 shadow-sm hover:shadow-pink-glow transition-all cursor-pointer group"
              >
                <Sparkles className="w-4 h-4 text-pink-500 group-hover:rotate-12 transition-transform" />
                <span className="hidden sm:inline">Ask</span> Infinity AI
                <span className="flex h-2 w-2 relative">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-pink-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-pink-500"></span>
                </span>
              </button>

              {/* Compare Matrix Trigger */}
              <button
                onClick={() => setIsCompareModalOpen(true)}
                title="Compare Products"
                className="relative p-2 rounded-xl text-chocolate-800 hover:bg-pink-100/70 border border-transparent hover:border-pink-200 transition-all cursor-pointer"
              >
                <Scale className="w-5 h-5" />
                {compareList.length > 0 && (
                  <span className="absolute -top-1 -right-1 bg-chocolate-900 text-cream-50 text-[10px] font-bold w-5 h-5 rounded-full flex items-center justify-center border-2 border-white">
                    {compareList.length}
                  </span>
                )}
              </button>

              {/* Wishlist Trigger */}
              <button
                onClick={() => setIsWishlistOpen(true)}
                title="Wishlist"
                className="relative p-2 rounded-xl text-chocolate-800 hover:bg-pink-100/70 border border-transparent hover:border-pink-200 transition-all cursor-pointer"
              >
                <Heart className="w-5 h-5" />
                {wishlist.length > 0 && (
                  <span className="absolute -top-1 -right-1 bg-pink-500 text-white text-[10px] font-bold w-5 h-5 rounded-full flex items-center justify-center border-2 border-white">
                    {wishlist.length}
                  </span>
                )}
              </button>

              {/* Infinity Cart Trigger */}
              <button
                onClick={() => setIsCartOpen(true)}
                title="Infinity Cart"
                className="relative flex items-center gap-2 pl-3 pr-4 py-2 rounded-xl bg-chocolate-900 text-cream-50 hover:bg-chocolate-800 shadow-md transition-all cursor-pointer group"
              >
                <div className="relative">
                  <ShoppingBag className="w-5 h-5 text-pink-300 group-hover:scale-110 transition-transform" />
                  {cartItems.length > 0 && (
                    <span className="absolute -top-2 -right-2 bg-pink-500 text-white text-[10px] font-extrabold w-4 h-4 rounded-full flex items-center justify-center border border-chocolate-900">
                      {cartItems.length}
                    </span>
                  )}
                </div>
                <div className="text-left hidden sm:block">
                  <div className="text-[10px] text-pink-200 uppercase font-bold tracking-wider leading-none">
                    {cartStoreCount} {cartStoreCount === 1 ? 'Store' : 'Stores'}
                  </div>
                  <div className="text-xs font-extrabold text-cream-100 leading-tight">
                    ₹{cartTotal.toLocaleString('en-IN')}
                  </div>
                </div>
              </button>

            </div>
          </div>
        </div>
      </nav>
    </header>
  );
};
