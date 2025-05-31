// <= IMPORTS =>
import { Link, useLocation, useNavigate } from "react-router-dom";
import Navbar from "../shared/Navbar";
import { useDispatch, useSelector } from "react-redux";
import {
  Edit,
  Edit2,
  Globe,
  Loader2,
  SendHorizontalIcon,
  Trash2,
  User2,
} from "lucide-react";
import { Button } from "../ui/button";
import { Avatar, AvatarImage } from "../ui/avatar";
import Swal from "sweetalert2";
import axios from "axios";
import { COMPANY_API_ENDPOINT } from "@/utils/constants";
import { toast } from "sonner";
import { setLoading } from "@/redux/authSlice";

const CompanyDetail = () => {
  // NAVIGATION
  const navigate = useNavigate();
  // DISPATCH
  const dispatch = useDispatch();
  // LOCATION
  const location = useLocation();
  // COMPANY STATE FROM LOCATION
  const { company } = location.state || {};
  // GETTING LOADING STATE FROM AUTH SLICE
  const { loading } = useSelector((store) => store.auth);
  // GETTING ALL JOBS FROM JOB SLICE
  const { allAdminJobs } = useSelector((store) => store.job);
  // FILTERING JOBS FOR THE SELECTED COMPANY (LENGTH)
  const companyJobsLength = allAdminJobs.filter(
    (job) => job.company._id === company._id
  ).length;
  //
  // FILTERING JOBS FOR THE SELECTED COMPANY (ARRAY)
  const companyJobs = allAdminJobs.filter(
    (job) => job.company._id === company._id
  );
  // DELETE COMPANY HANDLER
  const deleteCompanyHandler = async () => {
    // CONFIRMATION DIALOG BEFORE DELETING COMPANY
    const result = await Swal.fire({
      title: "Are you sure ?",
      text: "This action will delete this Company Permanently",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#cc9675",
      cancelButtonColor: "#365e7d",
      confirmButtonText: "Yes Delete !",
      customClass: {
        container: "my-swal-container",
      },
    });
    // IF THE USER CANCELS, RETURNING
    if (!result.isConfirmed) return;
    // IF CONFIRMED
    try {
      // LOADING STATE
      dispatch(setLoading(true));
      // MAKING REQUEST
      const response = await axios.delete(
        `${COMPANY_API_ENDPOINT}/delete/${company._id}`,
        { withCredentials: true }
      );
      // IF RESPONSE SUCCESS
      if (response.data.success) {
        // TOASTING SUCCESS MESSAGE
        toast.success(response.data.message);
        // NAVIGATING TO ADMIN COMPANIES
        navigate("/admin/companies");
      }
    } catch (error) {
      console.log(error);
      // TOASTING ERROR MESSAGE
      toast.error(error.response.data.message);
    } finally {
      // LOADING STATE
      dispatch(setLoading(false));
    }
  };
  return (
    <>
      <Navbar />
      {/* COMPANY DETAIL MAIN WRAPPER */}
      <section className="w-full flex items-center justify-center sm:px-[2rem] px-[1rem] py-[2rem]">
        {/* COMPANY DETAIL CONTENT WRAPPER */}
        <section className="flex flex-col gap-[2rem] w-full border-2 border-gray-100 rounded-xl sm:p-[2rem] p-[1rem] tracking-[0.5px]">
          {/* JOB COUNTER & CREATED DATE */}
          <div className="w-full flex items-center justify-between flex-wrap-reverse gap-[1rem]">
            <div className="flex items-center gap-[0.5rem] px-[1rem] py-[0.5rem] rounded-lg bg-gray-100 text-gray-500 text-sm">
              <SendHorizontalIcon size={20} />
              <span>
                Created On:{" "}
                <span className="text-gray-500">
                  {company?.createdAt.split("T")[0]}
                </span>
              </span>
            </div>
            <Link
              to={`/admin/company/${company._id}/jobs`}
              state={{ companyJobs: companyJobs, company: company }}
              className="flex cursor-pointer items-center gap-[0.5rem] px-[1rem] py-[0.5rem] rounded-lg bg-gray-100 text-gray-500 text-sm hover:bg-gray-200"
            >
              <User2 size={20} />
              <span>
                Total Jobs:{" "}
                <span className="text-gray-500">{companyJobsLength}</span>
              </span>
            </Link>
          </div>
          {/* EDIT BUTTON */}
          <div className="w-full flex items-center justify-end">
            <Button
              onClick={() => navigate(`/admin/companies/${company._id}`)}
              className={`bg-color-DB hover:bg-color-LB border-none outline-none focus:outline-none`}
            >
              <Edit /> Edit Company
            </Button>
          </div>
          {/* COMPANY INFORMATION */}
          <div className="w-full flex items-center gap-[2rem]">
            <Avatar className="w-[100px] h-[100px] rounded-none">
              <AvatarImage
                src={company?.logo}
                alt="Logo"
                className="w-[100px] h-[100px]"
              />
            </Avatar>
            <div>
              <h1 className="font-[500] text-[2.5rem] text-gray-600">
                {company?.name}
              </h1>
              <p className="text-gray-500 font-medium text-sm">
                {company?.location}
              </p>
            </div>
          </div>
          {/* COMPANY DESCRIPTION */}
          <div className="w-full flex flex-col items-start justify-center gap-[0.5rem]">
            <h1 className="font-[500] text-gray-600 text-[2rem]">
              Description
            </h1>
            <p className="text-gray-500 font-medium text-[1rem]">
              {company?.description}
            </p>
          </div>
          {/* COMPANY WEBSITE */}
          <div className="w-full flex flex-col items-start justify-center gap-[0.5rem]">
            <h1 className="font-[500] text-gray-600 text-[2rem]">Website</h1>
            <a
              className="flex cursor-pointer items-center gap-[0.5rem] px-[1rem] py-[0.5rem] rounded-lg bg-gray-100 text-color-DB"
              target="_blank"
              href={company?.website}
            >
              <Globe /> {company?.website}
            </a>
          </div>
          {/* DELETE COMPANY & LOADING BUTTON */}
          <div className="w-full flex items-center justify-end">
            <div className="flex items-center gap-[1rem]">
              <Link
                to={`/admin/companies/${company._id}`}
                state={{ company: company }}
              >
                <Button
                  className={`bg-color-DB hover:bg-color-LB border-none outline-none focus:outline-none`}
                >
                  <Edit2 /> Edit Company
                </Button>
              </Link>
              <div>
                {loading ? (
                  <Button
                    type="submit"
                    className={`bg-color-DB hover:bg-color-LB border-none outline-none focus:outline-none`}
                  >
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Deleting Company
                  </Button>
                ) : (
                  <Button
                    onClick={deleteCompanyHandler}
                    className={`bg-color-DB hover:bg-color-LB border-none outline-none focus:outline-none`}
                  >
                    <Trash2 /> Delete Company
                  </Button>
                )}
              </div>
            </div>
          </div>
        </section>
      </section>
    </>
  );
};

export default CompanyDetail;
