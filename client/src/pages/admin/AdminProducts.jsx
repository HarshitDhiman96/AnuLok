import React, { useState, useEffect } from 'react';
import {
  Plus,
  Search,
  Edit2,
  Trash2,
  Star,
  Package,
  X,
  Check,
  AlertCircle,
  ExternalLink
} from 'lucide-react';
import { api } from '../../services/api';
import { useToast } from '../../context/ToastContext';
import { formatPrice } from '../../utils/formatters';

export default function AdminProducts() {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [saving, setSaving] = useState(false);

  const { addToast } = useToast();

  const emptyForm = {
    name: '',
    description: '',
    category: 'sofas',
    categoryName: 'Sofas & Lounges',
    price: '',
    discountPrice: '',
    images: 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?auto=format&fit=crop&w=1200&q=80',
    material: 'Kiln-Dried Solid Teak & Natural Linseed Oil',
    colorName: 'Teak Honey',
    colorHex: '#8C6239',
    dimensions: '72"W x 34"D x 30"H',
    weight: '48 kg',
    stock: 12,
    sku: `ANU-${Math.floor(1000 + Math.random() * 9000)}`,
    tags: 'furniture, luxury, solid wood',
    featured: false
  };

  const [form, setForm] = useState(emptyForm);

  const loadData = async () => {
    setLoading(true);
    try {
      const [prodRes, catRes] = await Promise.all([
        api.getProducts(),
        api.getCategories()
      ]);
      setProducts(prodRes.products || []);
      setCategories(catRes.categories || []);
    } catch (err) {
      addToast('Failed to load products', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleOpenAdd = () => {
    setEditingProduct(null);
    setForm({
      ...emptyForm,
      sku: `ANU-${Math.floor(1000 + Math.random() * 9000)}`
    });
    setIsModalOpen(true);
  };

  const handleOpenEdit = (p) => {
    setEditingProduct(p);
    setForm({
      name: p.name,
      description: p.description,
      category: p.category,
      categoryName: p.categoryName || p.category,
      price: p.price,
      discountPrice: p.discountPrice || p.price,
      images: Array.isArray(p.images) ? p.images.join(', ') : p.images || '',
      material: p.material || '',
      colorName: p.colors?.[0]?.name || 'Standard',
      colorHex: p.colors?.[0]?.hex || '#8C6239',
      dimensions: p.dimensions || '',
      weight: p.weight || '',
      stock: p.stock || 0,
      sku: p.sku || '',
      tags: Array.isArray(p.tags) ? p.tags.join(', ') : '',
      featured: Boolean(p.featured)
    });
    setIsModalOpen(true);
  };

  const handleDelete = async (id, name) => {
    if (!window.confirm(`Are you sure you want to permanently delete "${name}"?`)) {
      return;
    }
    try {
      await api.deleteProduct(id);
      addToast(`Deleted "${name}" successfully.`);
      loadData();
    } catch (err) {
      addToast(err.message, 'error');
    }
  };

  const handleSave = async (e) => {
    e.preventDefault();
    if (!form.name || !form.price) {
      addToast('Name and price are required.', 'error');
      return;
    }

    setSaving(true);
    try {
      const catObj = categories.find(c => c.slug === form.category);
      const categoryName = catObj ? catObj.name : form.category;

      const payload = {
        name: form.name,
        description: form.description,
        category: form.category,
        categoryName,
        price: Number(form.price),
        discountPrice: form.discountPrice ? Number(form.discountPrice) : Number(form.price),
        images: form.images.split(',').map(s => s.trim()).filter(Boolean),
        material: form.material,
        colors: [{ name: form.colorName, hex: form.colorHex }],
        dimensions: form.dimensions,
        weight: form.weight,
        stock: Number(form.stock),
        sku: form.sku,
        tags: form.tags.split(',').map(s => s.trim()).filter(Boolean),
        featured: Boolean(form.featured)
      };

      if (editingProduct) {
        await api.updateProduct(editingProduct.id, payload);
        addToast(`Updated "${form.name}" successfully.`);
      } else {
        await api.createProduct(payload);
        addToast(`Added new product "${form.name}" to inventory.`);
      }

      setIsModalOpen(false);
      loadData();
    } catch (err) {
      addToast(err.message, 'error');
    } finally {
      setSaving(false);
    }
  };

  const filtered = products.filter(p => {
    const matchesSearch = p.name.toLowerCase().includes(search.toLowerCase()) ||
      p.sku?.toLowerCase().includes(search.toLowerCase());
    const matchesCat = categoryFilter === 'all' || p.category === categoryFilter;
    return matchesSearch && matchesCat;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-serif text-3xl font-bold text-anulok-espresso">Product Catalog</h1>
          <p className="text-xs text-stone-500 mt-1">Manage all handcrafted inventory, prices, discounts, and dimensions.</p>
        </div>

        <button
          onClick={handleOpenAdd}
          className="px-5 py-3 bg-anulok-espresso hover:bg-anulok-wood text-white text-xs font-semibold uppercase tracking-wider rounded-xl transition-colors flex items-center justify-center gap-2 shadow-md"
        >
          <Plus className="w-4 h-4 text-anulok-amber" /> Add New Product
        </button>
      </div>

      {/* Search & Filter Bar */}
      <div className="bg-white p-4 rounded-2xl border border-stone-200/80 shadow-xs flex flex-col sm:flex-row items-center gap-4">
        <div className="relative flex-1 w-full">
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by title or SKU..."
            className="w-full pl-9 pr-4 py-2 bg-anulok-cream border border-stone-300 rounded-xl text-xs outline-none focus:border-anulok-wood"
          />
          <Search className="w-4 h-4 text-stone-400 absolute left-3 top-2.5" />
        </div>

        <select
          value={categoryFilter}
          onChange={(e) => setCategoryFilter(e.target.value)}
          className="w-full sm:w-48 bg-anulok-cream border border-stone-300 rounded-xl px-3 py-2 text-xs outline-none focus:border-anulok-wood"
        >
          <option value="all">All Categories</option>
          {categories.map((c) => (
            <option key={c.id} value={c.slug}>{c.name}</option>
          ))}
        </select>
      </div>

      {/* Products Table */}
      <div className="bg-white rounded-3xl border border-stone-200/80 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-anulok-linen/70 text-stone-600 font-bold uppercase tracking-wider border-b border-stone-200">
              <tr>
                <th className="py-3.5 px-6">Product</th>
                <th className="py-3.5 px-4">Category</th>
                <th className="py-3.5 px-4">Price / Discount</th>
                <th className="py-3.5 px-4">Stock</th>
                <th className="py-3.5 px-4">Featured</th>
                <th className="py-3.5 px-6 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-100">
              {loading ? (
                <tr>
                  <td colSpan={6} className="py-12 text-center text-stone-400">Loading catalog...</td>
                </tr>
              ) : filtered.length > 0 ? (
                filtered.map((p) => (
                  <tr key={p.id} className="hover:bg-stone-50/70 transition-colors">
                    <td className="py-4 px-6 flex items-center gap-3">
                      <img
                        src={p.images?.[0]}
                        alt={p.name}
                        className="w-12 h-12 rounded-xl object-cover border border-stone-200 shrink-0"
                      />
                      <div className="min-w-0 max-w-xs">
                        <p className="font-bold text-anulok-espresso truncate text-sm">{p.name}</p>
                        <p className="text-[11px] text-stone-400 font-mono">SKU: {p.sku}</p>
                      </div>
                    </td>

                    <td className="py-4 px-4 text-stone-600 capitalize">
                      {p.categoryName || p.category}
                    </td>

                    <td className="py-4 px-4">
                      <p className="font-bold text-anulok-espresso">{formatPrice(p.discountPrice || p.price)}</p>
                      {p.discountPrice && p.discountPrice < p.price && (
                        <p className="text-[10px] text-stone-400 line-through">
                          {formatPrice(p.price)} ({p.discountPercentage}% OFF)
                        </p>
                      )}
                    </td>

                    <td className="py-4 px-4">
                      <span className={`inline-block px-2.5 py-0.5 rounded-full font-bold text-[11px] ${
                        p.stock <= 5 ? 'bg-rose-100 text-rose-700' : 'bg-emerald-100 text-emerald-700'
                      }`}>
                        {p.stock} units
                      </span>
                    </td>

                    <td className="py-4 px-4">
                      {p.featured ? (
                        <span className="text-[11px] font-bold text-amber-700 bg-amber-50 px-2 py-0.5 rounded-full border border-amber-200">
                          Featured
                        </span>
                      ) : (
                        <span className="text-stone-400">—</span>
                      )}
                    </td>

                    <td className="py-4 px-6 text-right space-x-2">
                      <button
                        onClick={() => handleOpenEdit(p)}
                        className="p-1.5 rounded-lg text-stone-600 hover:text-anulok-wood hover:bg-stone-100 transition-colors"
                        title="Edit product"
                      >
                        <Edit2 className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDelete(p.id, p.name)}
                        className="p-1.5 rounded-lg text-stone-400 hover:text-rose-600 hover:bg-rose-50 transition-colors"
                        title="Delete product"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={6} className="py-12 text-center text-stone-500">No products match your search.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add / Edit Product Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white w-full max-w-3xl rounded-3xl shadow-2xl border border-stone-200 overflow-hidden my-8 animate-slide-up">
            <div className="p-6 bg-anulok-linen/60 border-b border-stone-200 flex items-center justify-between">
              <div>
                <h3 className="font-serif text-xl font-bold text-anulok-espresso">
                  {editingProduct ? 'Edit Furniture Piece' : 'Add New Furniture Creation'}
                </h3>
                <p className="text-xs text-stone-500 mt-0.5">Fill in product attributes, specifications, and pricing.</p>
              </div>
              <button onClick={() => setIsModalOpen(false)} className="p-2 text-stone-400 hover:text-stone-700">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSave} className="p-6 sm:p-8 space-y-6 max-h-[75vh] overflow-y-auto">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="sm:col-span-2">
                  <label className="text-xs uppercase font-bold text-stone-600 block mb-1">Product Title *</label>
                  <input
                    type="text"
                    required
                    value={form.name}
                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                    placeholder="e.g. Aura Curved Bouclé Sectional Sofa"
                    className="w-full bg-anulok-cream border border-stone-300 rounded-xl px-4 py-2.5 text-xs outline-none focus:border-anulok-wood"
                  />
                </div>

                <div>
                  <label className="text-xs uppercase font-bold text-stone-600 block mb-1">Category *</label>
                  <select
                    value={form.category}
                    onChange={(e) => setForm({ ...form, category: e.target.value })}
                    className="w-full bg-anulok-cream border border-stone-300 rounded-xl px-4 py-2.5 text-xs outline-none focus:border-anulok-wood"
                  >
                    {categories.map((c) => (
                      <option key={c.id} value={c.slug}>{c.name}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="text-xs uppercase font-bold text-stone-600 block mb-1">SKU Code</label>
                  <input
                    type="text"
                    value={form.sku}
                    onChange={(e) => setForm({ ...form, sku: e.target.value })}
                    placeholder="ANU-SOF-001"
                    className="w-full bg-anulok-cream border border-stone-300 rounded-xl px-4 py-2.5 text-xs outline-none focus:border-anulok-wood"
                  />
                </div>

                <div>
                  <label className="text-xs uppercase font-bold text-stone-600 block mb-1">Original Price (₹) *</label>
                  <input
                    type="number"
                    required
                    value={form.price}
                    onChange={(e) => setForm({ ...form, price: e.target.value })}
                    placeholder="84999"
                    className="w-full bg-anulok-cream border border-stone-300 rounded-xl px-4 py-2.5 text-xs outline-none focus:border-anulok-wood"
                  />
                </div>

                <div>
                  <label className="text-xs uppercase font-bold text-stone-600 block mb-1">Discount Price (₹)</label>
                  <input
                    type="number"
                    value={form.discountPrice}
                    onChange={(e) => setForm({ ...form, discountPrice: e.target.value })}
                    placeholder="69999"
                    className="w-full bg-anulok-cream border border-stone-300 rounded-xl px-4 py-2.5 text-xs outline-none focus:border-anulok-wood"
                  />
                </div>

                <div>
                  <label className="text-xs uppercase font-bold text-stone-600 block mb-1">Stock Quantity</label>
                  <input
                    type="number"
                    value={form.stock}
                    onChange={(e) => setForm({ ...form, stock: e.target.value })}
                    placeholder="12"
                    className="w-full bg-anulok-cream border border-stone-300 rounded-xl px-4 py-2.5 text-xs outline-none focus:border-anulok-wood"
                  />
                </div>

                <div>
                  <label className="text-xs uppercase font-bold text-stone-600 block mb-1">Material</label>
                  <input
                    type="text"
                    value={form.material}
                    onChange={(e) => setForm({ ...form, material: e.target.value })}
                    placeholder="Solid Oak & Italian Bouclé"
                    className="w-full bg-anulok-cream border border-stone-300 rounded-xl px-4 py-2.5 text-xs outline-none focus:border-anulok-wood"
                  />
                </div>

                <div>
                  <label className="text-xs uppercase font-bold text-stone-600 block mb-1">Color Name</label>
                  <input
                    type="text"
                    value={form.colorName}
                    onChange={(e) => setForm({ ...form, colorName: e.target.value })}
                    placeholder="Warm Oat"
                    className="w-full bg-anulok-cream border border-stone-300 rounded-xl px-4 py-2.5 text-xs outline-none focus:border-anulok-wood"
                  />
                </div>

                <div>
                  <label className="text-xs uppercase font-bold text-stone-600 block mb-1">Color Hex</label>
                  <div className="flex gap-2">
                    <input
                      type="color"
                      value={form.colorHex}
                      onChange={(e) => setForm({ ...form, colorHex: e.target.value })}
                      className="w-10 h-10 p-1 bg-anulok-cream border border-stone-300 rounded-lg cursor-pointer"
                    />
                    <input
                      type="text"
                      value={form.colorHex}
                      onChange={(e) => setForm({ ...form, colorHex: e.target.value })}
                      className="flex-1 bg-anulok-cream border border-stone-300 rounded-xl px-3 py-2 text-xs"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-xs uppercase font-bold text-stone-600 block mb-1">Dimensions</label>
                  <input
                    type="text"
                    value={form.dimensions}
                    onChange={(e) => setForm({ ...form, dimensions: e.target.value })}
                    placeholder="108&quot;W x 68&quot;D x 31&quot;H"
                    className="w-full bg-anulok-cream border border-stone-300 rounded-xl px-4 py-2.5 text-xs outline-none focus:border-anulok-wood"
                  />
                </div>

                <div>
                  <label className="text-xs uppercase font-bold text-stone-600 block mb-1">Weight</label>
                  <input
                    type="text"
                    value={form.weight}
                    onChange={(e) => setForm({ ...form, weight: e.target.value })}
                    placeholder="72 kg"
                    className="w-full bg-anulok-cream border border-stone-300 rounded-xl px-4 py-2.5 text-xs outline-none focus:border-anulok-wood"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="text-xs uppercase font-bold text-stone-600 block mb-1">
                    Image URLs (Comma-separated for multi-angle gallery)
                  </label>
                  <input
                    type="text"
                    value={form.images}
                    onChange={(e) => setForm({ ...form, images: e.target.value })}
                    placeholder="https://images.unsplash.com/..., https://..."
                    className="w-full bg-anulok-cream border border-stone-300 rounded-xl px-4 py-2.5 text-xs outline-none focus:border-anulok-wood"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="text-xs uppercase font-bold text-stone-600 block mb-1">Tags (Comma-separated)</label>
                  <input
                    type="text"
                    value={form.tags}
                    onChange={(e) => setForm({ ...form, tags: e.target.value })}
                    placeholder="sofa, sectional, boucle, modern"
                    className="w-full bg-anulok-cream border border-stone-300 rounded-xl px-4 py-2.5 text-xs outline-none focus:border-anulok-wood"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="text-xs uppercase font-bold text-stone-600 block mb-1">Description</label>
                  <textarea
                    rows={3}
                    value={form.description}
                    onChange={(e) => setForm({ ...form, description: e.target.value })}
                    placeholder="Describe aesthetics, framing, and ergonomics..."
                    className="w-full bg-anulok-cream border border-stone-300 rounded-xl px-4 py-2.5 text-xs outline-none focus:border-anulok-wood"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="flex items-center gap-2 cursor-pointer text-xs font-bold text-stone-700">
                    <input
                      type="checkbox"
                      checked={form.featured}
                      onChange={(e) => setForm({ ...form, featured: e.target.checked })}
                      className="rounded text-anulok-wood focus:ring-anulok-wood"
                    />
                    <span>Show as Featured Product on Homepage</span>
                  </label>
                </div>
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
                  {saving ? 'Saving...' : editingProduct ? 'Update Product' : 'Add Product'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
