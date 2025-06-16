
import Layout from '../components/Layout';

const Finances = () => {
  return (
    <Layout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Finances</h1>
          <p className="text-gray-600">Track revenue, expenses, and financial reports</p>
        </div>
        
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8 text-center">
          <p className="text-gray-500">Financial management coming soon...</p>
        </div>
      </div>
    </Layout>
  );
};

export default Finances;
