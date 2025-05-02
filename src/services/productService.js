// Service for product-related API operations
class ProductService {
  constructor() {
    // Table information from the provided JSON
    this.tableName = 'product';
    this.fields = [
      'Id', 'Name', 'Tags', 'Owner', 'CreatedOn', 'CreatedBy', 'ModifiedOn', 
      'ModifiedBy', 'DeletedOn', 'DeletedBy', 'IsDeleted', 'InSandbox', 
      'sku', 'description', 'category', 'quantity', 'min_quantity', 
      'unit_cost', 'selling_price', 'location', 'status'
    ];
    this.apperClient = null;
    this.initClient();
  }

  // Initialize the ApperClient with environment variables
  initClient() {
    try {
      const { ApperClient } = window.ApperSDK;
      this.apperClient = new ApperClient({
        apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
        apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
      });
    } catch (error) {
      console.error('Failed to initialize ApperClient:', error);
    }
  }

  // Get all products with optional filtering
  async getProducts(filters = {}) {
    try {
      if (!this.apperClient) this.initClient();
      
      const params = {
        fields: this.fields,
        orderBy: [{ field: 'CreatedOn', direction: 'desc' }],
        where: [{ field: 'IsDeleted', operator: 'equals', value: false }]
      };
      
      // Add additional filters if provided
      if (filters.category) {
        params.where.push({ field: 'category', operator: 'equals', value: filters.category });
      }
      
      if (filters.status) {
        params.where.push({ field: 'status', operator: 'equals', value: filters.status });
      }
      
      if (filters.search) {
        params.whereGroups = [{
          operator: 'or',
          where: [
            { field: 'Name', operator: 'contains', value: filters.search },
            { field: 'sku', operator: 'contains', value: filters.search },
            { field: 'description', operator: 'contains', value: filters.search }
          ]
        }];
      }
      
      // Add pagination if needed
      if (filters.limit) {
        params.pagingInfo = {
          limit: filters.limit,
          offset: filters.offset || 0
        };
      }
      
      const response = await this.apperClient.fetchRecords(this.tableName, params);
      
      if (!response || !response.data) {
        return { data: [], total: 0 };
      }
      
      // Transform data to match UI expectations
      const products = response.data.map(product => ({
        id: product.Id,
        name: product.Name,
        sku: product.sku,
        category: product.category,
        description: product.description,
        quantity: product.quantity,
        minQuantity: product.min_quantity,
        unitCost: product.unit_cost,
        sellingPrice: product.selling_price,
        location: product.location,
        status: product.status || this.calculateStatus(product.quantity, product.min_quantity),
        createdAt: product.CreatedOn
      }));
      
      return { 
        data: products, 
        total: response.totalRecords || products.length 
      };
    } catch (error) {
      console.error('Error fetching products:', error);
      throw error;
    }
  }

  // Get product counts for dashboard stats
  async getProductStats() {
    try {
      if (!this.apperClient) this.initClient();
      
      // Get total count
      const totalResponse = await this.apperClient.fetchRecords(this.tableName, {
        fields: ['Id'],
        where: [{ field: 'IsDeleted', operator: 'equals', value: false }]
      });
      
      // Get low stock count
      const lowStockResponse = await this.apperClient.fetchRecords(this.tableName, {
        fields: ['Id'],
        where: [
          { field: 'IsDeleted', operator: 'equals', value: false },
          { field: 'status', operator: 'equals', value: 'Low Stock' }
        ]
      });
      
      // Get out of stock count
      const outOfStockResponse = await this.apperClient.fetchRecords(this.tableName, {
        fields: ['Id'],
        where: [
          { field: 'IsDeleted', operator: 'equals', value: false },
          { field: 'status', operator: 'equals', value: 'Out of Stock' }
        ]
      });
      
      // Get recently added (last 7 days)
      const sevenDaysAgo = new Date();
      sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
      
      const recentlyAddedResponse = await this.apperClient.fetchRecords(this.tableName, {
        fields: ['Id'],
        where: [
          { field: 'IsDeleted', operator: 'equals', value: false },
          { field: 'CreatedOn', operator: 'greaterThanOrEqual', value: sevenDaysAgo.toISOString() }
        ]
      });
      
      return {
        totalItems: totalResponse?.data?.length || 0,
        lowStock: lowStockResponse?.data?.length || 0,
        outOfStock: outOfStockResponse?.data?.length || 0,
        recentlyAdded: recentlyAddedResponse?.data?.length || 0
      };
    } catch (error) {
      console.error('Error fetching product stats:', error);
      return {
        totalItems: 0,
        lowStock: 0,
        outOfStock: 0,
        recentlyAdded: 0
      };
    }
  }

