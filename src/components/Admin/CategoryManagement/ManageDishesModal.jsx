import React from 'react';
import { X, ArrowRight } from 'lucide-react';
import { BORDER_BLACK, SHADOW_BLACK } from '../../../constants/adminStyles';

const ManageDishesModal = ({ show, category, categories, onReassign, onClose }) => {
  if (!show || !category) return null;

  const dishes = (category.menu_items || []).filter((item) => !item.is_deleted);

  return (
    <div className="fixed inset-0 z-50 bg-black/70 flex items-center justify-center p-4 backdrop-blur-sm">
      <div className={`bg-white p-8 max-w-lg w-full ${BORDER_BLACK} ${SHADOW_BLACK} relative flex flex-col max-h-[85vh]`}>
        <button
          onClick={onClose}
          className="absolute -top-4 -right-4 bg-white border-4 border-black w-10 h-10 flex items-center justify-center font-black hover:bg-red-100 transition-colors"
          aria-label="Close modal"
        >
          <X size={18} strokeWidth={3} />
        </button>

        <div className="mb-6">
          <p className="text-[10px] font-black uppercase tracking-[0.3em] text-[#f2ca50] mb-1">
            Manage Category Dishes
          </p>
          <h3 className="text-2xl font-black uppercase tracking-tighter">
            {category.name}
          </h3>
        </div>

        <div className="flex-1 overflow-y-auto pr-2 space-y-4 max-h-[50vh]">
          {dishes.length === 0 ? (
            <p className="text-center py-8 text-black/40 font-bold uppercase tracking-widest text-xs">
              No active dishes in this category
            </p>
          ) : (
            dishes.map((dish) => (
              <div key={dish.id} className={`p-4 bg-gray-50 ${BORDER_BLACK} flex flex-col sm:flex-row sm:items-center justify-between gap-3`}>
                <span className="font-bold text-xs uppercase tracking-tight truncate max-w-[200px]">
                  {dish.name}
                </span>
                <div className="flex items-center gap-2">
                  <span className="text-[9px] font-black text-black/50 uppercase tracking-widest">Move to</span>
                  <ArrowRight size={12} className="text-black/50" />
                  <select
                    value={category.id}
                    onChange={(e) => onReassign(dish.id, e.target.value)}
                    className={`bg-white px-2 py-1.5 ${BORDER_BLACK} text-[10px] font-black uppercase tracking-wider focus:outline-none focus:border-[#f2ca50] cursor-pointer`}
                  >
                    {categories.map((c) => (
                      <option key={c.id} value={c.id}>
                        {c.name.toUpperCase()}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default ManageDishesModal;
