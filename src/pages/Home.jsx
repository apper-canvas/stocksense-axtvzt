import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { toast } from 'react-toastify';
import MainFeature from '../components/MainFeature';
import getIcon from '../utils/iconUtils';
import { productService } from '../services/productService';

const Home = () => {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [searchQuery, setSearchQuery] = useState('');
  const [inventoryStats, setInventoryStats] = useState({
    totalItems: 0,
    lowStock: 0,
    outOfStock: 0,
    recentlyAdded: 0
  });
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // Fetch products and stats on component mount
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        
        // Get product stats for the dashboard
        const stats = await productService.getProductStats();
        setInventoryStats(stats);
        
        // Get all products
        const { data } = await productService.getProducts();
        setProducts(data);
        
        setLoading(false);
      } catch (err) {
        console.error('Error loading data:', err);
        setError('Failed to load inventory data. Please try again later.');
        setLoading(false);
        toast.error('Failed to load inventory data');
      }
    };
    
    fetchData();
  }, []);
  
  // Filter products based on search query
  const filteredItems = products.filter(item => 
    item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    item.sku.toLowerCase().includes(searchQuery.toLowerCase()) ||
    item.category.toLowerCase().includes(searchQuery.toLowerCase())
  );

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

  const handleAddProduct = async (newProduct) => {
    try {
      // Create the product in the database
      const createdProduct = await productService.createProduct(newProduct);
      
      // Add the new product to the local state
      setProducts(prev => [createdProduct, ...prev]);
      
      // Update inventory stats
      setInventoryStats(prev => ({
        ...prev,
        totalItems: prev.totalItems + 1,
        recentlyAdded: prev.recentlyAdded + 1
      }));
      
      toast.success(`Product "${newProduct.name}" added successfully!`);
    } catch (error) {
      console.error('Error adding product:', error);
      toast.error('Failed to add product. Please try again.');
    }
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

  // Loading state
  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col items-center justify-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary mb-4"></div>
          <p className="text-surface-600 dark:text-surface-400">Loading inventory data...</p>
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col items-center justify-center h-64">
          <div className="text-red-500 mb-4">
            {getIcon('AlertCircle')({ className: "w-12 h-12" })}
          </div>
          <p className="text-red-500 font-medium mb-2">Error Loading Data</p>
          <p className="text-surface-600 dark:text-surface-400 mb-4">{error}</p>
          <button 
            className="btn btn-primary"
            onClick={() => window.location.reload()}
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

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
            {products.map((item) => (
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