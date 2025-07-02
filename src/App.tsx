import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { SidebarProvider } from './components/ui/sidebar';
import { AppSidebar } from './components/AppSidebar';
import { BreadcrumbNav } from './components/BreadcrumbNav';
import { Toaster } from './components/ui/toaster';
import { ErrorBoundary } from './components/ErrorBoundary';
import { useStore } from './store';

// Pages
import Dashboard from './pages/Dashboard';
import Budgets from './pages/Budgets';
import EnhancedBudgets from './pages/EnhancedBudgets';
import BudgetDetails from './pages/BudgetDetails';
import Activities from './pages/Activities';
import Accommodations from './pages/Accommodations';
import Menus from './pages/Menus';
import Products from './pages/Products';
import Transports from './pages/Transports';
import Configuration from './pages/Configuration';
import AdminConfig from './pages/AdminConfig';
import CookDashboard from './pages/CookDashboard';
import LogisticsDashboard from './pages/LogisticsDashboard';
import SalesDashboard from './pages/SalesDashboard';
import Profile from './pages/Profile';
import Login from './pages/Login';
import NotFound from './pages/NotFound';
import Clients from './pages/Clients';

import './App.css';

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
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="*" element={<Navigate to="/login" />} />
          </Routes>
        </Router>
        <Toaster />
      </ErrorBoundary>
    );
  }

  return (
    <ErrorBoundary>
      <Router>
        <SidebarProvider>
          <div className="flex h-screen w-full">
            <AppSidebar />
            <main className="flex-1 flex flex-col overflow-hidden">
              <BreadcrumbNav />
              <div className="flex-1 overflow-auto p-6">
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
                      <Budgets />
                    </RequireAuth>
                  } />
                  <Route path="/enhanced-budgets" element={
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
                      <Configuration />
                    </RequireAuth>
                  } />
                  <Route path="/admin" element={
                    <RequireAuth>
                      <AdminConfig />
                    </RequireAuth>
                  } />
                  <Route path="/cook-dashboard" element={
                    <RequireAuth>
                      <CookDashboard />
                    </RequireAuth>
                  } />
                  <Route path="/logistics-dashboard" element={
                    <RequireAuth>
                      <LogisticsDashboard />
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
              </div>
            </main>
          </div>
        </SidebarProvider>
        <Toaster />
      </Router>
    </ErrorBoundary>
  );
};

export default App;
