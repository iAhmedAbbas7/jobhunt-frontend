// <= IMPORTS =>
import { Link } from "react-router-dom";
import { useSelector } from "react-redux";
import { Briefcase, X } from "lucide-react";
import { useEffect, useState } from "react";
import { Avatar, AvatarImage } from "../components/ui/avatar";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../components/ui/table";

const AllCompaniesTable = () => {
  // GETTING ALL COMPANIES & FILTER COMPANY STATE FROM COMPANY SLICE
  const { allCompanies, searchCompanyByText } = useSelector(
    (store) => store.company
  );
  // FILTER COMPANIES STATE
  const [filterCompanies, setFilterCompanies] = useState(allCompanies);
  const { allJobs } = useSelector((store) => store.job);
  // FILTER HANDLING
  useEffect(() => {
    // FETCHING FILTERED COMPANIES
    const filteredCompanies =
      // IF COMPANIES EXISTS
      allCompanies.length &&
      // IF SEARCH TEXT DOESN'T MATCH ANY COMPANY THEN RETURNING
      allCompanies.filter((company) => {
        if (!searchCompanyByText) {
          return true;
        }
        // IF MATCHES THEN RETURNING THE COMPANY BY CONVERTING THE NAME TO LOWERCASE
        return company?.name
          ?.toLowerCase()
          .includes(searchCompanyByText.toLowerCase());
      });
    // SETTING FILTERED COMPANIES
    setFilterCompanies(filteredCompanies);
  }, [allCompanies, searchCompanyByText]);
  return (
    // COMPANIES TABLE MAIN WRAPPER
    <section className="w-full tracking-[0.5px]">
      {/* TABLE */}
      {allCompanies.length <= 0 ? (
        <div className="flex items-center">
          <span className="text-gray-500 bg-gray-100 px-[1rem] py-[0.5rem] rounded-lg flex items-center gap-[0.5rem] font-medium">
            <X /> No Companies Registered
          </span>
        </div>
      ) : (
        <Table>
          {/* TABLE HEADER */}
          <TableHeader>
            <TableRow className="text-sm md:text-[1.1rem] text-gray-600">
              <TableHead className="text-gray-600">Logo</TableHead>
              <TableHead className="text-gray-600">Name</TableHead>
              <TableHead className="text-gray-600">Date</TableHead>
              <TableHead className="text-gray-600 text-right">Action</TableHead>
            </TableRow>
          </TableHeader>
          {/* TABLE BODY */}
          <TableBody>
            {filterCompanies?.map((company) => {
              // COMPUTING COMPANY JOBS
              const companyJobs = allJobs.filter(
                (job) => job?.company?._id === company._id
              );
              return (
                <TableRow
                  key={company._id}
                  className="md:text-[1.1rem] text-sm text-gray-500"
                >
                  <TableCell className="py-[1rem]">
                    <Link
                      to={`/companies/description/${company._id}`}
                      state={{ company: company }}
                    >
                      <Avatar className="w-[54px] h-[54px] rounded-none">
                        <AvatarImage
                          src={company?.logo}
                          alt="Logo"
                          className="w-[54px] h-[54px]"
                        />
                      </Avatar>
                    </Link>
                  </TableCell>
                  <TableCell className="py-[1rem]">{company?.name}</TableCell>
                  <TableCell className="py-[1rem]">
                    {company?.createdAt.split("T")[0]}
                  </TableCell>
                  <TableCell className="text-right py-[1rem]">
                    <div className="flex items-center justify-end text-color-DB">
                      <Link
                        to={`/companies/${company._id}/jobs`}
                        state={{ company: company, companyJobs: companyJobs }}
                        title="View Jobs"
                        className="flex items-center  gap-[0.5rem] bg-gray-200 px-[1rem] py-[0.5rem] rounded-md cursor-pointer"
                      >
                        <Briefcase /> View Jobs
                      </Link>
                    </div>
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      )}
    </section>
  );
};

export default AllCompaniesTable;
