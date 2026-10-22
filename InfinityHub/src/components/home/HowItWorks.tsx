import React from 'react';
import { useApp } from '../../context/AppContext';
import { 
  Search, 
  BrainCircuit, 
  Compass, 
  Scale, 
  Layers, 
  SearchCheck, 
  Award, 
  ShoppingBag, 
  TrendingDown, 
  ExternalLink,
  Sparkles
} from 'lucide-react';

export const HowItWorks: React.FC = () => {
  const { setActiveTab } = useApp();

  const steps = [
    { num: '01', title: 'Search', desc: 'Tell InfinityHub what you need in plain natural language.', icon: Search },
    { num: '02', title: 'AI Understands', desc: 'Extracts constraints: budget, specs, ratings & purpose.', icon: BrainCircuit },
    { num: '03', title: 'Discover', desc: 'Queries live catalog across 15+ monitored top stores.', icon: Compass },
    { num: '04', title: 'Compare', desc: 'Calculates true estimated final cost (price + shipping).', icon: Scale },
    { num: '05', title: 'Product Twin™', desc: 'Aggregates identical items into unified comparison cards.', icon: Layers },
    { num: '06', title: 'Deal Analysis', desc: 'Evaluates 30-day historical prices to catch fake sales.', icon: SearchCheck },
    { num: '07', title: 'AI Verdict', desc: 'Recommends Buy Now 🟢 vs Wait 🟡 with clear reasons.', icon: Award },
    { num: '08', title: 'Infinity Cart', desc: 'Groups multi-store items into one unified workspace.', icon: ShoppingBag },
    { num: '09', title: 'Optimize', desc: '1-click basket optimizer to eliminate excess costs.', icon: TrendingDown },
    { num: '10', title: 'Shop & Save', desc: 'Proceed smoothly with verified deals and guaranteed savings.', icon: ExternalLink }
  ];

  return (
    <section className="py-20 bg-cream-100/60 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-pink-200/80 text-chocolate-950 text-xs font-bold uppercase tracking-wider mb-3">
            <Sparkles className="w-3.5 h-3.5 text-pink-600" />
            Seamless Workflow
          </div>
          <h2 className="font-serif text-3xl sm:text-4xl font-bold text-chocolate-950 tracking-tight">
            How InfinityHub Works
          </h2>
          <p className="mt-3 text-sm sm:text-base text-chocolate-700 font-light leading-relaxed">
            A 10-step intelligent pipeline transforming how you discover, verify, and purchase products online.
          </p>
        </div>

        {/* 10-Step Interactive Pipeline Grid */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
          {steps.map((step, idx) => {
            const Icon = step.icon;
            return (
              <div 
                key={step.num}
                className="bg-white rounded-2xl p-4 sm:p-5 border border-pink-200 shadow-soft hover:shadow-soft-lg hover:-translate-y-1 transition-all duration-300 flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <span className="font-serif text-lg font-bold text-pink-500">
                      {step.num}
                    </span>
                    <div className="w-8 h-8 rounded-xl bg-pink-100/80 text-chocolate-900 flex items-center justify-center">
                      <Icon className="w-4 h-4" />
                    </div>
                  </div>
                  <h4 className="font-serif text-sm font-bold text-chocolate-950 mb-1">
                    {step.title}
                  </h4>
                  <p className="text-[11px] text-chocolate-700 leading-relaxed">
                    {step.desc}
                  </p>
                </div>

                <div className="mt-3 pt-2 border-t border-pink-100 flex items-center text-[10px] text-pink-600 font-bold uppercase tracking-wider">
                  Step {idx + 1} of 10
                </div>
              </div>
            );
          })}
        </div>

        {/* Bottom CTA */}
        <div className="mt-12 text-center">
          <button
            onClick={() => setActiveTab('shop')}
            className="px-7 py-3 rounded-2xl bg-chocolate-900 hover:bg-chocolate-800 text-cream-50 text-sm font-bold shadow-md hover:shadow-choc-glow transition-all cursor-pointer inline-flex items-center gap-2"
          >
            <Search className="w-4 h-4 text-pink-300" />
            <span>Start Searching Across All Stores</span>
          </button>
        </div>

      </div>
    </section>
  );
};
