import React, { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabase';
import { Star, MessageCircle } from 'lucide-react';
import { BORDER_BLACK, SHADOW_BLACK } from '../../constants/adminStyles';
import TimeRangeFilter from './TimeRangeFilter';

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
  const [range, setRange] = useState({ type: 'week', start: '', end: '' });

  useEffect(() => {
    const fetchReviews = async () => {
      setLoading(true);
      try {
        let query = supabase
          .from('reviews')
          .select(`
            *,
            orders (
              total_amount,
              kot_number,
              tables (table_number),
              order_items (
                quantity,
                menu_items (name)
              )
            )
          `);

        const now = new Date();
        if (range.type === 'today') {
          const startOfDay = new Date(now.setHours(0, 0, 0, 0)).toISOString();
          query = query.gte('created_at', startOfDay);
        } else if (range.type === 'week') {
          const lastWeek = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000).toISOString();
          query = query.gte('created_at', lastWeek);
        } else if (range.type === 'month') {
          const lastMonth = new Date(now.setMonth(now.getMonth() - 1)).toISOString();
          query = query.gte('created_at', lastMonth);
        } else if (range.type === 'custom' && range.start && range.end) {
          query = query.gte('created_at', range.start).lte('created_at', `${range.end}T23:59:59`);
        }

        const { data, error } = await query.order('created_at', { ascending: false });

        if (error) throw error;

        const reviewData = data || [];
        const userIds = [...new Set(reviewData.map(r => r.user_id).filter(Boolean))];
        let userMap = {};
        if (userIds.length > 0) {
          const { data: users } = await supabase.from('profiles').select('id, display_name').in('id', userIds);
          (users || []).forEach(u => { userMap[u.id] = u.display_name; });
        }

        const enriched = reviewData.map(r => ({
          ...r,
          display_name: userMap[r.user_id] || 'Anonymous User',
          table_number: r.orders?.tables?.table_number,
          order_total: r.orders?.total_amount,
          kot_number: r.orders?.kot_number,
          items: r.orders?.order_items?.map(oi => ({
            name: oi.menu_items?.name,
            qty: oi.quantity
          })) || []
        }));

        setReviews(enriched);
        if (enriched.length > 0) {
          setAvgRating(enriched.reduce((s, r) => s + r.rating, 0) / enriched.length);
        }
      } catch (err) {
        console.error('Failed to fetch reviews:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchReviews();
  }, [range]);

  const formatDate = (iso) => iso ? new Date(iso).toLocaleDateString([], { month: 'short', day: 'numeric', year: 'numeric' }) : '—';

  if (loading) return <div className="flex-1 flex items-center justify-center font-black uppercase tracking-[0.5em]">Loading Reviews...</div>;

  return (
    <div className="flex flex-col gap-6 animate-in fade-in duration-500">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-black uppercase tracking-tighter italic border-b-4 border-black">Reviews</h2>
          <p className="text-[10px] font-bold text-black/40 mt-1 uppercase tracking-widest">
            {range.type === 'today' ? "Reviews Today" : range.type === 'week' ? "Reviews Last 7 Days" : range.type === 'month' ? "Reviews Last 30 Days" : "Custom Range"}
          </p>
        </div>
        <TimeRangeFilter activeRange={range} onRangeChange={setRange} />
      </div>

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
              <div className="flex items-start justify-between mb-4 pb-4 border-b-2 border-black/5">
                <div>
                  <div className="flex items-center gap-2">
                    <p className="font-black text-sm uppercase tracking-tight">{r.display_name}</p>
                    {r.kot_number && (
                      <span className="text-[8px] font-black bg-black text-white px-1.5 py-0.5 uppercase tracking-tighter">
                        {r.kot_number}
                      </span>
                    )}
                  </div>
                  <p className="text-[10px] text-black/40 font-bold">{formatDate(r.created_at)}</p>
                </div>
                <StarDisplay rating={r.rating} />
              </div>

              {r.feedback && (
                <div className="mb-4">
                  <p className="text-sm text-black/70 font-medium italic border-l-4 border-black pl-3 bg-black/[0.02] py-2">
                    "{r.feedback}"
                  </p>
                </div>
              )}

              <div className="space-y-3">
                <div className="flex flex-wrap gap-1.5">
                  {r.items.map((item, idx) => (
                    <span key={idx} className="text-[9px] font-black uppercase bg-accent/20 px-2 py-0.5 border border-black/10">
                      {item.qty}x {item.name}
                    </span>
                  ))}
                </div>

                <div className="flex items-center justify-between pt-3 border-t border-black/5">
                  <div className="flex items-center gap-4 text-[10px] font-black uppercase tracking-widest text-black/30">
                    {r.table_number && <span>Table {r.table_number}</span>}
                    {r.order_total && <span>₹{r.order_total}</span>}
                  </div>
                  <span className="text-[9px] font-black uppercase tracking-widest text-black/20">
                    Order ID: ...{r.order_id?.slice(-8)}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ReviewsList;
