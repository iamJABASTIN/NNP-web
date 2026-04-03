import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import { useMenuPage } from '../hooks/useMenuPage';
import { useOrderTracking } from '../hooks/useOrderTracking';
import SidebarNav from '../components/Navigation/SidebarNav';
import BottomNav from '../components/Navigation/BottomNav';
import OrderSuccessModal from '../components/Menu/OrderSuccessModal';
import CartBar from '../components/Menu/CartBar';
import MenuView from '../sections/Menu/MenuView';
import OrdersView from '../sections/Menu/OrdersView';
import CheckInModal from '../components/Menu/CheckInModal';
import ProfileView from '../sections/Menu/ProfileView';

const MenuPage = () => {
  const { tableId } = useParams();
  const [activeTab, setActiveTab] = useState('menu');
  const [showSuccess, setShowSuccess] = useState(false);
  const [lastOrder, setLastOrder] = useState(null);

  const {
    categories, items, loading, cart, addToCart, removeFromCart,
    searchTerm, setSearchTerm, selectedCategory, setSelectedCategory,
    vegFilter, setVegFilter, showCheckIn, setShowCheckIn,
    nickname, setNickname, mobile, setMobile, orderType, setOrderType,
    manualTableName, setManualTableName, sessionCode, setSessionCode,
    sessionLoading, handleCheckoutConfirm
  } = useMenuPage(tableId);

  const { activeOrderId, orderStatus, trackNewOrder } = useOrderTracking();

  const onOrderSuccess = (order, total) => {
    setLastOrder({ ...order, total });
    setShowSuccess(true);
    trackNewOrder(order.id);
  };

  const renderView = () => {
    switch (activeTab) {
      case 'orders': return <OrdersView activeOrderId={activeOrderId} status={orderStatus} />;
      case 'profile': return <ProfileView />;
      default: return (
        <MenuView 
          items={items} cart={cart} addToCart={addToCart} removeFromCart={removeFromCart}
          searchTerm={searchTerm} setSearchTerm={setSearchTerm}
          selectedCategory={selectedCategory} setSelectedCategory={setSelectedCategory}
          categories={categories} vegFilter={vegFilter} setVegFilter={setVegFilter}
          loading={loading} tableId={tableId} onCheckIn={() => setShowCheckIn(true)}
        />
      );
    }
  };

  const onCheckout = async () => {
    try {
      const result = await handleCheckoutConfirm();
      if (result) onOrderSuccess(result.order, result.total);
    } catch (err) {
      alert(err.message || 'Failed to place order.');
    }
  };

  return (
    <div className="min-h-screen bg-[#F8F8F8] text-black">
      <SidebarNav activeTab={activeTab} onTabChange={setActiveTab} hasActiveOrder={!!activeOrderId} />
      
      <main className="md:ml-[88px] transition-all duration-300 pb-48">
        {renderView()}
      </main>

      <CartBar 
        itemsCount={cart.reduce((acc, i) => acc + i.quantity, 0)} 
        totalAmount={cart.reduce((acc, i) => acc + (i.price * i.quantity), 0)}
        onViewCart={() => setShowCheckIn(true)}
      />

      <BottomNav activeTab={activeTab} onTabChange={setActiveTab} hasActiveOrder={!!activeOrderId} />

      <OrderSuccessModal 
        show={showSuccess} onClose={() => setShowSuccess(false)}
        orderId={lastOrder?.id} total={lastOrder?.total}
        onTrack={() => { setShowSuccess(false); setActiveTab('orders'); }}
      />

      <CheckInModal 
        show={showCheckIn}
        onClose={() => setShowCheckIn(false)}
        nickname={nickname} setNickname={setNickname}
        mobile={mobile} setMobile={setMobile}
        orderType={orderType} setOrderType={setOrderType}
        manualTableName={manualTableName} setManualTableName={setManualTableName}
        isTablePreset={!!tableId}
        sessionCode={sessionCode} setSessionCode={setSessionCode}
        loading={sessionLoading}
        onConfirm={onCheckout}
      />
    </div>
  );
};

export default MenuPage;
