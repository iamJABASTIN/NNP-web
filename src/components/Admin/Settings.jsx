import React, { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabase';
import { Save, Plus, Store, Table as TableIcon } from 'lucide-react';
import { BORDER_BLACK, PRIMARY_YELLOW, SHADOW_BLACK } from '../../constants/adminStyles';

const Settings = () => {
  const [restaurant, setRestaurant] = useState(null);
  const [tables, setTables] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [newTable, setNewTable] = useState({ table_number: '', capacity: 4 });
  const [showAddTable, setShowAddTable] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      const { data: rest } = await supabase.from('restaurants').select('*').limit(1).single();
      const { data: tbl } = await supabase.from('tables').select('*').order('table_number');
      setRestaurant(rest);
      setTables(tbl || []);
      setLoading(false);
    };
    fetchData();
  }, []);

  const handleSave = async () => {
    if (!restaurant) return;
    setSaving(true);
    const { id, created_at, ...fields } = restaurant;
    fields.updated_at = new Date().toISOString();
    await supabase.from('restaurants').update(fields).eq('id', id);
    setSaving(false);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  const addTable = async () => {
    if (!newTable.table_number || !restaurant) return;
    await supabase.from('tables').insert([{ ...newTable, restaurant_id: restaurant.id }]);
    const { data } = await supabase.from('tables').select('*').order('table_number');
    setTables(data || []);
    setNewTable({ table_number: '', capacity: 4 });
    setShowAddTable(false);
  };

  const toggleTable = async (id, currentActive) => {
    await supabase.from('tables').update({ is_active: !currentActive }).eq('id', id);
    setTables(tables.map(t => t.id === id ? { ...t, is_active: !currentActive } : t));
  };

  const update = (field, value) => setRestaurant({ ...restaurant, [field]: value });

  if (loading || !restaurant) return <div className="flex-1 flex items-center justify-center font-black uppercase tracking-[0.5em]">Loading Settings...</div>;

  const fields = [
    { key: 'name', label: 'Restaurant Name', type: 'text' },
    { key: 'address', label: 'Address', type: 'text' },
    { key: 'phone', label: 'Phone', type: 'text' },
    { key: 'logo_url', label: 'Logo URL', type: 'text' },
    { key: 'upi_id', label: 'UPI ID', type: 'text' },
    { key: 'gst_number', label: 'GST Number', type: 'text' },
    { key: 'tax_rate', label: 'Tax Rate (%)', type: 'number' },
  ];

  return (
    <div className="flex flex-col gap-8 animate-in fade-in duration-500">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-black uppercase tracking-tighter italic border-b-4 border-black">Settings</h2>
        <button onClick={handleSave} disabled={saving}
          className={`flex items-center gap-2 px-6 py-3 font-black uppercase text-xs tracking-widest ${BORDER_BLACK} transition-all
            ${saved ? 'bg-green-500 text-white' : 'bg-[#f2ca50] text-black hover:-translate-y-0.5'} shadow-[4px_4px_0px_#000000]`}>
          <Save size={18} strokeWidth={3} />
          {saving ? 'Saving...' : saved ? 'Saved!' : 'Save Changes'}
        </button>
      </div>

      {/* Restaurant Info */}
      <div className={`bg-white p-8 ${BORDER_BLACK} ${SHADOW_BLACK}`}>
        <div className="flex items-center gap-3 mb-6">
          <Store size={24} strokeWidth={2.5} />
          <h3 className="text-xl font-black uppercase tracking-tighter">Restaurant Info</h3>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {fields.map(f => (
            <div key={f.key} className="flex flex-col gap-1">
              <label className="text-[10px] font-black uppercase tracking-widest text-black/50">{f.label}</label>
              <input type={f.type}
                className={`p-3 border-2 border-black font-black text-sm focus:outline-none focus:border-[#f2ca50] transition-colors`}
                value={restaurant[f.key] || ''}
                onChange={e => update(f.key, f.type === 'number' ? parseFloat(e.target.value) || 0 : e.target.value)}
              />
            </div>
          ))}
          <div className="flex flex-col gap-1">
            <label className="text-[10px] font-black uppercase tracking-widest text-black/50">Status</label>
            <button onClick={() => update('is_open', !restaurant.is_open)}
              className={`p-3 border-2 border-black font-black text-sm uppercase tracking-widest transition-all
                ${restaurant.is_open ? 'bg-green-500 text-white' : 'bg-red-500 text-white'}`}>
              {restaurant.is_open ? '● Open' : '● Closed'}
            </button>
          </div>
        </div>
      </div>

      {/* Table Management */}
      <div className={`bg-white p-8 ${BORDER_BLACK} ${SHADOW_BLACK}`}>
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <TableIcon size={24} strokeWidth={2.5} />
            <h3 className="text-xl font-black uppercase tracking-tighter">Tables ({tables.length})</h3>
          </div>
          <button onClick={() => setShowAddTable(!showAddTable)}
            className={`flex items-center gap-2 px-4 py-2 text-[10px] font-black uppercase tracking-widest border-2 border-black
              ${showAddTable ? 'bg-black text-white' : 'bg-white hover:bg-gray-100'} transition-all`}>
            <Plus size={14} strokeWidth={4} /> {showAddTable ? 'Cancel' : 'Add Table'}
          </button>
        </div>

        {showAddTable && (
          <div className="flex items-end gap-4 mb-6 p-4 border-2 border-dashed border-black/30 bg-[#f2ca50]/10">
            <div className="flex flex-col gap-1">
              <label className="text-[10px] font-black uppercase tracking-widest text-black/50">Table Number</label>
              <input type="text" className="p-2 border-2 border-black font-black text-sm w-32"
                value={newTable.table_number} onChange={e => setNewTable({ ...newTable, table_number: e.target.value })} />
            </div>
            <div className="flex flex-col gap-1">
              <label className="text-[10px] font-black uppercase tracking-widest text-black/50">Capacity</label>
              <input type="number" className="p-2 border-2 border-black font-black text-sm w-24"
                value={newTable.capacity} onChange={e => setNewTable({ ...newTable, capacity: parseInt(e.target.value) || 4 })} />
            </div>
            <button onClick={addTable} className="px-4 py-2 bg-black text-white border-2 border-black font-black uppercase text-xs hover:bg-green-600 transition-colors">
              Add
            </button>
          </div>
        )}

        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
          {tables.map(t => (
            <button key={t.id} onClick={() => toggleTable(t.id, t.is_active)}
              className={`p-4 border-2 border-black text-center font-black uppercase transition-all hover:-translate-y-0.5
                ${t.is_active ? 'bg-white shadow-[4px_4px_0px_#000000]' : 'bg-gray-200 opacity-50'}`}>
              <p className="text-lg tracking-tighter">T-{t.table_number}</p>
              <p className="text-[10px] text-black/50 tracking-widest">{t.capacity} seats</p>
              <div className={`w-2 h-2 mx-auto mt-2 border border-black ${t.is_active ? 'bg-green-500' : 'bg-red-400'}`} />
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Settings;
