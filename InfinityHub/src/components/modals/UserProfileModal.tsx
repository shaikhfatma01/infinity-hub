import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { 
  X, 
  User as UserIcon, 
  Bell, 
  ShoppingBag, 
  Heart, 
  Sparkles, 
  Award, 
  Layers, 
  CheckCircle2,
  Trash2,
  LogIn,
  LogOut,
  KeyRound,
  Mail,
  ShieldCheck
} from 'lucide-react';

export const UserProfileModal: React.FC = () => {
  const { 
    isProfileModalOpen, 
    setIsProfileModalOpen, 
    priceAlerts, 
    removePriceAlert,
    missions,
    startMission,
    wishlist,
    currentUser,
    login,
    register,
    logout
  } = useApp();

  const [activeTab, setActiveTab] = useState<'profile' | 'alerts' | 'auth'>('profile');
  const [authMode, setAuthMode] = useState<'login' | 'register'>('login');
  const [emailInput, setEmailInput] = useState('fatma.shaikh@infinityhub.ai');
  const [passwordInput, setPasswordInput] = useState('Password123!');
  const [nameInput, setNameInput] = useState('Fatma Shaikh');
  const [authLoading, setAuthLoading] = useState(false);

  if (!isProfileModalOpen) return null;

  const handleAuthSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setAuthLoading(true);
    if (authMode === 'login') {
      const ok = await login(emailInput, passwordInput);
      if (ok) {
        setActiveTab('profile');
      }
    } else {
      const ok = await register(emailInput, passwordInput, nameInput);
      if (ok) {
        setActiveTab('profile');
      }
    }
    setAuthLoading(false);
  };

  const handleFillDemo = () => {
    setEmailInput('fatma.shaikh@infinityhub.ai');
    setPasswordInput('Password123!');
    setNameInput('Fatma Shaikh');
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-chocolate-950/60 backdrop-blur-sm flex items-center justify-center p-2 sm:p-4">
      <div className="relative bg-white rounded-3xl max-w-2xl w-full max-h-[92vh] overflow-y-auto shadow-soft-lg border border-pink-200">
        
        {/* Header */}
        <div className="sticky top-0 z-20 bg-white/95 backdrop-blur-md px-6 py-4 border-b border-pink-100 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-pink-100 text-pink-600 flex items-center justify-center">
              <UserIcon className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-serif text-lg font-bold text-chocolate-950">
                User Account & Saved Intelligence
              </h3>
              <p className="text-xs text-chocolate-600">
                Manage alerts, saved shopping missions, and preferences.
              </p>
            </div>
          </div>

          <button
            onClick={() => setIsProfileModalOpen(false)}
            className="p-2 rounded-xl text-chocolate-400 hover:text-chocolate-950 hover:bg-pink-100 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Navigation Tabs */}
        <div className="flex border-b border-pink-100 px-6 pt-3 bg-cream-50/70">
          <button
            onClick={() => setActiveTab('profile')}
            className={`pb-3 px-4 text-xs font-bold transition-all border-b-2 cursor-pointer ${
              activeTab === 'profile'
                ? 'border-chocolate-950 text-chocolate-950'
                : 'border-transparent text-chocolate-600 hover:text-chocolate-900'
            }`}
          >
            👤 Member Profile
          </button>
          <button
            onClick={() => setActiveTab('alerts')}
            className={`pb-3 px-4 text-xs font-bold transition-all border-b-2 cursor-pointer flex items-center gap-1.5 ${
              activeTab === 'alerts'
                ? 'border-chocolate-950 text-chocolate-950'
                : 'border-transparent text-chocolate-600 hover:text-chocolate-900'
            }`}
          >
            <Bell className="w-3.5 h-3.5" />
            <span>Price Alerts ({priceAlerts.length})</span>
          </button>
          {!currentUser ? (
            <button
              onClick={() => setActiveTab('auth')}
              className={`pb-3 px-4 text-xs font-bold transition-all border-b-2 cursor-pointer flex items-center gap-1.5 ${
                activeTab === 'auth'
                  ? 'border-chocolate-950 text-chocolate-950'
                  : 'border-transparent text-chocolate-600 hover:text-chocolate-900'
              }`}
            >
              <LogIn className="w-3.5 h-3.5" />
              <span>Sign In</span>
            </button>
          ) : (
            <button
              onClick={() => setActiveTab('auth')}
              className={`pb-3 px-4 text-xs font-bold transition-all border-b-2 cursor-pointer flex items-center gap-1.5 ${
                activeTab === 'auth'
                  ? 'border-chocolate-950 text-chocolate-950'
                  : 'border-transparent text-chocolate-600 hover:text-chocolate-900'
              }`}
            >
              <KeyRound className="w-3.5 h-3.5" />
              <span>Account Credentials</span>
            </button>
          )}
        </div>

        {/* Tab Contents */}
        <div className="p-6 sm:p-8 space-y-6">
          {activeTab === 'profile' && (
            <div className="space-y-6">
              
              {/* Profile Card */}
              <div className="bg-gradient-to-r from-pink-100 to-cream-100 p-6 rounded-3xl border border-pink-200 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div className="flex items-center gap-4">
                  <div className="w-16 h-16 rounded-full bg-chocolate-900 text-cream-50 flex items-center justify-center font-serif text-2xl font-bold shadow-md">
                    {currentUser?.name ? currentUser.name.charAt(0).toUpperCase() : 'F'}
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="font-serif text-xl font-bold text-chocolate-950">
                        {currentUser?.name || 'Fatma Shaikh'}
                      </h3>
                      <span className="bg-chocolate-900 text-cream-50 text-[10px] font-extrabold px-2 py-0.5 rounded-full">
                        {currentUser?.role || 'PRO MEMBER'}
                      </span>
                    </div>
                    <p className="text-xs text-chocolate-700">
                      {currentUser?.email || 'fatma.shaikh@infinityhub.ai'}
                    </p>
                    <p className="text-[11px] text-emerald-700 font-semibold mt-1">
                      🎉 Estimated Lifetime Savings: ₹14,850 across 12 orders
                    </p>
                  </div>
                </div>

                {currentUser ? (
                  <button
                    onClick={logout}
                    className="px-3.5 py-1.5 rounded-xl border border-rose-200 text-rose-700 hover:bg-rose-50 text-xs font-bold flex items-center gap-1 cursor-pointer transition-colors"
                  >
                    <LogOut className="w-3.5 h-3.5" />
                    <span>Sign Out</span>
                  </button>
                ) : (
                  <button
                    onClick={() => setActiveTab('auth')}
                    className="px-4 py-2 rounded-xl bg-chocolate-900 text-cream-50 hover:bg-chocolate-800 text-xs font-bold flex items-center gap-1.5 cursor-pointer shadow-soft"
                  >
                    <LogIn className="w-3.5 h-3.5" />
                    <span>Sign In</span>
                  </button>
                )}
              </div>

              {/* Shopping Stats */}
              <div className="grid grid-cols-3 gap-3">
                <div className="bg-cream-50 p-4 rounded-2xl border border-pink-200 text-center">
                  <span className="text-[10px] font-bold uppercase text-chocolate-500 block">Wishlist</span>
                  <span className="font-serif text-lg font-bold text-chocolate-950">{wishlist.length} Items</span>
                </div>
                <div className="bg-cream-50 p-4 rounded-2xl border border-pink-200 text-center">
                  <span className="text-[10px] font-bold uppercase text-chocolate-500 block">Active Alerts</span>
                  <span className="font-serif text-lg font-bold text-pink-600">{priceAlerts.length} Trackers</span>
                </div>
                <div className="bg-cream-50 p-4 rounded-2xl border border-pink-200 text-center">
                  <span className="text-[10px] font-bold uppercase text-chocolate-500 block">Saved Missions</span>
                  <span className="font-serif text-lg font-bold text-chocolate-950">{missions.length} Missions</span>
                </div>
              </div>

              {/* Quick Mission Shortcuts */}
              <div>
                <h4 className="font-serif text-base font-bold text-chocolate-950 mb-3">
                  Your Ready Shopping Missions
                </h4>
                <div className="space-y-2">
                  {missions.slice(0, 3).map(m => (
                    <div
                      key={m.id}
                      onClick={() => {
                        startMission(m.id);
                        setIsProfileModalOpen(false);
                      }}
                      className="p-3.5 rounded-2xl bg-white border border-pink-200 hover:bg-pink-50 transition-colors flex items-center justify-between cursor-pointer"
                    >
                      <div>
                        <h5 className="font-serif text-xs font-bold text-chocolate-950">{m.title}</h5>
                        <p className="text-[11px] text-chocolate-600">{m.tagline}</p>
                      </div>
                      <span className="font-serif text-xs font-bold text-pink-600 bg-pink-100 px-2.5 py-1 rounded-xl">
                        Target: ₹{m.targetBudget.toLocaleString('en-IN')}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

            </div>
          )}

          {activeTab === 'alerts' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h4 className="font-serif text-base font-bold text-chocolate-950">
                  Active Price Drop Trackers ({priceAlerts.length})
                </h4>
                <span className="text-xs text-chocolate-500">Auto-checks every 30 mins</span>
              </div>

              {priceAlerts.length > 0 ? (
                <div className="space-y-3">
                  {priceAlerts.map(alert => (
                    <div
                      key={alert.id}
                      className="p-4 rounded-2xl bg-cream-50 border border-pink-200 flex items-center justify-between gap-4"
                    >
                      <div className="flex items-center gap-3 min-w-0">
                        {alert.productImage && (
                          <img src={alert.productImage} alt={alert.productName} className="w-12 h-12 object-contain rounded-xl bg-white p-1 shrink-0" />
                        )}
                        <div className="min-w-0">
                          <span className="text-[10px] uppercase font-bold text-pink-600 block">{alert.store}</span>
                          <h5 className="font-serif text-xs font-bold text-chocolate-950 truncate max-w-sm">{alert.productName}</h5>
                          <div className="flex items-center gap-2 mt-0.5 text-xs">
                            <span className="text-chocolate-600">Current: ₹{alert.currentPrice}</span>
                            <span className="font-bold text-emerald-700 bg-emerald-100 px-2 py-0.2 rounded">Target: ₹{alert.targetPrice}</span>
                          </div>
                        </div>
                      </div>

                      <button
                        onClick={() => removePriceAlert(alert.id)}
                        className="p-2 rounded-xl text-chocolate-400 hover:text-rose-600 hover:bg-rose-50 cursor-pointer"
                        title="Remove alert"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="py-12 text-center text-xs text-chocolate-600">
                  No active price alerts yet. Click the bell icon on any product to set one!
                </div>
              )}
            </div>
          )}

          {activeTab === 'auth' && (
            <div className="space-y-5 max-w-md mx-auto">
              <div className="text-center space-y-1">
                <div className="w-12 h-12 rounded-2xl bg-pink-100 text-pink-600 flex items-center justify-center mx-auto mb-2">
                  <ShieldCheck className="w-6 h-6" />
                </div>
                <h4 className="font-serif text-lg font-bold text-chocolate-950">
                  {authMode === 'login' ? 'Sign In to InfinityHub' : 'Create an Account'}
                </h4>
                <p className="text-xs text-chocolate-600">
                  Sync your Infinity Cart, Product Twins, and alerts across devices.
                </p>
              </div>

              <form onSubmit={handleAuthSubmit} className="space-y-3.5">
                {authMode === 'register' && (
                  <div>
                    <label className="text-[11px] font-bold text-chocolate-800 uppercase block mb-1">
                      Full Name
                    </label>
                    <input
                      type="text"
                      value={nameInput}
                      onChange={e => setNameInput(e.target.value)}
                      required
                      placeholder="e.g. Fatma Shaikh"
                      className="w-full px-3.5 py-2.5 rounded-xl border border-pink-200 text-xs text-chocolate-950 focus:outline-none focus:border-chocolate-900 bg-cream-50"
                    />
                  </div>
                )}

                <div>
                  <label className="text-[11px] font-bold text-chocolate-800 uppercase block mb-1">
                    Email Address
                  </label>
                  <input
                    type="email"
                    value={emailInput}
                    onChange={e => setEmailInput(e.target.value)}
                    required
                    placeholder="name@infinityhub.ai"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-pink-200 text-xs text-chocolate-950 focus:outline-none focus:border-chocolate-900 bg-cream-50"
                  />
                </div>

                <div>
                  <label className="text-[11px] font-bold text-chocolate-800 uppercase block mb-1">
                    Password
                  </label>
                  <input
                    type="password"
                    value={passwordInput}
                    onChange={e => setPasswordInput(e.target.value)}
                    required
                    placeholder="••••••••"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-pink-200 text-xs text-chocolate-950 focus:outline-none focus:border-chocolate-900 bg-cream-50"
                  />
                </div>

                <button
                  type="submit"
                  disabled={authLoading}
                  className="w-full py-2.5 rounded-xl bg-chocolate-900 text-cream-50 hover:bg-chocolate-800 font-bold text-xs transition-colors cursor-pointer shadow-soft flex items-center justify-center gap-2"
                >
                  {authLoading ? (
                    <div className="w-4 h-4 border-2 border-cream-50 border-t-transparent rounded-full animate-spin"></div>
                  ) : (
                    <>
                      <LogIn className="w-4 h-4" />
                      <span>{authMode === 'login' ? 'Sign In' : 'Create Account'}</span>
                    </>
                  )}
                </button>
              </form>

              <div className="pt-2 border-t border-pink-100 flex items-center justify-between text-xs">
                <button
                  type="button"
                  onClick={handleFillDemo}
                  className="text-pink-600 font-bold hover:underline cursor-pointer"
                >
                  ⚡ Fill Demo Credentials
                </button>

                <button
                  type="button"
                  onClick={() => setAuthMode(authMode === 'login' ? 'register' : 'login')}
                  className="text-chocolate-700 hover:text-chocolate-950 font-bold cursor-pointer"
                >
                  {authMode === 'login' ? 'Need an account? Sign up' : 'Already have an account? Sign in'}
                </button>
              </div>
            </div>
          )}
        </div>

      </div>
    </div>
  );
};
