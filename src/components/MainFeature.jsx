import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'react-toastify';
import getIcon from '../utils/iconUtils';

const categories = [
  "Electronics",
  "Food & Beverage",
  "Furniture",
  "Clothing",
  "Accessories",
  "Sports",
  "Books",
  "Toys",
  "Health & Beauty",
  "Other"
];

const MainFeature = ({ onAddProduct }) => {
  const [formData, setFormData] = useState({
    name: '',
    sku: '',
    description: '',
    category: '',
    quantity: '',
    minQuantity: '',
    unitCost: '',
    sellingPrice: '',
    location: ''
  });
  
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showPreview, setShowPreview] = useState(false);
  const [formStep, setFormStep] = useState(1);
  
  const PackageIcon = getIcon('Package');
  const ArrowRightIcon = getIcon('ArrowRight');
  const ArrowLeftIcon = getIcon('ArrowLeft');
  const EyeIcon = getIcon('Eye');
  const SaveIcon = getIcon('Save');
  const XIcon = getIcon('X');
  const CheckIcon = getIcon('Check');
  
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Clear error for this field when user types
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: null
      }));
    }
  };
  
  const validateStep1 = () => {
    const newErrors = {};
    
    if (!formData.name.trim()) newErrors.name = "Product name is required";
    if (!formData.sku.trim()) newErrors.sku = "SKU is required";
    if (!formData.category) newErrors.category = "Category is required";
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
  
  const validateStep2 = () => {
    const newErrors = {};
    
    if (!formData.quantity || isNaN(formData.quantity) || parseInt(formData.quantity) < 0) {
      newErrors.quantity = "Valid quantity is required";
    }
    
    if (!formData.minQuantity || isNaN(formData.minQuantity) || parseInt(formData.minQuantity) < 0) {
      newErrors.minQuantity = "Valid minimum quantity is required";
    }
    
    if (!formData.unitCost || isNaN(formData.unitCost) || parseFloat(formData.unitCost) <= 0) {
      newErrors.unitCost = "Valid unit cost is required";
    }
    
    if (!formData.sellingPrice || isNaN(formData.sellingPrice) || parseFloat(formData.sellingPrice) <= 0) {
      newErrors.sellingPrice = "Valid selling price is required";
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
  
  const handleNextStep = () => {
    if (formStep === 1 && validateStep1()) {
      setFormStep(2);
    }
  };
  
  const handlePrevStep = () => {
    setFormStep(1);
  };
  
  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (formStep === 2 && validateStep2()) {
      setIsSubmitting(true);
      
      // Create a new product object with parsed numeric values
      const newProduct = {
        ...formData,
        quantity: parseInt(formData.quantity),
        minQuantity: parseInt(formData.minQuantity),
        unitCost: parseFloat(formData.unitCost),
        sellingPrice: parseFloat(formData.sellingPrice),
        createdAt: new Date().toISOString()
      };
      
      // Simulate API call
      setTimeout(() => {
        onAddProduct(newProduct);
        
        // Reset form
        setFormData({
          name: '',
          sku: '',
          description: '',
          category: '',
          quantity: '',
          minQuantity: '',
          unitCost: '',
          sellingPrice: '',
          location: ''
        });
        
        setFormStep(1);
        setIsSubmitting(false);
        setShowPreview(false);
      }, 1000);
    }
  };
  
  const togglePreview = () => {
    if (!showPreview && (formStep === 1 ? validateStep1() : validateStep2())) {
      setShowPreview(true);
    } else {
      setShowPreview(false);
    }
  };
  
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1,
      transition: { 
        duration: 0.5
      } 
    },
    exit: {
      opacity: 0,
      transition: {
        duration: 0.3
      }
    }
  };
  
  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-xl md:text-2xl font-semibold flex items-center gap-2">
            <PackageIcon className="text-primary" />
            Add New Product
          </h2>
          <p className="text-surface-600 dark:text-surface-400 text-sm md:text-base">
            Enter new product details to add to your inventory
          </p>
        </div>
        
        <button
          onClick={togglePreview}
          className="btn flex items-center justify-center gap-2 bg-surface-100 hover:bg-surface-200 dark:bg-surface-700 dark:hover:bg-surface-600 text-surface-800 dark:text-surface-200"
        >
          {showPreview ? <XIcon className="w-4 h-4" /> : <EyeIcon className="w-4 h-4" />}
          <span>{showPreview ? "Close Preview" : "Preview"}</span>
        </button>
      </div>
      
      {/* Form Steps Indicator */}
      <div className="flex items-center mb-6">
        <div className={`flex items-center justify-center w-8 h-8 rounded-full ${
          formStep >= 1 ? 'bg-primary text-white' : 'bg-surface-200 dark:bg-surface-700 text-surface-600 dark:text-surface-400'
        }`}>
          {formStep > 1 ? <CheckIcon className="w-5 h-5" /> : 1}
        </div>
        <div className={`flex-1 h-1 mx-2 ${
          formStep > 1 ? 'bg-primary' : 'bg-surface-200 dark:bg-surface-700'
        }`}></div>
        <div className={`flex items-center justify-center w-8 h-8 rounded-full ${
          formStep >= 2 ? 'bg-primary text-white' : 'bg-surface-200 dark:bg-surface-700 text-surface-600 dark:text-surface-400'
        }`}>
          2
        </div>
      </div>
      
      <AnimatePresence mode="wait">
        {!showPreview ? (
          <motion.div
            key="form"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            className="card"
          >
            <form onSubmit={handleSubmit}>
              {formStep === 1 && (
                <div className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label htmlFor="name" className="label">Product Name*</label>
                      <input
                        type="text"
                        id="name"
                        name="name"
                        className={`input ${errors.name ? 'border-red-500 dark:border-red-500' : ''}`}
                        value={formData.name}
                        onChange={handleChange}
                        placeholder="Enter product name"
                      />
                      {errors.name && (
                        <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.name}</p>
                      )}
                    </div>
                    
                    <div>
                      <label htmlFor="sku" className="label">SKU/Product Code*</label>
                      <input
                        type="text"
                        id="sku"
                        name="sku"
                        className={`input ${errors.sku ? 'border-red-500 dark:border-red-500' : ''}`}
                        value={formData.sku}
                        onChange={handleChange}
                        placeholder="Enter SKU"
                      />
                      {errors.sku && (
                        <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.sku}</p>
                      )}
                    </div>
                  </div>
                  
                  <div>
                    <label htmlFor="category" className="label">Category*</label>
                    <select
                      id="category"
                      name="category"
                      className={`input ${errors.category ? 'border-red-500 dark:border-red-500' : ''}`}
                      value={formData.category}
                      onChange={handleChange}
                    >
                      <option value="">Select a category</option>
                      {categories.map((category) => (
                        <option key={category} value={category}>{category}</option>
                      ))}
                    </select>
                    {errors.category && (
                      <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.category}</p>
                    )}
                  </div>
                  
                  <div>
                    <label htmlFor="description" className="label">Description</label>
                    <textarea
                      id="description"
                      name="description"
                      rows="3"
                      className="input"
                      value={formData.description}
                      onChange={handleChange}
                      placeholder="Enter product description"
                    ></textarea>
                  </div>
                  
                  <div>
                    <label htmlFor="location" className="label">Storage Location</label>
                    <input
                      type="text"
                      id="location"
                      name="location"
                      className="input"
                      value={formData.location}
                      onChange={handleChange}
                      placeholder="Warehouse, shelf, bin, etc."
                    />
                  </div>
                </div>
              )}
              
              {formStep === 2 && (
                <div className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label htmlFor="quantity" className="label">Current Quantity*</label>
                      <input
                        type="number"
                        id="quantity"
                        name="quantity"
                        className={`input ${errors.quantity ? 'border-red-500 dark:border-red-500' : ''}`}
                        value={formData.quantity}
                        onChange={handleChange}
                        placeholder="Enter quantity"
                        min="0"
                      />
                      {errors.quantity && (
                        <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.quantity}</p>
                      )}
                    </div>
                    
                    <div>
                      <label htmlFor="minQuantity" className="label">Minimum Quantity*</label>
                      <input
                        type="number"
                        id="minQuantity"
                        name="minQuantity"
                        className={`input ${errors.minQuantity ? 'border-red-500 dark:border-red-500' : ''}`}
                        value={formData.minQuantity}
                        onChange={handleChange}
                        placeholder="Enter minimum quantity"
                        min="0"
                      />
                      {errors.minQuantity && (
                        <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.minQuantity}</p>
                      )}
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label htmlFor="unitCost" className="label">Unit Cost*</label>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                          <span className="text-surface-500">$</span>
                        </div>
                        <input
                          type="number"
                          id="unitCost"
                          name="unitCost"
                          className={`input pl-7 ${errors.unitCost ? 'border-red-500 dark:border-red-500' : ''}`}
                          value={formData.unitCost}
                          onChange={handleChange}
                          placeholder="0.00"
                          step="0.01"
                          min="0"
                        />
                      </div>
                      {errors.unitCost && (
                        <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.unitCost}</p>
                      )}
                    </div>
                    
                    <div>
                      <label htmlFor="sellingPrice" className="label">Selling Price*</label>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                          <span className="text-surface-500">$</span>
                        </div>
                        <input
                          type="number"
                          id="sellingPrice"
                          name="sellingPrice"
                          className={`input pl-7 ${errors.sellingPrice ? 'border-red-500 dark:border-red-500' : ''}`}
                          value={formData.sellingPrice}
                          onChange={handleChange}
                          placeholder="0.00"
                          step="0.01"
                          min="0"
                        />
                      </div>
                      {errors.sellingPrice && (
                        <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.sellingPrice}</p>
                      )}
                      
                      {formData.unitCost && formData.sellingPrice && parseFloat(formData.sellingPrice) > 0 && parseFloat(formData.unitCost) > 0 && (
                        <p className="mt-1 text-sm text-surface-600 dark:text-surface-400">
                          Profit Margin: {(((parseFloat(formData.sellingPrice) - parseFloat(formData.unitCost)) / parseFloat(formData.sellingPrice)) * 100).toFixed(2)}%
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              )}
              
              <div className="mt-6 flex justify-between">
                {formStep === 1 ? (
                  <div></div> // Empty div to maintain flex spacing
                ) : (
                  <button
                    type="button"
                    className="btn btn-outline flex items-center gap-2"
                    onClick={handlePrevStep}
                  >
                    <ArrowLeftIcon className="w-4 h-4" />
                    <span>Previous</span>
                  </button>
                )}
                
                {formStep === 1 ? (
                  <button
                    type="button"
                    className="btn btn-primary flex items-center gap-2"
                    onClick={handleNextStep}
                  >
                    <span>Next</span>
                    <ArrowRightIcon className="w-4 h-4" />
                  </button>
                ) : (
                  <button
                    type="submit"
                    className="btn btn-primary flex items-center gap-2"
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? (
                      <>
                        <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        <span>Saving...</span>
                      </>
                    ) : (
                      <>
                        <SaveIcon className="w-4 h-4" />
                        <span>Save Product</span>
                      </>
                    )}
                  </button>
                )}
              </div>
            </form>
          </motion.div>
        ) : (
          <motion.div
            key="preview"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            className="card"
          >
            <div className="mb-4 pb-4 border-b border-surface-200 dark:border-surface-700">
              <h3 className="text-lg font-medium">Product Preview</h3>
              <p className="text-surface-600 dark:text-surface-400 text-sm">Review product information before saving</p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-4">
              <div>
                <h4 className="text-sm font-medium text-surface-600 dark:text-surface-400">Basic Information</h4>
                <div className="space-y-3 mt-3">
                  <div>
                    <p className="text-xs text-surface-500 dark:text-surface-500">Product Name</p>
                    <p className="font-medium">{formData.name || "Not specified"}</p>
                  </div>
                  <div>
                    <p className="text-xs text-surface-500 dark:text-surface-500">SKU/Product Code</p>
                    <p className="font-medium">{formData.sku || "Not specified"}</p>
                  </div>
                  <div>
                    <p className="text-xs text-surface-500 dark:text-surface-500">Category</p>
                    <p className="font-medium">{formData.category || "Not specified"}</p>
                  </div>
                  <div>
                    <p className="text-xs text-surface-500 dark:text-surface-500">Description</p>
                    <p className="font-medium text-sm">{formData.description || "No description provided"}</p>
                  </div>
                  <div>
                    <p className="text-xs text-surface-500 dark:text-surface-500">Location</p>
                    <p className="font-medium">{formData.location || "Not specified"}</p>
                  </div>
                </div>
              </div>
              
              <div>
                <h4 className="text-sm font-medium text-surface-600 dark:text-surface-400">Inventory & Pricing</h4>
                <div className="space-y-3 mt-3">
                  <div>
                    <p className="text-xs text-surface-500 dark:text-surface-500">Current Quantity</p>
                    <p className="font-medium">{formData.quantity || "0"}</p>
                  </div>
                  <div>
                    <p className="text-xs text-surface-500 dark:text-surface-500">Minimum Quantity</p>
                    <p className="font-medium">{formData.minQuantity || "0"}</p>
                  </div>
                  <div>
                    <p className="text-xs text-surface-500 dark:text-surface-500">Unit Cost</p>
                    <p className="font-medium">${parseFloat(formData.unitCost || 0).toFixed(2)}</p>
                  </div>
                  <div>
                    <p className="text-xs text-surface-500 dark:text-surface-500">Selling Price</p>
                    <p className="font-medium">${parseFloat(formData.sellingPrice || 0).toFixed(2)}</p>
                  </div>
                  
                  {formData.unitCost && formData.sellingPrice && (
                    <div>
                      <p className="text-xs text-surface-500 dark:text-surface-500">Profit Margin</p>
                      <p className="font-medium text-green-600 dark:text-green-400">
                        {(((parseFloat(formData.sellingPrice) - parseFloat(formData.unitCost)) / parseFloat(formData.sellingPrice)) * 100).toFixed(2)}%
                      </p>
                    </div>
                  )}
                  
                  {formData.quantity && formData.minQuantity && parseInt(formData.quantity) < parseInt(formData.minQuantity) && (
                    <div className="p-3 bg-red-100 dark:bg-red-900/30 rounded-lg flex items-start gap-2">
                      {getIcon('AlertTriangle')({ className: "w-5 h-5 text-red-600 dark:text-red-400 mt-0.5 flex-shrink-0" })}
                      <p className="text-sm text-red-600 dark:text-red-400">
                        Warning: Current quantity is below the minimum level. Consider restocking soon.
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </div>
            
            <div className="mt-6 pt-4 border-t border-surface-200 dark:border-surface-700 flex justify-end">
              <button
                type="button"
                className="btn btn-primary flex items-center gap-2"
                onClick={togglePreview}
              >
                <ArrowLeftIcon className="w-4 h-4" />
                <span>Back to Form</span>
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default MainFeature;