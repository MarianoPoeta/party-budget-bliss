import React from 'react';
import { Plus, Trash2, CreditCard } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { usePayments } from '../../hooks/usePayments';

interface PaymentFormProps {
  totalAmount: number;
  onPaymentComplete: (paymentDetails: any) => void;
  onCancel: () => void;
}

const PaymentForm: React.FC<PaymentFormProps> = ({ totalAmount, onPaymentComplete, onCancel }) => {
  const { paymentMethods, addPaymentMethod, updatePaymentMethod, removePaymentMethod, calculatePaymentDetails } = usePayments();

  const handleAddPayment = () => {
    addPaymentMethod({
      method: 'credit_card',
      amount: 0
    });
  };

  const handleSave = () => {
    const paymentDetails = calculatePaymentDetails(totalAmount);
    onPaymentComplete(paymentDetails);
  };

  const totalPaid = paymentMethods.reduce((sum, method) => sum + method.amount, 0);
  const isValid = totalPaid === totalAmount;

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <CreditCard className="h-5 w-5" />
          Métodos de Pago
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex justify-between items-center p-3 bg-slate-50 rounded">
          <span className="font-medium">Monto Total:</span>
          <span className="text-lg font-bold">${totalAmount.toLocaleString()}</span>
        </div>

        {paymentMethods.map((payment) => (
          <div key={payment.id} className="flex gap-2 items-center">
            <Select 
              value={payment.method} 
              onValueChange={(value: any) => updatePaymentMethod(payment.id, { method: value })}
            >
              <SelectTrigger className="w-40">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="credit_card">Tarjeta de Crédito</SelectItem>
                <SelectItem value="cash">Efectivo</SelectItem>
                <SelectItem value="bank_transfer">Transferencia Bancaria</SelectItem>
                <SelectItem value="check">Cheque</SelectItem>
                <SelectItem value="other">Otro</SelectItem>
              </SelectContent>
            </Select>
            <Input
              type="number"
              placeholder="Monto"
              value={payment.amount || ''}
              onChange={(e) => updatePaymentMethod(payment.id, { amount: Number(e.target.value) })}
              className="flex-1"
            />
            <Button 
              size="sm" 
              variant="outline"
              onClick={() => removePaymentMethod(payment.id)}
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        ))}

        <Button onClick={handleAddPayment} variant="outline" className="w-full">
          <Plus className="h-4 w-4 mr-2" />
          Agregar Método de Pago
        </Button>

        <div className="flex justify-between items-center p-3 bg-slate-50 rounded">
          <span className="font-medium">Total Pagado:</span>
          <span className={`text-lg font-bold ${isValid ? 'text-green-600' : 'text-red-600'}`}>
            ${totalPaid.toLocaleString()}
          </span>
        </div>

        {!isValid && (
          <div className="p-3 bg-red-50 border border-red-200 rounded text-red-700 text-sm">
            El total del pago debe ser igual al total del presupuesto (${totalAmount.toLocaleString()})
          </div>
        )}

        <div className="flex gap-2 pt-4">
          <Button onClick={onCancel} variant="outline" className="flex-1">
            Cancelar
          </Button>
          <Button 
            onClick={handleSave} 
            disabled={!isValid}
            className="flex-1 bg-slate-800 hover:bg-slate-700"
          >
            Completar Presupuesto
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default PaymentForm;
