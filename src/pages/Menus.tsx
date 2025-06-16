
import Layout from '../components/Layout';

const Menus = () => {
  return (
    <Layout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Menus</h1>
          <p className="text-gray-600">Manage catering and dining options</p>
        </div>
        
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8 text-center">
          <p className="text-gray-500">Menu management coming soon...</p>
        </div>
      </div>
    </Layout>
  );
};

export default Menus;
