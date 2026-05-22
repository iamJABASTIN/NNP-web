import { useState, useEffect } from 'react';
import * as categoriesService from '../services/categories.service';

export function useCategoryManagement() {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [modalMode, setModalMode] = useState('add');
  const [form, setForm] = useState({ name: '', display_order: '0' });
  const [editingId, setEditingId] = useState(null);
  const [saving, setSaving] = useState(false);
  const [notification, setNotification] = useState({ message: '', type: null });
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [activeDishesCategoryId, setActiveDishesCategoryId] = useState(null);

  const showNotification = (message, type = 'success') => {
    setNotification({ message, type });
    setTimeout(() => setNotification({ message: '', type: null }), 3000);
  };

  const fetchData = async () => {
    try {
      setLoading(true);
      setError(null);
      setCategories(await categoriesService.fetchCategories());
    } catch (err) {
      setError(err.message || 'Failed to fetch categories');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchData(); }, []);

  const handleSave = async () => {
    if (!form.name.trim()) return;
    setSaving(true);
    try {
      if (modalMode === 'add') {
        await categoriesService.createCategory(form.name.trim(), form.display_order);
        showNotification('Category added successfully!');
      } else {
        await categoriesService.updateCategory(editingId, { name: form.name.trim(), display_order: form.display_order, is_active: true });
        showNotification('Category updated successfully!');
      }
      setShowModal(false);
      fetchData();
    } catch (err) {
      showNotification(err.message || 'Failed to save category', 'error');
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteConfirm = async () => {
    if (!deleteTarget) return;
    try {
      if (await categoriesService.checkCategoryHasItems(deleteTarget.id)) {
        showNotification(`Cannot delete: Category has items`, 'error');
      } else {
        await categoriesService.deleteCategory(deleteTarget.id);
        showNotification('Category deleted successfully!');
        fetchData();
      }
    } catch (err) {
      showNotification(err.message || 'Failed to delete category', 'error');
    } finally {
      setDeleteTarget(null);
    }
  };

  const handleReassignDish = async (dishId, newCategoryId) => {
    try {
      await categoriesService.reassignDishCategory(dishId, newCategoryId);
      showNotification('Dish reassigned successfully!');
      await fetchData();
    } catch (err) {
      showNotification(err.message || 'Failed to reassign dish', 'error');
    }
  };

  return {
    categories, loading, error, showModal, setShowModal, modalMode, setModalMode,
    form, setForm, editingId, setEditingId, saving, notification, setNotification,
    deleteTarget, setDeleteTarget, activeDishesCategoryId, setActiveDishesCategoryId,
    handleSave, handleDeleteConfirm, handleReassignDish, fetchData, showNotification
  };
}
