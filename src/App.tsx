import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link, Navigate, useLocation } from 'react-router-dom';
import ErrorBoundary from './components/ErrorBoundary';
import Index from './pages/Index';
import Dashboard from './pages/Dashboard';
import Budgets from './pages/Budgets';
import NewBudget from './pages/NewBudget';
import BudgetDetails from './pages/BudgetDetails';
import Activities from './pages/Activities';
import Accommodations from './pages/Accommodations';
import Menus from './pages/Menus';
import Finances from './pages/Finances';
import NotFound from './pages/NotFound';
import SalesDashboard from './pages/SalesDashboard';
import LogisticsDashboard from './pages/LogisticsDashboard';
import CookDashboard from './pages/CookDashboard';
import EnhancedBudgets from './pages/EnhancedBudgets';
import AdminConfig from './pages/AdminConfig';
import Configuration from './pages/Configuration';
import Login from './pages/Login';
import Profile from './pages/Profile';
import { useStore } from './store';
import Toaster from './components/ui/toaster';

const navLinks = [
  { to: '/sales', label: 'Sales/Coordinator' },
  { to: '/logistics', label: 'Logistics' },
  { to: '/cook', label: 'Cook' },
];

function RequireAuth({ children }: { children: JSX.Element }) {
  const currentUser = useStore(s => s.currentUser);
  const location = useLocation();
  if (!currentUser) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }
  return children;
}

const App: React.FC = () => {
  return (
    <ErrorBoundary>
      <Router>
        <Toaster />
        <div className="min-h-screen bg-slate-50">
          <nav className="bg-slate-800 text-white px-6 py-4 flex gap-6 items-center shadow">
            <span className="font-bold text-lg tracking-wide">Party Budget Bliss</span>
            {navLinks.map(link => (
              <Link
                key={link.to}
                to={link.to}
                className="hover:underline hover:text-green-300 transition-colors"
              >
                {link.label}
              </Link>
            ))}
          </nav>
          <main className="py-8">
        <Routes>
          <Route path="/" element={<Index />} />
              <Route path="/dashboard" element={<RequireAuth><Dashboard /></RequireAuth>} />
              <Route path="/budgets" element={<RequireAuth><Budgets /></RequireAuth>} />
              <Route path="/budgets/enhanced" element={<RequireAuth><EnhancedBudgets /></RequireAuth>} />
              <Route path="/budgets/new" element={<RequireAuth><NewBudget /></RequireAuth>} />
              <Route path="/budgets/:id" element={<RequireAuth><BudgetDetails /></RequireAuth>} />
              <Route path="/activities" element={<RequireAuth><Activities /></RequireAuth>} />
              <Route path="/accommodations" element={<RequireAuth><Accommodations /></RequireAuth>} />
              <Route path="/menus" element={<RequireAuth><Menus /></RequireAuth>} />
              <Route path="/finances" element={<RequireAuth><Finances /></RequireAuth>} />
              <Route path="/sales" element={<RequireAuth><SalesDashboard /></RequireAuth>} />
              <Route path="/logistics" element={<RequireAuth><LogisticsDashboard /></RequireAuth>} />
              <Route path="/cook" element={<RequireAuth><CookDashboard /></RequireAuth>} />
              <Route path="/admin/config" element={<RequireAuth><AdminConfig /></RequireAuth>} />
              <Route path="/configuration" element={<RequireAuth><Configuration /></RequireAuth>} />
              <Route path="/login" element={<Login />} />
              <Route path="/profile" element={<RequireAuth><Profile /></RequireAuth>} />
              <Route path="*" element={<Navigate to="/sales" replace />} />
        </Routes>
          </main>
        </div>
      </Router>
    </ErrorBoundary>
  );
};

export default App;
