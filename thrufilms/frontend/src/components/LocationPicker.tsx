import { MapContainer, TileLayer, Marker, useMapEvents } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import { useState } from "react";

import iconUrl from "leaflet/dist/images/marker-icon.png";
import iconShadowUrl from "leaflet/dist/images/marker-shadow.png";

const customIcon = new L.Icon({
  iconUrl,
  shadowUrl: iconShadowUrl,
  iconSize: [25, 41],
  iconAnchor: [12, 41],
});

interface LocationPickerProps {
  lat: number | null;
  lng: number | null;
  onChange: (lat: number, lng: number) => void;
  onAddressResolved?: (address: string) => void;
}

function LocationMarker({ lat, lng, onChange, onAddressResolved }: LocationPickerProps) {
  useMapEvents({
    async click(e) {
      const { lat: clickLat, lng: clickLng } = e.latlng;
      onChange(clickLat, clickLng);

      // Reverse geocode with OpenStreetMap Nominatim
      if (onAddressResolved) {
        try {
          const res = await fetch(
            `https://nominatim.openstreetmap.org/reverse?format=json&lat=${clickLat}&lon=${clickLng}&zoom=18&addressdetails=1`,
            { headers: { "Accept-Language": "en" } }
          );
          const data = await res.json();
          if (data?.display_name) {
            onAddressResolved(data.display_name);
          }
        } catch {
          // Silently fail — address is optional enhancement
        }
      }
    },
  });

  return lat !== null && lng !== null ? <Marker position={[lat, lng]} icon={customIcon} /> : null;
}

export default function LocationPicker({ lat, lng, onChange, onAddressResolved }: LocationPickerProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [searching, setSearching] = useState(false);

  // Default to central India if no coordinates provided
  const center: [number, number] = lat !== null && lng !== null ? [lat, lng] : [20.5937, 78.9629];

  const handleSearch = async () => {
    if (!searchQuery.trim()) return;
    setSearching(true);
    try {
      const res = await fetch(
        `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(searchQuery)}&limit=1&countrycodes=in`,
        { headers: { "Accept-Language": "en" } }
      );
      const data = await res.json();
      if (data?.[0]) {
        const newLat = parseFloat(data[0].lat);
        const newLng = parseFloat(data[0].lon);
        onChange(newLat, newLng);
        if (onAddressResolved) {
          onAddressResolved(data[0].display_name);
        }
      }
    } catch {
      // silent
    } finally {
      setSearching(false);
    }
  };

  return (
    <div className="space-y-3">
      {/* Search bar */}
      <div className="flex gap-2">
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && (e.preventDefault(), handleSearch())}
          className="input-field flex-1"
          placeholder="Search address, e.g. Andheri West, Mumbai"
        />
        <button
          type="button"
          onClick={handleSearch}
          disabled={searching}
          className="btn-secondary px-4 whitespace-nowrap"
        >
          {searching ? (
            <svg className="animate-spin w-4 h-4" viewBox="0 0 24 24" fill="none"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" /><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z" /></svg>
          ) : (
            <>
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} className="w-4 h-4"><path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
              Search
            </>
          )}
        </button>
      </div>

      {/* Map */}
      <div className="h-[300px] w-full rounded-md overflow-hidden border border-[#dfe1e6]">
        <MapContainer
          center={center}
          zoom={lat !== null && lng !== null ? 14 : 4}
          scrollWheelZoom={true}
          className="h-full w-full z-0"
          key={`${center[0]}-${center[1]}`}
        >
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          <LocationMarker lat={lat} lng={lng} onChange={onChange} onAddressResolved={onAddressResolved} />
        </MapContainer>
      </div>

      <p className="text-xs text-[#97a0af] font-medium">
        💡 Search for an address or click directly on the map to drop a pin.
      </p>
    </div>
  );
}
