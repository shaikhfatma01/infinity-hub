import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { XCircle, CheckCircle2, ArrowRight, Sparkles, Zap, DollarSign, Clock, ShieldCheck, ShoppingBag } from 'lucide-react';

export const HackathonUspSection: React.FC = () => {
  const { setActiveTab, setIsMissionsModalOpen, setIsAskAiOpen } = useApp();
  const [activeWorkflowTab, setActiveWorkflowTab] = useState<'comparison' | 'flow'>('comparison');

  const traditionalSteps = [
    { title: 'Search Store 1 (Amazon)', desc: 'Open app, search, browse 10 tabs' },
    { title: 'Search Store 2 (Flipkart)', desc: 'Re-enter search, remember prices' },
    { title: 'Search Store 3 (Myntra/Croma)', desc: 'Check if discount includes shipping' },
    { title: 'Manual Mental Comparison', desc: 'Is the 40% discount fake or real?' },
    { title: 'Separate Fragmented Carts', desc: 'Pay 3 shipping fees, manage 3 deliveries' }
  ];

  const infinitySteps = [
    { title: 'One Natural AI Search', desc: 'Say what you want in plain English' },
    { title: 'Automatic Product Twin™ Match', desc: 'Identifies identical items across 15+ stores' },
    { title: 'Price & Deal Truth Verification', desc: '30-day historical discount check' },
    { title: 'Unified Infinity Cart', desc: '1-click Smart Cart cost optimizer' },
    { title: 'Guaranteed Best Value', desc: 'Average savings of ₹1,200 per multi-item order' }
  ];

  return (
    <section className="py-20 bg-gradient-to-b from-cream-50 via-pink-50/50 to-cream-50 border-y border-pink-200/60">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-14">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-chocolate-900 text-pink-200 text-xs font-bold uppercase tracking-wider mb-3">
            <Zap className="w-3.5 h-3.5 text-pink-400" />
            Hackathon Innovation USP
          </div>
          <h2 className="font-serif text-3xl sm:text-4xl font-bold text-chocolate-950 tracking-tight">
            Why InfinityHub? The Paradigm Shift in E-Commerce
          </h2>
          <p className="mt-3 text-sm sm:text-base text-chocolate-700 font-light leading-relaxed">
            Comparing the old, exhausting way of hunting for discounts with our AI-powered universal aggregation architecture.
          </p>
        </div>

        {/* Side-by-Side Interactive Comparison Cards */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 max-w-5xl mx-auto">
          
          {/* Old Traditional Shopping */}
          <div className="rounded-3xl p-8 bg-white border border-rose-200/80 shadow-soft relative overflow-hidden">
            <div className="flex items-center gap-3 mb-6 pb-4 border-b border-rose-100">
              <div className="w-10 h-10 rounded-2xl bg-rose-100 text-rose-600 flex items-center justify-center font-bold">
                <XCircle className="w-6 h-6" />
              </div>
              <div>
                <h3 className="font-serif text-lg font-bold text-chocolate-950">Traditional Shopping</h3>
                <p className="text-xs text-rose-600 font-semibold">Fragmented, Deceptive & Time-Consuming</p>
              </div>
            </div>

            <div className="space-y-4">
              {traditionalSteps.map((step, idx) => (
                <div key={idx} className="flex items-start gap-3 p-3 rounded-2xl bg-rose-50/50 border border-rose-100">
                  <div className="w-6 h-6 rounded-full bg-rose-200 text-rose-700 flex items-center justify-center text-xs font-extrabold shrink-0 mt-0.5">
                    {idx + 1}
                  </div>
                  <div>
                    <h5 className="text-xs font-bold text-chocolate-900">{step.title}</h5>
                    <p className="text-[11px] text-chocolate-600 mt-0.5">{step.desc}</p>
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-6 pt-4 border-t border-rose-100 text-center">
              <span className="text-xs text-rose-700 font-medium inline-flex items-center gap-1">
                ⏱️ Takes 45+ minutes • High chance of overpaying on shipping
              </span>
            </div>
          </div>

          {/* InfinityHub AI Experience */}
          <div className="rounded-3xl p-8 bg-gradient-to-br from-pink-100/90 via-cream-50 to-pink-50 border-2 border-pink-300 shadow-soft-lg relative overflow-hidden">
            
            {/* Top Badge */}
            <div className="absolute top-4 right-4 bg-chocolate-900 text-pink-200 text-[10px] uppercase tracking-wider font-extrabold px-2.5 py-1 rounded-full shadow-xs">
              AI Advantage
            </div>

            <div className="flex items-center gap-3 mb-6 pb-4 border-b border-pink-200/80">
              <div className="w-10 h-10 rounded-2xl bg-pink-300 text-chocolate-950 flex items-center justify-center font-bold shadow-sm">
                <CheckCircle2 className="w-6 h-6" />
              </div>
              <div>
                <h3 className="font-serif text-lg font-bold text-chocolate-950">InfinityHub Intelligence</h3>
                <p className="text-xs text-pink-600 font-semibold">One Search • Product Twins • Best Deal</p>
              </div>
            </div>

            <div className="space-y-4">
              {infinitySteps.map((step, idx) => (
                <div key={idx} className="flex items-start gap-3 p-3 rounded-2xl bg-white/90 border border-pink-200/90 shadow-xs">
                  <div className="w-6 h-6 rounded-full bg-pink-500 text-white flex items-center justify-center text-xs font-extrabold shrink-0 mt-0.5">
                    ✓
                  </div>
                  <div>
                    <h5 className="text-xs font-bold text-chocolate-950">{step.title}</h5>
                    <p className="text-[11px] text-chocolate-700 mt-0.5">{step.desc}</p>
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-6 pt-4 border-t border-pink-200/80 flex items-center justify-between">
              <span className="text-xs font-bold text-emerald-700 inline-flex items-center gap-1">
                <Sparkles className="w-3.5 h-3.5" /> Instant 2-second cross-store scan
              </span>
              <button
                onClick={() => setIsAskAiOpen(true)}
                className="text-xs font-bold text-chocolate-900 hover:text-pink-600 inline-flex items-center gap-1 cursor-pointer"
              >
                <span>Try Infinity AI</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>

          </div>

        </div>

      </div>
    </section>
  );
};
