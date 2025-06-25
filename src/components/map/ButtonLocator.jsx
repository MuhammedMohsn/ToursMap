import React from "react";
import { useMap } from "react-leaflet";
import { useSelector } from "react-redux";
import { BiTargetLock } from "react-icons/bi";
import "../../styles/locate-me-styles.css"
const ButtonLocator = () => {
  const { user } = useSelector((state) => state.map);
  let map = useMap();
  return (
    <button
      title={"find my location on map"}
      onClick={() => {
        if (!Object.values(user?.location)?.includes(null)) {
          map?.flyTo([user?.location?.lat, user?.location?.lng], map.getZoom());
        }
      }}
      className="bg-primary locate-me-btn"
    >
      <BiTargetLock />

    </button>
  );
};

export default ButtonLocator;
