import { MapContainer, TileLayer } from "react-leaflet";
import UserLocation from "./components/map/UserLocation";
import MapLocate from "./components/map/MapLocate";
import Locations from "./components/map/Locations";
import { useSelector } from "react-redux";
import ButtonLocator from "./components/map/ButtonLocator";
import Routing from "./components/Routing/Routing";
import UserInteraction from "./components/map/UserInteraction";
function MyMap() {
  const { user } = useSelector((state) => state.map);
  const { show, markerPositionsOnMap } = useSelector((state) => state.routing);
  return (
    <>
      {!Object.values(user?.location)?.includes(null) && (
        <>
          <MapContainer
            center={[user?.location?.lat, user?.location?.lng]}
            style={{
              height:
                window.innerWidth < 700
                  ? "calc(100vh - 110px)"
                  : "calc(100vh - 65px)",
              width: "100%",
            }}
            zoom={15}
            scrollWheelZoom={false}
            className="position-relative"
          >
            <TileLayer
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
            <Routing />
            {markerPositionsOnMap?.length === 0 &&
              !Object.values(user?.location)?.includes(null) && (
                <UserLocation />
              )}
            <MapLocate />
            {markerPositionsOnMap?.length === 0 && <Locations />}
            {show && <UserInteraction />}
            <ButtonLocator />
          </MapContainer>
        </>
      )}
    </>
  );
}

export default MyMap;
