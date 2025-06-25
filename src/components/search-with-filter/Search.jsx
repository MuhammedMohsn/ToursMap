import { FaBuilding } from "react-icons/fa";
import { useDispatch, useSelector } from "react-redux";
import {
  selectDestination,
  toggleShowSuggestedDestination,
} from "../../redux/features/search-filter-slice";

function Search() {
  const { destination } = useSelector((state) => state.searchFilter);
  let dispatch = useDispatch();

  return (
    <>
      <div
        className="w-75 bg-white d-flex align-items-center position-relative justify-center-between overflow-hidden mx-2 cursor-pointer"
        onClick={() => {
          dispatch(toggleShowSuggestedDestination());
        }}
      >
        <FaBuilding className="mx-3 fs-5" />
        <input
          type="text"
          value={destination?.value}
          onChange={(e) => {
            dispatch(selectDestination({ value: e?.target?.value }));
          }}
          className="form-control border border-0 cursor-pointer"
          placeholder="search here"
        />
        {destination?.value && (
          <>
            <span
              className="reset-search cursor-pointer fs-5"
              onClick={() => {
                dispatch(selectDestination({ value: "" }));
                dispatch(toggleShowSuggestedDestination());
              }}
            >
              x
            </span>
          </>
        )}
      </div>
    </>
  );
}

export default Search;
