// <= IMPORTS =>
import Navbar from "../shared/Navbar";
import { Loader2, SearchIcon, Users2 } from "lucide-react";
import ApplicantsTable from "./ApplicantsTable";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import useGetAllApplicants from "@/hooks/useGetAllApplicants";
import { useDispatch } from "react-redux";
import { setSearchApplicantsByName } from "@/redux/applicationSlice";

const Applicants = () => {
  // RETRIEVING JOB ID FROM URL PARAMS
  const params = useParams();
  const jobId = params.id;
  // USING LOADING STATE FROM ALL APPLICANTS HOOK & PASSING JOB ID
  const { loading } = useGetAllApplicants(jobId);
  // DISPATCH
  const dispatch = useDispatch();
  // INPUT STATE MANAGEMENT
  const [input, setInput] = useState("");
  // FILTERING APPLICANTS
  useEffect(() => {
    dispatch(setSearchApplicantsByName(input));
  }, [input, dispatch]);
  return (
    <>
      <Navbar />
      {/* APPLICANTS MAIN WRAPPER */}
      <section className="w-full flex items-center justify-center sm:px-[2rem] px-[1rem] py-[2rem]">
        {/* APPLICANTS CONTENT WRAPPER */}
        <section className="flex flex-col gap-[2rem] w-full border-2 border-gray-100 rounded-xl sm:p-[2rem] p-[1rem] tracking-[0.5px]">
          {/* HEADING */}
          <div className="flex items-center justify-start">
            <div className="flex items-center gap-[1rem]">
              <SearchIcon className="text-color-DB w-[3rem] h-[3rem]" />
              <h1 className="font-[600] text-gray-500 text-[2rem]">
                Search Applicants
              </h1>
              <Users2 className="text-color-DB w-[3rem] h-[3rem]" />
            </div>
          </div>
          {/* SEARCH APPLICANTS */}
          <div>
            <input
              type="text"
              className="w-full px-[1rem] py-[0.5rem] outline-none border-2 border-gray-100 rounded-md text-gray-500"
              placeholder="Search Applicants By Name or Email"
              onChange={(e) => setInput(e.target.value)}
            />
          </div>
          {/* APPLICANTS TABLE */}
          {loading ? (
            <div className="flex items-center justify-center py-10">
              <Loader2 className="animate-spin w-12 h-12 text-color-DB" />
            </div>
          ) : (
            <ApplicantsTable jobId={jobId} />
          )}
        </section>
      </section>
    </>
  );
};

export default Applicants;
