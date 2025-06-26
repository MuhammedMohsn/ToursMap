import { useEffect } from "react";
import { Popup, useMap } from "react-leaflet";
import L from "leaflet";
import { useDispatch, useSelector } from "react-redux";
import { getMapInfo } from "../../redux/features/map-Info-new-slice";
import { Marker } from "react-leaflet";

const UserLocation = () => {
  const map = useMap();
  const { user } = useSelector((state) => state.map);
  let dispatch = useDispatch();
  const userLocationIcon = new L.Icon({
    iconUrl: "https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png",
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    shadowSize: [41, 41],
  });
  useEffect(() => {
    if (user.location.lng && user.location.lat) {
      map?.flyTo([user?.location?.lat, user?.location?.lng], map.getZoom());
      dispatch(
        getMapInfo({
          lat_min: map.getBounds().getSouthWest().lat,
          lon_min: map.getBounds().getSouthWest().lng,
          lat_max: map.getBounds().getNorthEast().lat,
          lon_max: map.getBounds().getNorthEast().lng,
        })
      );
    }
  }, [map, user?.location?.lat, user?.location?.lng, dispatch]);

  return (
    <>
      <Marker
        position={[user?.location?.lat, user?.location?.lng]}
        icon={userLocationIcon}
        riseOnHover={true}
      >
        <Popup>you are here</Popup>
      </Marker>
    </>
  );
};

export default UserLocation;
