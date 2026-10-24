import React, { useState, useEffect } from 'react';
import { Plus, Edit2, Trash2, FolderTree, X } from 'lucide-react';
import { api } from '../../services/api';
import { useToast } from '../../context/ToastContext';

export default function AdminCategories() {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCat, setEditingCat] = useState(null);
  const [form, setForm] = useState({
    name: '',
    description: '',
    image: 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?auto=format&fit=crop&w=800&q=80'
  });
  const [saving, setSaving] = useState(false);
  const { addToast } = useToast();

  const loadCategories = async () => {
    setLoading(true);
    try {
      const res = await api.getCategories();
      setCategories(res.categories || []);
    } catch {
      addToast('Failed to load categories', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadCategories();
  }, []);

  const handleOpenAdd = () => {
    setEditingCat(null);
    setForm({
      name: '',
      description: '',
      image: 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?auto=format&fit=crop&w=800&q=80'
    });
    setIsModalOpen(true);
  };

  const handleOpenEdit = (c) => {
    setEditingCat(c);
    setForm({
      name: c.name,
      description: c.description || '',
      image: c.image || ''
    });
    setIsModalOpen(true);
  };

  const handleDelete = async (id, name) => {
    if (!window.confirm(`Delete category "${name}"?`)) return;
    try {
      await api.deleteCategory(id);
      addToast(`Category "${name}" deleted.`);
      loadCategories();
    } catch (err) {
      addToast(err.message, 'error');
    }
  };

  const handleSave = async (e) => {
    e.preventDefault();
    if (!form.name) return;
    setSaving(true);
    try {
      if (editingCat) {
        await api.updateCategory(editingCat.id, form);
        addToast(`Category "${form.name}" updated.`);
      } else {
        await api.createCategory(form);
        addToast(`Category "${form.name}" created.`);
      }
      setIsModalOpen(false);
      loadCategories();
    } catch (err) {
      addToast(err.message, 'error');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-serif text-3xl font-bold text-anulok-espresso">Category Management</h1>
          <p className="text-xs text-stone-500 mt-1">Organize your store taxonomy and showroom departments.</p>
        </div>

        <button
          onClick={handleOpenAdd}
          className="px-5 py-3 bg-anulok-espresso hover:bg-anulok-wood text-white text-xs font-semibold uppercase tracking-wider rounded-xl transition-colors flex items-center justify-center gap-2 shadow-md"
        >
          <Plus className="w-4 h-4 text-anulok-amber" /> Add Category
        </button>
      </div>

      {/* Grid of Categories */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {loading ? (
          [...Array(6)].map((_, i) => (
            <div key={i} className="h-64 bg-white rounded-3xl border border-stone-200 animate-pulse" />
          ))
        ) : categories.map((cat) => (
          <div
            key={cat.id}
            className="bg-white rounded-3xl border border-stone-200/80 overflow-hidden shadow-xs flex flex-col justify-between"
          >
            <div className="relative aspect-[16/9] bg-stone-100 overflow-hidden">
              <img src={cat.image} alt={cat.name} className="w-full h-full object-cover" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent" />
              <div className="absolute bottom-3 left-4 right-4 text-white">
                <h3 className="font-serif text-lg font-bold">{cat.name}</h3>
                <span className="text-[11px] text-stone-200 font-mono">/{cat.slug}</span>
              </div>
            </div>

            <div className="p-5 flex-1 flex flex-col justify-between">
              <p className="text-xs text-stone-500 line-clamp-2 leading-relaxed">
                {cat.description || 'No description provided.'}
              </p>

              <div className="mt-4 pt-3 border-t border-stone-100 flex items-center justify-end gap-2">
                <button
                  onClick={() => handleOpenEdit(cat)}
                  className="p-1.5 rounded-lg text-stone-600 hover:text-anulok-wood hover:bg-stone-50 transition-colors"
                  title="Edit category"
                >
                  <Edit2 className="w-4 h-4" />
                </button>
                <button
                  onClick={() => handleDelete(cat.id, cat.name)}
                  className="p-1.5 rounded-lg text-stone-400 hover:text-rose-600 hover:bg-rose-50 transition-colors"
                  title="Delete category"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white w-full max-w-lg rounded-3xl shadow-2xl border border-stone-200 overflow-hidden animate-slide-up">
            <div className="p-6 bg-anulok-linen/60 border-b border-stone-200 flex items-center justify-between">
              <h3 className="font-serif text-xl font-bold text-anulok-espresso">
                {editingCat ? 'Edit Category' : 'Create Category'}
              </h3>
              <button onClick={() => setIsModalOpen(false)} className="p-1 text-stone-400 hover:text-stone-700">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSave} className="p-6 space-y-4">
              <div>
                <label className="text-xs uppercase font-bold text-stone-600 block mb-1">Category Name *</label>
                <input
                  type="text"
                  required
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  placeholder="e.g. Dining Tables"
                  className="w-full bg-anulok-cream border border-stone-300 rounded-xl px-4 py-2.5 text-xs outline-none focus:border-anulok-wood"
                />
              </div>

              <div>
                <label className="text-xs uppercase font-bold text-stone-600 block mb-1">Image URL</label>
                <input
                  type="text"
                  value={form.image}
                  onChange={(e) => setForm({ ...form, image: e.target.value })}
                  placeholder="https://images.unsplash.com/..."
                  className="w-full bg-anulok-cream border border-stone-300 rounded-xl px-4 py-2.5 text-xs outline-none focus:border-anulok-wood"
                />
              </div>

              <div>
                <label className="text-xs uppercase font-bold text-stone-600 block mb-1">Description</label>
                <textarea
                  rows={3}
                  value={form.description}
                  onChange={(e) => setForm({ ...form, description: e.target.value })}
                  placeholder="Short description for cards and navigation..."
                  className="w-full bg-anulok-cream border border-stone-300 rounded-xl px-4 py-2.5 text-xs outline-none focus:border-anulok-wood"
                />
              </div>

              <div className="pt-4 border-t border-stone-200 flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-5 py-2.5 border border-stone-300 rounded-xl text-xs font-semibold text-stone-600 hover:bg-stone-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="px-6 py-2.5 bg-anulok-espresso hover:bg-anulok-wood text-white rounded-xl text-xs font-semibold uppercase tracking-wider transition-colors disabled:opacity-50"
                >
                  {saving ? 'Saving...' : editingCat ? 'Save Changes' : 'Create Category'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
