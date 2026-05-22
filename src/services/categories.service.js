import { supabase } from '../lib/supabase';

const DEFAULT_RID = '00000000-0000-0000-0000-000000000001';

export async function fetchCategories() {
  const { data, error } = await supabase
    .from('categories')
    .select('*, menu_items(id, name, is_deleted)')
    .order('display_order', { ascending: true });

  if (error) throw new Error(error.message);
  return (data || []).map(cat => ({
    ...cat,
    item_count: cat.menu_items ? cat.menu_items.filter(item => !item.is_deleted).length : 0
  }));
}

export async function checkCategoryHasItems(categoryId) {
  const { count, error } = await supabase
    .from('menu_items')
    .select('id', { count: 'exact', head: true })
    .eq('category_id', categoryId)
    .eq('is_deleted', false);

  if (error) throw new Error(error.message);
  return count > 0;
}

export async function createCategory(name, displayOrder = 0) {
  const { data, error } = await supabase
    .from('categories')
    .insert([{ 
      restaurant_id: DEFAULT_RID,
      name, 
      display_order: parseInt(displayOrder) || 0,
      is_active: true
    }])
    .select()
    .single();

  if (error) throw new Error(error.message);
  return data;
}

export async function updateCategory(id, updates) {
  const { data, error } = await supabase
    .from('categories')
    .update({
      name: updates.name,
      display_order: parseInt(updates.display_order) || 0,
      is_active: updates.is_active
    })
    .eq('id', id)
    .select()
    .single();

  if (error) throw new Error(error.message);
  return data;
}

export async function deleteCategory(id) {
  const { error } = await supabase
    .from('categories')
    .delete()
    .eq('id', id);

  if (error) throw new Error(error.message);
  return true;
}

export async function reassignDishCategory(dishId, newCategoryId) {
  const { data, error } = await supabase
    .from('menu_items')
    .update({ category_id: newCategoryId })
    .eq('id', dishId)
    .select()
    .single();

  if (error) throw new Error(error.message);
  return data;
}
