// <= IMPORTS =>
import { Button } from "./ui/button";
import { Link } from "react-router-dom";
import { useSelector } from "react-redux";
import LatestJobCard from "./LatestJobCard";
import { ArrowUpIcon, MoreHorizontal, X } from "lucide-react";

const LatestJobs = () => {
  // GETTING ALL JOBS
  const { allJobs } = useSelector((store) => store.job);
  return (
    // LATEST JOBS MAIN WRAPPER
    <div className="flex items-center justify-center flex-col gap-[3rem] w-full sm:px-[2rem] px-[1rem] tracking-[0.5px] py-[5rem]">
      {/* HEADING */}
      <div className="flex items-center justify-center gap-[1rem] font-bold text-color-DB text-[3rem] text-center flex-wrap-reverse">
        <span>
          <ArrowUpIcon size={50} />
        </span>
        <h1>
          Latest <span className="text-color-MAIN">Job Openings</span>
        </h1>
      </div>
      {/* LATEST JOB CARDS */}
      {allJobs.length === 0 ? (
        <div className="w-full flex items-center justify-start">
          <span className="text-gray-500 bg-gray-100 px-[1rem] py-[0.5rem] rounded-lg flex items-center gap-[0.5rem] font-medium">
            <X /> No Jobs Available
          </span>
        </div>
      ) : (
        <section className="w-full grid gap-[2rem] xl:grid-cols-3 lg:grid-cols-3 md:grid-cols-2 sm:grid-cols-1 grid-cols-1 content-center items-stretch">
          {allJobs.length ? (
            allJobs
              .slice(0, 6)
              .map((job) => <LatestJobCard key={job._id} job={job} />)
          ) : (
            <span>No Jobs Available</span>
          )}
        </section>
      )}
      {/* VIEW MORE JOBS */}
      <Link to="/jobs">
        <Button className="bg-color-DB hover:bg-color-LB font-medium text-[1rem] focus:outline-none outline-none border-none">
          <MoreHorizontal /> View More
        </Button>
      </Link>
    </div>
  );
};

export default LatestJobs;
