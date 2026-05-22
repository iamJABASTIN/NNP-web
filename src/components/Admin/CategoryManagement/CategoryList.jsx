import React from 'react';
import CategoryRow from './CategoryRow';

const CategoryList = ({ categories, onEdit, onDelete, onManageDishes }) => {
  return (
    <table className="w-full min-w-[500px] text-left uppercase font-black text-xs">
      <thead className="bg-black text-white">
        <tr>
          <th className="p-6 tracking-widest">CATEGORY NAME</th>
          <th className="p-6 tracking-widest">DISHES COUNT</th>
          <th className="p-6 tracking-widest">DISPLAY ORDER</th>
          <th className="p-6 tracking-widest text-right">OPERATIONS</th>
        </tr>
      </thead>
      <tbody className="divide-y-4 divide-black">
        {categories.length === 0 ? (
          <tr>
            <td colSpan={4} className="py-16 text-center text-black/30 uppercase tracking-widest">
              No categories found
            </td>
          </tr>
        ) : (
          categories.map((cat) => (
            <CategoryRow
              key={cat.id}
              category={cat}
              onEdit={onEdit}
              onDelete={onDelete}
              onManageDishes={onManageDishes}
            />
          ))
        )}
      </tbody>
    </table>
  );
};

export default CategoryList;
