// <= IMPORTS =>
import { useDispatch } from "react-redux";
import Navbar from "./shared/Navbar";
import { Building2 } from "lucide-react";
import { useEffect, useState } from "react";
import { setSearchCompanyByText } from "@/redux/companySlice";
import AllCompaniesTable from "./AllCompaniesTable";

const AllCompanies = () => {
  // DISPATCH
  const dispatch = useDispatch();
  // INPUT STATE MANAGEMENT
  const [input, setInput] = useState("");
  // FILTERING COMPANIES
  useEffect(() => {
    dispatch(setSearchCompanyByText(input));
  }, [input, dispatch]);
  return (
    <>
      <Navbar />
      {/* ALL COMPANIES MAIN WRAPPER */}
      <section className="w-full flex items-center justify-center sm:px-[2rem] px-[1rem] py-[2rem]">
        {/* ALL COMPANIES CONTENT WRAPPER */}
        <section className="flex flex-col gap-[2rem] w-full border-2 border-gray-100 rounded-xl sm:p-[2rem] p-[1rem] tracking-[0.5px]">
          {/* HEADING */}
          <div className="w-full flex items-center justify-start gap-[2rem]">
            <div className="flex items-center gap-[1rem]">
              <Building2 className="text-color-DB w-[3rem] h-[3rem]" />
              <h1 className="font-[600] text-gray-500 text-[2rem]">
                Companies
              </h1>
            </div>
          </div>
          {/* SEARCH COMPANIES */}
          <div>
            <input
              type="text"
              className="w-full px-[1rem] py-[0.5rem] outline-none border-2 border-gray-100 rounded-md text-gray-500"
              placeholder="Search Companies By Name"
              onChange={(e) => setInput(e.target.value)}
            />
          </div>
          {/* ALL COMPANIES TABLE */}
          <AllCompaniesTable />
        </section>
      </section>
    </>
  );
};

export default AllCompanies;
