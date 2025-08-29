import { Suspense } from 'react';

function RoutesPage() {
  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center">
      <div className="bg-white p-8 rounded-lg shadow-md">
        <h1 className="text-2xl font-bold text-gray-800 mb-4">Routes</h1>
        <p className="text-gray-600">Routes page is working!</p>
      </div>
    </div>
  );
}

RoutesPage.displayName = 'RoutesPage';

export default RoutesPage;
