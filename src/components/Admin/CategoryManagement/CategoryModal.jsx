import React from 'react';
import { X, Save } from 'lucide-react';
import { BORDER_BLACK, SHADOW_BLACK } from '../../../constants/adminStyles';

const CategoryModal = ({ show, mode, form, setForm, onSave, onClose, saving }) => {
  if (!show) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/70 flex items-center justify-center p-4 backdrop-blur-sm">
      <div className={`bg-white p-8 max-w-md w-full ${BORDER_BLACK} ${SHADOW_BLACK} relative flex flex-col`}>
        <button
          onClick={onClose}
          className="absolute -top-4 -right-4 bg-white border-4 border-black w-10 h-10 flex items-center justify-center font-black hover:bg-red-100 transition-colors"
          aria-label="Close modal"
        >
          <X size={18} strokeWidth={3} />
        </button>

        <div className="mb-6">
          <p className="text-[10px] font-black uppercase tracking-[0.3em] text-[#f2ca50] mb-1">
            {mode === 'add' ? 'New Category' : 'Edit Category'}
          </p>
          <h3 className="text-2xl font-black uppercase tracking-tighter">
            {mode === 'add' ? 'Add Category' : 'Save Category'}
          </h3>
        </div>

        <div className="space-y-6">
          <div className="flex flex-col gap-1">
            <label className="text-[10px] font-black uppercase tracking-widest text-black/50">Category Name *</label>
            <input
              type="text"
              className={`p-3 ${BORDER_BLACK} font-black text-sm uppercase focus:outline-none focus:border-[#f2ca50]`}
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              placeholder="e.g. Desserts"
            />
          </div>

          <div className="flex flex-col gap-1">
            <label className="text-[10px] font-black uppercase tracking-widest text-black/50">Category Name (Tamil)</label>
            <input
              type="text"
              className={`p-3 ${BORDER_BLACK} font-black text-sm focus:outline-none focus:border-[#f2ca50]`}
              value={form.name_ta || ''}
              onChange={(e) => setForm({ ...form, name_ta: e.target.value })}
              placeholder="எ.கா. இனிப்புகள்"
            />
          </div>

          <div className="flex flex-col gap-1">
            <label className="text-[10px] font-black uppercase tracking-widest text-black/50">Display Order</label>
            <input
              type="number"
              className={`p-3 ${BORDER_BLACK} font-black text-sm focus:outline-none focus:border-[#f2ca50]`}
              value={form.display_order}
              onChange={(e) => setForm({ ...form, display_order: e.target.value })}
              placeholder="0"
              min="0"
            />
          </div>
        </div>

        <button
          onClick={onSave}
          disabled={saving || !form.name.trim()}
          className={`w-full mt-6 py-4 bg-black text-white font-black uppercase tracking-widest text-xs flex items-center justify-center gap-3 ${BORDER_BLACK} hover:-translate-y-0.5 transition-all shadow-[4px_4px_0px_#f2ca50] disabled:opacity-50`}
        >
          <Save size={18} strokeWidth={3} />
          {saving ? 'Saving...' : mode === 'add' ? 'Add Category' : 'Save Changes'}
        </button>
      </div>
    </div>
  );
};

export default CategoryModal;
