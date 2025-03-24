
import { useEffect, useRef, useState } from "react";

const GOOGLE_MAPS_API_KEY = "YOUR_GOOGLE_MAPS_API_KEY";

const addresses = [
  "서울특별시 강남구 광평로 281",
  "부산광역시 동구 중앙대로 206",
  "부산광역시 영도구 흰여울길 249-1",
  "부산광역시 영도구 청학로 14",
  "부산광역시 영도구 봉래나루로 225",
  "부산광역시 영도구 대평동1가 11",
  "부산광역시 수영구 광안해변로 165",
  "부산광역시 부산진구 전포동",
  "부산광역시 수영구 남천동로108번길 8",
  "부산광역시 남구 용호동 산 1-1",
  "부산광역시 수영구 광안해변로 197번길 10",
  "부산광역시 수영구 광안해변로 257"
];

export default function BusanTripMapWithGoogle() {
  const mapRef = useRef(null);
  const [totalDistance, setTotalDistance] = useState("");

  useEffect(() => {
    const script = document.createElement("script");
    script.src = \`https://maps.googleapis.com/maps/api/js?key=\${GOOGLE_MAPS_API_KEY}\`;
    script.async = true;
    script.onload = () => initMap();
    document.head.appendChild(script);
  }, []);

  const initMap = () => {
    const map = new window.google.maps.Map(mapRef.current, {
      zoom: 12,
      center: { lat: 35.1595454, lng: 129.0458223 },
    });

    const geocoder = new window.google.maps.Geocoder();
    const directionsService = new window.google.maps.DirectionsService();
    const directionsRenderer = new window.google.maps.DirectionsRenderer({ map });

    Promise.all(addresses.map(addr =>
      new Promise((resolve, reject) => {
        geocoder.geocode({ address: addr }, (results, status) => {
          if (status === "OK" && results[0]) {
            resolve(results[0].geometry.location);
          } else {
            reject(\`Geocoding failed for \${addr}: \${status}\`);
          }
        });
      })
    ))
    .then(locations => {
      const waypoints = locations.slice(1, -1).map(location => ({ location, stopover: true }));

      directionsService.route(
        {
          origin: locations[0],
          destination: locations[locations.length - 1],
          waypoints,
          travelMode: window.google.maps.TravelMode.DRIVING
        },
        (result, status) => {
          if (status === "OK") {
            directionsRenderer.setDirections(result);
            const route = result.routes[0];
            let total = 0;
            route.legs.forEach(leg => total += leg.distance.value);
            setTotalDistance((total / 1000).toFixed(1) + " km");
          } else {
            alert("Directions request failed due to " + status);
          }
        }
      );
    })
    .catch(err => console.error(err));
  };

  return (
    <div className="p-4 space-y-4">
      <h2 className="text-xl font-semibold">📍 부산 여행 동선 지도</h2>
      <div ref={mapRef} style={{ width: "100%", height: "500px" }} />
      {totalDistance && (
        <p className="text-lg mt-2">🚗 총 이동 거리: <strong>{totalDistance}</strong></p>
      )}
    </div>
  );
}
