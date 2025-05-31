// <= IMPORTS =>
import { useEffect, useState } from "react";
import { RadioGroup, RadioGroupItem } from "./ui/radio-group";
import { useDispatch } from "react-redux";
import { setSearchedQuery } from "@/redux/jobSlice";

// <= FILTER DATA =>
const filterData = [
  {
    filterType: "Location",
    array: ["Lahore", "Islamabad", "Karachi", "Peshawar", "Quetta"],
  },
  {
    filterType: "Industry",
    array: ["Frontend Developer", "Backend Developer", "FullStack Developer"],
  },
  {
    filterType: "Salary",
    array: ["3LPA-5LPA", "5LPA-10LPA", "10LPA-15LPA", "18LPA +"],
  },
];

const JobsFilter = () => {
  // DISPATCH
  const dispatch = useDispatch();
  // STATE MANAGEMENT FOR SELECTED FILTERS
  // JOB FILTER STATE MANAGEMENT
  const [selectedValue, setSelectedValue] = useState("");
  // CHANGE HANDLER
  const changeHandler = (value) => {
    setSelectedValue(`${value}`);
  };
  // SETTING SELECTED VALUE FOR SEARCH QUERY
  useEffect(() => {
    dispatch(setSearchedQuery(selectedValue));
  }, [selectedValue, dispatch]);
  return (
    <>
      {/* JOBS FILTER MAIN WRAPPER */}
      <section className="flex items-start justify-center flex-col gap-[0.75rem] tracking-[0.5px]">
        {/* HEADING */}
        <h1 className="font-[600] text-color-DB text-[1.75rem] uppercase">
          Filter Jobs
        </h1>
        {/* LINE */}
        <div className="border border-gray-300 w-full"></div>
        {/* RADIO GROUP */}
        <RadioGroup onValueChange={changeHandler} value={selectedValue}>
          {filterData.map((data, index) => (
            <div key={index}>
              {/* FILTER TYPE */}
              <h1 className="font-[600] text-[1.25rem] text-color-MAIN uppercase">
                {data.filterType}
              </h1>
              {/* FILTER ITEMS */}
              {data.array.map((item, idx) => {
                // UNIQUE KEY FOR FILTER ITEM
                const key = `id${index}-${idx}`;
                return (
                  <div
                    key={key}
                    className="flex items-center gap-2 text-gray-500 font-medium"
                  >
                    <RadioGroupItem
                      value={`${data.filterType}:${item}`}
                      key={key}
                    />
                    <label htmlFor={key}>{item}</label>
                  </div>
                );
              })}
            </div>
          ))}
        </RadioGroup>
      </section>
    </>
  );
};

export default JobsFilter;
