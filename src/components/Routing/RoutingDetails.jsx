import React, { useEffect } from "react";
import { Spinner } from "react-bootstrap";
import { useSelector } from "react-redux";
import { FaWalking } from "react-icons/fa";
import { FaCarSide } from "react-icons/fa";
import { FaTruck } from "react-icons/fa";
import { IoIosBicycle } from "react-icons/io";
import { setMarkerPositionsOnMap } from "../../redux/features/routing";
function RoutingDetails() {
  let showModeIcon = (mode, classNames) => {
    switch (mode) {
      case "walk":
        return <FaWalking className={classNames} />;
      case "bicycle":
        return <IoIosBicycle className={classNames} />;
      case "truck":
        return <FaTruck className={classNames} />;
      case "drive":
        return <FaCarSide className={classNames} />;
      default:
        return <FaCarSide className={classNames} />;
    }
  };
  const { mode, routingDetails } = useSelector((state) => state.routing);
  console.log("routingDetails", routingDetails);
  useEffect(() => {
    if (routingDetails?.data) {
      let waypoints = routingDetails?.data?.features[0]?.geometry?.coordinates;
      console.log("routes", waypoints);
      setMarkerPositionsOnMap(waypoints);
    }
  }, [routingDetails, mode]);
  return (
    <>
      <div
        className="d-flex align-items-center"
        style={{ height: "100px", width: "100%" }}
      >
        <span className="my-2">{showModeIcon(mode, "fs-1")}</span>
        <div className="fw-bold">
          {" "}
          <div className="d-flex justify-content-between">
            <span className="text-secondary fs-5 mx-2">distance is :</span>{" "}
            <span className="mx-2 fs-5">
              {routingDetails?.data?.features[0]?.properties?.distance} KM
            </span>
          </div>
          <div className="d-flex justify-content-between">
            <span className="text-secondary fs-5 mx-2">time is :</span>{" "}
            <span className="mx-2 fs-5">
              {routingDetails?.data?.features[0]?.properties?.time}
            </span>
          </div>
        </div>
      </div>
    </>
  );
}

export default RoutingDetails;
