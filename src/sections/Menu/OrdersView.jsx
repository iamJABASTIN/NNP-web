import React, { useState, useEffect, useCallback } from 'react';
import { useOrderDetails } from '../../hooks/useOrderDetails';
import { useRating } from '../../hooks/useRating';
import { useSession } from '../../hooks/useSession';
import {
  BillPreviewModal,
  RatingModal,
  CollectDetailsModal,
  EmptyState,
  LoadingState,
  OrderHeader,
  ReceiptCard,
  ActionButtons
} from '../../components/Menu';
import { supabase } from '../../lib/supabase';

const OrdersView = ({ activeOrderId, status, onSwitchToMenu }) => {
  const { items, totalAmount, tableNumber, loading } = useOrderDetails(activeOrderId);
  const { hasRated, isSubmitting, submitRating } = useRating(activeOrderId);
  const { user } = useSession();
  
  const [showBill, setShowBill] = useState(false);
  const [showRating, setShowRating] = useState(false);
  const [showCollectDetails, setShowCollectDetails] = useState(false);
  const [updatingProfile, setUpdatingProfile] = useState(false);
  const [profile, setProfile] = useState(null);

  useEffect(() => {
    if (user) {
      supabase.from('profiles').select('display_name, phone').eq('id', user.id).maybeSingle()
        .then(({ data }) => data && setProfile(data))
        .catch(err => console.error('Failed to fetch profile:', err));
    }
  }, [user]);

  const handleBillClose = () => {
    setShowBill(false);
    if (!hasRated) setTimeout(() => setShowRating(true), 400);
  };

  const handleBillRequestClick = () => {
    const hasDetails = profile?.display_name && profile?.display_name !== 'Guest' && profile?.phone;
    if (!hasDetails) setShowCollectDetails(true);
    else setShowBill(true);
  };

  const handleDetailsConfirm = async ({ nickname, mobile }) => {
    if (!user) return;
    setUpdatingProfile(true);
    try {
      const { error: dbError } = await supabase.from('profiles').update({ display_name: nickname, phone: mobile }).eq('id', user.id);
      if (dbError) throw dbError;
      const { error: authError } = await supabase.auth.updateUser({ data: { display_name: nickname, mobile_number: mobile } });
      if (authError) throw authError;
      setProfile({ display_name: nickname, phone: mobile });
      setShowCollectDetails(false);
      setShowBill(true);
    } catch (err) {
      alert(err.message || 'Failed to save billing details. Please try again.');
    } finally {
      setUpdatingProfile(false);
    }
  };

  const handleBillTaken = useCallback(async () => {
    if (activeOrderId) {
      await supabase.from('orders').update({ bill_requested_at: new Date().toISOString() }).eq('id', activeOrderId)
        .catch(err => console.error('Failed to stamp bill_requested_at:', err));
    }
  }, [activeOrderId]);

  if (!activeOrderId) return <EmptyState />;
  if (loading) return <LoadingState />;

  return (
    <div className="p-6 md:p-8 max-w-2xl mx-auto animate-in fade-in slide-in-from-bottom duration-500">
      <OrderHeader status={status} tableNumber={tableNumber} />
      <ReceiptCard items={items} totalAmount={totalAmount} />
      <ActionButtons
        onSwitchToMenu={onSwitchToMenu}
        onRequestBill={handleBillRequestClick}
        onRateExperience={() => setShowRating(true)}
        hasRated={hasRated}
      />

      <BillPreviewModal
        show={showBill}
        onClose={handleBillClose}
        items={items}
        totalAmount={totalAmount}
        tableNumber={tableNumber}
        orderId={activeOrderId}
        onBillTaken={handleBillTaken}
      />

      <RatingModal
        show={showRating}
        onClose={() => setShowRating(false)}
        onSubmit={submitRating}
        isSubmitting={isSubmitting}
      />

      <CollectDetailsModal
        show={showCollectDetails}
        onClose={() => setShowCollectDetails(false)}
        onConfirm={handleDetailsConfirm}
        loading={updatingProfile}
      />
    </div>
  );
};

export default OrdersView;
