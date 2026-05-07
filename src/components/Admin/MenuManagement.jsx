import React, { useState, useEffect } from 'react';
import { 
  Plus, 
  Trash2, 
  Edit2, 
  Save, 
  X, 
  AlertTriangle,
  Image as ImageIcon,
  Upload,
  Loader2,
  Search,
  Filter,
  RefreshCw
} from 'lucide-react';
import { useRef, useMemo } from 'react';
import { supabase } from '../../lib/supabase';
import { 
  PRIMARY_YELLOW, 
  BORDER_BLACK,
  SHADOW_BLACK
} from '../../constants/adminStyles';

const EMPTY_FORM = {
  name: '',
  description: '',
  price: '',
  cost_price: '',
  category_id: '',
  veg_type: 'veg',
  is_available: true,
  is_featured: false,
  image_url: '',
  spice_level: 0,
  prep_time_mins: 15,
};

const MenuManagement = () => {
  const [items, setItems] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  // Modal state
  const [showModal, setShowModal] = useState(false);
  const [modalMode, setModalMode] = useState('add'); // 'add' | 'edit'
  const [form, setForm] = useState({ ...EMPTY_FORM });
  const [editingId, setEditingId] = useState(null);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [notification, setNotification] = useState({ message: '', type: null });
  const fileInputRef = useRef(null);

  // Search & Filter state
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedType, setSelectedType] = useState('all');

  const showNotification = (message, type = 'success') => {
    setNotification({ message, type });
    setTimeout(() => setNotification({ message: '', type: null }), 3000);
  };

  // Delete confirmation
  const [deleteTarget, setDeleteTarget] = useState(null);

  const fetchData = async () => {
    setLoading(true);
    const { data: menuData } = await supabase.from('menu_items').select('*').order('created_at', { ascending: false });
    const { data: catData } = await supabase.from('categories').select('*').order('display_order');
    setItems(menuData || []);
    setCategories(catData || []);
    setLoading(false);
  };

  const filteredItems = useMemo(() => {
    return items.filter(item => {
      const matchesSearch = item.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                           item.description?.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesCategory = selectedCategory === 'all' || item.category_id === selectedCategory;
      const matchesType = selectedType === 'all' || item.veg_type === selectedType;
      return matchesSearch && matchesCategory && matchesType;
    });
  }, [items, searchQuery, selectedCategory, selectedType]);

  useEffect(() => { fetchData(); }, []);

  const openAddModal = () => {
    setModalMode('add');
    setForm({ ...EMPTY_FORM, category_id: categories[0]?.id || '' });
    setEditingId(null);
    setShowModal(true);
  };

  const openEditModal = (item) => {
    setModalMode('edit');
    setForm({
      name: item.name || '',
      description: item.description || '',
      price: item.price ?? '',
      cost_price: item.cost_price ?? '',
      category_id: item.category_id || '',
      veg_type: item.veg_type || 'veg',
      is_available: item.is_available ?? true,
      is_featured: item.is_featured ?? false,
      image_url: item.image_url || '',
      spice_level: item.spice_level ?? 0,
      prep_time_mins: item.prep_time_mins ?? 15,
    });
    setEditingId(item.id);
    setShowModal(true);
  };

  const handleSave = async () => {
    if (!form.name.trim() || !form.price) return;
    setSaving(true);

    const payload = {
      name: form.name.trim(),
      description: form.description.trim(),
      price: parseFloat(form.price) || 0,
      cost_price: form.cost_price ? parseFloat(form.cost_price) : null,
      category_id: form.category_id || null,
      veg_type: form.veg_type,
      is_available: form.is_available,
      is_featured: form.is_featured,
      image_url: form.image_url.trim() || null,
      spice_level: parseInt(form.spice_level) || 0,
      prep_time_mins: parseInt(form.prep_time_mins) || 15,
      updated_at: new Date().toISOString(),
    };

    if (modalMode === 'add') {
      const DEFAULT_RID = '00000000-0000-0000-0000-000000000001';
      await supabase.from('menu_items').insert([{ ...payload, restaurant_id: DEFAULT_RID }]);
    } else {
      await supabase.from('menu_items').update(payload).eq('id', editingId);
    }

    setSaving(false);
    setShowModal(false);
    fetchData();
  };

  const handleFileUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Constraints: 1MB limit, images only
    if (file.size > 1024 * 1024) {
      showNotification("Image size must be less than 1MB", 'error');
      return;
    }
    if (!file.type.startsWith('image/')) {
      showNotification("Please upload an image file", 'error');
      return;
    }

    setUploading(true);
    try {
      const fileExt = file.name.split('.').pop();
      const fileName = `${Math.random().toString(36).substring(2)}_${Date.now()}.${fileExt}`;
      const filePath = `items/${fileName}`;

      const { data, error } = await supabase.storage
        .from('menu_items')
        .upload(filePath, file);

      if (error) throw error;

      const { data: { publicUrl } } = supabase.storage
        .from('menu_items')
        .getPublicUrl(filePath);

      updateForm('image_url', publicUrl);
      showNotification("Image uploaded successfully!", 'success');
    } catch (error) {
      console.error('Error uploading image:', error.message);
      showNotification('Failed to upload image. Please try again.', 'error');
    } finally {
      setUploading(false);
    }
  };

  const handleDeleteConfirm = async () => {
    if (!deleteTarget) return;
    await supabase.from('menu_items').delete().eq('id', deleteTarget.id);
    setDeleteTarget(null);
    fetchData();
  };

  const updateForm = (field, value) => setForm({ ...form, [field]: value });

  if (loading) return <div className="flex-1 flex items-center justify-center font-black uppercase tracking-[0.5em]">Syncing Database...</div>;

  return (
    <div className="flex flex-col gap-8 animate-in fade-in duration-500 relative">
      {/* Custom Notification */}
      {notification.message && (
        <div className={`fixed top-6 right-6 z-[100] p-5 ${BORDER_BLACK} ${SHADOW_BLACK} flex items-center gap-3 animate-in slide-in-from-right duration-300 ${
          notification.type === 'error' ? 'bg-red-50' : 'bg-green-50'
        }`}>
          {notification.type === 'error' ? (
            <AlertTriangle className="text-red-600" size={20} />
          ) : (
            <div className="bg-green-600 rounded-full p-1"><Save className="text-white" size={12} /></div>
          )}
          <span className="font-black uppercase tracking-widest text-[10px]">{notification.message}</span>
          <button onClick={() => setNotification({ message: '', type: null })} className="ml-4 hover:scale-110 transition-transform">
            <X size={14} strokeWidth={3} />
          </button>
        </div>
      )}

      <div className="flex items-center justify-between mb-4">
        <h2 className="text-3xl font-black uppercase tracking-tighter italic border-b-4 border-black">Menu Catalog</h2>
        <div className="flex gap-4">
          <button 
            onClick={fetchData}
            className={`p-4 border-2 border-black hover:bg-black hover:text-white transition-all`}
            title="Refresh Data"
          >
            <RefreshCw size={20} className={loading ? 'animate-spin' : ''} />
          </button>
          <button 
            onClick={openAddModal}
            className={`flex items-center gap-3 bg-accent text-black font-black px-8 py-4 ${BORDER_BLACK} shadow-[4px_4px_0px_#000000] hover:-translate-y-1 transition-all`}
          >
            <Plus size={20} strokeWidth={4} />
            <span className="uppercase tracking-widest text-xs">ADD NEW DISH</span>
          </button>
        </div>
      </div>

      {/* Search & Filter Bar */}
      <div className={`bg-white ${BORDER_BLACK} p-4 shadow-[4px_4px_0px_#000000] flex flex-wrap items-center gap-6`}>
        <div className="flex-1 min-w-[200px] relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-black/30" size={18} />
          <input 
            type="text" 
            placeholder="Search by name or description..."
            className={`w-full pl-12 pr-4 py-3 border-2 border-black/10 focus:border-black outline-none font-bold text-sm uppercase tracking-tight`}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <Filter size={14} className="text-black/40" />
            <select 
              className="bg-transparent font-black uppercase text-[10px] tracking-widest outline-none cursor-pointer border-b-2 border-black/10 focus:border-black py-1"
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
            >
              <option value="all">ALL CATEGORIES</option>
              {categories.map(c => <option key={c.id} value={c.id}>{c.name.toUpperCase()}</option>)}
            </select>
          </div>

          <div className="flex items-center gap-2">
            <select 
              className="bg-transparent font-black uppercase text-[10px] tracking-widest outline-none cursor-pointer border-b-2 border-black/10 focus:border-black py-1"
              value={selectedType}
              onChange={(e) => setSelectedType(e.target.value)}
            >
              <option value="all">ALL TYPES</option>
              <option value="veg">VEG ONLY</option>
              <option value="non_veg">NON-VEG ONLY</option>
            </select>
          </div>
        </div>
      </div>

      <div className={`bg-white ${BORDER_BLACK} shadow-[8px_8px_0px_#000000] overflow-hidden`}>
        <table className="w-full text-left uppercase font-black text-xs">
          <thead className="bg-black text-white">
            <tr>
              <th className="p-6 tracking-widest">DISH DETAILS</th>
              <th className="p-6 tracking-widest">CATEGORY</th>
              <th className="p-6 tracking-widest">PRICE</th>
              <th className="p-6 tracking-widest">STATUS</th>
              <th className="p-6 tracking-widest text-right">OPERATIONS</th>
            </tr>
          </thead>
          <tbody className="divide-y-4 divide-black">
            {filteredItems.length === 0 ? (
              <tr><td colSpan={5} className="py-16 text-center text-black/30 uppercase tracking-widest">No menu items found</td></tr>
            ) : filteredItems.map((item) => (
              <tr key={item.id} className="hover:bg-gray-50">
                <td className="p-6">
                  <div className="flex items-center gap-4">
                    {item.image_url ? (
                      <img src={item.image_url} alt="" className="w-14 h-14 border-2 border-black object-cover bg-gray-100 flex-shrink-0" />
                    ) : (
                      <div className="w-14 h-14 border-2 border-black bg-gray-100 flex items-center justify-center flex-shrink-0">
                        <ImageIcon size={20} className="text-black/20" />
                      </div>
                    )}
                    <div className="flex flex-col min-w-0">
                      <span className="text-sm tracking-tighter">{item.name}</span>
                      <span className="text-[10px] text-black/50 line-clamp-1 normal-case font-bold">{item.description}</span>
                      {item.prep_time_mins && (
                        <span className="text-[9px] text-black/30 mt-0.5">{item.prep_time_mins} min prep</span>
                      )}
                    </div>
                  </div>
                </td>
                <td className="p-6">
                  <span className="px-3 py-1.5 border-2 border-black/10 text-[10px] whitespace-nowrap inline-block font-black">
                    {categories.find(c => c.id === item.category_id)?.name || 'NONE'}
                  </span>
                </td>
                <td className="p-6">
                  <div className="flex flex-col">
                    <span className="text-lg italic">₹{item.price}</span>
                    {item.cost_price && (
                      <span className="text-[9px] text-black/40 normal-case font-bold">Cost: ₹{item.cost_price}</span>
                    )}
                  </div>
                </td>
                <td className="p-6">
                  <div className="flex flex-col gap-1.5">
                    <span className={`text-[10px] italic ${item.veg_type === 'veg' ? 'text-green-600' : 'text-red-600'}`}>
                      {item.veg_type?.toUpperCase()}
                    </span>
                    {item.is_featured && (
                      <span className="text-[9px] text-accent font-black">★ FEATURED</span>
                    )}
                  </div>
                </td>
                <td className="p-6 text-right">
                  <div className="flex items-center gap-3 justify-end">
                    <button 
                      onClick={() => openEditModal(item)} 
                      className="p-3 border-2 border-black hover:bg-black hover:text-white transition-all"
                      aria-label={`Edit ${item.name}`}
                    >
                      <Edit2 size={18} />
                    </button>
                    <button 
                      onClick={() => setDeleteTarget(item)} 
                      className="p-3 border-2 border-black text-red-600 hover:bg-red-600 hover:text-white transition-all"
                      aria-label={`Delete ${item.name}`}
                    >
                      <Trash2 size={18} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Add/Edit Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 bg-black/70 flex items-center justify-center p-4 backdrop-blur-sm">
          <div className={`bg-white p-8 max-w-lg w-full ${BORDER_BLACK} ${SHADOW_BLACK} relative max-h-[90vh] flex flex-col`}>
            <button
              onClick={() => setShowModal(false)}
              className="absolute -top-4 -right-4 bg-white border-4 border-black w-10 h-10 flex items-center justify-center font-black hover:bg-red-100 transition-colors"
              aria-label="Close modal"
            >
              <X size={18} strokeWidth={3} />
            </button>

            <div className="mb-6">
              <p className="text-[10px] font-black uppercase tracking-[0.3em] text-accent mb-1">
                {modalMode === 'add' ? 'New Dish' : 'Edit Dish'}
              </p>
              <h3 className="text-2xl font-black uppercase tracking-tighter">
                {modalMode === 'add' ? 'Add to Menu' : form.name || 'Edit Item'}
              </h3>
            </div>

            <div className="flex-1 space-y-6 overflow-y-auto overflow-x-hidden pr-2 pb-6 custom-scrollbar">
              {/* Name */}
              <div className="flex flex-col gap-1">
                <label className="text-[10px] font-black uppercase tracking-widest text-black/50">Dish Name *</label>
                <input
                  type="text"
                  className={`p-3 ${BORDER_BLACK} font-black text-sm uppercase focus:outline-none focus:border-accent`}
                  value={form.name}
                  onChange={e => updateForm('name', e.target.value)}
                  placeholder="e.g. Malabar Parotta"
                />
              </div>

              {/* Description */}
              <div className="flex flex-col gap-1">
                <label className="text-[10px] font-black uppercase tracking-widest text-black/50">Description</label>
                <textarea
                  className={`p-3 ${BORDER_BLACK} font-bold text-xs h-20 focus:outline-none focus:border-accent`}
                  value={form.description}
                  onChange={e => updateForm('description', e.target.value)}
                  placeholder="A short description of the dish..."
                />
              </div>

              {/* Price + Cost Price */}
              <div className="grid grid-cols-2 gap-4">
                <div className="flex flex-col gap-1">
                  <label className="text-[10px] font-black uppercase tracking-widest text-black/50">Selling Price *</label>
                  <div className="relative flex items-center">
                    <span className="absolute left-3 font-black text-black/40">₹</span>
                    <input
                      type="number"
                      className={`w-full pl-8 p-3 ${BORDER_BLACK} font-black text-sm focus:outline-none focus:border-accent`}
                      value={form.price}
                      onChange={e => updateForm('price', e.target.value)}
                      placeholder="0"
                      min="0"
                    />
                  </div>
                </div>
                <div className="flex flex-col gap-1">
                  <label className="text-[10px] font-black uppercase tracking-widest text-black/50">Cost Price</label>
                  <div className="relative flex items-center">
                    <span className="absolute left-3 font-black text-black/40">₹</span>
                    <input
                      type="number"
                      className={`w-full pl-8 p-3 ${BORDER_BLACK} font-black text-sm focus:outline-none focus:border-accent`}
                      value={form.cost_price}
                      onChange={e => updateForm('cost_price', e.target.value)}
                      placeholder="0"
                      min="0"
                    />
                  </div>
                </div>
              </div>

              {/* Category + Type */}
              <div className="grid grid-cols-2 gap-4">
                <div className="flex flex-col gap-1">
                  <label className="text-[10px] font-black uppercase tracking-widest text-black/50">Category</label>
                  <select
                    className={`p-3 ${BORDER_BLACK} font-black text-sm focus:outline-none focus:border-accent bg-white`}
                    value={form.category_id}
                    onChange={e => updateForm('category_id', e.target.value)}
                  >
                    <option value="">Select Category</option>
                    {categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                  </select>
                </div>
                <div className="flex flex-col gap-1">
                  <label className="text-[10px] font-black uppercase tracking-widest text-black/50">Dietary Type</label>
                  <select
                    className={`p-3 ${BORDER_BLACK} font-black text-sm focus:outline-none focus:border-accent bg-white`}
                    value={form.veg_type}
                    onChange={e => updateForm('veg_type', e.target.value)}
                  >
                    <option value="veg">VEG</option>
                    <option value="non_veg">NON-VEG</option>
                  </select>
                </div>
              </div>

              {/* Image Section */}
              <div className="flex flex-col gap-3">
                <label className="text-[10px] font-black uppercase tracking-widest text-black/50">Food Image</label>
                
                <div className="flex gap-4">
                  {/* Preview / Placeholder */}
                  <div className={`w-24 h-24 ${BORDER_BLACK} bg-gray-50 flex items-center justify-center flex-shrink-0 relative group overflow-hidden`}>
                    {form.image_url ? (
                      <img src={form.image_url} alt="preview" className="w-full h-full object-cover" />
                    ) : (
                      <ImageIcon size={32} className="text-black/10" />
                    )}
                    {uploading && (
                      <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                        <Loader2 size={24} className="text-white animate-spin" />
                      </div>
                    )}
                  </div>

                  <div className="flex-1 flex flex-col gap-2">
                    <input
                      type="file"
                      ref={fileInputRef}
                      className="hidden"
                      accept="image/*"
                      onChange={handleFileUpload}
                    />
                    <button
                      type="button"
                      onClick={() => fileInputRef.current?.click()}
                      disabled={uploading}
                      className={`flex items-center justify-center gap-2 py-3 px-4 ${BORDER_BLACK} bg-white font-black text-[10px] uppercase tracking-widest hover:bg-gray-50 transition-all disabled:opacity-50`}
                    >
                      <Upload size={14} strokeWidth={3} />
                      {uploading ? 'Uploading...' : 'Upload Picture'}
                    </button>
                    <p className="text-[9px] text-black/40 font-bold leading-tight">
                      Recommended: Square 1:1 ratio. <br/>
                      Max size: 1MB (JPG, PNG, WEBP)
                    </p>
                  </div>
                </div>

                <div className="flex flex-col gap-1">
                  <label className="text-[9px] font-bold uppercase text-black/30">Or provide image link</label>
                  <input
                    type="url"
                    className={`p-3 ${BORDER_BLACK} font-bold text-xs focus:outline-none focus:border-accent`}
                    value={form.image_url}
                    onChange={e => updateForm('image_url', e.target.value)}
                    placeholder="https://example.com/image.jpg"
                  />
                </div>
              </div>

              {/* Prep Time */}
              <div className="flex flex-col gap-1">
                <label className="text-[10px] font-black uppercase tracking-widest text-black/50">Prep Time (minutes)</label>
                <div className="flex items-center gap-3">
                  <input
                    type="range"
                    min="5"
                    max="60"
                    step="5"
                    className="flex-1 accent-black h-2 bg-gray-100 rounded-lg appearance-none cursor-pointer"
                    value={form.prep_time_mins}
                    onChange={e => updateForm('prep_time_mins', e.target.value)}
                  />
                  <span className={`w-16 p-2 ${BORDER_BLACK} text-center font-black text-xs`}>
                    {form.prep_time_mins}m
                  </span>
                </div>
              </div>
            </div>

            {/* Save Button */}
            <button
              onClick={handleSave}
              disabled={saving || !form.name.trim() || !form.price}
              className={`w-full mt-6 py-4 bg-black text-white font-black uppercase tracking-widest text-xs flex items-center justify-center gap-3 ${BORDER_BLACK} hover:-translate-y-0.5 transition-all shadow-[4px_4px_0px_#f2ca50] disabled:opacity-50 disabled:cursor-not-allowed`}
            >
              <Save size={18} strokeWidth={3} />
              {saving ? 'Saving...' : modalMode === 'add' ? 'Add Dish' : 'Save Changes'}
            </button>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {deleteTarget && (
        <div className="fixed inset-0 z-50 bg-black/70 flex items-center justify-center p-6 backdrop-blur-sm">
          <div className={`bg-white p-8 max-w-sm w-full ${BORDER_BLACK} ${SHADOW_BLACK}`}>
            <div className="flex items-center gap-3 mb-4">
              <AlertTriangle size={24} strokeWidth={2.5} className="text-red-600" />
              <h3 className="text-xl font-black uppercase tracking-tighter">Delete Dish?</h3>
            </div>
            <p className="text-sm font-bold text-black/60 mb-6">
              Are you sure you want to delete <strong className="text-black">{deleteTarget.name}</strong>? This cannot be undone.
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => setDeleteTarget(null)}
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
    </div>
  );
};

export default MenuManagement;
