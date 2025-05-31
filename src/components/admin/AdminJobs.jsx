// <= IMPORTS =>
import { Button } from "../ui/button";
import Navbar from "../shared/Navbar";
import { useDispatch } from "react-redux";
import { useEffect, useState } from "react";
import AdminJobsTable from "./AdminJobsTable";
import { useNavigate } from "react-router-dom";
import { setSearchJobByText } from "@/redux/jobSlice";
import useGetAllAdminJobs from "@/hooks/useGetAllAdminJobs";
import { Briefcase, Loader2, Plus, SearchIcon } from "lucide-react";

const AdminJobs = () => {
  // USING LOADING STATE FROM ADMIN JOBS HOOK
  const { loading } = useGetAllAdminJobs();
  // NAVIGATION
  const navigate = useNavigate();
  // DISPATCH
  const dispatch = useDispatch();
  // INPUT STATE MANAGEMENT
  const [input, setInput] = useState("");
  // FILTERING COMPANIES
  useEffect(() => {
    dispatch(setSearchJobByText(input));
  }, [input, dispatch]);
  return (
    <>
      <Navbar />
      {/* ADMIN JOBS MAIN WRAPPER */}
      <section className="w-full flex items-center justify-center sm:px-[2rem] px-[1rem] py-[2rem]">
        {/* ADMIN JOBS CONTENT WRAPPER */}
        <section className="flex flex-col gap-[2rem] w-full border-2 border-gray-100 rounded-xl sm:p-[2rem] p-[1rem] tracking-[0.5px]">
          {/* HEADING & NEW JOB */}
          <div className="w-full flex items-center justify-between flex-wrap-reverse gap-[2rem]">
            <div className="flex items-center gap-[1rem]">
              <SearchIcon className="text-color-DB w-[3rem] h-[3rem]" />
              <h1 className="font-[600] text-gray-500 text-[2rem]">
                Search Jobs
              </h1>
              <Briefcase className="text-color-DB w-[3rem] h-[3rem]" />
            </div>
            <Button
              onClick={() => navigate("/admin/jobs/create")}
              className="bg-color-DB outline-none border-none focus:outline-none hover:bg-color-LB text-[1rem] font-medium"
            >
              <Plus /> New Job
            </Button>
          </div>
          {/* SEARCH JOBS */}
          <div>
            <input
              type="text"
              className="w-full px-[1rem] py-[0.5rem] outline-none border-2 border-gray-100 rounded-md text-gray-500"
              placeholder="Search Jobs By Role & Company Name"
              onChange={(e) => setInput(e.target.value)}
            />
          </div>
          {/* JOBS TABLE */}
          {loading ? (
            <div className="flex items-center justify-center py-10">
              <Loader2 className="animate-spin w-12 h-12 text-color-DB" />
            </div>
          ) : (
            <AdminJobsTable />
          )}
        </section>
      </section>
    </>
  );
};

export default AdminJobs;
