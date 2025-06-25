import "../../styles/search-select-input-styles.css";
import { FaFlag } from "react-icons/fa";
import { FaFilter } from "react-icons/fa6";
import { FaSearch } from "react-icons/fa";
import CountrySelect from "./CountrySelect";
import CategorySelect from "./CategorySelect";
import Search from "./Search";
import SuggestedNearbySearchedPlaces from "./SuggestedNearbySearchedPlaces";
import { useDispatch, useSelector } from "react-redux";
import {
  closeSuggestedDestination,
  toggleShowCategory,
  toggleShowCountry,
  toggleShowDestination,
} from "../../redux/features/search-filter-slice";

const componentMap = {
  place: Search,
  country: CountrySelect,
  category: CategorySelect,
};

const searchOptions = [
  { key: "country", icon: <FaFlag />, className: "flag-box bg-white" },
  {
    key: "category",
    icon: <FaFilter />,
    className: "filter-box bg-white",
  },
  {
    key: "destination",
    icon: <FaSearch />,
    className: "search-box bg-primary text-white",
  },
];

function SelectWithSearch() {
  let dispatch = useDispatch();
  const { destination, country, category } = useSelector(
    (state) => state.searchFilter
  );

  const searchType = destination?.show
    ? "place"
    : country?.show
    ? "country"
    : category?.show
    ? "category"
    : "place";
  const CurrentComponent = componentMap[searchType];
  let togglerFilter = (filterType) => {
    switch (filterType) {
      case "destination":
        dispatch(toggleShowDestination());
        dispatch(closeSuggestedDestination());

        break;
      case "country":
        dispatch(toggleShowCountry());
        dispatch(closeSuggestedDestination());
        break;
      case "category":
        dispatch(toggleShowCategory());
        dispatch(closeSuggestedDestination());
        break;
      default:
        dispatch(toggleShowDestination());
        dispatch(closeSuggestedDestination());
    }
  };
  return (
    <>
      <div className="search-select-container w-50 d-flex align-items-center p-2">
        {CurrentComponent ? <CurrentComponent /> : null}

        <div className="icons-container w-25 d-flex align-items-center justify-content-center gap-2 h-100">
          {searchOptions?.map(({ key, icon, className }) => {
            return (
              key !== searchType && (
                <div
                  key={key}
                  className={`${className} cursor-pointer`}
                  onClick={() => {
                    togglerFilter(key);
                  }}
                >
                  {icon}
                </div>
              )
            );
          })}
        </div>
      </div>

      {searchType === "place" && destination?.openSuggestedOptions && (
        <SuggestedNearbySearchedPlaces />
      )}
    </>
  );
}

export default SelectWithSearch;
