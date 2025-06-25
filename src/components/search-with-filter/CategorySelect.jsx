import Select, { components } from "react-select";
import { FaFilter } from "react-icons/fa6";
import { useDispatch, useSelector } from "react-redux";
import { selectCategory } from "../../redux/features/search-filter-slice";

function CategorySelect() {
  const options = [
    { value: "other_hotels", label: "Hotels" },
    { value: "banks", label: "Banks" },
    { value: "resorts", label: "Malls" },
    { value: "restaurants", label: "Restaurants" },
    { value: "atm", label: "ATM" },
    { value: "parks", label: "Parks" },
    { value: "museums", label: "Museums" },
    { value: "historic", label: "Historic Sites" },
  ];
  let dispatch = useDispatch();
  const { category } = useSelector((state) => state.searchFilter);
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
  // Custom selected value renderer with icon
  const SingleValue = (props) => (
    <components.SingleValue {...props}>
      {props.data.label && (
        <>
          {" "}
          <div className="d-flex align-items-center gap-2">
            <FaFilter />
            {props.data.label}
          </div>
        </>
      )}
    </components.SingleValue>
  );
  return (
    <>
      <div className="w-75 bg-white d-flex align-items-center justify-center-between mx-2 cursor-pointer">
        <FaFilter className="mx-3 fs-5" />
        <Select
          className="w-100"
          options={options}
          onChange={(option) => {
            dispatch(
              selectCategory({ value: option?.value, label: option?.label })
            );
          }}
          value={{ value: category?.value, label: category?.label }}
          defaultValue={null}
          placeholder="choose category"
          styles={customStyles}
          isClearable={true}
          components={{ SingleValue }}
        />
      </div>
    </>
  );
}

export default CategorySelect;
