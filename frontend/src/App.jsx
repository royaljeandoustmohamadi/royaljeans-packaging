import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import useAuthStore from './store/authStore';
import './index.css';

import Layout from './components/layout/Layout';

import Login from './pages/auth/Login';
import Dashboard from './pages/dashboard/Dashboard';
import OrdersList from './pages/orders/OrdersList';
import OrderCreate from './pages/orders/OrderCreate';
import OrderDetails from './pages/orders/OrderDetails';
import OrderEdit from './pages/orders/OrderEdit';
import ProductsPage from './pages/products/ProductsPage';
import WorkflowPage from './pages/workflow/WorkflowPage';
import InventoryPage from './pages/inventory/InventoryPage';
import ContractorsList from './pages/contractors/ContractorsList';
import ContractorCreate from './pages/contractors/ContractorCreate';
import FinancePage from './pages/finance/FinancePage';
import Reports from './pages/reports/Reports';
import AdminPanel from './pages/admin/AdminPanel';
import UserManagement from './pages/admin/UserManagement';
import ProfilePage from './pages/profile/ProfilePage';

const ProtectedRoute = ({ children }) => {
  const { isAuthenticated } = useAuthStore();
  return isAuthenticated ? children : <Navigate to="/login" replace />;
};

const AdminOnly = ({ children }) => {
  const { user } = useAuthStore();
  return user?.role === 'ADMIN' ? children : <Navigate to="/" replace />;
};

const PublicRoute = ({ children }) => {
  const { isAuthenticated } = useAuthStore();
  return !isAuthenticated ? children : <Navigate to="/" replace />;
};

const UnderDevelopment = ({ title, description }) => (
  <div
    className="animate-fadeUp"
    style={{
      background: 'var(--bg-card)',
      backdropFilter: 'blur(20px)',
      border: '1px solid var(--border)',
      borderRadius: 'var(--radius)',
      padding: 60,
      textAlign: 'center',
    }}
  >
    <div style={{ fontSize: 48, marginBottom: 12 }}>🚧</div>
    <div
      style={{
        color: 'var(--text-primary)',
        fontWeight: 700,
        fontSize: 18,
        marginBottom: 8,
      }}
    >
      {title} در دست توسعه
    </div>
    <div style={{ color: 'var(--text-muted)', fontSize: 13 }}>
      {description || 'این بخش به زودی آماده خواهد شد'}
    </div>
  </div>
);

function App() {
  return (
    <Router>
      <Routes>
        <Route
          path="/login"
          element={
            <PublicRoute>
              <div
                style={{
                  minHeight: '100vh',
                  background: 'var(--bg-primary)',
                  display: 'flex',
                  alignItems: 'center',
                }}
              >
                <Login />
              </div>
            </PublicRoute>
          }
        />

        <Route
          path="/"
          element={
            <ProtectedRoute>
              <Layout />
            </ProtectedRoute>
          }
        >
          <Route index element={<Dashboard />} />

          <Route path="orders" element={<OrdersList />} />
          <Route path="orders/new" element={<OrderCreate />} />
          <Route path="orders/:id" element={<OrderDetails />} />
          <Route path="orders/:id/edit" element={<OrderEdit />} />

          <Route path="products" element={<ProductsPage />} />

          <Route path="workflow" element={<WorkflowPage />} />

          <Route path="inventory" element={<InventoryPage />} />

          <Route path="contractors" element={<ContractorsList />} />
          <Route path="contractors/new" element={<ContractorCreate />} />
          <Route
            path="contractors/:id"
            element={
              <UnderDevelopment title="جزئیات پیمانکار" description="صفحه جزئیات پیمانکار به زودی اضافه خواهد شد" />
            }
          />

          <Route path="finance" element={<FinancePage />} />

          <Route path="reports" element={<Reports />} />

          <Route path="profile" element={<ProfilePage />} />

          <Route path="admin" element={<AdminPanel />} />
          <Route
            path="admin/users"
            element={
              <AdminOnly>
                <UserManagement />
              </AdminOnly>
            }
          />
        </Route>

        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Router>
  );
}

export default App;
