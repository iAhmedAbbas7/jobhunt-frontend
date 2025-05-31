// <= IMPORTS =>
import { SearchIcon, X } from "lucide-react";
import Navbar from "./shared/Navbar";
import Job from "./Job";
import { useDispatch, useSelector } from "react-redux";
import { setSearchedJobs, setSearchedQuery } from "@/redux/jobSlice";
import { useEffect } from "react";
import useGetAllQueryJobs from "@/hooks/useGetAllQueryJobs";

const Browse = () => {
  // USING GET ALL JOBS HOOK
  useGetAllQueryJobs();
  // DISPATCH
  const dispatch = useDispatch();
  // GETTING ALL JOBS FROM THE JOB SLICE
  const { searchedJobs } = useSelector((store) => store.job);
  // CLEANUP FUNCTION
  useEffect(() => {
    return () => {
      dispatch(setSearchedJobs([]));
      dispatch(setSearchedQuery(""));
    };
  }, [dispatch]);
  return (
    <>
      <Navbar />
      {/* BROWSE MAIN WRAPPER */}
      <section className="w-full flex flex-col items-center justify-center gap-[2rem] sm:px-[2rem] px-[1rem] py-[2rem]">
        {/* HEADING */}
        <div className="w-full flex items-center gap-[1rem]">
          <SearchIcon className="text-color-DB w-[3rem] h-[3rem]" />
          <h1 className="font-[600] text-gray-500 text-[2rem]">
            Search Results{" "}
            <span className="px-4 py-1 bg-gray-100 rounded-xl text-color-MAIN">
              {searchedJobs.length}
            </span>
          </h1>
        </div>
        {/* JOBS */}
        {searchedJobs.length === 0 ? (
          <div className="w-full flex items-center justify-start">
            <span className="text-gray-500 bg-gray-100 px-[1rem] py-[0.5rem] rounded-lg flex items-center gap-[0.5rem] font-medium">
              <X /> No Job Results
            </span>
          </div>
        ) : (
          <div className="w-full grid xl:grid-cols-3 lg:grid-cols-3 md-grid-cols-2 sm-grid-cols-1 grid-cols-1 gap-[1rem]">
            {searchedJobs.map((job, index) => (
              <div key={index}>
                <Job job={job} />
              </div>
            ))}
          </div>
        )}
      </section>
    </>
  );
};

export default Browse;
