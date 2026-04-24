import React, { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabase';
import { Clock, XCircle, Table as TableIcon } from 'lucide-react';
import { BORDER_BLACK, PRIMARY_YELLOW, SHADOW_BLACK } from '../../constants/adminStyles';

const SessionManagement = () => {
  const [sessions, setSessions] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchSessions = async () => {
    try {
      const { data, error } = await supabase
        .from('table_sessions')
        .select('*')
        .eq('status', 'active')
        .order('opened_at', { ascending: false });

      if (error) throw error;
      console.log('Fetched active sessions:', data);
      setSessions(data || []);
    } catch (err) {
      console.error('Error fetching active sessions:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSessions();

    // Poll every 30 seconds to keep the list fresh
    const interval = setInterval(fetchSessions, 30000);
    return () => clearInterval(interval);
  }, []);

  const handleCloseSession = async (sessionId) => {
    if (!window.confirm('Are you sure you want to close this session? Guest users will be automatically signed out.')) {
      return;
    }

    try {
      const { error } = await supabase
        .from('table_sessions')
        .update({
          status: 'completed',
          closed_at: new Date().toISOString()
        })
        .eq('id', sessionId);

      if (error) throw error;

      // Refresh the list
      await fetchSessions();
    } catch (err) {
      console.error('Error closing session:', err);
      alert('Failed to close session. Please try again.');
    }
  };

  const formatTime = (isoString) => {
    if (!isoString) return 'N/A';
    return new Date(isoString).toLocaleTimeString([], {
      hour: '2-digit',
      minute: '2-digit',
      hour12: true
    });
  };

  return (
    <div className="flex-1 flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-4xl font-black uppercase italic tracking-tighter">
            Active Sessions
          </h2>
          <p className="text-gray-500 font-medium uppercase tracking-wider text-xs mt-1">
            Monitor and manage currently occupied tables
          </p>
        </div>
        <div className="flex items-center gap-2 bg-black text-white px-3 py-1 text-xs font-bold uppercase tracking-widest">
          <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
          Live Updates
        </div>
      </div>

      {loading ? (
        <div className="flex-1 flex items-center justify-center">
          <div className="text-xl font-black uppercase tracking-widest animate-bounce">
            Loading...
          </div>
        </div>
      ) : sessions.length === 0 ? (
        <div className={`flex-1 flex flex-col items-center justify-center ${BORDER_BLACK} bg-white ${SHADOW_BLACK} p-12 text-center`}>
          <TableIcon size={64} strokeWidth={1} className="mb-4 opacity-20" />
          <h3 className="text-2xl font-black uppercase italic">No Active Sessions</h3>
          <p className="text-gray-400 font-medium uppercase tracking-widest text-xs mt-2">
            All tables are currently available
          </p>
        </div>
      ) : (
        <div className={`overflow-hidden ${BORDER_BLACK} bg-white ${SHADOW_BLACK}`}>
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-black text-white">
                <th className="p-4 font-black uppercase tracking-widest text-sm">Table</th>
                <th className="p-4 font-black uppercase tracking-widest text-sm">Started At</th>
                <th className="p-4 font-black uppercase tracking-widest text-sm text-center">Status</th>
                <th className="p-4 font-black uppercase tracking-widest text-sm text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y-4 divide-black">
              {sessions.map((session) => (
                <tr key={session.id} className="hover:bg-gray-50 transition-colors group">
                  <td className="p-4 font-black uppercase italic">
                    <div className="flex items-center gap-2">
                      <TableIcon size={16} />
                      {session.table_id}
                    </div>
                  </td>
                  <td className="p-4 font-medium text-gray-600">
                    <div className="flex items-center gap-2">
                      <Clock size={14} />
                      {formatTime(session.created_at)}
                    </div>
                  </td>
                  <td className="p-4 text-center">
                    <span className="inline-flex items-center gap-1 px-2 py-1 border-2 border-black bg-green-100 text-[10px] font-black uppercase tracking-tighter">
                      <div className="w-1.5 h-1.5 bg-green-600 rounded-full" />
                      Active
                    </span>
                  </td>
                  <td className="p-4 text-right">
                    <button
                      onClick={() => handleCloseSession(session.id)}
                      className="group-hover:translate-x-[-2px] group-hover:translate-y-[-2px] transition-all"
                    >
                      <div className="px-4 py-2 border-2 border-black bg-white text-black font-black uppercase text-xs tracking-widest hover:bg-black hover:text-white shadow-[4px_4px_0px_#000000] active:shadow-none active:translate-x-[2px] active:translate-y-[2px] flex items-center gap-2">
                        <XCircle size={14} />
                        Close
                      </div>
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default SessionManagement;
