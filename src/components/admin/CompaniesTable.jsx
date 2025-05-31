// <= IMPORTS =>
import { useEffect, useState } from "react";
import { Avatar, AvatarImage } from "../ui/avatar";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../ui/table";
import { Edit2, X } from "lucide-react";
import { useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import useGetAllAdminCompanies from "@/hooks/useGetAllAdminCompanies";

const CompaniesTable = () => {
  // USING GET ALL ADMIN COMPANIES HOOK
  useGetAllAdminCompanies();
  // NAVIGATION
  const navigate = useNavigate();
  // GETTING ALL COMPANIES & FILTER COMPANY STATE FROM COMPANY SLICE
  const { allAdminCompanies, searchCompanyByText } = useSelector(
    (store) => store.company
  );
  // FILTER COMPANIES STATE
  const [filterCompanies, setFilterCompanies] = useState(allAdminCompanies);
  // FILTER HANDLING
  useEffect(() => {
    // IF ADMIN COMPANIES ARE PRESENT
    if (allAdminCompanies && allAdminCompanies.length > 0) {
      // FILTERING ADMIN COMPANIES ARRAY TO SEARCH FOR NAME
      const filteredCompanies = allAdminCompanies.filter((company) => {
        // IF THERE IS NO SEARCH TEXT THEN RETURNING
        if (!searchCompanyByText) {
          return true;
        }
        // IF MATCHES THEN RETURNING THE COMPANY BY CHECKING THE NAME IN LOWERCASE
        return company?.name
          ?.toLowerCase()
          .includes(searchCompanyByText.toLowerCase());
      });
      // SETTING FILTERED COMPANIES
      setFilterCompanies(filteredCompanies);
    } else {
      // IF THERE ARE NO ADMIN COMPANIES
      setFilterCompanies([]);
    }
  }, [allAdminCompanies, searchCompanyByText]);
  return (
    // COMPANIES TABLE MAIN WRAPPER
    <section className="w-full tracking-[0.5px]">
      {/* TABLE */}
      {filterCompanies.length <= 0 ? (
        <div className="flex items-center">
          <span className="text-gray-500 bg-gray-100 px-[1rem] py-[0.5rem] rounded-lg flex items-center gap-[0.5rem] font-medium">
            {searchCompanyByText !== "" && filterCompanies.length <= 0 ? (
              <>
                <X /> No Companies With the Name -{" "}
                <span className="text-color-DB font-[600] text-[1.2rem] capitalize">
                  {searchCompanyByText}
                </span>
              </>
            ) : (
              <>
                <X /> No Companies Registered Currently
              </>
            )}
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
            {filterCompanies?.map((company) => (
              <TableRow
                key={company._id}
                className="md:text-[1.1rem] text-sm text-gray-500"
              >
                <TableCell className="py-[1rem]">
                  <Link
                    to={`/admin/companies/${company._id}/detail`}
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
                    <span
                      title="Edit"
                      onClick={() =>
                        navigate(`/admin/companies/${company._id}`)
                      }
                      className="bg-gray-200 px-[1rem] py-[0.5rem] rounded-md cursor-pointer"
                    >
                      <Edit2 />
                    </span>
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

export default CompaniesTable;
