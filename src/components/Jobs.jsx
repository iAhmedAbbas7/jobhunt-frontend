// <= IMPORTS =>
import Job from "./Job";
import { X } from "lucide-react";
import Navbar from "./shared/Navbar";
import JobsFilter from "./JobsFilter";
import { motion } from "framer-motion";
import { useSelector } from "react-redux";
import { useEffect, useState } from "react";
import useGetSavedJobs from "@/hooks/useGetSavedJobs";

const Jobs = () => {
  // USING GET SAVED JOBS HOOK
  useGetSavedJobs();
  // GETTING ALL JOBS
  const { allJobs, searchedQuery } = useSelector((store) => store.job);
  // FILTERED JOBS STATE MANAGEMENT
  const [filteredJobs, setFilteredJobs] = useState(allJobs);
  // FILTERING JOBS
  useEffect(() => {
    // IF SEARCHED QUERY IS PRESENT
    if (searchedQuery) {
      // SPLITTING THE QUERY IN TO 1 : CATEGORY & 2 : VALUE
      const [filterType, value] = searchedQuery.split(":");
      // INITIALIZING FILTERED JOBS
      let filteredJobs = allJobs;
      // IF THE FILTER CATEGORY IS LOCATION
      if (filterType === "Location") {
        filteredJobs = allJobs.filter((job) =>
          job.location.toLowerCase().includes(value.toLowerCase())
        );
      }
      // IF THE FILTER CATEGORY IS INDUSTRY
      else if (filterType === "Industry") {
        filteredJobs = allJobs.filter((job) =>
          job.title.toLowerCase().includes(value.toLowerCase())
        );
      }
      // IF THE FILTER CATEGORY IS SALARY
      else if (filterType === "Salary") {
        filteredJobs = allJobs.filter((job) => {
          // SALARY NUMBER FOR COMPARISON
          const salary = parseFloat(job.salary);
          if (value === "3LPA-5LPA") return salary <= 5;
          if (value === "5LPA-10LPA") return salary >= 5 && salary <= 10;
          if (value === "10LPA-15LPA") return salary >= 10 && salary <= 15;
          if (value === "18LPA +") return salary > 18;
          return true;
        });
      }
      setFilteredJobs(filteredJobs);
    }
    // IF SEARCHED QUERY IS NOT PRESENT
    else {
      setFilteredJobs(allJobs);
    }
  }, [searchedQuery, allJobs]);
  return (
    <>
      {/* NAVBAR */}
      <Navbar />
      {/* JOBS MAIN WRAPPER */}
      <section className="sm:px-[2rem] px-[1rem] tracking-[0.5px]">
        {/* JOBS CONTENT WRAPPER */}
        <section className="flex lg:flex-row flex-col items-start gap-[2rem] flex-wrap">
          {/* JOBS FILTER */}
          <div className="lg:w-1/5 py-[2rem] h-[87vh] overflow-y-auto">
            <JobsFilter />
          </div>
          {/* JOB CARDS */}
          {filteredJobs.length <= 0 ? (
            // IF NO JOBS AVAILABLE
            <div className="flex flex-1 items-center justify-center py-[2rem] h-[87vh] overflow-y-auto">
              <span className="text-gray-500 bg-gray-100 px-[1rem] py-[0.5rem] flex items-center gap-[0.5rem] font-medium rounded-lg">
                <X /> No Jobs Available
              </span>
            </div>
          ) : (
            // IF JOBS AVAILABLE
            <div className="w-full flex-1 overflow-y-auto h-[87vh] py-[2rem]">
              <div className="w-full grid xl:grid-cols-3 lg:grid-cols-2 md:grid-cols-2 sm:grid-cols-1 grid-cols-1 gap-[1rem] items-stretch">
                {filteredJobs.map((job) => (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.8 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.3 }}
                    viewport={{ once: true }}
                    layoutId={job?._id}
                    className="grid items-stretch"
                    key={job?._id}
                  >
                    <Job job={job} />
                  </motion.div>
                ))}
              </div>
            </div>
          )}
        </section>
      </section>
    </>
  );
};

export default Jobs;
