
import { useState } from 'react';
import { PaymentMethod, PaymentDetails } from '../types/Payment';

export const usePayments = () => {
  const [paymentMethods, setPaymentMethods] = useState<PaymentMethod[]>([]);

  const addPaymentMethod = (method: Omit<PaymentMethod, 'id'>) => {
    const newMethod: PaymentMethod = {
      ...method,
      id: Date.now().toString()
    };
    setPaymentMethods(prev => [...prev, newMethod]);
  };

  const updatePaymentMethod = (id: string, updates: Partial<PaymentMethod>) => {
    setPaymentMethods(prev => 
      prev.map(method => method.id === id ? { ...method, ...updates } : method)
    );
  };

  const removePaymentMethod = (id: string) => {
    setPaymentMethods(prev => prev.filter(method => method.id !== id));
  };

  const calculatePaymentDetails = (totalAmount: number): PaymentDetails => {
    const totalPaid = paymentMethods.reduce((sum, method) => sum + method.amount, 0);
    
    let status: 'unpaid' | 'partially_paid' | 'paid' = 'unpaid';
    if (totalPaid === totalAmount) {
      status = 'paid';
    } else if (totalPaid > 0) {
      status = 'partially_paid';
    }

    return {
      methods: paymentMethods,
      totalPaid,
      status
    };
  };

  const resetPayments = () => {
    setPaymentMethods([]);
  };

  return {
    paymentMethods,
    addPaymentMethod,
    updatePaymentMethod,
    removePaymentMethod,
    calculatePaymentDetails,
    resetPayments
  };
};
