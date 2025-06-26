import { useMapEvents, Marker, useMap } from "react-leaflet";
import L from "leaflet";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchUserLocationDetails,
  setWaypoints,
} from "../../redux/features/routing";
import "leaflet-routing-machine";
import "leaflet-routing-machine/dist/leaflet-routing-machine.css";
import { useEffect } from "react";
import { useRef } from "react";
const UserInteraction = () => {
  let map = useMap();
  const routingControlRef = useRef(null);
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

  useEffect(() => {
    if (map && routingControlRef?.current) {
      map.removeControl(routingControlRef.current);
      routingControlRef.current = null;
      return;
    }
    const routingControl = L.Routing.control({
      waypoints: routingDetails?.data?.features[0]?.geometry?.coordinates
        ?.flat()
        ?.map((point) => {
          return L.latLng(point[0], point[1]);
        }),
      lineOptions: {
        styles: [{ color: "#0074D9", weight: 5 }],
      },
      show: false,
      addWaypoints: false,
      draggableWaypoints: false,
      fitSelectedRoutes: true,
      createMarker: () => null,
    }).addTo(map);
    routingControlRef.current = routingControl;
    return () => {
      if (routingControlRef.current) {
        map.removeControl(routingControlRef.current);
        routingControlRef.current = null;
      }
    };
  }, [routingDetails, map]);
  return (
    <>
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
                ></Marker>
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
