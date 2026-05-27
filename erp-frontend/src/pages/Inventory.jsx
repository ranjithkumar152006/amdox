import { useState, useEffect } from "react";
import { Search, Plus, Filter, Package, AlertTriangle, TrendingDown, DollarSign, Download, MoreVertical, CheckCircle2 } from "lucide-react";
import Card from "../components/Card";
import API from "../services/api";

export default function Inventory() {
  const [inventoryData, setInventoryData] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [toast, setToast] = useState(null);

  // Form state
  const [newName, setNewName] = useState("");
  const [newCategory, setNewCategory] = useState("Electronics");
  const [newStock, setNewStock] = useState("");
  const [newPrice, setNewPrice] = useState("");

  const [showFilters, setShowFilters] = useState(false);
  const [filterCategory, setFilterCategory] = useState("All");
  const [filterStatus, setFilterStatus] = useState("All");

  useEffect(() => {
    Promise.all([
      API.get("/inventory/stats"),
      API.get("/inventory")
    ]).then(([statsRes, invRes]) => {
      setInventoryData({
        stats: statsRes.data.data,
        products: invRes.data.data
      });
    }).catch(console.error);
  }, []);

  const showToast = (message) => {
    console.log("Inventory Action Triggered:", message);
    setToast(message);
    setTimeout(() => setToast(null), 3000);
  };

  const handleExport = () => {
    // Create mock CSV data
    let csvContent = "data:text/csv;charset=utf-8,ID,Product,Category,In Stock,Unit Price,Total Value,Status\\n";
    products.forEach(row => {
      csvContent += `${row.id},"${row.name}","${row.category}",${row.stock},"${row.price}","${row.total}",${row.status}\\n`;
    });
    
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "Amdox_Inventory_Report.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    showToast("Inventory Stock Report (CSV) Exported");
  };

  const handleAddProduct = async (e) => {
    e.preventDefault();
    try {
      const res = await API.post("/inventory", {
        name: newName,
        category: newCategory,
        stock: newStock,
        unitPrice: newPrice
      });
      if (res.data.success) {
        setIsModalOpen(false);
        showToast("Product SKU Created successfully!");
        setNewName("");
        setNewCategory("Electronics");
        setNewStock("");
        setNewPrice("");
        // Refresh data
        API.get("/inventory").then(r => setInventoryData(prev => ({...prev, products: r.data.data})));
        API.get("/inventory/stats").then(r => setInventoryData(prev => ({...prev, stats: r.data.data})));
      }
    } catch (err) {
      showToast("Error adding product: " + (err.response?.data?.message || err.message));
    }
  };

  if (!inventoryData) {
    return <div className="p-8 flex items-center justify-center min-h-screen bg-slate-50">
      <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
    </div>;
  }

  const { stats, products } = inventoryData;

  const filteredProducts = products.filter(item => {
    const matchesSearch = item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          item.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          item.category.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = filterCategory === "All" || item.category === filterCategory;
    const matchesStatus = filterStatus === "All" || item.status === filterStatus;
    
    return matchesSearch && matchesCategory && matchesStatus;
  });

  return (
    <div className="p-6 space-y-8 relative font-['Inter']">
       {/* Toast Notification */}
       {toast && (
        <div className="fixed bottom-10 right-10 z-[100] animate-bounce-in">
          <div className="bg-[#111827] text-white px-6 py-4 rounded-xl shadow-2xl flex items-center gap-3 border border-slate-700">
            <div className="w-8 h-8 rounded-full bg-indigo-500/20 flex items-center justify-center">
              <CheckCircle2 size={20} className="text-indigo-500" />
            </div>
            <div>
              <p className="text-[14px] font-[600]">{toast}</p>
              <p className="text-[12px] text-slate-400">Warehouse catalog synchronized</p>
            </div>
          </div>
        </div>
      )}

      {/* Add Product Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-[200] flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden animate-bounce-in">
            <div className="p-6 border-b border-slate-100 flex justify-between items-center bg-slate-50">
              <h3 className="text-lg font-bold text-slate-900">Add New Product</h3>
              <button onClick={() => setIsModalOpen(false)} className="text-slate-400 hover:text-slate-600">✕</button>
            </div>
            <form className="p-6 space-y-4" onSubmit={handleAddProduct}>
              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Product Name</label>
                <input 
                  required 
                  type="text" 
                  value={newName}
                  onChange={(e) => setNewName(e.target.value)}
                  className="w-full border border-slate-200 rounded-lg h-10 px-3 text-sm focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none" 
                  placeholder="e.g. Dell UltraSharp 32" 
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Category</label>
                  <select 
                    value={newCategory}
                    onChange={(e) => setNewCategory(e.target.value)}
                    className="w-full border border-slate-200 rounded-lg h-10 px-3 text-sm outline-none"
                  >
                    <option value="Electronics">Electronics</option>
                    <option value="Furniture">Furniture</option>
                    <option value="Accessories">Accessories</option>
                    <option value="Office Supplies">Office Supplies</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Initial Stock</label>
                  <input 
                    required 
                    type="number" 
                    min="0"
                    value={newStock}
                    onChange={(e) => setNewStock(e.target.value)}
                    className="w-full border border-slate-200 rounded-lg h-10 px-3 text-sm outline-none" 
                    placeholder="0" 
                  />
                </div>
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Unit Price ($)</label>
                <input 
                  required 
                  type="number" 
                  min="0"
                  step="0.01"
                  value={newPrice}
                  onChange={(e) => setNewPrice(e.target.value)}
                  className="w-full border border-slate-200 rounded-lg h-10 px-3 text-sm outline-none" 
                  placeholder="0.00" 
                />
              </div>
              <button type="submit" className="w-full bg-[#2563EB] hover:bg-blue-700 text-white font-bold h-11 rounded-lg mt-4 transition-all shadow-lg shadow-blue-600/20">
                Confirm Item Creation
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Header Section */}
      <div className="grid grid-cols-12 gap-6 items-center">
        <div className="col-span-12 lg:col-span-8">
          <h1 className="text-[24px] font-[700] text-[#111827] leading-[1.2]">Inventory Asset Manager</h1>
          <p className="text-[14px] text-[#6B7280] font-[400] mt-1">Monitor stock levels, warehouse allocation, and supply chain status.</p>
        </div>
        <div className="col-span-12 lg:col-span-4 flex justify-end gap-3">
          <button 
            type="button"
            onClick={handleExport}
            className="bg-white border border-slate-200 px-4 h-[44px] rounded-[8px] text-[14px] font-[600] flex items-center gap-2 hover:bg-slate-50 transition-colors shadow-sm"
          >
            <Download size={16} className="text-slate-400" /> Export
          </button>
          <button 
            type="button"
            onClick={() => setIsModalOpen(true)}
            className="bg-[#2563EB] text-white px-4 h-[44px] rounded-[8px] text-[14px] font-[600] flex items-center gap-2 hover:bg-blue-700 transition-colors shadow-lg shadow-blue-600/20"
          >
            <Plus size={16} /> Add Product
          </button>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-12 gap-6">
        <div className="col-span-12 md:col-span-6 lg:col-span-3">
          <Card title="Total Products" value={stats.total.toString()} trend="up" trendValue="4.5" Icon={Package} color="blue" />
        </div>
        <div className="col-span-12 md:col-span-6 lg:col-span-3">
          <Card title="Low Stock Items" value={stats.lowStock.toString()} trend="down" trendValue="2" Icon={AlertTriangle} color="amber" />
        </div>
        <div className="col-span-12 md:col-span-6 lg:col-span-3">
          <Card title="Out of Stock" value={stats.outOfStock.toString()} trend="up" trendValue="1" Icon={TrendingDown} color="rose" />
        </div>
        <div className="col-span-12 md:col-span-6 lg:col-span-3">
          <Card title="Total Value" value={`$${stats.totalValue.toLocaleString()}`} trend="up" trendValue="12.3" Icon={DollarSign} color="emerald" />
        </div>
      </div>

      {/* Table Section */}
      <div className="grid grid-cols-12 gap-6">
        <div className="col-span-12 bg-white rounded-[12px] border border-slate-200 shadow-sm overflow-hidden">
          <div className="p-4 border-b border-slate-100 flex flex-col gap-4 bg-slate-50/30">
            <div className="flex items-center justify-between">
              <h2 className="text-[16px] font-[600] text-[#111827]">Product Listing</h2>
              <div className="flex gap-2">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={14} />
                  <input 
                    type="text" 
                    placeholder="Search product..." 
                    className="pl-9 pr-4 h-[36px] bg-white border border-slate-200 rounded-lg text-[12px] outline-none w-48 focus:ring-2 focus:ring-blue-500/20" 
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
                <button 
                  type="button"
                  onClick={() => setShowFilters(!showFilters)}
                  className={`h-[36px] px-3 border border-slate-200 rounded-lg flex items-center gap-2 text-[12px] font-[600] shadow-sm transition-colors ${showFilters ? 'bg-blue-50 text-blue-600 border-blue-200' : 'bg-white text-slate-600 hover:bg-slate-50'}`}
                >
                  <Filter size={14} /> Filter
                </button>
              </div>
            </div>
            {showFilters && (
              <div className="flex gap-4 pt-4 border-t border-slate-200 animate-fade-in">
                <div className="flex flex-col gap-1.5">
                  <label className="text-[11px] font-[600] text-slate-500 uppercase">Category</label>
                  <select 
                    value={filterCategory}
                    onChange={(e) => setFilterCategory(e.target.value)}
                    className="h-[36px] px-3 border border-slate-200 rounded-lg text-[13px] outline-none w-40 bg-white"
                  >
                    <option value="All">All Categories</option>
                    <option value="Electronics">Electronics</option>
                    <option value="Furniture">Furniture</option>
                    <option value="Accessories">Accessories</option>
                    <option value="Office Supplies">Office Supplies</option>
                  </select>
                </div>
                <div className="flex flex-col gap-1.5">
                  <label className="text-[11px] font-[600] text-slate-500 uppercase">Status</label>
                  <select 
                    value={filterStatus}
                    onChange={(e) => setFilterStatus(e.target.value)}
                    className="h-[36px] px-3 border border-slate-200 rounded-lg text-[13px] outline-none w-40 bg-white"
                  >
                    <option value="All">All Statuses</option>
                    <option value="In Stock">In Stock</option>
                    <option value="Low Stock">Low Stock</option>
                    <option value="Out of Stock">Out of Stock</option>
                  </select>
                </div>
              </div>
            )}
          </div>
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200 h-[56px]">
                <th className="px-6 text-[12px] font-[700] text-[#6B7280] uppercase tracking-wider">Product</th>
                <th className="px-6 text-[12px] font-[700] text-[#6B7280] uppercase tracking-wider">Category</th>
                <th className="px-6 text-[12px] font-[700] text-[#6B7280] uppercase tracking-wider">In Stock</th>
                <th className="px-6 text-[12px] font-[700] text-[#6B7280] uppercase tracking-wider">Unit Price</th>
                <th className="px-6 text-[12px] font-[700] text-[#6B7280] uppercase tracking-wider">Total Value</th>
                <th className="px-6 text-[12px] font-[700] text-[#6B7280] uppercase tracking-wider">Status</th>
                <th className="px-6 text-right"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredProducts.length > 0 ? (
                filteredProducts.map((item) => (
                  <tr key={item.id} className="h-[48px] hover:bg-slate-50 transition-colors">
                    <td className="px-6">
                      <div>
                        <p className="text-[14px] font-[600] text-[#111827]">{item.name}</p>
                        <p className="text-[12px] text-[#6B7280] font-[400]">{item.id}</p>
                      </div>
                    </td>
                    <td className="px-6 text-[13px] text-[#6B7280]">{item.category}</td>
                    <td className="px-6 text-[13px] font-[600] text-[#111827]">{item.stock}</td>
                    <td className="px-6 text-[13px] text-[#6B7280]">${item.unitPrice.toLocaleString()}</td>
                    <td className="px-6 text-[13px] font-[700] text-[#111827]">${item.totalValue.toLocaleString()}</td>
                    <td className="px-6">
                      <span className={`px-2.5 py-1 rounded-full text-[11px] font-[700] uppercase tracking-wider ${
                        item.status === 'In Stock' ? 'bg-emerald-50 text-emerald-600' : 
                        item.status === 'Low Stock' ? 'bg-amber-50 text-amber-600' : 'bg-rose-50 text-rose-600'
                      }`}>
                        {item.status}
                      </span>
                    </td>
                    <td className="px-6 text-right">
                      <button className="p-1 text-slate-400 hover:text-slate-600">
                        <MoreVertical size={16} />
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={7} className="px-6 py-10 text-center text-slate-400 italic text-[13px]">
                    No inventory items found matching your search.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
