import { MapContainer, TileLayer } from "react-leaflet";
import UserLocation from "./UserLocation";
import MapLocate from "./MapLocate";
import Locations from "./Locations";
import { useSelector } from "react-redux";
import ButtonLocator from "./ButtonLocator";
import Routing from "../Routing/Routing";
import UserInteraction from "./UserInteraction";
function Map() {
  const { user } = useSelector((state) => state.map);
  const { show } = useSelector((state) => state.routing);
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
            {!show && !Object.values(user?.location)?.includes(null) && (
              <UserLocation />
            )}
            <MapLocate />
            {!show && <Locations />}
            {show && <UserInteraction />}
            <ButtonLocator />
          </MapContainer>
        </>
      )}
    </>
  );
}

export default Map;
