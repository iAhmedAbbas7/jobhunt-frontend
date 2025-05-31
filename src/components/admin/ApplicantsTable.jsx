// <= IMPORTS =>
import axios from "axios";
import { toast } from "sonner";
import { Button } from "../ui/button";
import { useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import useGetAllApplicants from "@/hooks/useGetAllApplicants";
import { updateApplicantStatus } from "@/redux/applicationSlice";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";
import { APPLICATION_API_ENDPOINT, CHAT_API_ENDPOINT } from "@/utils/constants";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../ui/table";
import {
  Check,
  MessageCircle,
  MoreHorizontal,
  StarsIcon,
  X,
} from "lucide-react";

const ApplicantsTable = () => {
  // RETRIEVING JOB ID FROM URL PARAMS
  const params = useParams();
  const jobId = params.id;
  // USING GET ALL APPLICANTS HOOK & PASSING JOB ID
  useGetAllApplicants(jobId);
  // NAVIGATION
  const navigate = useNavigate();
  // DISPATCH
  const dispatch = useDispatch();
  // GETTING JOB DATA FROM APPLICATION SLICE TO TO DESTRUCTURE APPLICATIONS
  const jobData = useSelector((store) => store.application.applicants);
  // DESTRUCTURING APPLICATION FROM JOB DATA (MEMOIZING TO COMPUTE ONLY WHEN JOB DATA CHANGES)
  const applicationsArray = useMemo(() => {
    return jobData?.applications || [];
  }, [jobData]);
  // GETTING SEARCH APPLICANTS BY NAME FROM  FROM APPLICATION SLICE
  const { searchApplicantsByName } = useSelector((store) => store.application);
  // FILTER APPLICANTS STATE
  const [filterApplicants, setFilterApplicants] = useState(applicationsArray);
  // FILTER HANDLING
  useEffect(() => {
    // IF APPLICANTS ARE PRESENT IN APPLICATIONS ARRAY
    if (applicationsArray && applicationsArray.length > 0) {
      // FILTERING APPLICATIONS ARRAY TO SEARCH FOR NAME
      const filteredApplicants = applicationsArray?.filter((application) => {
        // IF THERE IS NO SEARCH TEXT THEN RETURNING
        if (!searchApplicantsByName) {
          return true;
        }
        // IF MATCHES THEN RETURNING THE APPLICANT BY CHECKING THE NAME IN LOWERCASE
        return (
          application?.applicant?.fullName
            ?.toLowerCase()
            .includes(searchApplicantsByName.toLowerCase()) ||
          application?.applicant?.email
            ?.toLowerCase()
            .includes(searchApplicantsByName)
        );
      });
      // SETTING FILTERED APPLICANTS
      setFilterApplicants(filteredApplicants);
    } else {
      // IF THERE ARE NO APPLICANTS
      setFilterApplicants([]);
    }
  }, [applicationsArray, searchApplicantsByName]);
  // APPLICATION STATUS
  const applicationStatus = ["ACCEPTED", "REJECTED"];
  // APPLICATION STATUS HANDLER
  const applicationStatusHandler = async (status, id) => {
    try {
      const response = await axios.post(
        `${APPLICATION_API_ENDPOINT}/status/${id}/update`,
        { status },
        { withCredentials: true }
      );
      if (response.data.success) {
        toast.success(response.data.message);
        dispatch(updateApplicantStatus({ id, status }));
      }
    } catch (error) {
      console.log(error);
    }
  };
  // OPEN CHAT HANDLER
  const handleChat = async (jobId, otherUserId) => {
    try {
      // MAKING REQUEST
      const response = await axios.post(
        `${CHAT_API_ENDPOINT}/room`,
        { jobId, otherUserId: otherUserId },
        { withCredentials: true }
      );
      // IF RESPONSE SUCCESS
      if (response.data.success) {
        // NAVIGATING TO THE CHAT
        navigate(`/chat/room/${response.data.room._id}`);
      }
    } catch (error) {
      console.log("Unable to Open Chat!", error);
      // TOASTING ERROR MESSAGE
      toast.error("Unable to Open Chat!");
    }
  };
  return (
    // APPLICANTS TABLE MAIN WRAPPER
    <section className="w-full tracking-[0.5px] flex flex-col gap-[1rem]">
      {/* BEST MATCHED APPLICANTS */}
      {filterApplicants.length > 0 && (
        <Button
          onClick={() =>
            navigate(`/admin/jobs/${jobId}/bestMatchedApplicants`, {
              state: { jobId: jobId },
            })
          }
          className="w-fit bg-color-DB outline-none border-none focus:outline-none hover:bg-color-LB text-[1rem] font-medium"
        >
          <StarsIcon /> Matched Applicants
        </Button>
      )}
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
        <Table>
          {/* TABLE HEADER */}
          <TableHeader>
            <TableRow className="text-sm md:text-[1.1rem] text-gray-600">
              <TableHead className="text-gray-600">Name</TableHead>
              <TableHead className="text-gray-600">Email</TableHead>
              <TableHead className="text-gray-600">Contact</TableHead>
              <TableHead className="text-gray-600">Resume</TableHead>
              <TableHead className="text-gray-600">Date</TableHead>
              <TableHead className="text-gray-600 text-right">Action</TableHead>
            </TableRow>
          </TableHeader>
          {/* TABLE BODY */}
          <TableBody>
            {filterApplicants?.map((application) => (
              <TableRow
                key={application._id}
                className="md:text-[1.1rem] text-sm text-gray-500"
              >
                <TableCell className="py-[1rem]">
                  {application?.applicant?.fullName}
                </TableCell>
                <TableCell className="py-[1rem]">
                  {application?.applicant?.email}
                </TableCell>
                <TableCell className="py-[1rem]">
                  {application?.applicant?.phoneNumber}
                </TableCell>
                <TableCell className="py-[1rem] text-color-DB font-bold">
                  {application?.applicant?.profile?.resume ? (
                    <a
                      target="_blank"
                      href={application?.applicant?.profile?.resume}
                    >
                      {application?.applicant?.profile?.resumeOriginalName}
                    </a>
                  ) : (
                    <span>No Resume</span>
                  )}
                </TableCell>
                <TableCell className="py-[1rem]">
                  {application?.createdAt?.split("T")[0]}
                </TableCell>
                <TableCell className="py-[1rem] text-right">
                  <Popover>
                    <PopoverTrigger title="More">
                      <MoreHorizontal size={35} className="text-color-DB" />
                    </PopoverTrigger>
                    <PopoverContent className="flex flex-col gap-[0.5rem] items-center justify-center max-w-[100px]">
                      <div className="flex flex-col items-center gap-[0.5rem] justify-center text-color-DB">
                        {applicationStatus.map((status, index) => (
                          <span
                            onClick={() =>
                              applicationStatusHandler(status, application._id)
                            }
                            key={index}
                            title={status === "ACCEPTED" ? "Accept" : "Reject"}
                            className={`px-[1rem] py-[0.5rem] rounded-md cursor-pointer font-bold ${
                              application?.status === status
                                ? status === "ACCEPTED"
                                  ? "bg-green-300"
                                  : "bg-red-300"
                                : "bg-gray-200"
                            }`}
                          >
                            {status === "ACCEPTED" ? <Check /> : <X />}
                          </span>
                        ))}
                      </div>
                      <div
                        onClick={() =>
                          handleChat(application.job, application.applicant._id)
                        }
                        title="Chat"
                        className="px-[1rem] py-[0.5rem] rounded-md cursor-pointer font-bold bg-gray-200"
                      >
                        <MessageCircle size={25} className="text-color-DB" />
                      </div>
                    </PopoverContent>
                  </Popover>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      )}
    </section>
  );
};

export default ApplicantsTable;
