
export interface PaymentMethod {
  id: string;
  method: 'credit_card' | 'cash' | 'bank_transfer' | 'check' | 'other';
  amount: number;
}

export interface PaymentDetails {
  methods: PaymentMethod[];
  totalPaid: number;
  status: 'unpaid' | 'partially_paid' | 'paid';
}
