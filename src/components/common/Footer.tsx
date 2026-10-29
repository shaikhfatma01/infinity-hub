import React from 'react';
import { useApp } from '../../context/AppContext';
import { Sparkles, ShieldCheck, Zap, Heart, Award, ArrowUpRight } from 'lucide-react';

export const Footer: React.FC = () => {
  const { setActiveTab, setIsAskAiOpen, setIsMissionsModalOpen, setIsSharedListModalOpen } = useApp();

  const stores = [
    'Amazon', 'Flipkart', 'Myntra', 'Meesho', 'Nykaa', 'Purplle', 
    'Ajio', 'Tata CLiQ', 'Croma', 'Reliance Digital', 'BigBasket', 'Blinkit', 'Zepto', 'IKEA', 'Decathlon'
  ];

  return (
    <footer className="bg-gradient-bg-chocolate text-cream-100 pt-16 pb-12 border-t border-chocolate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Top Feature Highlights */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 pb-12 border-b border-chocolate-800/80">
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 rounded-2xl bg-pink-500/20 border border-pink-400/30 flex items-center justify-center shrink-0">
              <Sparkles className="w-6 h-6 text-pink-300" />
            </div>
            <div>
              <h4 className="font-serif text-lg font-bold text-cream-50">AI-Powered Product Twins™</h4>
              <p className="text-xs text-cream-300 mt-1 leading-relaxed">
                Automatically identifies identical items across multiple retailers to guarantee the lowest true cost.
              </p>
            </div>
          </div>

          <div className="flex items-start gap-4">
            <div className="w-12 h-12 rounded-2xl bg-pink-500/20 border border-pink-400/30 flex items-center justify-center shrink-0">
              <ShieldCheck className="w-6 h-6 text-pink-300" />
            </div>
            <div>
              <h4 className="font-serif text-lg font-bold text-cream-50">Verified Deal Truth Engine</h4>
              <p className="text-xs text-cream-300 mt-1 leading-relaxed">
                Detects deceptive discounts by evaluating real 30-day price trends and merchant credibility.
              </p>
            </div>
          </div>

          <div className="flex items-start gap-4">
            <div className="w-12 h-12 rounded-2xl bg-pink-500/20 border border-pink-400/30 flex items-center justify-center shrink-0">
              <Zap className="w-6 h-6 text-pink-300" />
            </div>
            <div>
              <h4 className="font-serif text-lg font-bold text-cream-50">Unified Multi-Store Cart</h4>
              <p className="text-xs text-cream-300 mt-1 leading-relaxed">
                Add products from 15+ stores into one shopping workspace with 1-click cart cost optimization.
              </p>
            </div>
          </div>
        </div>

        {/* Main Footer Links */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-8 py-12 border-b border-chocolate-800/80">
          
          {/* Brand Info */}
          <div className="col-span-2">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-pink-300 flex items-center justify-center text-chocolate-950 font-serif font-bold text-xl shadow-md">
                ♾️
              </div>
              <span className="font-serif text-2xl font-bold tracking-tight text-cream-50">
                Infinity<span className="text-pink-400 font-sans">Hub</span>
              </span>
            </div>
            <p className="text-xs text-cream-300 mt-3 max-w-sm leading-relaxed">
              InfinityHub is the intelligent universal commerce platform. We bring products, real discounts, cross-store twins, and shopping missions together into one luxury interface.
            </p>
            <div className="mt-4 flex items-center gap-2">
              <span className="bg-pink-500/20 text-pink-200 text-[11px] font-semibold px-2.5 py-1 rounded-full border border-pink-400/30 inline-flex items-center gap-1.5">
                <Award className="w-3.5 h-3.5 text-pink-300" /> Hackathon Edition 2026
              </span>
            </div>
          </div>

          {/* Platform Exploration */}
          <div>
            <h5 className="font-serif text-sm font-bold text-cream-100 uppercase tracking-wider mb-3">
              Platform
            </h5>
            <ul className="space-y-2 text-xs text-cream-300">
              <li>
                <button onClick={() => setActiveTab('shop')} className="hover:text-pink-300 transition-colors">
                  Universal Shop
                </button>
              </li>
              <li>
                <button onClick={() => setActiveTab('missions')} className="hover:text-pink-300 transition-colors">
                  Shopping Missions
                </button>
              </li>
              <li>
                <button onClick={() => setActiveTab('deals')} className="hover:text-pink-300 transition-colors">
                  Real Deals Hub
                </button>
              </li>
              <li>
                <button onClick={() => setActiveTab('grocery')} className="hover:text-pink-300 transition-colors">
                  Grocery Value Engine
                </button>
              </li>
              <li>
                <button onClick={() => setIsAskAiOpen(true)} className="hover:text-pink-300 transition-colors font-medium text-pink-200">
                  ✨ Ask Infinity AI
                </button>
              </li>
            </ul>
          </div>

          {/* Unique Innovations */}
          <div>
            <h5 className="font-serif text-sm font-bold text-cream-100 uppercase tracking-wider mb-3">
              AI Engines
            </h5>
            <ul className="space-y-2 text-xs text-cream-300">
              <li>
                <button onClick={() => setIsMissionsModalOpen(true)} className="hover:text-pink-300 transition-colors">
                  🎓 College Setup ₹15k
                </button>
              </li>
              <li>
                <button onClick={() => setIsSharedListModalOpen(true)} className="hover:text-pink-300 transition-colors">
                  👨‍👩‍👧 Shared Family List
                </button>
              </li>
              <li>
                <span className="text-cream-400">Product Twin™ Recognition</span>
              </li>
              <li>
                <span className="text-cream-400">Should I Buy This Now?</span>
              </li>
              <li>
                <span className="text-cream-400">Eco Shopping Score 🌱</span>
              </li>
            </ul>
          </div>

          {/* Supported Retailers */}
          <div>
            <h5 className="font-serif text-sm font-bold text-cream-100 uppercase tracking-wider mb-3">
              Monitored Stores
            </h5>
            <div className="flex flex-wrap gap-1.5">
              {stores.slice(0, 10).map((st) => (
                <span key={st} className="text-[10px] bg-chocolate-900/80 text-cream-300 px-2 py-1 rounded border border-chocolate-700/60">
                  {st}
                </span>
              ))}
              <span className="text-[10px] text-pink-300 py-1 font-semibold">+ 5 more</span>
            </div>
          </div>

        </div>

        {/* Bottom Copyright & Disclaimer */}
        <div className="pt-8 flex flex-col md:flex-row items-center justify-between text-xs text-cream-400 gap-4">
          <p>
            © 2026 InfinityHub. Built with Baby Pink + Chocolate Brown luxury design system. All brand trademarks belong to their respective stores.
          </p>
          <div className="flex items-center gap-4 text-cream-300">
            <span className="hover:text-pink-300 cursor-pointer">Privacy Policy</span>
            <span>•</span>
            <span className="hover:text-pink-300 cursor-pointer">Terms of Service</span>
            <span>•</span>
            <span className="hover:text-pink-300 cursor-pointer">Affiliate Transparency</span>
          </div>
        </div>

      </div>
    </footer>
  );
};
