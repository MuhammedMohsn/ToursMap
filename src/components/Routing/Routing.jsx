import React, { useEffect } from "react";
import { FaRoute } from "react-icons/fa";
import "../../styles/routing-styles.css";
import { useDispatch, useSelector } from "react-redux";
import { setMode, setShow } from "../../redux/features/routing";
import { TiDelete } from "react-icons/ti";
import { FaCarSide } from "react-icons/fa";
import { FaTruck } from "react-icons/fa";
import { IoIosBicycle } from "react-icons/io";
import { FaLocationDot } from "react-icons/fa6";
import { FaWalking } from "react-icons/fa";
import { setWaypoints, clearWayPoint } from "../../redux/features/routing";
import { CiLocationOn } from "react-icons/ci";
import { BiTargetLock } from "react-icons/bi";
import { FaMapLocationDot } from "react-icons/fa6";
import {
  fetchUserLocationDetails,
  fetchAllSearchedLocationsForWaypoint,
} from "../../redux/features/routing";
import { useMap } from "react-leaflet";
import { Spinner } from "react-bootstrap";
import { getMapCenter } from "../../redux/features/map-Info-new-slice";
import { fetchRoutingDetails } from "../../redux/features/routing";
import { resetRoutingDetails } from "../../redux/features/routing";
import RoutingDetails from "./RoutingDetails";
function Routing() {
  let dispatch = useDispatch();
  const { user } = useSelector((state) => state.map);
  let map = useMap();

  const { show, mode, waypoints, markerPositionsOnMap, routingDetails } =
    useSelector((state) => state.routing);

  const modes = [
    { id: 1, mode: "drive", icon: <FaCarSide /> },
    { id: 2, mode: "truck", icon: <FaTruck /> },
    { id: 3, mode: "bicycle", icon: <IoIosBicycle /> },
    { id: 4, mode: "walk", icon: <FaWalking /> },
  ];
  const handleRoutingAddress = (e, key) => {
    const address = e.target.value;
    const updatedWaypoints = {
      ...waypoints,
      [key]: {
        ...waypoints[key],
        address,
        showSuggestedPlaces: true,
      },
    };

    dispatch(setWaypoints(updatedWaypoints));

    const params = {
      q: address,
      api: process.env.REACT_APP_GEO_KEO_RAPID_API_KEY_1,
    };
    const apiKey = process.env.REACT_APP_RAPID_API_KEY_1;

    dispatch(
      fetchAllSearchedLocationsForWaypoint({
        params,
        apiKey,
        key,
      })
    );
  };

  let handleDeleteRoutingAddress = (e, key) => {
    e.stopPropagation();
    dispatch(resetRoutingDetails());
    dispatch(clearWayPoint({ key }));
  };
  let handleUserLocation = async (key) => {
    let params = {
      lat: user?.location?.lat,
      lon: user?.location?.lng,
      "accept-language": "en",
    };
    let apiKey = process.env.REACT_APP_RAPID_API_KEY_1;
    if (!Object.values(user.location)?.includes(null)) {
      await dispatch(fetchUserLocationDetails({ params, apiKey })).then(
        (res) => {
          dispatch(
            setWaypoints({
              ...waypoints,
              [key]: {
                ...waypoints[key],
                address: res?.payload?.display_name,
              },
            })
          );
        }
      );
      getMapCenter({
        lat: user?.location?.lat,
        lng: user?.location?.lng,
      });
      map?.flyTo([user?.location?.lat, user?.location?.lng], map.getZoom());
    }
  };
  let handleSearchFromSuggestedPlaces = (e, place, key) => {
    e.stopPropagation();
    let {
      formatted_address,
      geometry: {
        location: { lat, lng },
      },
    } = place;
    dispatch(
      setWaypoints({
        ...waypoints,
        [key]: {
          ...waypoints[key],
          address: formatted_address,
          showSuggestedPlaces: false,
        },
      })
    );
    if (lat && lng) {
      dispatch(
        getMapCenter({
          lat,
          lng,
        })
      );
      map?.flyTo([lat, lng], map.getZoom());
    }
  };
  useEffect(() => {
    let isAllWaypointHasAddress = Object.entries(waypoints).every(
      ([_, value]) => value.address
    );
    if (isAllWaypointHasAddress) {
      let apiKey = process.env.REACT_APP_RAPID_API_KEY_1;
      let params = {
        apiKey: process.env.REACT_APP_GEO_APIFY_RAPID_API_KEY_1,
        mode,
        waypoints: Object.values(waypoints)
          ?.map((point) => {
            return `${point?.coords[0]},${point?.coords[1]}`;
          })
          .join("|"),
      };
      dispatch(fetchRoutingDetails({ params, apiKey }));
    }
  }, [waypoints, dispatch, mode]);
  console.log("routingDetails?.data", routingDetails?.data);
  return (
    <>
      <div className="routing">
        {" "}
        {!show && (
          <button className="bg-white routing-btn">
            <FaRoute
              className="cursor-pointer fs-4"
              onClick={(e) => {
                e.stopPropagation();
                dispatch(setShow(true));
                const updatedWaypoints = Object.entries(waypoints).reduce(
                  (acc, [key, value]) => {
                    acc[key] = { ...value, address: "" };
                    return acc;
                  },
                  {}
                );

                dispatch(setWaypoints(updatedWaypoints));
              }}
            />
          </button>
        )}
        {show && (
          <>
            <div className={`bg-white routing-container ${show && "show"} p-3`}>
              <div className="d-flex justify-content-end align-items-center">
                <TiDelete
                  className="text-danger fs-3 cursor-pointer"
                  onClick={(e) => {
                    dispatch(setShow(false));
                    const updatedWaypoints = Object.entries(waypoints).reduce(
                      (acc, [key, value]) => {
                        acc[key] = { ...value, address: "" };
                        return acc;
                      },
                      {}
                    );
                    dispatch(setWaypoints(updatedWaypoints));
                    dispatch(resetRoutingDetails());
                    e.stopPropagation();
                  }}
                />
              </div>
              <div className="modes-container mx-auto w-75 h-fit">
                {[...modes]?.map((item) => {
                  return (
                    <span
                      key={item?.id}
                      className={`cursor-pointer fs-3 p-2 mode ${
                        mode === item?.mode ? "bg-secondary" : ""
                      }`}
                      onClick={(e) => {
                        e.stopPropagation();
                        dispatch(setMode(item?.mode));
                      }}
                      title={item?.mode}
                    >
                      {item?.icon}
                    </span>
                  );
                })}
              </div>
              <div className="timeline my-4">
                {Object.keys(waypoints)?.map((waypoint, index) => (
                  <div key={index}>
                    <div
                      className={`timeline-content-${
                        index + 1
                      } d-flex align-items-center justify-content-between position-relative my-3`}
                      key={index}
                    >
                      <CiLocationOn
                        className={`fs-3  ${
                          index === 1 ? "text-danger" : "text-primary"
                        }`}
                      />

                      <input
                        type="text"
                        className="form-control mx-2"
                        value={waypoints[waypoint]?.address}
                        onChange={(e) => {
                          handleRoutingAddress(e, waypoint);
                        }}
                        placeholder="Enter address here Or Click on map"
                      />
                      {waypoints[waypoint]?.address && (
                        <>
                          {" "}
                          <div
                            onClick={(e) => {
                              handleDeleteRoutingAddress(e, waypoint);
                            }}
                            className="delete-address-btn bg-danger"
                          >
                            x
                          </div>
                        </>
                      )}
                    </div>
                    {waypoints[waypoint]?.showSuggestedPlaces && (
                      <>
                        {waypoints[waypoint].searchedLocations?.loading ? (
                          <div
                            className="d-flex gap-4 justify-content-center align-items-center py-4 w-100"
                            style={{ color: "white" }}
                          >
                            جاري تحميل البيانات ...
                            <Spinner animation="border" variant="primary" />
                          </div>
                        ) : (
                          <>
                            {waypoints[waypoint]?.searchedLocations?.error ? (
                              <>
                                {" "}
                                <div
                                  className="d-flex gap-4 justify-content-center align-items-center py-4"
                                  style={{ color: "white" }}
                                >
                                  حدث خطأ في تحميل البيانات
                                </div>
                              </>
                            ) : (
                              <>
                                {" "}
                                {Array.isArray(
                                  waypoints[waypoint].searchedLocations?.data
                                ) &&
                                  waypoints[waypoint].searchedLocations?.data
                                    ?.length > 0 && (
                                    <>
                                      {" "}
                                      {waypoints[
                                        waypoint
                                      ].searchedLocations?.data?.map(
                                        (place, placeIndex) => {
                                          let { formatted_address } = place;

                                          return (
                                            <div
                                              key={placeIndex}
                                              className="cursor-pointer d-flex align-items-center "
                                            >
                                              <FaLocationDot className="mt-2" />
                                              <div
                                                className="fw-bolder fs-6"
                                                onClick={(e) => {
                                                  handleSearchFromSuggestedPlaces(
                                                    e,
                                                    place,
                                                    waypoint
                                                  );
                                                }}
                                              >
                                                <span>
                                                  {formatted_address}{" "}
                                                </span>
                                              </div>
                                            </div>
                                          );
                                        }
                                      )}
                                    </>
                                  )}
                                {waypoints[waypoint].searchedLocations?.data
                                  ?.length === 0 && <>Not found</>}
                              </>
                            )}
                          </>
                        )}
                      </>
                    )}
                  </div>
                ))}
              </div>
              <div className="w-100">
                <div className="mx-auto d-flex w-50 px-4 align-items-center justify-content-center">
                  <BiTargetLock
                    className={`fs-3 ${
                      waypoints["first waypoint"]?.address
                        ? "disabled-icon"
                        : "cursor-pointer"
                    }`}
                    title={
                      waypoints["first waypoint"]?.address
                        ? "your location is already added as 1st waypoint"
                        : "select your location as 1st waypoint"
                    }
                    disabled={waypoints["first waypoint"]?.address}
                    onClick={() => {
                      handleUserLocation("first waypoint");
                    }}
                  />
                  <FaMapLocationDot
                    className={` fs-3 mx-2 ${
                      waypoints["second waypoint"]?.address
                        ? "cursor-pointer"
                        : "disabled-icon"
                    }`}
                    title={
                      waypoints["second waypoint"]?.address === ""
                        ? "find the route on map"
                        : ""
                    }
                  />
                </div>
              </div>
              {routingDetails?.data != null && <RoutingDetails />}
            </div>
          </>
        )}
      </div>
    </>
  );
}

export default Routing;
