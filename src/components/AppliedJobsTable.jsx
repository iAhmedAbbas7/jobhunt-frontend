// <= IMPORTS =>
import { useSelector } from "react-redux";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "./ui/table";
import { Avatar, AvatarImage } from "./ui/avatar";
import { X } from "lucide-react";
import { Link } from "react-router-dom";

const AppliedJobsTable = () => {
  // GETTING ALL APPLIED JOBS FROM THE JOB SLICE
  const { allAppliedJobs } = useSelector((store) => store.job);
  return (
    // APPLIED JOBS TABLE MAIN WRAPPER
    <div className="w-full">
      {/* TABLE */}
      {allAppliedJobs.length <= 0 ? (
        <div className="flex items-center">
          <span className="text-gray-500 bg-gray-100 px-[1rem] py-[0.5rem] rounded-lg flex items-center gap-[0.5rem] font-medium">
            <X /> No Applied Jobs
          </span>
        </div>
      ) : (
        <Table>
          {/* TABLE HEADER */}
          <TableHeader>
            <TableRow className="text-sm md:text-[1.1rem] text-gray-600">
              <TableHead className="text-gray-600">Date</TableHead>
              <TableHead className="text-gray-600">Title</TableHead>
              <TableHead className="text-gray-600">Company</TableHead>
              <TableHead className="text-gray-600 text-right">Status</TableHead>
            </TableRow>
          </TableHeader>
          {/* TABLE BODY */}
          <TableBody>
            {allAppliedJobs.map((appliedJob) => (
              <TableRow
                key={appliedJob._id}
                className="md:text-[1.1rem] text-sm text-gray-500"
              >
                <TableCell className="py-[1rem]">
                  {appliedJob?.createdAt.split("T")[0]}
                </TableCell>
                <TableCell className="py-[1rem]">
                  <Link to={`/jobs/description/${appliedJob?.job?._id}`}>
                    {appliedJob?.job?.title}
                  </Link>
                </TableCell>
                <TableCell className="py-[1rem]">
                  <Link
                    to={`/companies/description/${appliedJob?.job?.company?._id}`}
                    state={{ company: appliedJob?.job?.company }}
                  >
                    <Avatar className="w-[54px] h-[54px] rounded-none">
                      <AvatarImage
                        src={appliedJob?.job?.company?.logo}
                        alt="Logo"
                        title={appliedJob?.job?.company?.name}
                        className="w-[54px] h-[54px]"
                      />
                    </Avatar>
                  </Link>
                </TableCell>
                <TableCell className="text-right py-[1rem]">
                  <span
                    className={`text-white text-sm uppercase px-[1rem] py-[0.5rem] rounded-full ${
                      appliedJob?.status === "ACCEPTED"
                        ? "bg-green-300"
                        : appliedJob?.status === "REJECTED"
                        ? "bg-red-300"
                        : "bg-gray-200"
                    } min-w-fit`}
                  >
                    {appliedJob?.status}
                  </span>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      )}
    </div>
  );
};

export default AppliedJobsTable;
