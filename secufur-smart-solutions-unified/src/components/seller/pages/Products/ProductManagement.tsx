import React, { useState } from 'react';
import { useApp } from '@/context/seller/AppContext';
import { Plus, Search, Filter, Edit2, Archive, Package, X, CheckCircle, AlertTriangle, Send, Eye, Lock, Unlock } from 'lucide-react';
import { ProductStatus } from '../../types';

const ProductManagement: React.FC = () => {
  const { products, setProducts, addProduct, addLog, submitProductForApproval, updateProduct, adjustInventory } = useApp();
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState<string | null>(null);
  const [isAdjustStockModal, setIsAdjustStockModal] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<ProductStatus | 'All'>('All');
  const [categoryFilter, setCategoryFilter] = useState<string>('All');

  const [formData, setFormData] = useState({
    name: '',
    sku: '',
    category: 'Ceiling Fan' as 'Ceiling Fan' | 'Lithium Ion Battery',
    price: '',
    stock: '',
    description: '',
    hsnCode: '',
    taxSlab: '18',
    weight: '',
    length: '',
    width: '',
    height: '',
    minOrderQty: '1',
    maxOrderQty: '100'
  });

  const [stockAdjustment, setStockAdjustment] = useState({ amount: '', reason: '' });

  const filteredProducts = products.filter(p => {
    const matchesSearch = p.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          p.sku.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'All' || p.status === statusFilter;
    const matchesCategory = categoryFilter === 'All' || p.category === categoryFilter;
    return matchesSearch && matchesStatus && matchesCategory;
  });

  const handleAddProduct = (e: React.FormEvent) => {
    e.preventDefault();
    addProduct({
      name: formData.name,
      sku: formData.sku,
      category: formData.category,
      price: parseFloat(formData.price),
      stock: parseInt(formData.stock),
      description: formData.description || `${formData.category} - ${formData.name}`,
      compliance: {
        hsnCode: formData.hsnCode,
        taxSlab: parseInt(formData.taxSlab)
      },
      weight: parseFloat(formData.weight) || 1,
      dimensions: {
        length: parseFloat(formData.length) || 10,
        width: parseFloat(formData.width) || 10,
        height: parseFloat(formData.height) || 10
      },
      minOrderQty: parseInt(formData.minOrderQty) || 1,
      maxOrderQty: parseInt(formData.maxOrderQty) || 100
    });
    setFormData({
      name: '', sku: '', category: 'Ceiling Fan', price: '', stock: '',
      description: '', hsnCode: '', taxSlab: '18', weight: '',
      length: '', width: '', height: '', minOrderQty: '1', maxOrderQty: '100'
    });
    setIsAddModalOpen(false);
  };

  const handleSubmitForApproval = (productId: string) => {
    submitProductForApproval(productId);
  };

  const handleStockAdjustment = (productId: string) => {
    if (stockAdjustment.amount && stockAdjustment.reason) {
      adjustInventory(productId, parseInt(stockAdjustment.amount), stockAdjustment.reason);
      setStockAdjustment({ amount: '', reason: '' });
      setIsAdjustStockModal(null);
    }
  };

  const toggleStatus = (id: string) => {
    const product = products.find(p => p.id === id);
    if (product && !product.isLocked) {
      const nextStatus: ProductStatus = product.status === 'Live' ? 'Archived' : 
                                        product.status === 'Archived' ? 'Draft' : product.status;
      updateProduct(id, { status: nextStatus });
    }
  };

  const getStatusColor = (status: ProductStatus) => {
    switch (status) {
      case 'Live': return 'bg-green-100 text-green-700 border-green-200';
      case 'Draft': return 'bg-gray-100 text-gray-600 border-gray-200';
      case 'Submitted': return 'bg-blue-100 text-blue-700 border-blue-200';
      case 'UnderReview': return 'bg-yellow-100 text-yellow-700 border-yellow-200';
      case 'Rejected': return 'bg-red-100 text-red-700 border-red-200';
      case 'Archived': return 'bg-slate-100 text-slate-600 border-slate-200';
      default: return 'bg-gray-100 text-gray-600 border-gray-200';
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl sm:text-2xl font-jakarta font-extrabold text-slate-800">Product Management</h2>
          <p className="text-slate-500 text-xs sm:text-sm">Create and organize your digital catalog.</p>
        </div>
        <button 
          onClick={() => setIsAddModalOpen(true)}
          className="flex items-center justify-center gap-2 bg-[#002366] text-white px-6 py-3 rounded-xl font-bold text-xs hover:bg-blue-900 transition-all shadow-lg shadow-blue-900/10"
        >
          <Plus size={18} />
          ADD PRODUCT
        </button>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="p-4 sm:p-6 border-b border-gray-100 flex flex-col lg:flex-row gap-4 items-stretch lg:items-center justify-between bg-gray-50/50">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
            <input 
              type="text"
              placeholder="Search by Name or SKU..."
              className="w-full pl-12 pr-4 py-3 bg-white border border-gray-200 rounded-xl text-sm outline-none focus:ring-2 focus:ring-[#002366] transition-all"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <div className="flex items-center gap-3 flex-wrap">
            <select 
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              className="px-4 py-3 bg-white border border-gray-200 rounded-xl text-xs font-bold text-slate-600"
            >
              <option value="All">All Categories</option>
              <option value="Ceiling Fan">Ceiling Fan</option>
              <option value="Lithium Ion Battery">Lithium Ion Battery</option>
            </select>
            <select 
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value as any)}
              className="px-4 py-3 bg-white border border-gray-200 rounded-xl text-xs font-bold text-slate-600"
            >
              <option value="All">All Status</option>
              <option value="Live">Live</option>
              <option value="Draft">Draft</option>
              <option value="Submitted">Submitted</option>
              <option value="UnderReview">Under Review</option>
              <option value="Rejected">Rejected</option>
              <option value="Archived">Archived</option>
            </select>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-gray-50 text-[10px] font-bold text-gray-400 uppercase tracking-wider">
                <th className="px-4 sm:px-6 py-4">Product</th>
                <th className="px-4 sm:px-6 py-4">SKU / HSN</th>
                <th className="px-4 sm:px-6 py-4">Category</th>
                <th className="px-4 sm:px-6 py-4">Price</th>
                <th className="px-4 sm:px-6 py-4">Stock</th>
                <th className="px-4 sm:px-6 py-4">Status</th>
                <th className="px-4 sm:px-6 py-4 text-center">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {filteredProducts.map((p) => (
                <tr key={p.id} className="hover:bg-blue-50/30 transition-colors">
                  <td className="px-4 sm:px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-lg bg-gray-100 overflow-hidden shrink-0">
                        <img src={p.images[0]} alt={p.name} className="w-full h-full object-cover" />
                      </div>
                      <div className="min-w-0">
                        <div className="flex items-center gap-2">
                          <p className="text-xs sm:text-sm font-bold text-slate-800 truncate max-w-[150px] sm:max-w-none">{p.name}</p>
                          {p.isLocked && <Lock size={12} className="text-slate-400 shrink-0" />}
                        </div>
                        <p className="text-[9px] sm:text-[10px] text-slate-400 font-medium">Sold: {p.soldCount} units</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 sm:px-6 py-4">
                    <p className="text-xs font-mono font-medium text-slate-600">{p.sku}</p>
                    <p className="text-[9px] text-slate-400 font-mono">{p.compliance.hsnCode}</p>
                  </td>
                  <td className="px-4 sm:px-6 py-4">
                    <span className={`px-2.5 py-1 rounded-full text-[9px] sm:text-[10px] font-bold ${
                      p.category === 'Ceiling Fan' ? 'bg-blue-100 text-blue-700' : 'bg-green-100 text-green-700'
                    }`}>
                      {p.category}
                    </span>
                  </td>
                  <td className="px-4 sm:px-6 py-4">
                    <p className="text-sm font-bold text-slate-800">₹{p.price.toLocaleString('en-IN')}</p>
                    <p className="text-[9px] text-slate-400">GST: {p.compliance.taxSlab}%</p>
                  </td>
                  <td className="px-4 sm:px-6 py-4">
                    <div className="flex items-center gap-2">
                      <span className={`text-sm font-bold ${p.availableStock < 10 ? 'text-red-500' : 'text-slate-800'}`}>
                        {p.availableStock}
                      </span>
                      {p.reservedStock > 0 && (
                        <span className="text-[9px] text-orange-500 font-bold">({p.reservedStock} reserved)</span>
                      )}
                    </div>
                    <button 
                      onClick={() => setIsAdjustStockModal(p.id)}
                      className="text-[9px] text-[#002366] font-bold hover:underline mt-1"
                    >
                      Adjust Stock
                    </button>
                  </td>
                  <td className="px-4 sm:px-6 py-4">
                    <span className={`px-3 py-1.5 rounded-lg text-[9px] sm:text-[10px] font-extrabold uppercase border ${getStatusColor(p.status)}`}>
                      {p.status}
                    </span>
                    {p.status === 'Rejected' && p.rejectionReason && (
                      <p className="text-[9px] text-red-500 mt-1 truncate max-w-[100px]" title={p.rejectionReason}>
                        {p.rejectionReason}
                      </p>
                    )}
                  </td>
                  <td className="px-4 sm:px-6 py-4">
                    <div className="flex items-center justify-center gap-1 sm:gap-2">
                      {p.status === 'Draft' && (
                        <button 
                          onClick={() => handleSubmitForApproval(p.id)}
                          className="p-2 text-blue-500 hover:bg-blue-50 rounded-lg transition-colors"
                          title="Submit for Approval"
                        >
                          <Send size={16} />
                        </button>
                      )}
                      {!p.isLocked && (
                        <button 
                          onClick={() => setIsEditModalOpen(p.id)}
                          className="p-2 text-slate-400 hover:text-[#002366] hover:bg-blue-50 rounded-lg transition-colors"
                          title="Edit"
                        >
                          <Edit2 size={16} />
                        </button>
                      )}
                      {p.status === 'Live' && !p.isLocked && (
                        <button 
                          onClick={() => toggleStatus(p.id)}
                          className="p-2 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                          title="Archive"
                        >
                          <Archive size={16} />
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
              {filteredProducts.length === 0 && (
                <tr>
                  <td colSpan={7} className="px-6 py-20 sm:py-32 text-center">
                    <div className="max-w-sm mx-auto flex flex-col items-center">
                      <div className="w-20 h-20 sm:w-24 sm:h-24 bg-blue-50 rounded-full flex items-center justify-center mb-6 text-[#002366]/20">
                        <Package size={40} />
                      </div>
                      <h3 className="text-lg sm:text-xl font-jakarta font-bold text-slate-800 mb-2">No products found</h3>
                      <p className="text-xs sm:text-sm text-slate-400 mb-8 leading-relaxed">
                        {searchTerm || statusFilter !== 'All' || categoryFilter !== 'All' 
                          ? 'Try adjusting your filters'
                          : 'Start by adding your first product to the catalog'}
                      </p>
                      <button 
                        onClick={() => setIsAddModalOpen(true)} 
                        className="px-8 py-3 bg-[#002366] text-white rounded-xl font-bold text-xs hover:bg-blue-900 shadow-xl shadow-blue-900/10 transition-all uppercase tracking-widest"
                      >
                        Add First Product
                      </button>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add Product Modal */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-300">
          <div className="w-full max-w-2xl bg-white rounded-3xl shadow-2xl overflow-hidden max-h-[90vh] overflow-y-auto">
            <div className="bg-[#002366] px-6 sm:px-8 py-5 sm:py-6 flex items-center justify-between text-white sticky top-0 z-10">
              <h3 className="text-lg sm:text-xl font-jakarta font-bold">Add New Product</h3>
              <button onClick={() => setIsAddModalOpen(false)} className="hover:bg-white/10 p-1 rounded-lg transition-colors">
                <X size={24} />
              </button>
            </div>
            <form onSubmit={handleAddProduct} className="p-6 sm:p-8 space-y-6">
              <div className="space-y-4">
                <div>
                  <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-2">Product Name *</label>
                  <input 
                    required 
                    type="text" 
                    placeholder="e.g., Industrial Ceiling Fan 56 inch"
                    className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm outline-none focus:ring-2 focus:ring-[#002366]" 
                    value={formData.name} 
                    onChange={(e) => setFormData({...formData, name: e.target.value})} 
                  />
                </div>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-2">SKU Code *</label>
                    <input 
                      required 
                      type="text" 
                      placeholder="CF-IND-56"
                      className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-xs font-mono outline-none focus:ring-2 focus:ring-[#002366]" 
                      value={formData.sku} 
                      onChange={(e) => setFormData({...formData, sku: e.target.value})} 
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-2">Category *</label>
                    <select 
                      className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm outline-none focus:ring-2 focus:ring-[#002366]" 
                      value={formData.category} 
                      onChange={(e) => setFormData({...formData, category: e.target.value as any})}
                    >
                      <option value="Ceiling Fan">Ceiling Fan</option>
                      <option value="Lithium Ion Battery">Lithium Ion Battery</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-2">HSN Code *</label>
                    <input 
                      required 
                      type="text" 
                      placeholder="84145110"
                      className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-xs font-mono outline-none focus:ring-2 focus:ring-[#002366]" 
                      value={formData.hsnCode} 
                      onChange={(e) => setFormData({...formData, hsnCode: e.target.value})} 
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-2">GST Slab (%)</label>
                    <select 
                      className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm outline-none focus:ring-2 focus:ring-[#002366]" 
                      value={formData.taxSlab} 
                      onChange={(e) => setFormData({...formData, taxSlab: e.target.value})}
                    >
                      <option value="5">5%</option>
                      <option value="12">12%</option>
                      <option value="18">18%</option>
                      <option value="28">28%</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-2">MRP (₹) *</label>
                    <input 
                      required 
                      type="number" 
                      placeholder="4999"
                      className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm font-bold outline-none focus:ring-2 focus:ring-[#002366]" 
                      value={formData.price} 
                      onChange={(e) => setFormData({...formData, price: e.target.value})} 
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-2">Stock Qty *</label>
                    <input 
                      required 
                      type="number" 
                      placeholder="100"
                      className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm outline-none focus:ring-2 focus:ring-[#002366]" 
                      value={formData.stock} 
                      onChange={(e) => setFormData({...formData, stock: e.target.value})} 
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-2">Weight (kg)</label>
                  <input 
                    type="number" 
                    step="0.1"
                    placeholder="8.5"
                    className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm outline-none focus:ring-2 focus:ring-[#002366]" 
                    value={formData.weight} 
                    onChange={(e) => setFormData({...formData, weight: e.target.value})} 
                  />
                </div>

                <div>
                  <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-2">Dimensions (cm)</label>
                  <div className="grid grid-cols-3 gap-3">
                    <input 
                      type="number" 
                      placeholder="L"
                      className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm outline-none focus:ring-2 focus:ring-[#002366]" 
                      value={formData.length} 
                      onChange={(e) => setFormData({...formData, length: e.target.value})} 
                    />
                    <input 
                      type="number" 
                      placeholder="W"
                      className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm outline-none focus:ring-2 focus:ring-[#002366]" 
                      value={formData.width} 
                      onChange={(e) => setFormData({...formData, width: e.target.value})} 
                    />
                    <input 
                      type="number" 
                      placeholder="H"
                      className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm outline-none focus:ring-2 focus:ring-[#002366]" 
                      value={formData.height} 
                      onChange={(e) => setFormData({...formData, height: e.target.value})} 
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-2">Description</label>
                  <textarea 
                    rows={3}
                    placeholder="Product description..."
                    className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm outline-none focus:ring-2 focus:ring-[#002366] resize-none" 
                    value={formData.description} 
                    onChange={(e) => setFormData({...formData, description: e.target.value})} 
                  />
                </div>
              </div>

              <div className="p-4 bg-yellow-50 rounded-xl border border-yellow-100">
                <div className="flex items-start gap-3">
                  <AlertTriangle size={18} className="text-yellow-500 mt-0.5 shrink-0" />
                  <div>
                    <p className="text-xs font-bold text-yellow-800">Product Approval Required</p>
                    <p className="text-[10px] text-yellow-600 mt-1">
                      New products are saved as drafts. Submit for platform approval before they can go live.
                    </p>
                  </div>
                </div>
              </div>

              <div className="flex gap-4 pt-4">
                <button 
                  type="button" 
                  onClick={() => setIsAddModalOpen(false)} 
                  className="flex-1 py-4 bg-gray-100 text-slate-600 rounded-xl font-bold text-sm hover:bg-gray-200 transition-all"
                >
                  CANCEL
                </button>
                <button 
                  type="submit" 
                  className="flex-[2] py-4 bg-[#002366] text-white rounded-xl font-bold text-sm hover:bg-blue-900 transition-all shadow-xl shadow-blue-900/20"
                >
                  SAVE AS DRAFT
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Stock Adjustment Modal */}
      {isAdjustStockModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-300">
          <div className="w-full max-w-md bg-white rounded-3xl shadow-2xl overflow-hidden">
            <div className="bg-[#002366] px-6 sm:px-8 py-5 sm:py-6 flex items-center justify-between text-white">
              <h3 className="text-lg font-jakarta font-bold">Adjust Stock</h3>
              <button onClick={() => setIsAdjustStockModal(null)} className="hover:bg-white/10 p-1 rounded-lg transition-colors">
                <X size={24} />
              </button>
            </div>
            <div className="p-6 sm:p-8 space-y-6">
              <div>
                <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-2">
                  Adjustment Amount (+ or -)
                </label>
                <input 
                  type="number" 
                  placeholder="e.g., +10 or -5"
                  className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm font-bold outline-none focus:ring-2 focus:ring-[#002366]" 
                  value={stockAdjustment.amount} 
                  onChange={(e) => setStockAdjustment({...stockAdjustment, amount: e.target.value})} 
                />
              </div>
              <div>
                <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-2">
                  Reason for Adjustment *
                </label>
                <select 
                  className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm outline-none focus:ring-2 focus:ring-[#002366]" 
                  value={stockAdjustment.reason} 
                  onChange={(e) => setStockAdjustment({...stockAdjustment, reason: e.target.value})}
                >
                  <option value="">Select reason...</option>
                  <option value="New stock received">New stock received</option>
                  <option value="Stock audit correction">Stock audit correction</option>
                  <option value="Damaged/Defective">Damaged/Defective</option>
                  <option value="Lost/Missing">Lost/Missing</option>
                  <option value="Return received">Return received</option>
                  <option value="Other">Other</option>
                </select>
              </div>
              <div className="flex gap-4 pt-4">
                <button 
                  type="button" 
                  onClick={() => setIsAdjustStockModal(null)} 
                  className="flex-1 py-4 bg-gray-100 text-slate-600 rounded-xl font-bold text-sm hover:bg-gray-200"
                >
                  CANCEL
                </button>
                <button 
                  onClick={() => handleStockAdjustment(isAdjustStockModal)}
                  disabled={!stockAdjustment.amount || !stockAdjustment.reason}
                  className="flex-1 py-4 bg-[#002366] text-white rounded-xl font-bold text-sm hover:bg-blue-900 disabled:opacity-50"
                >
                  UPDATE STOCK
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProductManagement;
