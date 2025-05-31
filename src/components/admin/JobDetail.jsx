// <= IMPORTS =>
import axios from "axios";
import Swal from "sweetalert2";
import { toast } from "sonner";
import Navbar from "../shared/Navbar";
import { Button } from "../ui/button";
import { useEffect, useState } from "react";
import { setLoading } from "@/redux/authSlice";
import { setSingleJob } from "@/redux/jobSlice";
import { Avatar, AvatarImage } from "../ui/avatar";
import { JOB_API_ENDPOINT } from "@/utils/constants";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate, useParams } from "react-router-dom";
import {
  ArrowRightCircleIcon,
  Check,
  Edit2,
  Loader2,
  SendHorizontalIcon,
  Trash2,
  User2,
} from "lucide-react";

const JobDetail = () => {
  // NAVIGATION
  const navigate = useNavigate();
  // DISPATCH
  const dispatch = useDispatch();
  // RETRIEVING JOB ID FROM URL PARAMS
  const params = useParams();
  const jobId = params.id;
  // GETTING SINGLE JOB FROM JOB SLICE
  const { singleJob } = useSelector((store) => store.job);
  // GETTING LOADING STATE FROM AUTH SLICE
  const { loading } = useSelector((store) => store.auth);
  // HIRED STATE MANAGEMENT
  const [hired, setHired] = useState(singleJob?.hired || false);
  // UI UPDATE MANAGEMENT
  useEffect(() => {
    dispatch(setSingleJob(null));
    // LOADING STATE
    dispatch(setLoading(true));
    // FETCHING SINGLE JOB FROM THE API
    const fetchSingleJob = async () => {
      try {
        // MAKING REQUEST
        const response = await axios.get(`${JOB_API_ENDPOINT}/get/${jobId}`, {
          withCredentials: true,
        });
        if (response.data.success) {
          // SAVING SINGLE JOB IN THE JOB SLICE
          dispatch(setSingleJob(response.data.job));
          // UPDATING HIRED STATE
          setHired(response.data.job.hired);
        }
      } catch (error) {
        console.log(error);
      } finally {
        // LOADING STATE
        dispatch(setLoading(false));
      }
    };
    fetchSingleJob();
  }, [dispatch, jobId]);
  // JOB HIRED HANDLER
  const markHiredHandler = async () => {
    try {
      // LOADING STATE
      dispatch(setLoading(true));
      // MAKING REQUEST
      const response = await axios.patch(
        `${JOB_API_ENDPOINT}/updateHireStatus/${jobId}`,
        { hired: true },
        { withCredentials: true }
      );
      // IF RESPONSE SUCCESS
      if (response.data.success) {
        // TOASTING SUCCESS MESSAGE
        toast.success(response.data.message);
        // UPDATING LOCAL HIRE STATE
        setHired(true);
        // UPDATING THE SINGLE JOB IN THE JOB SLICE
        dispatch(setSingleJob(response.data.updatedJob));
      }
    } catch (error) {
      console.log(error);
      // TOASTING ERROR MESSAGE
      toast.error(error.response.data.message || "Something went wrong!");
    } finally {
      // LOADING STATE
      dispatch(setLoading(false));
    }
  };
  // JOB OPEN HANDLER
  const markOpenHandler = async () => {
    try {
      // LOADING STATE
      dispatch(setLoading(true));
      // MAKING REQUEST
      const response = await axios.patch(
        `${JOB_API_ENDPOINT}/updateHireStatus/${jobId}`,
        { hired: false },
        { withCredentials: true }
      );
      // IF RESPONSE SUCCESS
      if (response.data.success) {
        // TOASTING SUCCESS MESSAGE
        toast.success(response.data.message);
        // UPDATING LOCAL HIRE STATE
        setHired(false);
        // UPDATING THE SINGLE JOB IN THE JOB SLICE
        dispatch(setSingleJob(response.data.updatedJob));
      }
    } catch (error) {
      console.log(error);
      // TOASTING ERROR MESSAGE
      toast.error(error.response.data.message || "Something went wrong!");
    } finally {
      // LOADING STATE
      dispatch(setLoading(false));
    }
  };
  // JOB DELETE HANDLER
  const deleteJobHandler = async () => {
    // CONFIRMATION DIALOG BEFORE DELETING JOB
    const result = await Swal.fire({
      title: "Are you sure ?",
      text: "This action will delete this Job Permanently",
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
        `${JOB_API_ENDPOINT}/delete/${jobId}`,
        { withCredentials: true }
      );
      // IF RESPONSE SUCCESS
      if (response.data.success) {
        // TOASTING SUCCESS MESSAGE
        toast.success(response.data.message);
        // NAVIGATING TO ADMIN JOBS
        navigate("/admin/jobs");
      }
    } catch (error) {
      console.log(error);
    } finally {
      // LOADING STATE
      dispatch(setLoading(false));
    }
  };
  // IF LOADING
  if (loading) {
    return (
      <>
        <Navbar />
        <div className="flex items-center justify-center h-[87vh]">
          <Loader2 className="animate-spin w-12 h-12 text-color-DB" />
        </div>
      </>
    );
  }
  return (
    <>
      <Navbar />
      {/* JOB DETAIL MAIN WRAPPER */}
      <section className="w-full flex items-center justify-center sm:px-[2rem] px-[1rem] py-[2rem]">
        {/* JOB DETAIL CONTENT WRAPPER */}
        <section className="flex flex-col gap-[2rem] w-full border-2 border-gray-100 rounded-xl sm:p-[2rem] p-[1rem] tracking-[0.5px]">
          {/* APPLICANTS COUNTER & POSTED DATE */}
          <div className="w-full flex items-center justify-between flex-wrap-reverse gap-[1rem]">
            <div className="flex items-center gap-[0.5rem] px-[1rem] py-[0.5rem] rounded-lg bg-gray-100 text-gray-500 text-sm">
              <SendHorizontalIcon size={20} />
              <span>
                Posted On:{" "}
                <span className="text-gray-500">
                  {singleJob?.createdAt.split("T")[0]}
                </span>
              </span>
            </div>
            <div
              onClick={() =>
                navigate(`/admin/jobs/${singleJob._id}/applicants`)
              }
              className="flex cursor-pointer items-center gap-[0.5rem] px-[1rem] py-[0.5rem] rounded-lg bg-gray-100 text-gray-500 text-sm hover:bg-gray-200"
            >
              <User2 size={20} />
              <span>
                Total Applicants:{" "}
                <span className="text-gray-500">
                  {singleJob?.applications?.length}
                </span>
              </span>
            </div>
          </div>
          {/* HIRED & LOADING BUTTON */}
          <div className="w-full flex items-center justify-end">
            {loading ? (
              <Button className="bg-color-DB hover:bg-color-LB font-medium text-[1rem] focus:outline-none outline-none border-none">
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Updating
              </Button>
            ) : (
              // HIRED UNCHECK BUTTON
              <div className="flex items-center gap-[1rem]">
                {hired && (
                  <Button
                    onClick={markOpenHandler}
                    className="bg-color-DB hover:bg-color-LB font-medium text-[1rem] focus:outline-none outline-none border-none"
                  >
                    <Check /> Mark Open
                  </Button>
                )}
                <Button
                  onClick={markHiredHandler}
                  disabled={hired}
                  className="bg-color-DB hover:bg-color-LB font-medium text-[1rem] focus:outline-none outline-none border-none"
                >
                  <Check /> {hired ? "Marked Hired" : "Mark Hired"}
                </Button>
              </div>
            )}
          </div>
          {/* COMPANY INFORMATION */}
          <div className="w-full flex items-center gap-[2rem]">
            <button>
              <Avatar className="w-[100px] h-[100px] rounded-none">
                <AvatarImage
                  src={singleJob?.company?.logo}
                  alt="Logo"
                  className="w-[100px] h-[100px]"
                />
              </Avatar>
            </button>
            <div>
              <h1 className="font-[500] text-[2.5rem] text-gray-600">
                {singleJob?.company?.name}
              </h1>
              <p className="text-gray-500 font-medium text-sm">
                {singleJob?.location}
              </p>
            </div>
          </div>
          {/* JOB TITLE */}
          <div className="w-full flex flex-col items-start justify-center gap-[0.5rem]">
            <h1 className="font-[500] text-gray-600 text-[2rem]">Title</h1>
            <h4 className="text-gray-500 font-medium text-[1.5rem]">
              {singleJob?.title}
            </h4>
          </div>
          {/* JOB DESCRIPTION */}
          <div className="w-full flex flex-col items-start justify-center gap-[0.5rem]">
            <h1 className="font-[500] text-gray-600 text-[2rem]">
              Description
            </h1>
            <p className="text-gray-500 font-medium text-[1rem]">
              {singleJob?.description}
            </p>
          </div>
          {/* JOB DETAILS */}
          <div className="w-full flex flex-col items-start justify-center gap-[0.5rem]">
            <h1 className="font-[500] text-gray-600 text-[2rem]">Details</h1>
            <div className="flex flex-wrap gap-[1rem]">
              <div className="px-[1rem] py-[0.5rem] bg-color-LB text-white rounded-full">
                {singleJob?.position === 1
                  ? "1 Position"
                  : `${singleJob?.position} Positions`}
              </div>
              <div className="px-[1rem] py-[0.5rem] bg-color-DB text-white rounded-full">
                {singleJob?.jobType}
              </div>
              <div className="px-[1rem] py-[0.5rem] bg-color-MAIN text-white rounded-full">
                {singleJob?.salary} LPA
              </div>
              <div className="px-[1rem] py-[0.5rem] bg-color-MAIN text-white rounded-full">
                {singleJob?.experienceLevel} + Years Experience
              </div>
            </div>
          </div>
          {/* JOB REQUIREMENTS */}
          <div className="w-full flex flex-col items-start justify-center gap-[0.5rem]">
            <h1 className="font-[500] text-gray-600 text-[2rem]">
              Requirements
            </h1>
            <div className="text-gray-500 font-medium">
              <div className="flex flex-col items-start justify-center gap-[1rem]">
                {singleJob?.requirements.map((item) => (
                  <span
                    className="flex items-center gap-[0.5rem] text-[1.35rem]"
                    key={item.id}
                  >
                    <ArrowRightCircleIcon size={25} className="text-color-DB" />{" "}
                    {item}
                  </span>
                ))}
              </div>
            </div>
          </div>
          {/* DELETE JOB & LOADING BUTTON */}
          <div className="w-full flex items-center justify-end">
            <div className="flex items-center gap-[1rem]">
              <Link to={`/admin/jobs/${jobId}`} state={{ job: singleJob }}>
                <Button
                  className={`bg-color-DB hover:bg-color-LB border-none outline-none focus:outline-none`}
                >
                  <Edit2 /> Edit Job
                </Button>
              </Link>
              <div>
                {loading ? (
                  <Button
                    type="submit"
                    className={`bg-color-DB hover:bg-color-LB border-none outline-none focus:outline-none`}
                  >
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Deleting Job
                  </Button>
                ) : (
                  <Button
                    onClick={deleteJobHandler}
                    className={`bg-color-DB hover:bg-color-LB border-none outline-none focus:outline-none`}
                  >
                    <Trash2 /> Delete Job
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

export default JobDetail;
