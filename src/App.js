import "./App.css";
import { Fragment, useEffect } from "react";
import SelectWithSearch from "./components/search-with-filter/SelectWithSearch";
import { getUserLocation } from "./redux/features/map-Info-new-slice";
import { useDispatch, useSelector } from "react-redux";
import List from "./components/list/List";
import Map from "./components/map/Map";
function App() {
  let dispatch = useDispatch();
  useEffect(() => {
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          dispatch(getUserLocation({ lat: latitude, lng: longitude }));
        },
        (error) => {}
      );
    }
  }, [dispatch]);
  let userLocation = useSelector((state) => {
    return state?.map?.user?.location;
  });
  console.log("userLocation", userLocation);
  return (
    <Fragment>
      <div className="App">
        <div className="px-3 w-100 h-70px d-flex align-items-center justify-content-between bg-primary">
          <h4>tripify</h4>
          <SelectWithSearch />
        </div>
        <div className="row mt-2">
          <div className="col-md-3 col-sm-12">
            {" "}
            <List />
          </div>
          <div className=" col-md-9 col-sm-12">
            <Map />
          </div>
        </div>
      </div>
    </Fragment>
  );
}

export default App;
