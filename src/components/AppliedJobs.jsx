// <= IMPORTS =>
import { Briefcase } from "lucide-react";
import Navbar from "./shared/Navbar";
import AppliedJobsTable from "./AppliedJobsTable";

const AppliedJobs = () => {
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
              <h1 className="font-[600] text-gray-500 text-[2rem]">
                Applied Jobs
              </h1>
              <Briefcase className="text-color-DB w-[3rem] h-[3rem]" />
            </div>
          </div>
          {/* JOBS TABLE */}
          <AppliedJobsTable />
        </section>
      </section>
    </>
  );
};

export default AppliedJobs;
