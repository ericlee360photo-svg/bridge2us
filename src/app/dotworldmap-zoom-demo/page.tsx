import DotWorldMap from '@/components/DotWorldMap';

export default function DotWorldMapZoomDemo() {
  return (
    <div className="min-h-screen bg-gray-950 py-8">
      <div className="container mx-auto px-4">
        <div className="space-y-6">
          <div className="text-center">
            <h1 className="text-3xl font-bold text-white mb-4">
              DotWorldMap Zoom & Pan Demo
            </h1>
            <p className="text-gray-300 mb-6">
              Try zooming with the mouse wheel and dragging to pan around the map
            </p>
          </div>

          <div className="bg-gray-900 rounded-lg p-6">
            <h2 className="text-xl font-semibold text-white mb-4">Interactive Map</h2>
            <div className="space-y-4 text-sm text-gray-300">
              <p>• <strong>Static Map:</strong> No zoom/pan functionality</p>
              <p>• <strong>Partner Locations:</strong> Shows connection between two points</p>
              <p>• <strong>Distance Display:</strong> Shows distance in km and miles</p>
            </div>
            
            <div className="mt-6">
              <DotWorldMap
                a={{ lat: 40.7128, lon: -74.0060 }}  // New York
                b={{ lat: 51.5074, lon: -0.1278 }}   // London
                label="both"
                className="w-full max-w-4xl mx-auto"
              />
            </div>
          </div>

          <div className="bg-gray-900 rounded-lg p-6">
            <h2 className="text-xl font-semibold text-white mb-4">Another Example</h2>
            <p className="text-gray-300 mb-4">Tokyo to Sydney connection</p>
            
            <DotWorldMap
              a={{ lat: 35.6762, lon: 139.6503 }}  // Tokyo
              b={{ lat: -33.8688, lon: 151.2093 }} // Sydney
              label="both"
              className="w-full max-w-4xl mx-auto"
            />
          </div>

          <div className="bg-blue-900/20 border border-blue-500/30 rounded-lg p-4">
            <h3 className="text-blue-400 font-semibold mb-2">What Gets Transformed:</h3>
            <ul className="text-gray-300 text-sm space-y-1">
              <li>✅ <strong>Base Layer:</strong> Ocean dots and land dots</li>
              <li>✅ <strong>User Location Dots:</strong> Partner markers with labels</li>
              <li>✅ <strong>Arc Connection:</strong> Line connecting the two locations</li>
              <li>❌ <strong>Distance Label:</strong> Stays static (not transformed)</li>
              <li>❌ <strong>UI Overlays:</strong> Cards and controls remain above</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
