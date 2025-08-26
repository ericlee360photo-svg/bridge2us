import DotWorldMap from "../components/DotWorldMap";

export default function MapDemo() {
  return (
    <div style={{ maxWidth: 960, margin: "24px auto", padding: 16 }}>
      <h2 style={{ color: "#eaeef9" }}>Dot World Map — Demo</h2>
      <DotWorldMap
        a={{ lat: 40.7128, lon: -74.0060 }}   // NYC
        b={{ lat: 48.8566, lon:   2.3522 }}   // Paris
        label="both"
      />
    </div>
  );
}
