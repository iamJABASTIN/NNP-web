import React, { useState } from 'react';
import { Pencil, Trash2, QrCode, Check, X } from 'lucide-react';
import { BORDER_BLACK } from '../../constants/adminStyles';

const TableCard = ({ table, onEdit, onDelete, onQR }) => {
  const [editing, setEditing] = useState(false);
  const [editNumber, setEditNumber] = useState(table.table_number);
  const [editCapacity, setEditCapacity] = useState(table.capacity);

  const handleSave = () => {
    if (!editNumber.trim()) return;
    onEdit(table.id, { table_number: editNumber.trim(), capacity: editCapacity });
    setEditing(false);
  };

  const handleCancel = () => {
    setEditNumber(table.table_number);
    setEditCapacity(table.capacity);
    setEditing(false);
  };

  if (editing) {
    return (
      <div className={`p-4 bg-accent/10 ${BORDER_BLACK} shadow-[4px_4px_0px_#000000]`}>
        <div className="flex flex-col gap-2 mb-3">
          <input
            type="text"
            value={editNumber}
            onChange={e => setEditNumber(e.target.value)}
            className="p-2 border-2 border-black font-black text-sm w-full text-center"
            placeholder="Number"
            autoFocus
          />
          <input
            type="number"
            value={editCapacity}
            onChange={e => setEditCapacity(parseInt(e.target.value) || 1)}
            className="p-1.5 border-2 border-black font-bold text-xs w-full text-center"
            placeholder="Seats"
            min={1}
          />
        </div>
        <div className="flex gap-1">
          <button
            onClick={handleSave}
            className="flex-1 p-1.5 bg-green-600 text-white border-2 border-black hover:bg-green-700 transition-colors"
            aria-label="Save changes"
          >
            <Check size={14} strokeWidth={3} className="mx-auto" />
          </button>
          <button
            onClick={handleCancel}
            className="flex-1 p-1.5 bg-white border-2 border-black hover:bg-gray-100 transition-colors"
            aria-label="Cancel editing"
          >
            <X size={14} strokeWidth={3} className="mx-auto" />
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className={`group relative p-4 bg-white ${BORDER_BLACK} shadow-[4px_4px_0px_#000000] hover:-translate-y-0.5 transition-all`}>
      <p className="text-lg font-black tracking-tighter text-center">T-{table.table_number}</p>
      <p className="text-[10px] text-black/50 tracking-widest text-center font-bold">{table.capacity} seats</p>
      <div className={`w-2 h-2 mx-auto mt-2 border border-black ${table.is_active ? 'bg-green-500' : 'bg-red-400'}`} />

      {/* Action buttons — visible on hover */}
      <div className="absolute inset-0 bg-white/90 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
        <button
          onClick={() => onQR(table)}
          className="w-9 h-9 bg-accent border-2 border-black flex items-center justify-center hover:scale-110 transition-transform"
          aria-label={`Generate QR for table ${table.table_number}`}
        >
          <QrCode size={16} strokeWidth={2.5} />
        </button>
        <button
          onClick={() => setEditing(true)}
          className="w-9 h-9 bg-white border-2 border-black flex items-center justify-center hover:scale-110 transition-transform"
          aria-label={`Edit table ${table.table_number}`}
        >
          <Pencil size={14} strokeWidth={2.5} />
        </button>
        <button
          onClick={() => onDelete(table)}
          className="w-9 h-9 bg-red-100 border-2 border-black flex items-center justify-center hover:scale-110 transition-transform hover:bg-red-200"
          aria-label={`Delete table ${table.table_number}`}
        >
          <Trash2 size={14} strokeWidth={2.5} className="text-red-600" />
        </button>
      </div>
    </div>
  );
};

export default TableCard;
