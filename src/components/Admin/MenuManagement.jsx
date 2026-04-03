import React, { useState, useEffect } from 'react';
import { 
  Plus, 
  Trash2, 
  Edit2, 
  Save, 
  X, 
  CheckCircle2 
} from 'lucide-react';
import { supabase } from '../../lib/supabase';
import { 
  PRIMARY_YELLOW, 
  BORDER_BLACK 
} from '../../constants/adminStyles';

const MenuManagement = () => {
  const [items, setItems] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState(null);
  const [editForm, setEditForm] = useState({});
  const [isAdding, setIsAdding] = useState(false);
  const [newForm, setNewForm] = useState({
    name: '',
    price: '',
    category_id: '',
    veg_type: 'veg',
    is_available: true,
    description: ''
  });

  const fetchData = async () => {
    setLoading(true);
    const { data: menuData } = await supabase.from('menu_items').select('*').order('created_at', { ascending: false });
    const { data: catData } = await supabase.from('categories').select('*').order('display_order');
    setItems(menuData || []);
    setCategories(catData || []);
    setLoading(false);
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleEdit = (item) => {
    setEditingId(item.id);
    setEditForm(item);
  };

  const handleSave = async (id) => {
    const { error } = await supabase.from('menu_items').update(editForm).eq('id', id);
    if (!error) {
      setEditingId(null);
      fetchData();
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Delete this item from the database?')) {
      const { error } = await supabase.from('menu_items').delete().eq('id', id);
      if (!error) fetchData();
    }
  };

  const handleAdd = async () => {
    const { error } = await supabase.from('menu_items').insert([newForm]);
    if (!error) {
      setIsAdding(false);
      setNewForm({ name: '', price: '', category_id: categories[0]?.id || '', veg_type: 'veg', is_available: true, description: '' });
      fetchData();
    }
  };

  if (loading) return <div className="flex-1 flex items-center justify-center font-black uppercase tracking-[0.5em]">Syncing Database...</div>;

  return (
    <div className="flex flex-col gap-8 animate-in fade-in duration-500">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-3xl font-black uppercase tracking-tighter italic border-b-4 border-black">Menu Catalog</h2>
        <button 
          onClick={() => setIsAdding(!isAdding)}
          className={`flex items-center gap-3 bg-[${PRIMARY_YELLOW}] text-black font-black px-8 py-4 ${BORDER_BLACK} shadow-[4px_4px_0px_#000000] hover:-translate-y-1 transition-all`}
        >
          {isAdding ? <X size={20} strokeWidth={4} /> : <Plus size={20} strokeWidth={4} />}
          <span className="uppercase tracking-widest text-xs">{isAdding ? 'CANCEL' : 'ADD NEW DISH'}</span>
        </button>
      </div>

      <div className={`bg-white ${BORDER_BLACK} shadow-[8px_8px_0px_#000000] overflow-hidden`}>
        <table className="w-full text-left uppercase font-black text-xs">
          <thead className="bg-black text-white">
            <tr>
              <th className="p-6 tracking-widest">DISH DETAILS</th>
              <th className="p-6 tracking-widest">CATEGORY</th>
              <th className="p-6 tracking-widest">PRICE</th>
              <th className="p-6 tracking-widest">AVAILABILITY</th>
              <th className="p-6 tracking-widest text-right">OPERATIONS</th>
            </tr>
          </thead>
          <tbody className="divide-y-4 divide-black">
            {/* Inline Add Row */}
            {isAdding && (
              <tr className={`bg-[${PRIMARY_YELLOW}]/20 animate-in slide-in-from-top duration-300`}>
                <td className="p-6">
                  <div className="space-y-4">
                    <input 
                      placeholder="NAME (e.g. Malabar Parotta)" 
                      className={`w-full bg-white p-3 ${BORDER_BLACK} font-black text-xs uppercase`}
                      value={newForm.name}
                      onChange={e => setNewForm({...newForm, name: e.target.value})}
                    />
                    <textarea 
                      placeholder="DESCRIPTION..." 
                      className={`w-full bg-white p-3 ${BORDER_BLACK} font-black text-[10px] h-20`}
                      value={newForm.description}
                      onChange={e => setNewForm({...newForm, description: e.target.value})}
                    />
                  </div>
                </td>
                <td className="p-6">
                  <select 
                    className={`w-full bg-white p-3 ${BORDER_BLACK} font-black`}
                    value={newForm.category_id}
                    onChange={e => setNewForm({...newForm, category_id: e.target.value})}
                  >
                    <option value="">Select Category</option>
                    {categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                  </select>
                </td>
                <td className="p-6">
                  <div className="flex items-center gap-2">
                    <span className="text-lg italic">₹</span>
                    <input 
                      type="number"
                      placeholder="0.00" 
                      className={`w-24 bg-white p-3 ${BORDER_BLACK} font-black`}
                      value={newForm.price}
                      onChange={e => setNewForm({...newForm, price: e.target.value})}
                    />
                  </div>
                </td>
                <td className="p-6">
                  <div className="flex gap-4 items-center">
                    <div className="flex items-center gap-2">
                      <input 
                        type="checkbox" 
                        className="w-5 h-5 accent-black" 
                        checked={newForm.is_available}
                        onChange={e => setNewForm({...newForm, is_available: e.target.checked})}
                      />
                      <span>ACTIVE</span>
                    </div>
                    <select 
                      className="bg-white border-2 border-black p-1 text-[10px]"
                      value={newForm.veg_type}
                      onChange={e => setNewForm({...newForm, veg_type: e.target.value})}
                    >
                      <option value="veg">VEG</option>
                      <option value="non_veg">NON-VEG</option>
                    </select>
                  </div>
                </td>
                <td className="p-6 text-right">
                  <button 
                    onClick={handleAdd}
                    className="bg-black text-white p-4 border-2 border-white hover:bg-green-600 transition-colors"
                  >
                    <CheckCircle2 size={24} />
                  </button>
                </td>
              </tr>
            )}

            {items.map((item) => (
              <tr key={item.id} className={`${editingId === item.id ? `bg-[${PRIMARY_YELLOW}]/10` : 'hover:bg-gray-50'}`}>
                <td className="p-6">
                  {editingId === item.id ? (
                    <div className="space-y-2">
                      <input 
                        className={`w-full bg-white p-2 border-2 border-black font-black text-xs uppercase`}
                        value={editForm.name}
                        onChange={e => setEditForm({...editForm, name: e.target.value})}
                      />
                      <textarea 
                        className={`w-full bg-white p-2 border-2 border-black font-black text-[10px] h-14`}
                        value={editForm.description}
                        onChange={e => setEditForm({...editForm, description: e.target.value})}
                      />
                    </div>
                  ) : (
                    <div className="flex flex-col">
                      <span className="text-lg tracking-tighter">{item.name}</span>
                      <span className="text-[10px] text-black/50 line-clamp-1">{item.description}</span>
                      <img src={item.image_url} alt="" className="w-12 h-12 border-2 border-black mt-2 bg-gray-100 object-cover" />
                    </div>
                  )}
                </td>
                <td className="p-6">
                  {editingId === item.id ? (
                    <select 
                      className="bg-white border-2 border-black p-2 font-black w-full"
                      value={editForm.category_id}
                      onChange={e => setEditForm({...editForm, category_id: e.target.value})}
                    >
                      {categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                    </select>
                  ) : (
                    <span className="px-4 py-2 border-2 border-black/10 text-[10px]">{categories.find(c => c.id === item.category_id)?.name || 'NONE'}</span>
                  )}
                </td>
                <td className="p-6">
                  {editingId === item.id ? (
                    <input 
                      type="number"
                      className="bg-white border-2 border-black p-2 font-black w-24"
                      value={editForm.price}
                      onChange={e => setEditForm({...editForm, price: e.target.value})}
                    />
                  ) : (
                    <span className="text-lg italic">₹{item.price}</span>
                  )}
                </td>
                <td className="p-6">
                  <div className="flex flex-col gap-2">
                    <div className="flex items-center gap-2">
                      <div className={`w-3 h-3 border-2 border-black ${item.is_available ? 'bg-green-500' : 'bg-red-500'}`}></div>
                      <span className="text-[10px]">{item.is_available ? 'IN STOCK' : 'SOLD OUT'}</span>
                    </div>
                    <span className={`text-[10px] italic ${item.veg_type === 'veg' ? 'text-green-600' : 'text-red-600'}`}>
                      {item.veg_type?.toUpperCase()}
                    </span>
                  </div>
                </td>
                <td className="p-6 text-right">
                  <div className="flex items-center gap-4 justify-end">
                    {editingId === item.id ? (
                      <>
                        <button onClick={() => handleSave(item.id)} className="p-3 bg-black text-white hover:bg-green-600 border-2 border-black">
                          <Save size={20} />
                        </button>
                        <button onClick={() => setEditingId(null)} className="p-3 bg-white text-black hover:bg-gray-200 border-2 border-black">
                          <X size={20} />
                        </button>
                      </>
                    ) : (
                      <>
                        <button onClick={() => handleEdit(item)} className="p-3 border-2 border-black hover:bg-black hover:text-white transition-all">
                          <Edit2 size={20} />
                        </button>
                        <button onClick={() => handleDelete(item.id)} className="p-3 border-2 border-black text-red-600 hover:bg-red-600 hover:text-white transition-all">
                          <Trash2 size={20} />
                        </button>
                      </>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default MenuManagement;
