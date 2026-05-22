import React from 'react';
import { Plus, RefreshCw, AlertTriangle, Save, X } from 'lucide-react';
import { useCategoryManagement } from '../../../hooks/useCategoryManagement';
import CategoryList from './CategoryList';
import CategoryModal from './CategoryModal';
import ManageDishesModal from './ManageDishesModal';
import { BORDER_BLACK, SHADOW_BLACK } from '../../../constants/adminStyles';

const CategoryManagement = () => {
  const {
    categories, loading, error, showModal, setShowModal, modalMode, setModalMode,
    form, setForm, setEditingId, saving, notification, setNotification,
    deleteTarget, setDeleteTarget, activeDishesCategoryId, setActiveDishesCategoryId,
    handleSave, handleDeleteConfirm, handleReassignDish, fetchData
  } = useCategoryManagement();

  const openAddModal = () => {
    setModalMode('add'); setForm({ name: '', display_order: '0' }); setShowModal(true);
  };
  const openEditModal = (cat) => {
    setModalMode('edit'); setForm({ name: cat.name, display_order: String(cat.display_order) }); setEditingId(cat.id); setShowModal(true);
  };

  if (loading && categories.length === 0) {
    return <div className="flex-1 flex items-center justify-center font-black uppercase tracking-[0.5em]">Syncing Categories...</div>;
  }

  const activeDishesCategory = categories.find((cat) => cat.id === activeDishesCategoryId);

  return (
    <div className="flex flex-col gap-8 animate-in fade-in duration-500 relative">
      {/* Toast Notification */}
      {notification.message && (
        <div className={`fixed top-6 right-6 left-6 sm:left-auto z-[100] p-5 ${BORDER_BLACK} ${SHADOW_BLACK} flex items-center gap-3 animate-in slide-in-from-right duration-300 ${notification.type === 'error' ? 'bg-red-50' : 'bg-green-50'}`}>
          {notification.type === 'error' ? <AlertTriangle className="text-red-600" size={20} /> : <div className="bg-green-600 rounded-full p-1"><Save className="text-white" size={12} /></div>}
          <span className="font-black uppercase tracking-widest text-[10px]">{notification.message}</span>
          <button onClick={() => setNotification({ message: '', type: null })} className="ml-4 hover:scale-110 transition-transform"><X size={14} strokeWidth={3} /></button>
        </div>
      )}

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4">
        <h2 className="text-3xl font-black uppercase tracking-tighter italic border-b-4 border-black w-fit">Categories Catalog</h2>
        <div className="flex gap-2 sm:gap-4 w-full sm:w-auto">
          <button onClick={fetchData} className="p-4 border-2 border-black hover:bg-black hover:text-white transition-all flex-1 sm:flex-none flex justify-center" title="Refresh">
            <RefreshCw size={20} className={loading ? 'animate-spin' : ''} />
          </button>
          <button onClick={openAddModal} className={`flex-1 sm:flex-none flex items-center justify-center gap-3 bg-[#f2ca50] text-black font-black px-6 sm:px-8 py-4 ${BORDER_BLACK} shadow-[4px_4px_0px_#000000] hover:-translate-y-1 transition-all`}>
            <Plus size={20} strokeWidth={4} />
            <span className="uppercase tracking-widest text-xs">ADD CATEGORY</span>
          </button>
        </div>
      </div>

      {/* Error State */}
      {error && (
        <div className={`bg-red-50 p-6 ${BORDER_BLACK} flex items-center justify-between`}>
          <div className="flex items-center gap-3">
            <AlertTriangle className="text-red-600" size={24} /><span className="font-bold text-sm text-red-800 uppercase">{error}</span>
          </div>
          <button onClick={fetchData} className="px-4 py-2 border-2 border-black font-bold text-xs uppercase hover:bg-black hover:text-white transition-colors">Retry</button>
        </div>
      )}

      {/* Table List */}
      <div className={`bg-white ${BORDER_BLACK} shadow-[8px_8px_0px_#000000] overflow-x-auto w-full`}>
        <CategoryList categories={categories} onEdit={openEditModal} onDelete={setDeleteTarget} onManageDishes={setActiveDishesCategoryId} />
      </div>

      {/* Form Modal */}
      <CategoryModal show={showModal} mode={modalMode} form={form} setForm={setForm} onSave={handleSave} onClose={() => setShowModal(false)} saving={saving} />

      {/* Manage Dishes Modal */}
      <ManageDishesModal show={!!activeDishesCategoryId} category={activeDishesCategory} categories={categories} onReassign={handleReassignDish} onClose={() => setActiveDishesCategoryId(null)} />

      {/* Delete Confirmation Modal */}
      {deleteTarget && (
        <div className="fixed inset-0 z-50 bg-black/70 flex items-center justify-center p-6 backdrop-blur-sm">
          <div className={`bg-white p-8 max-w-sm w-full ${BORDER_BLACK} ${SHADOW_BLACK}`}>
            <div className="flex items-center gap-3 mb-4"><AlertTriangle size={24} strokeWidth={2.5} className="text-red-600" /><h3 className="text-xl font-black uppercase tracking-tighter">Delete Category?</h3></div>
            <p className="text-sm font-bold text-black/60 mb-6">Are you sure you want to delete <strong className="text-black">{deleteTarget.name}</strong>? This will fail if there are active dishes.</p>
            <div className="flex gap-3">
              <button onClick={() => setDeleteTarget(null)} className="flex-1 py-3 bg-white border-2 border-black font-black uppercase text-xs tracking-widest hover:bg-gray-100 transition-colors">Cancel</button>
              <button onClick={handleDeleteConfirm} className="flex-1 py-3 bg-red-600 text-white border-2 border-black font-black uppercase text-xs tracking-widest hover:bg-red-700 transition-colors">Delete</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CategoryManagement;
