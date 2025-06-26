import "../../styles/places-styles.css";
import { Spinner } from "react-bootstrap";
import { FaRoute } from "react-icons/fa";
import {
  FaHotel,
  FaUniversity,
  FaUtensils,
  FaMoneyCheckAlt,
  FaQuestionCircle,
  FaShoppingCart,
} from "react-icons/fa";
import { MdMuseum } from "react-icons/md";
import { useDispatch, useSelector } from "react-redux";
import { setShow, setWaypoints } from "../../redux/features/routing";
import { fetchUserLocationDetails } from "../../redux/features/routing";
function List() {
  let dispatch = useDispatch();
  const { placesOnMap } = useSelector((state) => state.map);
  const { waypoints } = useSelector((state) => state.routing);
  const {
    user: { location },
  } = useSelector((state) => state.map);
  const { category } = useSelector((state) => state.searchFilter);
  const getCategoryIcon = (category) => {
    switch (category?.label) {
      case "Hotels":
        return <FaHotel className="mt-2" />;
      case "Banks":
        return <FaUniversity className="mt-2" />;
      case "Malls":
        return <FaShoppingCart className="mt-2" />;
      case "Restaurants":
        return <FaUtensils className="mt-2" />;
      case "ATM":
        return <FaMoneyCheckAlt className="mt-2" />;
      case "Museums":
        return <MdMuseum className="mt-2" />;
      default:
        return <FaQuestionCircle className="mt-2" />;
    }
  };
  const handlePlaceWithUserLocationRouteOnMap = async (place, userLocation) => {
    const clearedWaypoints = Object.entries(waypoints).reduce(
      (acc, [key, value]) => {
        acc[key] = { ...value, address: "" };
        return acc;
      },
      {}
    );
    dispatch(setWaypoints(clearedWaypoints));

    dispatch(setShow(true));

    const places = [
      {
        waypointKey: "first waypoint",
        lat: userLocation?.lat,
        lon: userLocation?.lng,
      },
      {
        waypointKey: "second waypoint",
        lat: place?.lat,
        lon: place?.lon,
      },
    ];

    const apiKey = process.env.REACT_APP_RAPID_API_KEY_1;
    const updatedWaypoints = { ...clearedWaypoints };

    for (const point of places) {
      const params = {
        lat: point.lat,
        lon: point.lon,
        "accept-language": "en",
      };

      const res = await dispatch(fetchUserLocationDetails({ params, apiKey }));
      updatedWaypoints[point.waypointKey] = {
        ...updatedWaypoints[point.waypointKey],
        address: res?.payload?.display_name,
        coords: [point.lat, point.lon],
      };
    }
    dispatch(setWaypoints(updatedWaypoints));
  };

  return (
    <div className="mx-auto places-container mb-3">
      {placesOnMap?.loading ? (
        <div
          className="d-flex gap-4 justify-content-center align-items-center py-4 h-100"
          style={{ color: "white" }}
        >
          جاري تحميل البيانات ...
          <Spinner animation="border" variant="primary" />
        </div>
      ) : (
        <>
          {placesOnMap?.error ? (
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
              {Array.isArray(placesOnMap?.data) &&
                placesOnMap?.data?.length > 0 && (
                  <>
                    {" "}
                    {placesOnMap?.data
                      ?.filter((item) => {
                        return item?.name;
                      })
                      ?.map((place, index) => {
                        return (
                          <div
                            key={index}
                            className="places mx-auto mt-2 py-4 px-3 d-flex justify-content-between align-items-center bg-primary text-dark"
                          >
                            {getCategoryIcon(category)}
                            <div className="fw-bolder fs-6">
                              <span>{place?.name} </span>
                            </div>
                            <FaRoute
                              className="cursor-pointer fs-4"
                              onClick={() => {
                                handlePlaceWithUserLocationRouteOnMap(
                                  place?.point,
                                  location
                                );
                              }}
                            />
                          </div>
                        );
                      })}
                  </>
                )}
              {placesOnMap?.data?.length === 0 && (
                <>
                  <span>Not found</span>
                </>
              )}
            </>
          )}
        </>
      )}
    </div>
  );
}

export default List;
