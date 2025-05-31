// <= IMPORTS =>
import { Link, useLocation, useNavigate } from "react-router-dom";
import Navbar from "./shared/Navbar";
import { Briefcase, Edit2, Users2, X } from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "./ui/table";
import { Avatar, AvatarImage } from "./ui/avatar";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setSearchJobByText } from "@/redux/jobSlice";

const CompanyJobs = () => {
  // NAVIGATION
  const navigate = useNavigate();
  // DISPATCH
  const dispatch = useDispatch();
  // LOCATION
  const location = useLocation();
  // COMPANY STATE FROM LOCATION
  const { companyJobs, company } = location.state || {};
  // INPUT STATE MANAGEMENT
  const [input, setInput] = useState("");
  // FILTERING JOBS
  useEffect(() => {
    dispatch(setSearchJobByText(input));
  }, [input, dispatch]);
  // GETTING SEARCH JOB BY TEXT STATE FROM JOB SLICE
  const { searchJobByText } = useSelector((store) => store.job);
  // FILTER JOBS STATE
  const [filterJobs, setFilterJobs] = useState(companyJobs);
  // FILTER HANDLING
  useEffect(() => {
    // FETCHING FILTERED JOBS
    const filteredJobs =
      // IF JOBS EXISTS
      companyJobs.length &&
      // IF SEARCH TEXT DOESN'T MATCH ANY COMPANY THEN RETURNING
      companyJobs.filter((job) => {
        if (!searchJobByText) {
          return true;
        }
        // IF MATCHES THEN RETURNING THE COMPANY BY CONVERTING THE NAME TO LOWERCASE
        return job?.title
          ?.toLowerCase()
          .includes(searchJobByText.toLowerCase());
      });
    // SETTING FILTERED JOBS
    setFilterJobs(filteredJobs);
  }, [companyJobs, searchJobByText]);
  return (
    <>
      <Navbar />
      {/* JOBS FOR COMPANY MAIN WRAPPER */}
      <section className="w-full flex items-center justify-center sm:px-[2rem] px-[1rem] py-[2rem]">
        {/* JOBS FOR COMPANY CONTENT WRAPPER */}
        <section className="flex flex-col gap-[2rem] w-full border-2 border-gray-100 rounded-xl sm:p-[2rem] p-[1rem] tracking-[0.5px]">
          {/* HEADING */}
          <div className="w-full flex items-center justify-between flex-wrap-reverse gap-[2rem]">
            <div className="flex items-center gap-[1rem] text-[2rem]">
              <Briefcase className="text-color-DB w-[3rem] h-[3rem]" />
              <h1 className="font-[600] text-gray-500">
                Jobs For{" "}
                <span className="underline underline-offset-4">
                  {company?.name}
                </span>
              </h1>
              <span className="px-4 py-1 bg-gray-100 rounded-xl text-color-MAIN">
                {companyJobs?.length}
              </span>
            </div>
          </div>
          {/* SEARCH JOBS */}
          <div>
            <input
              type="text"
              className="w-full px-[1rem] py-[0.5rem] outline-none border-2 border-gray-100 rounded-md text-gray-500"
              placeholder="Search Jobs By Role"
              onChange={(e) => setInput(e.target.value)}
            />
          </div>
          {/* JOBS TABLE */}
          <section className="w-full tracking-[0.5px]">
            {/* TABLE */}
            {companyJobs.length <= 0 ? (
              <div className="flex items-center">
                <span className="text-gray-500 bg-gray-100 px-[1rem] py-[0.5rem] rounded-lg flex items-center gap-[0.5rem] font-medium">
                  <X /> No Jobs For {company.name}
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
                    <TableHead className="text-gray-600 text-right">
                      Action
                    </TableHead>
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
                        <Link to={`/jobs/description/${job._id}`}>
                          {job?.title}
                        </Link>
                      </TableCell>
                      <TableCell className="py-[1rem]">
                        {job?.createdAt.split("T")[0]}
                      </TableCell>
                      <TableCell className="text-right py-[1rem]">
                        <div className="flex items-center gap-[0.5rem] justify-end text-color-DB">
                          <span
                            title="Edit"
                            onClick={() =>
                              navigate(`/admin/companies/${job._id}`)
                            }
                            className="bg-gray-200 px-[1rem] py-[0.5rem] rounded-md cursor-pointer"
                          >
                            <Edit2 />
                          </span>
                          <span
                            title="Applicants"
                            onClick={() =>
                              navigate(`/admin/jobs/${job._id}/applicants`)
                            }
                            className="bg-gray-200 px-[1rem] py-[0.5rem] rounded-md cursor-pointer"
                          >
                            <Users2 />
                          </span>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </section>
        </section>
      </section>
    </>
  );
};

export default CompanyJobs;
