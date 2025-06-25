// components/Routing.js
import { useEffect } from "react";
import L from "leaflet";
import "leaflet-routing-machine";
import { useMap } from "react-leaflet";

const Routing = ({ from, to }) => {
  const map = useMap();

  useEffect(() => {
    if (!map) return;
    const routingControl = L.Routing.control({
      waypoints: [L.latLng(from), L.latLng(to)],
      routeWhileDragging: true,
      show: false,
      addWaypoints: false,
      lineOptions: {
        styles: [{ color: "blue", weight: 4 }],
      },
      router: new L.Routing.OSRMv1({
        serviceUrl: "https://router.project-osrm.org/route/v1",
        profile: "foot"
      }),
    }).addTo(map);

    return () => {
      if (map) map.removeControl(routingControl);
    };
  }, [map, from, to]);

  return null;
};

export default Routing;
