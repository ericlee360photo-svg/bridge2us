import React, { useState, useEffect } from "react";
import DotWorldMap from "../components/DotWorldMap";
import TimeOverlay from "../components/TimeOverlay";

export default function MapDemo() {
  const [mapColors, setMapColors] = useState({
    landColor: '#cfd6ff',
    oceanColor: 'rgba(42,47,58,.55)',
    backgroundColor: '#0f1115',
    textColor: '#3b82f6'
  });

  // Demo user and partner data
  const userTimezone = "America/Los_Angeles"; // Demo user timezone
  const partnerTimezone = "Europe/Paris"; // Demo partner timezone (Paris)
  const userLocation = "Los Angeles, USA";
  const partnerLocation = "Paris, France";

  return (
    <div style={{ maxWidth: 960, margin: "24px auto", padding: 16 }}>
      <h2 style={{ color: "#eaeef9" }}>Dot World Map — Demo</h2>
      
      <div className="relative">
        <DotWorldMap
          a={{ lat: 40.7128, lon: -74.0060 }}   // NYC
          b={{ lat: 48.8566, lon: 2.3522 }}   // Paris
          label="both"
          landColor={mapColors.landColor}
          oceanColor={mapColors.oceanColor}
          backgroundColor={mapColors.backgroundColor}
        />
        
        {/* Time Overlays */}
        <div className="absolute bottom-2 left-2 pointer-events-none">
          <TimeOverlay 
            position=""
            title="My Time"
            timezone={userTimezone}
            location={userLocation}
            textColor={mapColors.textColor}
          />
        </div>
        
        <div className="absolute bottom-2 right-2 pointer-events-none">
          <TimeOverlay 
            position=""
            title="Partner's Time"
            timezone={partnerTimezone}
            location={partnerLocation}
            isPartner={true}
            textColor={mapColors.textColor}
          />
        </div>
      </div>
    </div>
  );
}
