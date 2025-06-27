import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
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

import EnhancedBudgets from './pages/EnhancedBudgets';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Index />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/budgets" element={<Budgets />} />
        <Route path="/budgets/enhanced" element={<EnhancedBudgets />} />
        <Route path="/budgets/new" element={<NewBudget />} />
        <Route path="/budgets/:id" element={<BudgetDetails />} />
        <Route path="/activities" element={<Activities />} />
        <Route path="/accommodations" element={<Accommodations />} />
        <Route path="/menus" element={<Menus />} />
        <Route path="/finances" element={<Finances />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
