import React, { useEffect } from "react";
import { Spinner } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import { FaWalking } from "react-icons/fa";
import { FaCarSide } from "react-icons/fa";
import { FaTruck } from "react-icons/fa";
import { IoIosBicycle } from "react-icons/io";
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
  function formatTime(seconds) {
    const hrs = Math.floor(seconds / 3600);
    const mins = Math.floor((seconds % 3600) / 60);
    const secs = Math.floor(seconds % 60);

    return `${hrs} hours ${mins} minutes ${secs} seconds`;
  }
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
              {routingDetails?.data?.features[0]?.properties?.distance > 1000
                ? `${Math.floor(
                    routingDetails?.data?.features[0]?.properties?.distance /
                      1000
                  )} KM ${
                    routingDetails?.data?.features[0]?.properties?.distance %
                    1000
                  } M`
                : `${routingDetails?.data?.features[0]?.properties?.distance} M`}
            </span>
          </div>
          <div className="d-flex justify-content-between">
            <span className="text-secondary fs-5 mx-2">time is :</span>{" "}
            <span className="mx-2 fs-5">
              {formatTime(routingDetails?.data?.features[0]?.properties?.time)}
            </span>
          </div>
        </div>
      </div>
    </>
  );
}

export default RoutingDetails;
