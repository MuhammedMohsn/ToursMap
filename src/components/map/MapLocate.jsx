import { useEffect, useCallback } from "react";
import { useMap } from "react-leaflet";
import { useDispatch, useSelector } from "react-redux";
import { getMapInfo } from "../../redux/features/map-Info-new-slice";
import { fetchPlacesListByBBox } from "../../redux/features/map-Info-new-slice";

export default function MapLocate() {
  const dispatch = useDispatch();
  const map = useMap();
  const { category } = useSelector((state) => state.searchFilter);
  const mapCenter = useSelector((state) => state?.map?.mapCenter?.location);
  const mapInfo = useSelector((state) => state?.map?.map);
  // this logic to detect if map center or making zoom in/out call detect bounds of map , then call api
  const updateMapInfo = useCallback(() => {
    const bounds = map.getBounds();
    dispatch(
      getMapInfo({
        lat_min: bounds.getSouthWest().lat,
        lon_min: bounds.getSouthWest().lng,
        lat_max: bounds.getNorthEast().lat,
        lon_max: bounds.getNorthEast().lng,
      })
    );
  }, [map, dispatch]);
  useEffect(() => {
    if (map && !Object.values(mapCenter)?.includes(null)) {
      map.flyTo(mapCenter, map.getZoom());
      dispatch(
        getMapInfo({
          lat_min: map.getBounds().getSouthWest().lat,
          lon_min: map.getBounds().getSouthWest().lng,
          lat_max: map.getBounds().getNorthEast().lat,
          lon_max: map.getBounds().getNorthEast().lng,
        })
      );
    }
  }, [map, dispatch, mapCenter]);
  useEffect(() => {
    if (map) {
      map.on("moveend", updateMapInfo);
      map.on("zoomend", updateMapInfo);
    }
    // Clean up on unmount
    return () => {
      map.off("moveend", updateMapInfo);
      map.off("zoomend", updateMapInfo);
    };
  }, [dispatch, map, updateMapInfo]);
  useEffect(() => {
    if (Object.keys(mapInfo)?.length === 0 || !category?.value) return;

    const params = {
      lon_max: mapInfo?.location?.lon_max + 0.02,
      lat_min: mapInfo?.location?.lat_min - 0.02,
      lon_min: mapInfo?.location?.lon_min - 0.02,
      lat_max: mapInfo?.location?.lat_max + 0.02,
      format: "json",
      kinds: category?.value,
    };

    const apiKey = process.env.REACT_APP_RAPID_API_KEY_1;

    dispatch(fetchPlacesListByBBox({ params, apiKey }));
  }, [category?.value, dispatch, mapInfo]);
  return null;
}
