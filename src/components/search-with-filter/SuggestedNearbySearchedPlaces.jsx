import React, { useEffect } from "react";
import { TiDelete } from "react-icons/ti";
import { FaLocationDot } from "react-icons/fa6";
import { useDispatch, useSelector } from "react-redux";
import { Spinner } from "react-bootstrap";

import {
  closeSuggestedDestination,
  fetchAllNearbyLocations,
  fetchAllSearchedLocations,
  selectDestination,
} from "../../redux/features/search-filter-slice";
import { getMapCenter } from "../../redux/features/map-Info-new-slice";

function SuggestedNearbySearchedPlaces() {
  const { nearbyLocations, searchedLocations, destination } = useSelector(
    (state) => state.searchFilter
  );
  const { user } = useSelector((state) => state?.map);

  let dispatch = useDispatch();

  let destinationHandler = (place) => {
    dispatch(selectDestination({ value: place?.city }));
  };
  let destinationSearchHandler = (place) => {
    let { geometry, formatted_address } = place;
    dispatch(
      selectDestination({
        value: formatted_address,
      })
    );
    if (geometry?.location?.lat && geometry?.location?.lng) {
      dispatch(
        getMapCenter({
          lat: geometry?.location?.lat,
          lng: geometry?.location?.lng,
        })
      );
    }
  };
  useEffect(() => {
    // calling it at first after user location is detected
    let params = {
      radius: 100,
      distanceUnit: "KM",
      types: "CITY",
    };
    let apiKey = process.env.REACT_APP_RAPID_API_KEY_1;
    let latlng = { lat: user?.location?.lat, lng: user?.location?.lng };
    if (user?.location?.lat && user?.location?.lng) {
      dispatch(fetchAllNearbyLocations({ params, apiKey, latlng }));
    }
  }, [user, dispatch]);
  // get places from search
  useEffect(() => {
    if (destination?.value) {
      let apiKey = process.env.REACT_APP_RAPID_API_KEY_1;
      let params = {
        q: destination?.value,
        api: process.env.REACT_APP_GEO_KEO_RAPID_API_KEY_1,
      };
      dispatch(fetchAllSearchedLocations({ params, apiKey }));
    }
  }, [destination, dispatch]);
  let mappedSearchedLocations = searchedLocations?.data?.map((item) => {
    return {
      address_components: item?.address_components,
      geometry: item?.geometry,
      formatted_address: item?.formatted_address,
    };
  });

  return (
    <>
      <div className="h-fit p-3 bg-white text-dark searched-places-container">
        {destination?.value ? (
          searchedLocations?.loading ? (
            <div
              className="d-flex gap-4 justify-content-center align-items-center py-4 w-100"
              style={{ color: "white" }}
            >
              جاري تحميل البيانات ...
              <Spinner animation="border" variant="primary" />
            </div>
          ) : (
            <>
              {searchedLocations?.error ? (
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
                  {Array.isArray(mappedSearchedLocations) &&
                    mappedSearchedLocations?.length > 0 && (
                      <>
                        {" "}
                        {mappedSearchedLocations?.map((place, index) => {
                          let { formatted_address } = place;

                          return (
                            <div
                              key={index}
                              className="cursor-pointer d-flex align-items-center "
                              onClick={() => {
                                dispatch(closeSuggestedDestination());
                              }}
                            >
                              <FaLocationDot className="mt-2" />
                              <div
                                className="fw-bolder fs-6"
                                onClick={() => {
                                  destinationSearchHandler(place);
                                }}
                              >
                                <span>{formatted_address} </span>
                              </div>
                            </div>
                          );
                        })}
                      </>
                    )}
                  {mappedSearchedLocations?.length === 0 && <>Not found</>}
                </>
              )}
            </>
          )
        ) : nearbyLocations?.loading ? (
          <div
            className="d-flex gap-4 justify-content-center align-items-center py-4 w-100"
            style={{ color: "white" }}
          >
            جاري تحميل البيانات ...
            <Spinner animation="border" variant="primary" />
          </div>
        ) : (
          <>
            {nearbyLocations?.error ? (
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
                {Array.isArray(nearbyLocations?.data) &&
                  nearbyLocations?.data?.length > 0 && (
                    <>
                      {" "}
                      <div className="d-flex align-items-center justify-content-between">
                        <span>Popular Nearby Cities from your location</span>
                        <TiDelete
                          className="text-danger fs-4 cursor-pointer"
                          onClick={() => {
                            dispatch(closeSuggestedDestination());
                          }}
                        />
                      </div>
                      {nearbyLocations?.data?.map((place) => {
                        return (
                          <div
                            key={place?.id}
                            className="cursor-pointer d-flex mb-1"
                            onClick={() => {
                              destinationHandler(place);
                            }}
                          >
                            <FaLocationDot className="mt-2" />
                            <div className="mx-2">
                              <div className="fw-bolder fs-6">
                                <span className="m-2">{place?.city}</span> is
                                about
                                <span className="m-2">
                                  {place?.distance}
                                  KM
                                </span>
                              </div>
                              <div className="d-flex justify-content-start mx-2  fs-7">
                                {place?.country}
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </>
                  )}
                {nearbyLocations?.data?.length === 0 && <>Not found</>}
              </>
            )}
          </>
        )}
      </div>
    </>
  );
}

export default SuggestedNearbySearchedPlaces;
