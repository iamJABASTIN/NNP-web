import React, { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabase';
import { Plus, Table as TableIcon, AlertTriangle } from 'lucide-react';
import { BORDER_BLACK, SHADOW_BLACK } from '../../constants/adminStyles';
import TableCard from './TableCard';
import QRModal from './QRModal';

const TableManager = ({ restaurantName }) => {
  const [tables, setTables] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAdd, setShowAdd] = useState(false);
  const [newTable, setNewTable] = useState({ table_number: '', capacity: 4 });
  const [qrTable, setQrTable] = useState(null);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [deleteError, setDeleteError] = useState(null);

  const fetchTables = async () => {
    const { data } = await supabase
      .from('tables')
      .select('*')
      .neq('table_number', 'Takeout')
      .order('table_number');

    // Sort numerically (1, 2, 10) not lexicographically (1, 10, 2)
    const sorted = (data || []).sort((a, b) => {
      const numA = parseInt(a.table_number, 10);
      const numB = parseInt(b.table_number, 10);
      if (!isNaN(numA) && !isNaN(numB)) return numA - numB;
      return a.table_number.localeCompare(b.table_number);
    });
    setTables(sorted);
    setLoading(false);
  };

  useEffect(() => { fetchTables(); }, []);

  const handleAdd = async () => {
    if (!newTable.table_number.trim()) return;

    const { data: restaurant } = await supabase
      .from('restaurants')
      .select('id')
      .limit(1)
      .single();

    if (!restaurant) return;

    const { error } = await supabase.from('tables').insert([{
      table_number: newTable.table_number.trim(),
      capacity: newTable.capacity,
      restaurant_id: restaurant.id,
    }]);

    if (error) {
      console.error('Failed to add table:', error);
      return;
    }

    await fetchTables();
    setNewTable({ table_number: '', capacity: 4 });
    setShowAdd(false);
  };

  const handleEdit = async (tableId, updates) => {
    const { error } = await supabase
      .from('tables')
      .update(updates)
      .eq('id', tableId);

    if (error) {
      console.error('Failed to update table:', error);
      return;
    }
    await fetchTables();
  };

  const handleDeleteConfirm = async () => {
    if (!deleteTarget) return;
    setDeleteError(null);

    // Check for active sessions
    const { data: activeSessions } = await supabase
      .from('table_sessions')
      .select('id')
      .eq('table_id', deleteTarget.id)
      .eq('status', 'active')
      .limit(1);

    if (activeSessions && activeSessions.length > 0) {
      setDeleteError('Cannot delete — this table has an active session. Close the session first.');
      return;
    }

    const { error } = await supabase
      .from('tables')
      .delete()
      .eq('id', deleteTarget.id);

    if (error) {
      setDeleteError(`Delete failed: ${error.message}`);
      return;
    }

    setDeleteTarget(null);
    await fetchTables();
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center p-16 font-black uppercase tracking-[0.5em] text-sm">
        Loading Tables...
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <TableIcon size={24} strokeWidth={2.5} />
          <h3 className="text-xl font-black uppercase tracking-tighter">
            Tables <span className="text-black/30">({tables.length})</span>
          </h3>
        </div>
        <button
          onClick={() => setShowAdd(!showAdd)}
          className={`flex items-center gap-2 px-4 py-2 text-[10px] font-black uppercase tracking-widest border-2 border-black
            ${showAdd ? 'bg-black text-white' : 'bg-white hover:bg-gray-100'} transition-all`}
        >
          <Plus size={14} strokeWidth={4} /> {showAdd ? 'Cancel' : 'Add Table'}
        </button>
      </div>

      {/* Add form */}
      {showAdd && (
        <div className="flex items-end gap-4 p-4 border-2 border-dashed border-black/30 bg-accent/10">
          <div className="flex flex-col gap-1">
            <label className="text-[10px] font-black uppercase tracking-widest text-black/50">Table Number</label>
            <input
              type="text"
              className="p-2 border-2 border-black font-black text-sm w-32 focus:outline-none"
              value={newTable.table_number}
              onChange={e => setNewTable({ ...newTable, table_number: e.target.value })}
              placeholder="e.g. 12"
              autoFocus
            />
          </div>
          <div className="flex flex-col gap-1">
            <label className="text-[10px] font-black uppercase tracking-widest text-black/50">Capacity</label>
            <input
              type="number"
              className="p-2 border-2 border-black font-black text-sm w-24 focus:outline-none"
              value={newTable.capacity}
              onChange={e => setNewTable({ ...newTable, capacity: parseInt(e.target.value) || 1 })}
              min={1}
            />
          </div>
          <button
            onClick={handleAdd}
            className="px-4 py-2 bg-black text-white border-2 border-black font-black uppercase text-xs hover:bg-green-600 transition-colors"
          >
            Add
          </button>
        </div>
      )}

      {/* Table grid */}
      {tables.length === 0 ? (
        <div className={`flex flex-col items-center justify-center p-16 ${BORDER_BLACK} bg-white ${SHADOW_BLACK}`}>
          <TableIcon size={64} strokeWidth={1} className="opacity-20 mb-4" />
          <h3 className="text-2xl font-black uppercase italic">No Tables</h3>
          <p className="text-gray-400 font-medium uppercase tracking-widest text-xs mt-2">
            Add your first table to get started
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
          {tables.map(t => (
            <TableCard
              key={t.id}
              table={t}
              onEdit={handleEdit}
              onDelete={setDeleteTarget}
              onQR={setQrTable}
            />
          ))}
        </div>
      )}

      {/* Delete confirmation dialog */}
      {deleteTarget && (
        <div className="fixed inset-0 z-50 bg-black/70 flex items-center justify-center p-6 backdrop-blur-sm">
          <div className={`bg-white p-8 max-w-sm w-full ${BORDER_BLACK} ${SHADOW_BLACK}`}>
            <div className="flex items-center gap-3 mb-4">
              <AlertTriangle size={24} strokeWidth={2.5} className="text-red-600" />
              <h3 className="text-xl font-black uppercase tracking-tighter">Delete Table?</h3>
            </div>
            <p className="text-sm font-bold text-black/60 mb-6">
              Are you sure you want to delete <strong>Table T-{deleteTarget.table_number}</strong>?
              This action cannot be undone.
            </p>

            {deleteError && (
              <div className="p-3 bg-red-50 border-2 border-red-500 text-xs font-black text-red-600 mb-4" role="alert">
                {deleteError}
              </div>
            )}

            <div className="flex gap-3">
              <button
                onClick={() => { setDeleteTarget(null); setDeleteError(null); }}
                className="flex-1 py-3 bg-white border-2 border-black font-black uppercase text-xs tracking-widest hover:bg-gray-100 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleDeleteConfirm}
                className="flex-1 py-3 bg-red-600 text-white border-2 border-black font-black uppercase text-xs tracking-widest hover:bg-red-700 transition-colors"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}

      {/* QR Modal */}
      <QRModal
        show={!!qrTable}
        table={qrTable}
        restaurantName={restaurantName}
        onClose={() => setQrTable(null)}
      />
    </div>
  );
};

export default TableManager;
