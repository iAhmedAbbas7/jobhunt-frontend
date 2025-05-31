// <= IMPORTS =>
import { Link } from "react-router-dom";
import { useSelector } from "react-redux";
import { useEffect, useState } from "react";
import { Edit2, Users2, X } from "lucide-react";
import { Avatar, AvatarImage } from "../ui/avatar";
import useGetAllAdminJobs from "@/hooks/useGetAllAdminJobs";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../ui/table";

const AdminJobsTable = () => {
  // USING GET ALL ADMIN JOBS HOOK
  useGetAllAdminJobs();
  // GETTING ALL COMPANIES & FILTER COMPANY STATE FROM COMPANY SLICE
  const { allAdminJobs, searchJobByText } = useSelector((store) => store.job);
  // FILTER COMPANIES STATE
  const [filterJobs, setFilterJobs] = useState(allAdminJobs);
  // FILTER HANDLING
  useEffect(() => {
    // IF ADMIN JOBS ARE PRESENT
    if (allAdminJobs && allAdminJobs.length > 0) {
      const filteredJobs = allAdminJobs.filter((job) => {
        // IF THERE IS NO SEARCH TEXT THEN RETURNING
        if (!searchJobByText) {
          return true;
        }
        // IF MATCHES THEN RETURNING THE JOB BY MATCHING THE NAME & TITLE IN LOWERCASE
        return (
          job?.title?.toLowerCase().includes(searchJobByText.toLowerCase()) ||
          job?.company?.name
            .toLowerCase()
            .includes(searchJobByText.toLowerCase())
        );
      });
      // SETTING FILTERED COMPANIES
      setFilterJobs(filteredJobs);
    } else {
      // IF THERE ARE NO ADMIN JOBS
      setFilterJobs([]);
    }
  }, [allAdminJobs, searchJobByText]);
  return (
    // JOBS TABLE MAIN WRAPPER
    <section className="w-full tracking-[0.5px]">
      {/* TABLE */}
      {filterJobs.length <= 0 ? (
        <div className="flex items-center">
          <span className="text-gray-500 bg-gray-100 px-[1rem] py-[0.5rem] rounded-lg flex items-center gap-[0.5rem] font-medium">
            {searchJobByText !== "" && filterJobs.length <= 0 ? (
              <>
                <X /> No Jobs With the Title or Company Name -{" "}
                <span className="text-color-DB font-[600] text-[1.2rem] capitalize">
                  {searchJobByText}
                </span>
              </>
            ) : (
              <>
                <X /> No Jobs Created Currently
              </>
            )}
          </span>
        </div>
      ) : (
        <Table>
          {/* TABLE HEADER */}
          <TableHeader>
            <TableRow className="text-sm md:text-[1.1rem] text-gray-600">
              <TableHead className="text-gray-600">Company</TableHead>
              <TableHead className="text-gray-600">Role</TableHead>
              <TableHead className="text-gray-600">Date</TableHead>
              <TableHead className="text-gray-600 text-right">Action</TableHead>
            </TableRow>
          </TableHeader>
          {/* TABLE BODY */}
          <TableBody>
            {filterJobs?.map((job) => (
              <TableRow
                key={job._id}
                className="md:text-[1.1rem] text-sm text-gray-500"
              >
                <TableCell className="py-[1rem]">
                  <Avatar className="w-[54px] h-[54px] rounded-none">
                    <AvatarImage
                      title={job?.company?.name}
                      src={job?.company?.logo}
                      alt="Logo"
                      className="w-[54px] h-[54px]"
                    />
                  </Avatar>
                </TableCell>
                <TableCell className="py-[1rem] cursor-pointer">
                  <Link to={`/admin/jobs/${job._id}/detail`}>{job?.title}</Link>
                </TableCell>
                <TableCell className="py-[1rem]">
                  {job?.createdAt.split("T")[0]}
                </TableCell>
                <TableCell className="text-right py-[1rem]">
                  <div className="flex items-center gap-[0.5rem] justify-end text-color-DB">
                    <Link
                      to={`/admin/jobs/${job._id}`}
                      state={{ job: job }}
                      title="Edit"
                      className="bg-gray-200 px-[1rem] py-[0.5rem] rounded-md cursor-pointer"
                    >
                      <Edit2 />
                    </Link>
                    <Link
                      to={`/admin/jobs/${job._id}/applicants`}
                      title="Applicants"
                      className="bg-gray-200 px-[1rem] py-[0.5rem] rounded-md cursor-pointer"
                    >
                      <Users2 />
                    </Link>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      )}
    </section>
  );
};

export default AdminJobsTable;
