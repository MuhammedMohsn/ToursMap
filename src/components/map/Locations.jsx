import { Marker, Popup, useMap } from "react-leaflet";
import { useSelector } from "react-redux";
import L from "leaflet";
function Locations() {
  const { placesOnMap } = useSelector((state) => state.map);
  const dotIcon = new L.Icon({
    iconUrl: "https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png",
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    shadowSize: [41, 41],
  });
  // here i display points that retrieved from endpoint , if i write in routing fields address, remove the places
  return (
    <>
      {" "}
      {Array.isArray(placesOnMap?.data) &&
        placesOnMap?.data
          ?.filter((place) => place.point.lat && place.point.lon)
          ?.map((place) => {
            return (
              <Marker
                position={[place.point.lat, place.point.lon]}
                riseOnHover={true}
                icon={dotIcon}
                key={place.xid}
              >
                <Popup>
                  <span>{place?.name}</span>
                </Popup>
              </Marker>
            );
          })}
    </>
  );
}

export default Locations;
