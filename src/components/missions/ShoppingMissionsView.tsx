import React from 'react';
import { useApp } from '../../context/AppContext';
import { 
  GraduationCap, 
  Home, 
  Laptop, 
  Sparkles, 
  Dumbbell, 
  Sparkle, 
  ArrowRight, 
  CheckCircle2, 
  ShoppingBag,
  DollarSign
} from 'lucide-react';

export const ShoppingMissionsView: React.FC = () => {
  const { missions, startMission } = useApp();

  // Flagship numbers come from the mission data itself so they can never drift from catalogue prices.
  const flagship = missions.find(m => m.id === 'mission-college-setup');
  const flagshipItems = flagship?.items ?? [];
  const flagshipTotal = flagshipItems.reduce((sum, i) => sum + i.selectedProduct.finalEstimatedPrice, 0);
  const flagshipBudget = flagship?.targetBudget ?? 15000;
  const flagshipRemaining = flagshipBudget - flagshipTotal;

  return (
    <div className="py-10 bg-cream-50 min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="mb-12 text-center max-w-3xl mx-auto">
          <div className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-pink-200/80 text-chocolate-950 text-xs font-bold uppercase tracking-wider mb-3">
            <GraduationCap className="w-3.5 h-3.5 text-pink-600" />
            Feature 18 & 47 • Goal-Oriented AI Commerce
          </div>
          <h1 className="font-serif text-3xl sm:text-4xl font-bold text-chocolate-950">
            Shopping Missions Hub
          </h1>
          <p className="mt-3 text-sm sm:text-base text-chocolate-700 font-light leading-relaxed">
            Instead of searching 10 different products across 5 apps, tell InfinityHub what you're trying to accomplish and your target budget.
          </p>
        </div>

        {/* Flagship ₹15,000 College Mission Hero Showcase */}
        <div className="bg-gradient-to-r from-pink-200/80 via-pink-100 to-cream-100 rounded-3xl p-8 border-2 border-pink-300 shadow-soft-lg mb-14 relative overflow-hidden">
          <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-8">
            <div className="max-w-2xl">
              <span className="bg-chocolate-900 text-pink-200 text-xs font-extrabold uppercase px-3 py-1 rounded-full inline-block mb-3">
                ⭐ Flagship Hackathon Interactive Demo
              </span>
              <h2 className="font-serif text-2xl sm:text-3xl font-bold text-chocolate-950">
                🎓 College Setup Mission (Budget: ₹15,000)
              </h2>
              <p className="text-xs sm:text-sm text-chocolate-800 mt-2 leading-relaxed">
                "I am going to college and have ₹15,000. Help me buy everything I need."
              </p>
              <div className="mt-4 flex flex-wrap gap-2 text-xs text-chocolate-900 font-medium">
                {flagshipItems.map(item => (
                  <span key={item.id} className="bg-white/80 px-2.5 py-1 rounded-lg border border-pink-200">
                    {item.name} (₹{item.selectedProduct.finalEstimatedPrice.toLocaleString('en-IN')})
                  </span>
                ))}
              </div>
            </div>

            <div className="bg-white p-6 rounded-3xl border border-pink-200 shadow-soft w-full lg:w-80 shrink-0 text-center space-y-3">
              <div className="text-left space-y-1">
                <div className="flex justify-between text-xs text-chocolate-600">
                  <span>Target Budget:</span>
                  <span className="font-bold text-chocolate-950">₹{flagshipBudget.toLocaleString('en-IN')}</span>
                </div>
                <div className="flex justify-between text-xs text-chocolate-600">
                  <span>Calculated Total:</span>
                  <span className="font-bold text-chocolate-950">₹{flagshipTotal.toLocaleString('en-IN')}</span>
                </div>
                <div className={`flex justify-between text-xs font-bold ${flagshipRemaining >= 0 ? 'text-emerald-700' : 'text-rose-700'}`}>
                  <span>{flagshipRemaining >= 0 ? 'Remaining Budget:' : 'Over Budget By:'}</span>
                  <span>₹{Math.abs(flagshipRemaining).toLocaleString('en-IN')}</span>
                </div>
              </div>

              <button
                onClick={() => startMission('mission-college-setup')}
                className="w-full py-3 rounded-2xl bg-chocolate-900 hover:bg-chocolate-800 text-cream-50 text-xs sm:text-sm font-bold shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer"
              >
                <Sparkles className="w-4 h-4 text-pink-300" />
                <span>✨ Launch College Demo</span>
              </button>
            </div>
          </div>
        </div>

        {/* All Missions Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {missions.map(mission => (
            <div
              key={mission.id}
              className="bg-white rounded-3xl p-6 border border-pink-200 shadow-soft hover:shadow-soft-lg transition-all flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between mb-3">
                  <span className="text-[10px] font-extrabold uppercase tracking-wider text-pink-600 bg-pink-50 px-2.5 py-1 rounded-full border border-pink-200">
                    {mission.category}
                  </span>
                  <span className="font-serif text-sm font-bold text-chocolate-950">
                    Max ₹{mission.targetBudget.toLocaleString('en-IN')}
                  </span>
                </div>

                <h3 className="font-serif text-xl font-bold text-chocolate-950 mb-1">
                  {mission.title}
                </h3>
                <p className="text-xs text-chocolate-600 font-medium mb-3">
                  {mission.tagline}
                </p>
                <p className="text-xs text-chocolate-700 font-light leading-relaxed mb-4">
                  {mission.description}
                </p>

                <div className="space-y-1.5 pt-3 border-t border-pink-100">
                  <span className="text-[10px] font-bold text-chocolate-500 uppercase tracking-wider block">Included Gear:</span>
                  {mission.items.map(it => (
                    <div key={it.id} className="text-xs text-chocolate-800 flex items-center gap-1.5">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                      <span className="truncate">{it.name}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="mt-6 pt-4 border-t border-pink-100">
                <button
                  onClick={() => startMission(mission.id)}
                  className="w-full py-2.5 rounded-xl bg-pink-100 hover:bg-pink-200 text-chocolate-950 text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer"
                >
                  <span>Explore & Optimize Mission</span>
                  <ArrowRight className="w-3.5 h-3.5 text-pink-600" />
                </button>
              </div>
            </div>
          ))}
        </div>

      </div>
    </div>
  );
};
