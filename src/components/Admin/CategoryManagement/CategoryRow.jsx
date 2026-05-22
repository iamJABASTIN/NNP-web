import React from 'react';
import { Edit2, Trash2 } from 'lucide-react';

const CategoryRow = ({ category, onEdit, onDelete, onManageDishes }) => {
  return (
    <tr className="hover:bg-gray-50 border-b-2 border-black/10">
      <td className="p-6 font-bold text-sm tracking-tight">{category.name.toUpperCase()}</td>
      <td className="p-6">
        <button
          onClick={() => onManageDishes(category.id)}
          className="px-3 py-1.5 border-2 border-black hover:bg-black hover:text-white transition-all text-[10px] inline-block font-black cursor-pointer bg-white"
          title={`Manage dishes in ${category.name}`}
        >
          {category.item_count} ITEMS
        </button>
      </td>
      <td className="p-6 font-bold text-sm">{category.display_order}</td>
      <td className="p-6 text-right">
        <div className="flex items-center gap-3 justify-end">
          <button
            onClick={() => onEdit(category)}
            className="p-3 border-2 border-black hover:bg-black hover:text-white transition-all"
            aria-label={`Edit ${category.name}`}
          >
            <Edit2 size={18} />
          </button>
          <button
            onClick={() => onDelete(category)}
            className="p-3 border-2 border-black text-red-600 hover:bg-red-600 hover:text-white transition-all"
            aria-label={`Delete ${category.name}`}
          >
            <Trash2 size={18} />
          </button>
        </div>
      </td>
    </tr>
  );
};

export default CategoryRow;
