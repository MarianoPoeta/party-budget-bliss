import React, { Suspense } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Layout from './components/Layout';
import Toaster from './components/ui/toaster';
import ErrorBoundary from './components/ErrorBoundary';
import { LoadingSpinner } from './components/LoadingSpinner';
import { useStore } from './store';

// Lazy load all pages for better performance
const Dashboard = React.lazy(() => import('./pages/Dashboard'));
const EnhancedBudgets = React.lazy(() => import('./pages/EnhancedBudgets'));
const BudgetDetails = React.lazy(() => import('./pages/BudgetDetails'));
const Activities = React.lazy(() => import('./pages/Activities'));
const Accommodations = React.lazy(() => import('./pages/Accommodations'));
const Menus = React.lazy(() => import('./pages/Menus'));
const Products = React.lazy(() => import('./pages/Products'));
const Foods = React.lazy(() => import('./pages/Foods'));
const Transports = React.lazy(() => import('./pages/Transports'));
const EnhancedConfiguration = React.lazy(() => import('./pages/EnhancedConfiguration'));
const AdminConfig = React.lazy(() => import('./pages/AdminConfig'));
const SalesDashboard = React.lazy(() => import('./pages/SalesDashboard'));
const Profile = React.lazy(() => import('./pages/Profile'));
const Login = React.lazy(() => import('./pages/Login'));
const NotFound = React.lazy(() => import('./pages/NotFound'));
const Clients = React.lazy(() => import('./pages/Clients'));

import './App.css';

// Loading component for lazy routes
const RouteLoading = () => (
  <div className="flex items-center justify-center min-h-screen">
    <LoadingSpinner size="lg" text="Cargando..." />
  </div>
);

function RequireAuth({ children }: { children: JSX.Element }) {
  const { currentUser } = useStore();
  
  if (!currentUser || !currentUser.id) {
    return <Navigate to="/login" />;
  }
  
  return children;
}

const App: React.FC = () => {
  const { currentUser } = useStore();

  if (!currentUser || !currentUser.id) {
    return (
      <ErrorBoundary>
        <Router>
          <Suspense fallback={<RouteLoading />}>
            <Routes>
              <Route path="/login" element={<Login />} />
              <Route path="*" element={<Navigate to="/login" />} />
            </Routes>
          </Suspense>
        </Router>
        <Toaster />
      </ErrorBoundary>
    );
  }

  return (
    <ErrorBoundary>
      <Router>
        <Layout>
          <Suspense fallback={<RouteLoading />}>
            <Routes>
              <Route path="/login" element={<Login />} />
              <Route path="/" element={
                <RequireAuth>
                  <Dashboard />
                </RequireAuth>
              } />
              <Route path="/dashboard" element={
                <RequireAuth>
                  <Dashboard />
                </RequireAuth>
              } />
              <Route path="/budgets" element={
                <RequireAuth>
                  <EnhancedBudgets />
                </RequireAuth>
              } />
              <Route path="/budgets/:id" element={
                <RequireAuth>
                  <BudgetDetails />
                </RequireAuth>
              } />
              <Route path="/activities" element={
                <RequireAuth>
                  <Activities />
                </RequireAuth>
              } />
              <Route path="/accommodations" element={
                <RequireAuth>
                  <Accommodations />
                </RequireAuth>
              } />
              <Route path="/menus" element={
                <RequireAuth>
                  <Menus />
                </RequireAuth>
              } />
              <Route path="/products" element={
                <RequireAuth>
                  <Products />
                </RequireAuth>
              } />
              <Route path="/foods" element={
                <RequireAuth>
                  <Foods />
                </RequireAuth>
              } />
              <Route path="/transports" element={
                <RequireAuth>
                  <Transports />
                </RequireAuth>
              } />
              <Route path="/clients" element={
                <RequireAuth>
                  <Clients />
                </RequireAuth>
              } />
              <Route path="/configuration" element={
                <RequireAuth>
                  <EnhancedConfiguration />
                </RequireAuth>
              } />
              <Route path="/admin" element={
                <RequireAuth>
                  <AdminConfig />
                </RequireAuth>
              } />
              <Route path="/sales-dashboard" element={
                <RequireAuth>
                  <SalesDashboard />
                </RequireAuth>
              } />
              <Route path="/profile" element={
                <RequireAuth>
                  <Profile />
                </RequireAuth>
              } />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </Suspense>
        </Layout>
        <Toaster />
      </Router>
    </ErrorBoundary>
  );
};

export default App;
