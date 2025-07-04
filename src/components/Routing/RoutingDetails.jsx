import { useSelector } from "react-redux";
import { FaWalking } from "react-icons/fa";
import { FaCarSide } from "react-icons/fa";
import { FaTruck } from "react-icons/fa";
import { IoIosBicycle } from "react-icons/io";
import { FaDiamondTurnRight } from "react-icons/fa6";
import { BsFillSignTurnLeftFill } from "react-icons/bs";
import { MdSouth } from "react-icons/md";
import { MdNorth } from "react-icons/md";
import { CiLocationOn } from "react-icons/ci";

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
      {routingDetails?.data?.features[0]?.properties?.distance > 20000 ? (
        <>
          <h4>
            Both the starting and ending point are in two different countries,
            so we're sorry we can't provide a good route
          </h4>
        </>
      ) : (
        <>
          <div
            className="d-flex align-items-center mb-5"
            style={{ height: "100px", width: "100%" }}
          >
            <span className="my-2">{showModeIcon(mode, "fs-1")}</span>
            <div className="fw-bold">
              {" "}
              <div className="d-flex justify-content-between">
                <span className="text-secondary fs-5 mx-2">distance is :</span>{" "}
                <span className="mx-2 fs-5">
                  {routingDetails?.data?.features[0]?.properties?.distance >
                  1000
                    ? `${Math.floor(
                        routingDetails?.data?.features[0]?.properties
                          ?.distance / 1000
                      )} KM ${
                        routingDetails?.data?.features[0]?.properties
                          ?.distance % 1000
                      } M`
                    : `${routingDetails?.data?.features[0]?.properties?.distance} M`}
                </span>
              </div>
              <div className="d-flex justify-content-between">
                <span className="text-secondary fs-5 mx-2">time is :</span>{" "}
                <span className="mx-2 fs-5">
                  {formatTime(
                    routingDetails?.data?.features[0]?.properties?.time
                  )}
                </span>
              </div>
            </div>
          </div>
          {routingDetails?.data?.features[0]?.properties?.legs[0]?.steps?.map(
            (step, index) => {
              let text = step?.instruction?.text;
              return (
                <div
                  className="d-flex align-items-center fw-bolder"
                  key={index}
                >
                  {typeof text === "string" &&
                  text?.toLowerCase()?.includes("left") ? (
                    <BsFillSignTurnLeftFill className="mx-2 fs-5" />
                  ) : typeof text === "string" &&
                    text?.toLowerCase()?.includes("south") ? (
                    <MdSouth className="mx-2 fs-5" />
                  ) : typeof text === "string" &&
                    text?.toLowerCase()?.includes("right") ? (
                    <FaDiamondTurnRight className="mx-2 fs-5" />
                  ) : typeof text === "string" &&
                    text?.toLowerCase()?.includes("north") ? (
                    <MdNorth className="mx-2 fs-5" />
                  ) : typeof text === "string" &&
                    text
                      ?.toLowerCase()
                      ?.includes("You have arrived at your destination.") ? (
                    <CiLocationOn className="mx-2 fs-5" />
                  ) : (
                    <></>
                  )}
                  <span className="fs-5">{step?.instruction?.text}</span>
                </div>
              );
            }
          )}
        </>
      )}
    </>
  );
}

export default RoutingDetails;
