import React, { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabase';
import { Star, MessageCircle } from 'lucide-react';
import { BORDER_BLACK, SHADOW_BLACK } from '../../constants/adminStyles';

const StarDisplay = ({ rating }) => (
  <div className="flex items-center gap-0.5">
    {[1, 2, 3, 4, 5].map(i => (
      <Star key={i} size={14} strokeWidth={2.5}
        className={i <= rating ? 'fill-[#f2ca50] text-black' : 'text-black/20'}
      />
    ))}
  </div>
);

const ReviewsList = () => {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [avgRating, setAvgRating] = useState(0);

  useEffect(() => {
    const fetchReviews = async () => {
      setLoading(true);
      const { data } = await supabase
        .from('reviews')
        .select('*, orders(total_amount, tables(table_number))')
        .order('created_at', { ascending: false });

      // Get user names separately (reviews.user_id is nullable)
      const reviewData = data || [];
      const userIds = [...new Set(reviewData.map(r => r.user_id).filter(Boolean))];
      let userMap = {};
      if (userIds.length > 0) {
        const { data: users } = await supabase.from('profiles').select('id, display_name').in('id', userIds);
        (users || []).forEach(u => { userMap[u.id] = u.display_name; });
      }

      const enriched = reviewData.map(r => ({
        ...r,
        display_name: userMap[r.user_id] || 'Anonymous',
        table_number: r.orders?.tables?.table_number,
        order_total: r.orders?.total_amount,
      }));

      setReviews(enriched);
      if (enriched.length > 0) {
        setAvgRating(enriched.reduce((s, r) => s + r.rating, 0) / enriched.length);
      }
      setLoading(false);
    };
    fetchReviews();
  }, []);

  const formatDate = (iso) => iso ? new Date(iso).toLocaleDateString([], { month: 'short', day: 'numeric', year: 'numeric' }) : '—';

  if (loading) return <div className="flex-1 flex items-center justify-center font-black uppercase tracking-[0.5em]">Loading Reviews...</div>;

  return (
    <div className="flex flex-col gap-6 animate-in fade-in duration-500">
      <h2 className="text-3xl font-black uppercase tracking-tighter italic border-b-4 border-black inline-block">Reviews</h2>

      {/* Summary card */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className={`p-6 bg-[#f2ca50] ${BORDER_BLACK} ${SHADOW_BLACK}`}>
          <p className="text-[10px] font-black uppercase tracking-widest mb-1">Average Rating</p>
          <div className="flex items-center gap-3">
            <h3 className="text-4xl font-black tracking-tighter">{avgRating.toFixed(1)}</h3>
            <StarDisplay rating={Math.round(avgRating)} />
          </div>
        </div>
        <div className={`p-6 bg-white ${BORDER_BLACK} ${SHADOW_BLACK}`}>
          <p className="text-[10px] font-black uppercase tracking-widest mb-1">Total Reviews</p>
          <h3 className="text-4xl font-black tracking-tighter">{reviews.length}</h3>
        </div>
        <div className={`p-6 bg-white ${BORDER_BLACK} ${SHADOW_BLACK}`}>
          <p className="text-[10px] font-black uppercase tracking-widest mb-1">5-Star Reviews</p>
          <h3 className="text-4xl font-black tracking-tighter">{reviews.filter(r => r.rating === 5).length}</h3>
        </div>
      </div>

      {reviews.length === 0 ? (
        <div className={`flex flex-col items-center justify-center p-16 ${BORDER_BLACK} bg-white ${SHADOW_BLACK}`}>
          <MessageCircle size={64} strokeWidth={1} className="opacity-20 mb-4" />
          <h3 className="text-2xl font-black uppercase italic">No Reviews Yet</h3>
          <p className="text-gray-400 font-medium uppercase tracking-widest text-xs mt-2">Reviews will appear here once customers submit feedback</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {reviews.map(r => (
            <div key={r.id} className={`bg-white p-6 ${BORDER_BLACK} shadow-[4px_4px_0px_#000000] hover:-translate-y-0.5 transition-all`}>
              <div className="flex items-start justify-between mb-3">
                <div>
                  <p className="font-black text-sm uppercase">{r.display_name}</p>
                  <p className="text-[10px] text-black/40 font-bold">{formatDate(r.created_at)}</p>
                </div>
                <StarDisplay rating={r.rating} />
              </div>
              {r.feedback && (
                <p className="text-sm text-black/70 italic border-l-4 border-black pl-3 mb-3">"{r.feedback}"</p>
              )}
              <div className="flex items-center gap-4 text-[10px] font-black uppercase tracking-widest text-black/30">
                {r.table_number && <span>Table {r.table_number}</span>}
                {r.order_total && <span>₹{r.order_total}</span>}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ReviewsList;
