import React, { useState } from 'react';
import AdminLayout from './AdminLayout';
import AdminDashboard from './AdminDashboard';
import AdminProducts from './AdminProducts';
import AdminCategories from './AdminCategories';
import AdminOrders from './AdminOrders';
import AdminCoupons from './AdminCoupons';
import AdminCustomers from './AdminCustomers';

export default function AdminPortalPage() {
  const [activeTab, setActiveTab] = useState('dashboard');

  return (
    <AdminLayout activeTab={activeTab} setActiveTab={setActiveTab}>
      {activeTab === 'dashboard' && <AdminDashboard onNavigateTab={setActiveTab} />}
      {activeTab === 'products' && <AdminProducts />}
      {activeTab === 'categories' && <AdminCategories />}
      {activeTab === 'orders' && <AdminOrders />}
      {activeTab === 'coupons' && <AdminCoupons />}
      {activeTab === 'customers' && <AdminCustomers />}
    </AdminLayout>
  );
}
