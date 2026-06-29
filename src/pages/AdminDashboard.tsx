import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import adminApi from '../lib/adminApi';
import { removeAdminToken } from '../lib/auth';
import { Trash2, Edit, Plus, X, ChevronDown, ChevronUp, LogOut, Package, FileText, Video } from 'lucide-react';
import { MentorshipAdmin } from '../components/MentorshipAdmin';
import './AdminDashboard.css';

interface OrderItem {
  productId: string;
  name: string;
  price: number;
  quantity: number;
  bindingStyle?: string;
}

interface ShippingAddress {
  fullName: string;
  street: string;
  city: string;
  zip: string;
  country: string;
}

interface Order {
  id: string;
  order_code: string;
  customer_email: string;
  customer_name: string | null;
  amount: number;
  status: string;
  items: OrderItem[];
  shipping_address: ShippingAddress | null;
  tracking_code: string | null;
  paypal_order_id: string | null;
  created_at: string;
  updated_at: string;
}

interface Product {
  id: string;
  title: string;
  description: string | null;
  price: number;
  image_url: string;
  category: string;
  created_at: string;
}

export const AdminDashboard: React.FC = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<'orders' | 'products' | 'mentorship'>('orders');
  const [orders, setOrders] = useState<Order[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Expanded Order IDs
  const [expandedOrders, setExpandedOrders] = useState<Record<string, boolean>>({});

  // Product CRUD states
  const [isAddingProduct, setIsAddingProduct] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  
  // Product Form states
  const [productForm, setProductForm] = useState({
    title: '',
    description: '',
    price: '',
    category: 'books',
  });
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const token = localStorage.getItem('worldwide_admin_token');
    if (!token) {
      navigate('/admin/login');
      return;
    }
    fetchData();
  }, [navigate]);

  const fetchData = async () => {
    setLoading(true);
    setError(null);
    try {
      const [ordersRes, productsRes] = await Promise.all([
        adminApi.get('/worldwide/admin/orders'),
        adminApi.get('/worldwide/admin/products'),
      ]);
      setOrders(ordersRes.data);
      setProducts(productsRes.data);
    } catch (err: any) {
      console.error(err);
      setError(err.response?.data?.error || 'Failed to fetch dashboard data.');
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    removeAdminToken();
    navigate('/admin/login');
  };

  const toggleOrderExpand = (id: string) => {
    setExpandedOrders(prev => ({ ...prev, [id]: !prev[id] }));
  };

  // 1. Update Order Status
  const handleUpdateStatus = async (orderId: string, newStatus: string) => {
    try {
      const res = await adminApi.patch(`/worldwide/admin/orders/${orderId}`, { status: newStatus });
      setOrders(prev => prev.map(o => o.id === orderId ? { ...o, status: res.data.status } : o));
    } catch (err: any) {
      alert(err.response?.data?.error || 'Failed to update status');
    }
  };



  // 3. Delete Product
  const handleDeleteProduct = async (id: string) => {
    if (!window.confirm('Are you sure you want to delete this product?')) return;
    try {
      await adminApi.delete(`/worldwide/admin/products/${id}`);
      setProducts(prev => prev.filter(p => p.id !== id));
    } catch (err: any) {
      alert(err.response?.data?.error || 'Failed to delete product');
    }
  };

  // 4. Create Product
  const handleCreateProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!productForm.title || !productForm.price || !selectedFile) {
      alert('Title, price, and image file are required.');
      return;
    }

    const formData = new FormData();
    formData.append('title', productForm.title);
    formData.append('description', productForm.description);
    formData.append('price', productForm.price);
    formData.append('category', productForm.category);
    formData.append('image', selectedFile);

    try {
      const res = await adminApi.post('/worldwide/admin/products', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      setProducts(prev => [res.data, ...prev]);
      setIsAddingProduct(false);
      resetProductForm();
    } catch (err: any) {
      alert(err.response?.data?.error || 'Failed to create product');
    }
  };

  // 5. Update Product Details
  const handleUpdateProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingProduct) return;

    const formData = new FormData();
    formData.append('title', productForm.title);
    formData.append('description', productForm.description);
    formData.append('price', productForm.price);
    formData.append('category', productForm.category);
    if (selectedFile) {
      formData.append('image', selectedFile);
    }

    try {
      const res = await adminApi.patch(`/worldwide/admin/products/${editingProduct.id}`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      setProducts(prev => prev.map(p => p.id === editingProduct.id ? res.data : p));
      setEditingProduct(null);
      resetProductForm();
    } catch (err: any) {
      alert(err.response?.data?.error || 'Failed to update product');
    }
  };

  const startEditProduct = (p: Product) => {
    setEditingProduct(p);
    setProductForm({
      title: p.title,
      description: p.description || '',
      price: String(p.price),
      category: p.category,
    });
    setSelectedFile(null);
  };

  const startAddProduct = () => {
    setIsAddingProduct(true);
    resetProductForm();
  };

  const resetProductForm = () => {
    setProductForm({
      title: '',
      description: '',
      price: '',
      category: 'books',
    });
    setSelectedFile(null);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  return (
    <div className="admin-dashboard-page">
      <div className="container py-3">
        <header className="dashboard-header">
          <div>
            <h1 className="dashboard-title">Worldwide Management</h1>
            <p className="dashboard-subtitle">Control the store inventory and process customer purchases.</p>
          </div>
          <button className="btn btn-outline logout-btn" onClick={handleLogout}>
            <LogOut size={16} style={{ marginRight: '0.5rem' }} />
            Log Out
          </button>
        </header>

        {/* Tabs */}
        <div className="tabs-container">
          <button
            className={`tab-btn ${activeTab === 'orders' ? 'active' : ''}`}
            onClick={() => setActiveTab('orders')}
          >
            <FileText size={18} style={{ marginRight: '0.5rem' }} />
            Orders ({orders.length})
          </button>
          <button
            className={`tab-btn ${activeTab === 'products' ? 'active' : ''}`}
            onClick={() => setActiveTab('products')}
          >
            <Package size={18} style={{ marginRight: '0.5rem' }} />
            Products ({products.length})
          </button>
          <button
            className={`tab-btn ${activeTab === 'mentorship' ? 'active' : ''}`}
            onClick={() => setActiveTab('mentorship')}
          >
            <Video size={18} style={{ marginRight: '0.5rem' }} />
            Mentorship
          </button>
        </div>

        {error && <div className="dashboard-error-box">{error}</div>}

        {loading ? (
          <div className="dashboard-loading">
            <div className="spinner"></div>
            <p>Loading dashboard metrics...</p>
          </div>
        ) : (
          <div className="tab-content">
            {/* Orders Tab */}
            {activeTab === 'orders' && (
              <div className="orders-section">
                {orders.length === 0 ? (
                  <div className="empty-dashboard-state">No orders recorded yet.</div>
                ) : (
                  <div className="orders-list">
                    {orders.map((order) => {
                      const isExpanded = !!expandedOrders[order.id];
                      return (
                        <div key={order.id} className={`order-row-card ${isExpanded ? 'expanded' : ''}`}>
                          <div className="order-row-summary" onClick={() => toggleOrderExpand(order.id)}>
                            <div className="order-summary-left">
                              <span className="order-code-badge">{order.order_code}</span>
                              <span className="order-email">{order.customer_email}</span>
                            </div>
                            <div className="order-summary-right">
                              <span className="order-amount">£{order.amount.toFixed(2)}</span>
                              <span className={`status-pill ${order.status}`}>{order.status}</span>
                              {isExpanded ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
                            </div>
                          </div>

                          {isExpanded && (
                            <div className="order-expanded-details">
                              <div className="details-grid">
                                <div>
                                  <h4 className="details-title">Customer Info</h4>
                                  <p><strong>Name:</strong> {order.customer_name || 'Guest Checkout'}</p>
                                  <p><strong>Email:</strong> {order.customer_email}</p>
                                  {order.paypal_order_id && (
                                    <p><strong>PayPal ID:</strong> <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>{order.paypal_order_id}</span></p>
                                  )}
                                  <p><strong>Date:</strong> {new Date(order.created_at).toLocaleString()}</p>
                                </div>
                                
                                <div>
                                  <h4 className="details-title">Order Info</h4>
                                  <p className="shipping-text" style={{ fontStyle: 'italic' }}>Digital products - delivered via email.</p>
                                </div>

                                <div className="order-fulfillment-control">
                                  <h4 className="details-title">Order Status</h4>
                                  <div className="form-group" style={{ marginBottom: '1rem' }}>
                                    <select
                                      value={order.status}
                                      onChange={(e) => handleUpdateStatus(order.id, e.target.value)}
                                      className="form-control"
                                      aria-label="Order Status"
                                    >
                                      <option value="pending">Pending</option>
                                      <option value="confirmed">Confirmed</option>
                                      <option value="delivered">Delivered</option>
                                      <option value="cancelled">Cancelled</option>
                                    </select>
                                  </div>
                                </div>
                              </div>

                              <div className="details-items-section">
                                <h4 className="details-title">Purchased Items</h4>
                                <table className="items-table">
                                  <thead>
                                    <tr>
                                      <th>Product</th>
                                      <th>Binding Style</th>
                                      <th style={{ textAlign: 'center' }}>Qty</th>
                                      <th style={{ textAlign: 'right' }}>Price</th>
                                    </tr>
                                  </thead>
                                  <tbody>
                                    {order.items.map((item, idx) => (
                                      <tr key={idx}>
                                        <td>{item.name}</td>
                                        <td>{item.bindingStyle || '—'}</td>
                                        <td style={{ textAlign: 'center' }}>{item.quantity}</td>
                                        <td style={{ textAlign: 'right' }}>£{item.price.toFixed(2)}</td>
                                      </tr>
                                    ))}
                                  </tbody>
                                </table>
                              </div>
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            )}

            {/* Products Tab */}
            {activeTab === 'products' && (
              <div className="products-section">
                <div className="products-actions-bar">
                  <h3 className="section-subtitle-title">Product Catalog</h3>
                  <button className="btn btn-primary btn-add-product" onClick={startAddProduct}>
                    <Plus size={16} style={{ marginRight: '0.5rem' }} />
                    Add Product
                  </button>
                </div>

                {products.length === 0 ? (
                  <div className="empty-dashboard-state">No products found. Add your first item.</div>
                ) : (
                  <div className="products-dashboard-grid">
                    {products.map((product) => (
                      <div key={product.id} className="prod-card">
                        <div className="prod-img-box">
                          <img src={product.image_url} alt={product.title} />
                        </div>
                        <div className="prod-content">
                          <span className="prod-category-tag">{product.category}</span>
                          <h4 className="prod-title">{product.title}</h4>
                          <p className="prod-price">£{product.price.toFixed(2)}</p>
                          <p className="prod-desc-preview">{product.description || 'No description provided.'}</p>
                          <div className="prod-actions">
                            <button className="prod-action-btn edit" onClick={() => startEditProduct(product)} title="Edit product">
                              <Edit size={16} />
                              Edit
                            </button>
                            <button className="prod-action-btn delete" onClick={() => handleDeleteProduct(product.id)} title="Delete product">
                              <Trash2 size={16} />
                              Delete
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* Mentorship Tab */}
            {activeTab === 'mentorship' && (
              <MentorshipAdmin />
            )}
          </div>
        )}
      </div>

      {/* Add / Edit Product Modals */}
      {(isAddingProduct || editingProduct) && (
        <div className="modal-overlay" onClick={() => { setIsAddingProduct(false); setEditingProduct(null); }}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()} style={{ maxWidth: '600px' }}>
            <button className="modal-close" onClick={() => { setIsAddingProduct(false); setEditingProduct(null); }}>
              <X size={24} />
            </button>
            <h3 className="modal-title">{isAddingProduct ? 'Create Product' : 'Edit Product'}</h3>
            
            <form onSubmit={isAddingProduct ? handleCreateProduct : handleUpdateProduct} className="product-form-modal">
              <div className="form-group">
                <label htmlFor="prodTitle">Title *</label>
                <input
                  type="text"
                  id="prodTitle"
                  value={productForm.title}
                  onChange={(e) => setProductForm(prev => ({ ...prev, title: e.target.value }))}
                  className="form-control"
                  required
                />
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="prodPrice">Price (GBP) *</label>
                  <input
                    type="number"
                    step="0.01"
                    id="prodPrice"
                    value={productForm.price}
                    onChange={(e) => setProductForm(prev => ({ ...prev, price: e.target.value }))}
                    className="form-control"
                    required
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="prodCategory">Category</label>
                  <select
                    id="prodCategory"
                    value={productForm.category}
                    onChange={(e) => setProductForm(prev => ({ ...prev, category: e.target.value }))}
                    className="form-control"
                  >
                    <option value="books">Books</option>
                    <option value="graphics">Graphics Service</option>
                  </select>
                </div>
              </div>

              <div className="form-group">
                <label htmlFor="prodDesc">Description</label>
                <textarea
                  id="prodDesc"
                  value={productForm.description}
                  onChange={(e) => setProductForm(prev => ({ ...prev, description: e.target.value }))}
                  className="form-control"
                />
              </div>

              <div className="form-group">
                <label htmlFor="prodImage">Product Image {isAddingProduct ? '*' : '(Optional)'}</label>
                <input
                  type="file"
                  id="prodImage"
                  ref={fileInputRef}
                  onChange={(e) => setSelectedFile(e.target.files?.[0] || null)}
                  className="form-control"
                  accept="image/png, image/jpeg, image/webp"
                  required={isAddingProduct}
                />
              </div>

              <div className="modal-buttons" style={{ display: 'flex', gap: '1rem', marginTop: '2rem' }}>
                <button type="submit" className="btn btn-primary" style={{ flex: 1 }}>
                  {isAddingProduct ? 'Create' : 'Save Changes'}
                </button>
                <button type="button" className="btn btn-outline" style={{ flex: 1 }} onClick={() => { setIsAddingProduct(false); setEditingProduct(null); }}>
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

