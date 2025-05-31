// <= IMPORTS =>
import Navbar from "../shared/Navbar";
import { Button } from "../ui/button";
import useChat from "@/hooks/useChat";
import { useDispatch } from "react-redux";
import { useEffect, useState } from "react";
import CompaniesTable from "./CompaniesTable";
import { useNavigate } from "react-router-dom";
import { setSearchCompanyByText } from "@/redux/companySlice";
import { Building2, Loader2, Plus, SearchIcon } from "lucide-react";
import useGetAllAdminCompanies from "@/hooks/useGetAllAdminCompanies";

const Companies = () => {
  // USING LOAD ROOMS FUNCTION FROM USE CHAT HOOK
  const { loadRooms } = useChat();
  // USING LOADING STATE FROM COMPANIES HOOK
  const { loading } = useGetAllAdminCompanies();
  // NAVIGATION
  const navigate = useNavigate();
  // DISPATCH
  const dispatch = useDispatch();
  // INPUT STATE MANAGEMENT
  const [input, setInput] = useState("");
  // FILTERING COMPANIES
  useEffect(() => {
    dispatch(setSearchCompanyByText(input));
  }, [input, dispatch]);
  // USING LOAD ROOMS
  useEffect(() => {
    loadRooms();
  }, [loadRooms]);
  return (
    <>
      <Navbar />
      {/* COMPANIES MAIN WRAPPER */}
      <section className="w-full flex items-center justify-center sm:px-[2rem] px-[1rem] py-[2rem]">
        {/* COMPANIES CONTENT WRAPPER */}
        <section className="flex flex-col gap-[2rem] w-full border-2 border-gray-100 rounded-xl sm:p-[2rem] p-[1rem] tracking-[0.5px]">
          {/* HEADING & NEW COMPANY */}
          <div className="w-full flex items-center justify-between flex-wrap-reverse gap-[2rem]">
            <div className="flex items-center gap-[1rem]">
              <SearchIcon className="text-color-DB w-[3rem] h-[3rem]" />
              <h1 className="font-[600] text-gray-500 text-[2rem]">
                Search Companies
              </h1>
              <Building2 className="text-color-DB w-[3rem] h-[3rem]" />
            </div>
            <Button
              onClick={() => navigate("/admin/companies/create")}
              className="bg-color-DB outline-none border-none focus:outline-none hover:bg-color-LB text-[1rem] font-medium"
            >
              <Plus /> New Company
            </Button>
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
          {/* COMPANIES TABLE */}
          {loading ? (
            <div className="flex items-center justify-center py-10">
              <Loader2 className="animate-spin w-12 h-12 text-color-DB" />
            </div>
          ) : (
            <CompaniesTable />
          )}
        </section>
      </section>
    </>
  );
};

export default Companies;