  // Get a single product by ID
  async getProductById(id) {
    try {
      if (!this.apperClient) this.initClient();
      
      const response = await this.apperClient.getRecordById(this.tableName, id, {
        fields: this.fields
      });
      
      if (!response || !response.data) {
        return null;
      }
      
      const product = response.data;
      
      return {
        id: product.Id,
        name: product.Name,
        sku: product.sku,
        category: product.category,
        description: product.description,
        quantity: product.quantity,
        minQuantity: product.min_quantity,
        unitCost: product.unit_cost,
        sellingPrice: product.selling_price,
        location: product.location,
        status: product.status || this.calculateStatus(product.quantity, product.min_quantity),
        createdAt: product.CreatedOn
      };
    } catch (error) {
      console.error(`Error fetching product with ID ${id}:`, error);
      throw error;
    }
  }

  // Create a new product
  async createProduct(productData) {
    try {
      if (!this.apperClient) this.initClient();
      
      // Transform UI data to match database schema
      const dbProduct = {
        Name: productData.name,
        sku: productData.sku,
        description: productData.description,
        category: productData.category,
        quantity: parseInt(productData.quantity),
        min_quantity: parseInt(productData.minQuantity),
        unit_cost: parseFloat(productData.unitCost),
        selling_price: parseFloat(productData.sellingPrice),
        location: productData.location,
        status: this.calculateStatus(
          parseInt(productData.quantity), 
          parseInt(productData.minQuantity)
        )
      };
      
      const response = await this.apperClient.createRecord(this.tableName, {
        records: [dbProduct]
      });
      
      if (!response || !response.success || !response.results || response.results.length === 0) {
        throw new Error('Failed to create product');
      }
      
      const createdProduct = response.results[0].data;
      
      return {
        id: createdProduct.Id,
        name: createdProduct.Name,
        sku: createdProduct.sku,
        category: createdProduct.category,
        description: createdProduct.description,
        quantity: createdProduct.quantity,
        minQuantity: createdProduct.min_quantity,
        unitCost: createdProduct.unit_cost,
        sellingPrice: createdProduct.selling_price,
        location: createdProduct.location,
        status: createdProduct.status,
        createdAt: createdProduct.CreatedOn
      };
    } catch (error) {
      console.error('Error creating product:', error);
      throw error;
    }
  }

  // Update an existing product
  async updateProduct(id, productData) {
    try {
      if (!this.apperClient) this.initClient();
      
      // Transform UI data to match database schema
      const dbProduct = {
        Id: id,
        Name: productData.name,
        sku: productData.sku,
        description: productData.description,
        category: productData.category,
        quantity: parseInt(productData.quantity),
        min_quantity: parseInt(productData.minQuantity),
        unit_cost: parseFloat(productData.unitCost),
        selling_price: parseFloat(productData.sellingPrice),
        location: productData.location,
        status: this.calculateStatus(
          parseInt(productData.quantity), 
          parseInt(productData.minQuantity)
        )
      };
      
      const response = await this.apperClient.updateRecord(this.tableName, {
        records: [dbProduct]
      });
      
      if (!response || !response.success || !response.results || response.results.length === 0) {
        throw new Error('Failed to update product');
      }
      
      const updatedProduct = response.results[0].data;
      
      return {
        id: updatedProduct.Id,
        name: updatedProduct.Name,
        sku: updatedProduct.sku,
        category: updatedProduct.category,
        description: updatedProduct.description,
        quantity: updatedProduct.quantity,
        minQuantity: updatedProduct.min_quantity,
        unitCost: updatedProduct.unit_cost,
        sellingPrice: updatedProduct.selling_price,
        location: updatedProduct.location,
        status: updatedProduct.status,
        updatedAt: updatedProduct.ModifiedOn
      };
    } catch (error) {
      console.error(`Error updating product with ID ${id}:`, error);
      throw error;
    }
  }

  // Delete a product (soft delete by setting IsDeleted to true)
  async deleteProduct(id) {
    try {
      if (!this.apperClient) this.initClient();
      
      const response = await this.apperClient.updateRecord(this.tableName, {
        records: [{
          Id: id,
          IsDeleted: true,
          DeletedOn: new Date().toISOString()
        }]
      });
      
      if (!response || !response.success || !response.results || response.results.length === 0) {
        throw new Error('Failed to delete product');
      }
      
      return true;
    } catch (error) {
      console.error(`Error deleting product with ID ${id}:`, error);
      throw error;
    }
  }

  // Calculate status based on quantity and minimum quantity
  calculateStatus(quantity, minQuantity) {
    if (quantity <= 0) {
      return 'Out of Stock';
    } else if (quantity < minQuantity) {
      return 'Low Stock';
    } else {
      return 'In Stock';
    }
  }
}

export const productService = new ProductService();