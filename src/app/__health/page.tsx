import { Suspense } from 'react';

function HealthPage() {
  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center">
      <div className="bg-white p-8 rounded-lg shadow-md">
        <h1 className="text-2xl font-bold text-gray-800 mb-4">Health Check</h1>
        <p className="text-gray-600">Application is running successfully!</p>
      </div>
    </div>
  );
}

HealthPage.displayName = 'HealthPage';

export default HealthPage;
