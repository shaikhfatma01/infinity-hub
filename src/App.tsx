import React from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { Navbar } from './components/common/Navbar';
import { Footer } from './components/common/Footer';
import { MobileBottomNav } from './components/common/MobileBottomNav';
import { ToastContainer } from './components/common/ToastContainer';

// Home Components
import { HeroSection } from './components/home/HeroSection';
import { TheInfinityDifference } from './components/home/TheInfinityDifference';
import { HackathonUspSection } from './components/home/HackathonUspSection';
import { HowItWorks } from './components/home/HowItWorks';
import { DealsCarousel } from './components/home/DealsCarousel';
import { SmartBudgetExplorer } from './components/home/SmartBudgetExplorer';

// Catalog & Specialized Views
import { UniversalCatalog } from './components/catalog/UniversalCatalog';
import { ShoppingMissionsView } from './components/missions/ShoppingMissionsView';
import { DealsPageView } from './components/deals/DealsPageView';
import { GroceryValueEngineView } from './components/grocery/GroceryValueEngineView';

// Modals & Drawers
import { ProductDetailModal } from './components/modals/ProductDetailModal';
import { SideBySideComparisonModal } from './components/modals/SideBySideComparisonModal';
import { ShoppingMissionsModal } from './components/modals/ShoppingMissionsModal';
import { BuildMyLookModal } from './components/modals/BuildMyLookModal';
import { AskInfinityAiModal } from './components/modals/AskInfinityAiModal';
import { SnapAndShopModal } from './components/modals/SnapAndShopModal';
import { VoiceSearchModal } from './components/modals/VoiceSearchModal';
import { InfinityCartDrawer } from './components/modals/InfinityCartDrawer';
import { WishlistModal } from './components/modals/WishlistModal';
import { PriceAlertModal } from './components/modals/PriceAlertModal';
import { SharedShoppingListModal } from './components/modals/SharedShoppingListModal';
import { UserProfileModal } from './components/modals/UserProfileModal';
import { AdminUsersPage } from './components/admin/AdminUsersPage';

const MainContent: React.FC = () => {
  const { activeTab } = useApp();

  return (
    <main className="min-h-screen">
      {activeTab === 'home' && (
        <>
          <HeroSection />
          <TheInfinityDifference />
          <HackathonUspSection />
          <DealsCarousel />
          <SmartBudgetExplorer />
          <HowItWorks />
        </>
      )}

      {activeTab === 'shop' && <UniversalCatalog />}
      {activeTab === 'missions' && <ShoppingMissionsView />}
      {activeTab === 'deals' && <DealsPageView />}
      {activeTab === 'grocery' && <GroceryValueEngineView />}
      {activeTab === 'admin' && <AdminUsersPage />}

      {/* Global Modals & Drawers */}
      <ProductDetailModal />
      <SideBySideComparisonModal />
      <ShoppingMissionsModal />
      <BuildMyLookModal />
      <AskInfinityAiModal />
      <SnapAndShopModal />
      <VoiceSearchModal />
      <InfinityCartDrawer />
      <WishlistModal />
      <PriceAlertModal />
      <SharedShoppingListModal />
      <UserProfileModal />

      <ToastContainer />
      <MobileBottomNav />
    </main>
  );
};

export function App() {
  return (
    <AppProvider>
      <div className="flex flex-col min-h-screen bg-cream-50 text-chocolate-950 font-sans selection:bg-pink-300 selection:text-chocolate-950">
        <Navbar />
        <MainContent />
        <Footer />
      </div>
    </AppProvider>
  );
}

export default App;
