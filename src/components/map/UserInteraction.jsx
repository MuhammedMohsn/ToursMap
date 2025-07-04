import { useMapEvents, Marker, Popup ,Polyline} from "react-leaflet";
import L from "leaflet";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchUserLocationDetails,
  setWaypoints,
} from "../../redux/features/routing";

const UserInteraction = () => {
  let dispatch = useDispatch();
  const { waypoints, routingDetails } = useSelector((state) => state.routing);
  console.log("waypoints", waypoints);
  const dotIcon = new L.Icon({
    iconUrl: "https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png",
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    shadowSize: [41, 41],
  });

  useMapEvents({
    click: (e) => {
      let isMapClicked =
        e.originalEvent.target.closest(".leaflet-container") &&
        !e.originalEvent.target.closest(".routing");
      if (!isMapClicked) {
        return;
      }
      if (Object.entries(waypoints).every(([_, value]) => value.address)) {
        return;
      }
      const { lat, lng } = e.latlng;
      const newMarker = [lat, lng];
      let firstEmptyWaypoint = Object.entries(waypoints).find(
        ([_, value]) => !value.address
      )?.[0];
      let params = {
        lat: newMarker[0],
        lon: newMarker[1],
        "accept-language": "en",
      };
      let apiKey = process.env.REACT_APP_RAPID_API_KEY_1;

      dispatch(fetchUserLocationDetails({ params, apiKey })).then((res) => {
        dispatch(
          setWaypoints({
            ...waypoints,
            [firstEmptyWaypoint]: {
              ...waypoints[firstEmptyWaypoint],
              address: res?.payload?.display_name,
              coords: newMarker,
            },
          })
        );
      });
    },
  });
  let routePoints =
    routingDetails?.data?.features[0]?.geometry?.coordinates?.flat();
  return (
    <>
      {routePoints?.length > 0 && (
        <>
          {routingDetails?.data?.features[0]?.properties?.distance > 20000 ? (
            <></>
          ) : (
            <Polyline
              positions={routePoints?.map((point) => {
                return [point[1], point[0]];
              })}
              color={"red"}
              weight={"4"}
            />
          )}
        </>
      )}
      {Object.entries(waypoints)?.map(
        ([waypointIndex, waypointValues], idx) => {
          return (
            <>
              {" "}
              {waypointValues?.coords?.length == 2 ? (
                <Marker
                  key={idx}
                  position={waypointValues?.coords}
                  icon={dotIcon}
                  riseOnHover={true}
                >
                  {" "}
                  <Popup>
                    <span>{waypointValues?.address}</span>
                  </Popup>
                </Marker>
              ) : (
                <></>
              )}
            </>
          );
        }
      )}
    </>
  );
};

export default UserInteraction;
