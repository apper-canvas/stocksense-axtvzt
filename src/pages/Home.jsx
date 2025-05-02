import { useState } from 'react';
import { motion } from 'framer-motion';
import { toast } from 'react-toastify';
import MainFeature from '../components/MainFeature';
import getIcon from '../utils/iconUtils';

const Home = () => {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [searchQuery, setSearchQuery] = useState('');
  const [inventoryStats, setInventoryStats] = useState({
    totalItems: 124,
    lowStock: 12,
    outOfStock: 5,
    recentlyAdded: 8
  });
  
  // Quick access cards with inventory highlights
  const quickAccessItems = [
    {
      title: "Total Products",
      value: inventoryStats.totalItems,
      icon: "Package",
      color: "bg-blue-100 dark:bg-blue-900/30",
      textColor: "text-blue-700 dark:text-blue-300"
    },
    {
      title: "Low Stock Items",
      value: inventoryStats.lowStock,
      icon: "AlertTriangle",
      color: "bg-yellow-100 dark:bg-yellow-900/30",
      textColor: "text-yellow-700 dark:text-yellow-300"
    },
    {
      title: "Out of Stock",
      value: inventoryStats.outOfStock,
      icon: "XCircle",
      color: "bg-red-100 dark:bg-red-900/30",
      textColor: "text-red-700 dark:text-red-300"
    },
    {
      title: "Recently Added",
      value: inventoryStats.recentlyAdded,
      icon: "PlusCircle",
      color: "bg-green-100 dark:bg-green-900/30",
      textColor: "text-green-700 dark:text-green-300"
    }
  ];

  // Sample inventory items to demonstrate the list
  const sampleInventoryItems = [
    { id: 1, name: "Wireless Headphones", sku: "WH-001", category: "Electronics", quantity: 24, minQuantity: 10, status: "In Stock" },
    { id: 2, name: "Organic Green Tea", sku: "GT-002", category: "Food & Beverage", quantity: 8, minQuantity: 15, status: "Low Stock" },
    { id: 3, name: "Ergonomic Office Chair", sku: "OC-003", category: "Furniture", quantity: 0, minQuantity: 5, status: "Out of Stock" },
    { id: 4, name: "Smartphone Case", sku: "SC-004", category: "Accessories", quantity: 56, minQuantity: 20, status: "In Stock" },
    { id: 5, name: "Yoga Mat", sku: "YM-005", category: "Sports", quantity: 12, minQuantity: 10, status: "In Stock" },
    { id: 6, name: "LED Desk Lamp", sku: "DL-006", category: "Lighting", quantity: 7, minQuantity: 8, status: "Low Stock" }
  ];

  const filteredItems = sampleInventoryItems.filter(item => 
    item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    item.sku.toLowerCase().includes(searchQuery.toLowerCase()) ||
    item.category.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1,
      transition: { 
        staggerChildren: 0.1 
      } 
    }
  };

  const itemVariants = {
    hidden: { 
      y: 20, 
      opacity: 0 
    },
    visible: { 
      y: 0, 
      opacity: 1,
      transition: { 
        type: "spring", 
        stiffness: 100 
      }
    }
  };

  const handleSearch = (e) => {
    setSearchQuery(e.target.value);
  };

  const handleAddProduct = (newProduct) => {
    // In a real app, this would add the product to the state or backend
    // For this demo, we just show a success toast
    toast.success(`Product "${newProduct.name}" added successfully!`);
    setInventoryStats(prev => ({
      ...prev,
      totalItems: prev.totalItems + 1,
      recentlyAdded: prev.recentlyAdded + 1
    }));
  };

  const getStatusBadge = (status) => {
    switch(status) {
      case "In Stock":
        return <span className="badge badge-green">In Stock</span>;
      case "Low Stock":
        return <span className="badge badge-yellow">Low Stock</span>;
      case "Out of Stock":
        return <span className="badge badge-red">Out of Stock</span>;
      default:
        return <span className="badge bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200">{status}</span>;
    }
  };

  return (
    <div className="container mx-auto px-4">
      <div className="mb-8">
        <h1 className="text-2xl md:text-3xl font-bold mb-2">Inventory Dashboard</h1>
        <p className="text-surface-600 dark:text-surface-400">
          Manage and track your inventory in real-time
        </p>
      </div>
      
      {/* Stats Cards */}
      <motion.div 
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        {quickAccessItems.map((item, index) => (
          <motion.div 
            key={index}
            variants={itemVariants}
            className={`${item.color} rounded-xl p-4 flex items-center space-x-4 shadow-sm hover:shadow-md transition-shadow duration-200`}
          >
            <div className={`p-3 rounded-full ${item.textColor}`}>
              {getIcon(item.icon)({ className: "w-6 h-6" })}
            </div>
            <div>
              <p className="text-surface-600 dark:text-surface-300 text-sm font-medium">{item.title}</p>
              <p className={`text-2xl font-bold ${item.textColor}`}>{item.value}</p>
            </div>
          </motion.div>
        ))}
      </motion.div>

      {/* Tabs */}
      <div className="flex border-b border-surface-200 dark:border-surface-700 mb-6">
        <button 
          onClick={() => setActiveTab('dashboard')}
          className={`px-4 py-2 font-medium text-sm border-b-2 transition-colors duration-200 ${
            activeTab === 'dashboard' 
              ? 'border-primary text-primary dark:border-primary-light dark:text-primary-light' 
              : 'border-transparent text-surface-600 dark:text-surface-400 hover:text-surface-800 dark:hover:text-surface-200'
          }`}
        >
          Dashboard
        </button>
        <button 
          onClick={() => setActiveTab('products')}
          className={`px-4 py-2 font-medium text-sm border-b-2 transition-colors duration-200 ${
            activeTab === 'products' 
              ? 'border-primary text-primary dark:border-primary-light dark:text-primary-light' 
              : 'border-transparent text-surface-600 dark:text-surface-400 hover:text-surface-800 dark:hover:text-surface-200'
          }`}
        >
          Products
        </button>
        <button 
          onClick={() => setActiveTab('add')}
          className={`px-4 py-2 font-medium text-sm border-b-2 transition-colors duration-200 ${
            activeTab === 'add' 
              ? 'border-primary text-primary dark:border-primary-light dark:text-primary-light' 
              : 'border-transparent text-surface-600 dark:text-surface-400 hover:text-surface-800 dark:hover:text-surface-200'
          }`}
        >
          Add New
        </button>
      </div>

      {/* Tab Content */}
      <div className="mb-8">
        {activeTab === 'dashboard' && (
          <div>
            <div className="mb-6 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  {getIcon('Search')({ className: "w-5 h-5 text-surface-400" })}
                </div>
                <input
                  type="text"
                  placeholder="Search products, SKUs, categories..."
                  className="input pl-10"
                  value={searchQuery}
                  onChange={handleSearch}
                />
              </div>
              <div className="flex space-x-2">
                <button className="btn btn-outline flex items-center gap-2">
                  {getIcon('Filter')({ className: "w-4 h-4" })}
                  <span>Filter</span>
                </button>
                <button className="btn btn-outline flex items-center gap-2">
                  {getIcon('Download')({ className: "w-4 h-4" })}
                  <span>Export</span>
                </button>
              </div>
            </div>

            <div className="overflow-x-auto rounded-xl shadow-sm border border-surface-200 dark:border-surface-700">
              <table className="min-w-full divide-y divide-surface-200 dark:divide-surface-700">
                <thead className="bg-surface-100 dark:bg-surface-800">
                  <tr>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-surface-600 dark:text-surface-400 uppercase tracking-wider">
                      Product
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-surface-600 dark:text-surface-400 uppercase tracking-wider">
                      SKU
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-surface-600 dark:text-surface-400 uppercase tracking-wider">
                      Category
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-surface-600 dark:text-surface-400 uppercase tracking-wider">
                      Quantity
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-surface-600 dark:text-surface-400 uppercase tracking-wider">
                      Status
                    </th>
                    <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-surface-600 dark:text-surface-400 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white dark:bg-surface-800 divide-y divide-surface-200 dark:divide-surface-700">
                  {filteredItems.length > 0 ? (
                    filteredItems.map((item) => (
                      <tr key={item.id} className="hover:bg-surface-50 dark:hover:bg-surface-750 transition-colors duration-150">
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                          {item.name}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-surface-600 dark:text-surface-400">
                          {item.sku}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-surface-600 dark:text-surface-400">
                          {item.category}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-surface-600 dark:text-surface-400">
                          <div className="flex items-center">
                            <span className={`${item.quantity < item.minQuantity ? 'text-red-600 dark:text-red-400' : ''}`}>
                              {item.quantity}
                            </span>
                            {item.quantity < item.minQuantity && (
                              <span className="ml-2 text-red-600 dark:text-red-400">
                                {getIcon('AlertCircle')({ className: "w-4 h-4" })}
                              </span>
                            )}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm">
                          {getStatusBadge(item.status)}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-right">
                          <div className="flex justify-end space-x-2">
                            <button className="p-1 rounded-md hover:bg-surface-100 dark:hover:bg-surface-700" title="Edit">
                              {getIcon('Edit')({ className: "w-4 h-4 text-blue-600 dark:text-blue-400" })}
                            </button>
                            <button className="p-1 rounded-md hover:bg-surface-100 dark:hover:bg-surface-700" title="Adjust Stock">
                              {getIcon('RefreshCw')({ className: "w-4 h-4 text-green-600 dark:text-green-400" })}
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={6} className="px-6 py-4 text-center text-sm text-surface-500 dark:text-surface-400">
                        No items found matching your search criteria
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {activeTab === 'products' && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {sampleInventoryItems.map((item) => (
              <div key={item.id} className="card flex flex-col hover:shadow-lg transition-shadow duration-200">
                <div className="flex justify-between items-start mb-4">
                  <h3 className="text-lg font-semibold">{item.name}</h3>
                  {getStatusBadge(item.status)}
                </div>
                <div className="space-y-2 mb-4">
                  <div className="flex justify-between">
                    <span className="text-surface-600 dark:text-surface-400 text-sm">SKU:</span>
                    <span className="font-medium">{item.sku}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-surface-600 dark:text-surface-400 text-sm">Category:</span>
                    <span>{item.category}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-surface-600 dark:text-surface-400 text-sm">Quantity:</span>
                    <span className={`font-medium ${item.quantity < item.minQuantity ? 'text-red-600 dark:text-red-400' : ''}`}>
                      {item.quantity}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-surface-600 dark:text-surface-400 text-sm">Min Quantity:</span>
                    <span>{item.minQuantity}</span>
                  </div>
                </div>
                <div className="mt-auto pt-4 border-t border-surface-200 dark:border-surface-700 flex justify-between">
                  <button className="btn btn-outline text-sm px-3 py-1.5 flex items-center gap-1">
                    {getIcon('Edit')({ className: "w-4 h-4" })}
                    <span>Edit</span>
                  </button>
                  <button className="btn btn-outline text-sm px-3 py-1.5 flex items-center gap-1">
                    {getIcon('RefreshCw')({ className: "w-4 h-4" })}
                    <span>Adjust</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {activeTab === 'add' && (
          <MainFeature onAddProduct={handleAddProduct} />
        )}
      </div>
    </div>
  );
};

export default Home;