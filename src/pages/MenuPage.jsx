import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import { useMenuPage } from '../hooks/useMenuPage';
import { useOrderTracking } from '../hooks/useOrderTracking';
import { useTables } from '../hooks/useTables';
import SidebarNav from '../components/Navigation/SidebarNav';
import BottomNav from '../components/Navigation/BottomNav';
import { OrderSuccessModal, CartBar, CheckInModal, AddItemsModal } from '../components/Menu';
import MenuView from '../sections/Menu/MenuView';
import OrdersView from '../sections/Menu/OrdersView';
import ProfileView from '../sections/Menu/ProfileView';

const MenuPage = () => {
  const { tableId } = useParams();
  const [activeTab, setActiveTab] = useState('menu');
  const [showSuccess, setShowSuccess] = useState(false);
  const [lastOrder, setLastOrder] = useState(null);
  const [showAddConfirm, setShowAddConfirm] = useState(false);
  const [addingItems, setAddingItems] = useState(false);
  const [checkoutError, setCheckoutError] = useState(null);

  const {
    categories, items, loading, cart, addToCart, removeFromCart,
    searchTerm, setSearchTerm, selectedCategory, setSelectedCategory,
    vegFilter, setVegFilter, showCheckIn, setShowCheckIn,
    nickname, setNickname, mobile, setMobile, orderType, setOrderType,
    manualTableName, setManualTableName, sessionCode, setSessionCode,
    sessionLoading, handleCheckoutConfirm, addToExistingOrder, presetTable
  } = useMenuPage(tableId);

  const { activeOrderId, orderStatus, trackNewOrder, loading: orderTrackingLoading } = useOrderTracking();
  const { tables, loading: tablesLoading } = useTables();

  const onOrderSuccess = (order, total) => {
    setLastOrder({ ...order, total });
    setShowSuccess(true);
    trackNewOrder(order.id);
  };

  const tableNumber = presetTable?.table_number || tables.find(t => t.id === tableId)?.table_number;

  const renderView = () => {
    switch (activeTab) {
      case 'orders': return <OrdersView activeOrderId={activeOrderId} status={orderStatus} onSwitchToMenu={() => setActiveTab('menu')} />;
      case 'profile': return <ProfileView />;
      default: return (
        <MenuView 
          items={items} cart={cart} addToCart={addToCart} removeFromCart={removeFromCart}
          searchTerm={searchTerm} setSearchTerm={setSearchTerm}
          selectedCategory={selectedCategory} setSelectedCategory={setSelectedCategory}
          categories={categories} vegFilter={vegFilter} setVegFilter={setVegFilter}
          loading={loading} tableNumber={tableNumber} onCheckIn={() => setShowCheckIn(true)}
        />
      );
    }
  };

  const onCheckout = async () => {
    setCheckoutError(null);
    try {
      const result = await handleCheckoutConfirm();
      if (result) onOrderSuccess(result.order, result.total);
    } catch (err) {
      console.error('Checkout failed:', err);
      setCheckoutError(err.message || 'Failed to place order.');
    }
  };

  // When active order exists, append items instead of creating a new order
  const handleViewCart = () => {
    if (cart.length === 0) return;
    
    // If we're still validating the order ID, wait.
    if (orderTrackingLoading) return;

    if (activeOrderId) {
      console.log('Active order found, showing AddItemsModal');
      setShowAddConfirm(true);
    } else {
      if (tableId) {
        console.log('Table preset (scanned QR), placing order instantly');
        onCheckout();
      } else {
        console.log('No active order and table not preset, showing CheckInModal');
        setShowCheckIn(true);
      }
    }
  };

  const handleAddToExisting = async () => {
    setAddingItems(true);
    try {
      await addToExistingOrder(activeOrderId);
      setShowAddConfirm(false);
      setActiveTab('orders');
    } catch (err) {
      alert(err.message || 'Failed to add items.');
    } finally {
      setAddingItems(false);
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
        onViewCart={handleViewCart}
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
        tableId={tableId}
        sessionCode={sessionCode} setSessionCode={setSessionCode}
        loading={sessionLoading || tablesLoading}
        error={checkoutError}
        tables={tables}
        onConfirm={onCheckout}
      />

      <AddItemsModal
        show={showAddConfirm}
        onClose={() => setShowAddConfirm(false)}
        cart={cart}
        loading={addingItems}
        onConfirm={handleAddToExisting}
      />
    </div>
  );
};

export default MenuPage;
