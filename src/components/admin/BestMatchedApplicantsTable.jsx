// <= IMPORTS =>
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../ui/table";
import { X } from "lucide-react";
import { useSelector } from "react-redux";
import { useEffect, useMemo, useState } from "react";

const BestMatchedApplicantsTable = ({ matchedApplicants }) => {
  // DESTRUCTURING APPLICANTS FROM PROPS (MEMOIZING TO COMPUTE ONLY WHEN JOB DATA CHANGES)
  const applicantsArray = useMemo(() => {
    return matchedApplicants || [];
  }, [matchedApplicants]);
  // GETTING SEARCH APPLICANTS BY NAME FROM FROM APPLICATION SLICE
  const { searchApplicantsByName } = useSelector((store) => store.application);
  // FILTER APPLICANTS STATE
  const [filterApplicants, setFilterApplicants] = useState(applicantsArray);
  // FILTER HANDLING
  useEffect(() => {
    // IF APPLICANTS ARE PRESENT IN APPLICATIONS ARRAY
    if (applicantsArray && applicantsArray.length > 0) {
      // FILTERING APPLICATIONS ARRAY TO SEARCH FOR NAME
      const filteredApplicants = applicantsArray?.filter((app) => {
        // IF THERE IS NO SEARCH TEXT THEN RETURNING
        if (!searchApplicantsByName) {
          return true;
        }
        // IF MATCHES THEN RETURNING THE APPLICANT BY CHECKING THE NAME IN LOWERCASE
        return (
          app?.applicant?.fullName
            ?.toLowerCase()
            .includes(searchApplicantsByName.toLowerCase()) ||
          app?.applicant?.email?.toLowerCase().includes(searchApplicantsByName)
        );
      });
      // SETTING FILTERED APPLICANTS
      setFilterApplicants(filteredApplicants);
    } else {
      // IF THERE ARE NO APPLICANTS
      setFilterApplicants([]);
    }
  }, [applicantsArray, searchApplicantsByName]);
  // COMPUTING SCORE
  const computedRows = useMemo(() => {
    return filterApplicants.map((app) => {
      // APPLICANTS SCORE
      const score = app.matchingScore || 0;
      // JOB REQUIREMENTS COUNT
      const total = app.jobRequirementsCount || 1;
      // PERCENTAGE
      const percentage = (score / total) * 100;
      // DETERMINING CLASSES BASED ON PERCENTAGE SCORE
      let rowClass;
      if (percentage <= 20) {
        rowClass = "bg-gray-200 hover:bg-gray-200";
      } else if (percentage <= 40) {
        rowClass = "bg-yellow-200 hover:bg-yellow-200";
      } else if (percentage <= 60) {
        rowClass = "bg-blue-200 hover:bg-blue-200";
      } else if (percentage <= 80) {
        rowClass = "bg-red-200 hover:bg-red-200";
      } else {
        rowClass = "bg-green-200 hover:bg-green-200";
      }
      return {
        ...app,
        computedPercentage: percentage.toFixed(0),
        rowClass,
      };
    });
  }, [filterApplicants]);
  return (
    <section className="w-full tracking-[0.5px] flex flex-col gap-[1rem]">
      {/* TABLE */}
      {filterApplicants.length <= 0 ? (
        <div className="flex items-center">
          <span className="text-gray-500 bg-gray-100 px-[1rem] py-[0.5rem] rounded-lg flex items-center gap-[0.5rem] font-medium">
            {searchApplicantsByName !== "" && filterApplicants.length <= 0 ? (
              <>
                <X /> No Applicants With the Name or Email -{" "}
                <span className="text-color-DB font-[600] text-[1.2rem] capitalize">
                  {searchApplicantsByName}
                </span>
              </>
            ) : (
              <>
                <X /> No Applicants at this Time
              </>
            )}
          </span>
        </div>
      ) : (
        <Table className="border-separate border-spacing-y-2">
          {/* TABLE HEADER */}
          <TableHeader className="hover:bg-gray-100 bg-gray-100">
            <TableRow className="text-sm md:text-[1.1rem] text-gray-600">
              <TableHead className="text-gray-600 font-[600] rounded-tl-lg rounded-bl-lg">
                Name
              </TableHead>
              <TableHead className="text-gray-600 font-[600]">Email</TableHead>
              <TableHead className="text-gray-600 font-[600] text-right rounded-tr-lg rounded-br-lg">
                Score
              </TableHead>
            </TableRow>
          </TableHeader>
          {/* TABLE BODY */}
          <TableBody>
            {computedRows?.map((app) => (
              <TableRow
                key={app._id}
                className={`md:text-[1.1rem] text-sm text-gray-500 ${app.rowClass}`}
              >
                <TableCell className="py-[1rem] rounded-tl-lg rounded-bl-lg">
                  {app?.applicant?.fullName}
                </TableCell>
                <TableCell className="py-[1rem]">
                  {app?.applicant?.email}
                </TableCell>
                <TableCell className="py-[1rem] text-right rounded-tr-lg rounded-br-lg">
                  <span className="px-[1rem] py-[0.5rem] rounded-md font-bold bg-white text-gray-600">
                    {app?.matchingScore} / {app?.jobRequirementsCount}
                  </span>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      )}
    </section>
  );
};

export default BestMatchedApplicantsTable;
