import Select from "react-select";
import { FaFlag } from "react-icons/fa";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchAllCountries,
  selectCountry,
} from "../../redux/features/search-filter-slice";
import { useEffect } from "react";

function CountrySelect() {
  let dispatch = useDispatch();

  const { country, countries } = useSelector((state) => state.searchFilter);
  useEffect(() => {
    dispatch(fetchAllCountries());
  }, [dispatch]);
  const options =
    Array.isArray(countries?.data) &&
    countries?.data?.map((countryOption) => {
      return { value: countryOption?.Name, label: countryOption?.Name };
    });
  const customStyles = {
    menu: (provided) => ({
      ...provided,
      zIndex: 999,
    }),
    option: (provided, state) => ({
      ...provided,
      borderBottom: "1px solid #EBECF0",
      backgroundColor: state.isFocused ? "#33daff" : "white",
      color: "black",
      padding: 10,
      cursor: "pointer",
      display: "flex",
      alignItems: "center",
      justifyContent: "start",
    }),
  };
  return (
    <>
      <div className="w-75 bg-white d-flex align-items-center justify-center-between mx-2 cursor-pointer">
        <FaFlag className="mx-3 fs-5" />
        <Select
          className="w-100"
          options={options}
          onChange={(option) => {
            dispatch(selectCountry({ value: option?.value }));
          }}
          value={{ label: country.value, value: country?.value }}
          defaultValue={null}
          placeholder="choose country"
          styles={customStyles}
          isClearable={true}
        />
      </div>
    </>
  );
}

export default CountrySelect;
