import React, { useState, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import { Search, Sparkles, Mic, Camera, ArrowRight, CheckCircle2, TrendingUp, ShieldCheck } from 'lucide-react';

export const HeroSection: React.FC = () => {
  const { 
    searchQuery, 
    setSearchQuery, 
    handleSearchSubmit, 
    setIsVoiceModalOpen, 
    setIsSnapShopModalOpen,
    setIsAskAiOpen,
    setActiveTab
  } = useApp();

  const exampleQueries = [
    'Black purse under ₹1000',
    'Laptop under ₹60000 for coding',
    'Best blanket under ₹1500',
    'Running shoes under ₹3000',
    'Skincare under ₹1000',
    'Build my college setup under ₹15000',
    'Daawat basmati rice vs fortune oil'
  ];

  const [placeholderIndex, setPlaceholderIndex] = useState(0);
  const [displayedPlaceholder, setDisplayedPlaceholder] = useState('');
  const [isTyping, setIsTyping] = useState(true);

  // Typewriter effect for search bar
  useEffect(() => {
    let timeout: ReturnType<typeof setTimeout>;
    const currentFullText = exampleQueries[placeholderIndex];

    if (isTyping) {
      if (displayedPlaceholder.length < currentFullText.length) {
        timeout = setTimeout(() => {
          setDisplayedPlaceholder(currentFullText.slice(0, displayedPlaceholder.length + 1));
        }, 55);
      } else {
        timeout = setTimeout(() => {
          setIsTyping(false);
        }, 2200);
      }
    } else {
      if (displayedPlaceholder.length > 0) {
        timeout = setTimeout(() => {
          setDisplayedPlaceholder(displayedPlaceholder.slice(0, -1));
        }, 25);
      } else {
        setIsTyping(true);
        setPlaceholderIndex((prev) => (prev + 1) % exampleQueries.length);
      }
    }

    return () => clearTimeout(timeout);
  }, [displayedPlaceholder, isTyping, placeholderIndex]);

  const popularChips = [
    { label: 'Purses', query: 'black purse under 1000' },
    { label: 'Laptops', query: 'laptop under 60000 16gb ram' },
    { label: 'Shoes', query: 'running shoes under 5000' },
    { label: 'Skincare', query: 'skincare sunscreen under 1000' },
    { label: 'Groceries', query: 'grocery rice and oil' },
    { label: 'Blankets', query: 'winter blanket under 1500' },
    { label: 'Electronics', query: 'noise cancelling headphones' }
  ];

  const stores = [
    'Amazon', 'Flipkart', 'Myntra', 'Nykaa', 'Croma', 'Ajio', 'BigBasket', 'Zepto', 'Blinkit', 'Tata CLiQ', 'Meesho', 'IKEA'
  ];

  return (
    <section className="relative overflow-hidden bg-gradient-bg-hero pt-12 pb-20 lg:pt-16 lg:pb-28">
      
      {/* Background Decorative Glows */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[700px] h-[400px] bg-pink-200/50 rounded-full blur-3xl pointer-events-none -z-10" />
      <div className="absolute top-20 right-10 w-[300px] h-[300px] bg-pink-300/30 rounded-full blur-2xl pointer-events-none -z-10" />
      
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        
        {/* Top AI Badge */}
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/90 border border-pink-300/80 shadow-soft mb-6 hover:scale-105 transition-transform">
          <span className="flex h-2 w-2 relative">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-pink-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-pink-500"></span>
          </span>
          <span className="text-xs font-bold text-chocolate-900 tracking-wide uppercase">
            Universal AI Shopping Companion
          </span>
          <span className="text-pink-300">•</span>
          <span className="text-xs font-medium text-chocolate-700">15+ Stores Indexed</span>
        </div>

        {/* Main Headings */}
        <h1 className="font-serif text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-chocolate-950 max-w-4xl mx-auto leading-[1.15]">
          Search Everything.{' '}
          <span className="relative whitespace-nowrap">
            <span className="gradient-text-pink italic font-serif">Shop Smarter.</span>
            <svg className="absolute -bottom-2 left-0 w-full h-3 text-pink-300 -z-10" viewBox="0 0 100 20" preserveAspectRatio="none">
              <path d="M0,15 Q50,0 100,15" stroke="currentColor" strokeWidth="4" fill="none" />
            </svg>
          </span>
        </h1>

        {/* Supporting Subtitle */}
        <p className="mt-5 text-base sm:text-lg text-chocolate-700 max-w-2xl mx-auto font-light leading-relaxed">
          InfinityHub compares products, real prices, ratings and hidden discounts across Amazon, Flipkart, Myntra, Nykaa, and 10+ stores so you don't have to.
        </p>

        {/* Large Intelligent Search Interface */}
        <div className="mt-10 max-w-3xl mx-auto">
          <div className="glass-white p-2.5 sm:p-3 rounded-3xl shadow-soft-lg border-2 border-pink-300/80 transition-all focus-within:border-pink-500 focus-within:shadow-pink-glow">
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2">
              
              {/* Input Area */}
              <div className="flex-1 flex items-center px-3 py-2">
                <Search className="w-6 h-6 text-chocolate-400 mr-3 shrink-0" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleSearchSubmit()}
                  placeholder={displayedPlaceholder ? `e.g. "${displayedPlaceholder}"` : 'What are you looking for today?'}
                  className="w-full bg-transparent text-sm sm:text-base text-chocolate-950 placeholder:text-chocolate-400/90 font-medium focus:outline-none"
                />
              </div>

              {/* Action Buttons Inside Search Bar */}
              <div className="flex items-center justify-between sm:justify-end gap-1.5 pt-2 sm:pt-0 border-t sm:border-t-0 border-pink-100 px-2 sm:px-0">
                
                {/* Voice Search Button */}
                <button
                  type="button"
                  onClick={() => setIsVoiceModalOpen(true)}
                  title="Voice Search"
                  className="p-2.5 rounded-2xl text-chocolate-700 hover:text-chocolate-950 hover:bg-pink-100 transition-all cursor-pointer flex items-center gap-1.5 text-xs font-semibold"
                >
                  <Mic className="w-4 h-4 text-pink-600" />
                  <span className="hidden md:inline">Voice</span>
                </button>

                {/* Snap & Shop Button */}
                <button
                  type="button"
                  onClick={() => setIsSnapShopModalOpen(true)}
                  title="Search by Image"
                  className="p-2.5 rounded-2xl text-chocolate-700 hover:text-chocolate-950 hover:bg-pink-100 transition-all cursor-pointer flex items-center gap-1.5 text-xs font-semibold"
                >
                  <Camera className="w-4 h-4 text-pink-600" />
                  <span className="hidden md:inline">Image</span>
                </button>

                {/* Primary AI Search Submit Button */}
                <button
                  type="button"
                  onClick={() => handleSearchSubmit()}
                  className="px-5 py-3 rounded-2xl bg-chocolate-900 hover:bg-chocolate-800 text-cream-50 font-bold text-xs sm:text-sm shadow-md hover:shadow-choc-glow transition-all flex items-center gap-2 cursor-pointer group"
                >
                  <Sparkles className="w-4 h-4 text-pink-300 group-hover:rotate-12 transition-transform" />
                  <span>Search with Infinity AI</span>
                </button>

              </div>

            </div>
          </div>

          {/* Popular Search Chips */}
          <div className="mt-4 flex items-center justify-center flex-wrap gap-2 text-xs">
            <span className="text-chocolate-600 font-semibold flex items-center gap-1">
              <TrendingUp className="w-3.5 h-3.5 text-pink-500" /> Popular:
            </span>
            {popularChips.map((chip) => (
              <button
                key={chip.label}
                onClick={() => handleSearchSubmit(chip.query)}
                className="bg-white/80 hover:bg-pink-100 text-chocolate-800 hover:text-chocolate-950 px-3 py-1 rounded-full border border-pink-200/80 font-medium transition-all cursor-pointer hover:border-pink-300"
              >
                {chip.label}
              </button>
            ))}
          </div>
        </div>

        {/* Live Monitored Retailers Strip */}
        <div className="mt-14 pt-8 border-t border-pink-200/50 max-w-4xl mx-auto">
          <p className="text-[11px] uppercase font-bold tracking-widest text-chocolate-500 mb-4">
            Unified Intelligent Aggregation Across Leading Stores
          </p>
          <div className="flex flex-wrap items-center justify-center gap-3 sm:gap-6">
            {stores.map((st) => (
              <div 
                key={st}
                onClick={() => {
                  setSearchQuery(st);
                  handleSearchSubmit(st);
                }}
                className="flex items-center gap-1.5 bg-white/70 hover:bg-white px-3 py-1.5 rounded-xl border border-pink-200/60 shadow-xs text-xs font-semibold text-chocolate-800 hover:text-chocolate-950 transition-all cursor-pointer hover:scale-105"
              >
                <CheckCircle2 className="w-3.5 h-3.5 text-pink-500" />
                <span>{st}</span>
              </div>
            ))}
          </div>
        </div>

      </div>
    </section>
  );
};
