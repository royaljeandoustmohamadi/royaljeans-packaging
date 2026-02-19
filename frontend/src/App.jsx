import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Box } from '@chakra-ui/react';
import useAuthStore from './store/authStore';
import './index.css';

// Layouts
import Layout from './components/layout/Layout';

// Pages
import Login from './pages/auth/Login';
import Dashboard from './pages/dashboard/Dashboard';
import OrdersList from './pages/orders/OrdersList';
import OrderCreate from './pages/orders/OrderCreate';
import OrderDetails from './pages/orders/OrderDetails';
import OrderEdit from './pages/orders/OrderEdit';
import ContractorsList from './pages/contractors/ContractorsList';
import ContractorCreate from './pages/contractors/ContractorCreate';
import Reports from './pages/reports/Reports';
import AdminPanel from './pages/admin/AdminPanel';

// Protected Route Component
const ProtectedRoute = ({ children }) => {
  const { isAuthenticated } = useAuthStore();
  return isAuthenticated ? children : <Navigate to="/login" replace />;
};

// Public Route Component (redirects to home if authenticated)
const PublicRoute = ({ children }) => {
  const { isAuthenticated } = useAuthStore();
  return !isAuthenticated ? children : <Navigate to="/" replace />;
};

function App() {
  return (
    <Router>
      <Routes>
        {/* Public Routes */}
        <Route
          path="/login"
          element={
            <PublicRoute>
              <Box minH="100vh" bg="gray.50" display="flex" alignItems="center">
                <Login />
              </Box>
            </PublicRoute>
          }
        />

        {/* Protected Routes */}
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
          <Route path="contractors" element={<ContractorsList />} />
          <Route path="contractors/new" element={<ContractorCreate />} />
          <Route path="reports" element={<Reports />} />
          <Route path="admin" element={<AdminPanel />} />
        </Route>

        {/* Fallback */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Router>
  );
}

export default App;
