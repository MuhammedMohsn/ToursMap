import { useMapEvents, Marker, useMap } from "react-leaflet";
import L from "leaflet";
import { useDispatch, useSelector } from "react-redux";
import {
  setMarkerPositionsOnMap,
  fetchUserLocationDetails,
  setWaypoints,
} from "../../redux/features/routing";
import "leaflet-routing-machine";
import "leaflet-routing-machine/dist/leaflet-routing-machine.css";
import { useEffect } from "react";
const UserInteraction = () => {
  let map = useMap();
  let dispatch = useDispatch();
  const { markerPositionsOnMap, waypoints, routingDetails } = useSelector(
    (state) => state.routing
  );
  const dotIcon = new L.Icon({
    iconUrl: "https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png",
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    shadowSize: [41, 41],
  });

  useMapEvents({
    click: (e) => {
      if (
        e.originalEvent.target.closest(".leaflet-container") &&
        !e.originalEvent.target.closest(".routing")
      ) {
        if (markerPositionsOnMap.length === 2) {
          console.log("enteted here");
          return;
        }
        const { lat, lng } = e.latlng;
        const newMarker = [lat, lng];
        const updatedMarkers = [...markerPositionsOnMap, newMarker];
        console.log("updatedMarkers", updatedMarkers);
        dispatch(setMarkerPositionsOnMap(updatedMarkers));
        updatedMarkers.forEach(async (position, positionIndex) => {
          let params = {
            lat: position[0],
            lon: position[1],
            "accept-language": "en",
          };
          let apiKey = process.env.REACT_APP_RAPID_API_KEY_1;

          await dispatch(fetchUserLocationDetails({ params, apiKey })).then(
            (res) => {
              dispatch(
                setWaypoints(
                  waypoints?.map((point, index) => {
                    if (index === positionIndex) {
                      return {
                        ...point,
                        address: res?.payload?.display_name,
                      };
                    } else {
                      return point;
                    }
                  })
                )
              );
            }
          );
        });
      }
    },
  });
  useEffect(() => {
    if (!map || markerPositionsOnMap.length !== 2) return;
    let points =
      routingDetails?.data != null
        ? markerPositionsOnMap?.map((point, index) => {
            return [L.latLng(point[0], point[1])];
          })
        : [
            L.latLng(markerPositionsOnMap[0][0], markerPositionsOnMap[0][1]),
            L.latLng(markerPositionsOnMap[1][0], markerPositionsOnMap[1][1]),
          ];
    console.log("points", points);
    const routingControl = L.Routing.control({
      waypoints: points,
      lineOptions: {
        styles: [{ color: "#0074D9", weight: 5 }],
      },
      show: false,
      addWaypoints: false,
      draggableWaypoints: false,
      fitSelectedRoutes: true,
      createMarker: () => null,
    }).addTo(map);
  }, [markerPositionsOnMap, map, routingDetails]);
  return (
    <>
      {markerPositionsOnMap?.map((pos, idx) => (
        <Marker
          key={idx}
          position={pos}
          icon={dotIcon}
          riseOnHover={true}
        ></Marker>
      ))}
    </>
  );
};

export default UserInteraction;
