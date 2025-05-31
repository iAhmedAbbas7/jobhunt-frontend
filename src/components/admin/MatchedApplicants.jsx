// <= IMPORTS =>
import { APPLICATION_API_ENDPOINT } from "@/utils/constants";
import axios from "axios";
import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { toast } from "sonner";
import Navbar from "../shared/Navbar";
import { ChartColumnBig, Loader2, SearchIcon, Users2 } from "lucide-react";
import { useDispatch } from "react-redux";
import { setSearchApplicantsByName } from "@/redux/applicationSlice";
import BestMatchedApplicantsTable from "./BestMatchedApplicantsTable";

const MatchedApplicants = () => {
  // LOCATION
  const location = useLocation();
  // GETTING JOB ID FROM LOCATION STATE
  const { jobId } = location.state || {};
  // STATE MANAGEMENT
  const [loading, setLoading] = useState(false);
  const [matchedApplicants, setMatchedApplicants] = useState([]);
  // FETCHING MATCHED APPLICANTS FOR THE JOB ON COMPONENT MOUNT
  useEffect(() => {
    const fetchMatchedApplicants = async () => {
      // LOADING STATE
      setLoading(true);
      try {
        // MAKING REQUEST
        const response = await axios.get(
          `${APPLICATION_API_ENDPOINT}/${jobId}/bestMatchedApplicants`,
          { withCredentials: true }
        );
        // IF RESPONSE SUCCESS
        if (response.data.success) {
          // SETTING MATCHED APPLICANTS IN THE LOCAL STATE
          setMatchedApplicants(response.data.matchedApplicants);
        }
      } catch (error) {
        console.log(error);
        // TOASTING ERROR MESSAGE
        toast.error("Failed to Fetch Matched Applicants");
      } finally {
        // LOADING STATE
        setLoading(false);
      }
    };
    if (jobId) {
      fetchMatchedApplicants();
    }
  }, [jobId]);
  // DISPATCH
  const dispatch = useDispatch();
  // INPUT STATE MANAGEMENT
  const [input, setInput] = useState("");
  // FILTERING APPLICANTS
  useEffect(() => {
    dispatch(setSearchApplicantsByName(input));
  }, [input, dispatch]);
  return (
    <>
      <Navbar />
      {/* MATCHED APPLICANTS MAIN WRAPPER */}
      <section className="w-full flex items-center justify-center sm:px-[2rem] px-[1rem] py-[2rem]">
        {/* MATCHED APPLICANTS CONTENT WRAPPER */}
        <section className="flex flex-col gap-[2rem] w-full border-2 border-gray-100 rounded-xl sm:p-[2rem] p-[1rem] tracking-[0.5px]">
          {/* HEADING */}
          <div className="flex items-center justify-start">
            <div className="flex items-center gap-[1rem]">
              <SearchIcon className="text-color-DB w-[3rem] h-[3rem]" />
              <h1 className="font-[600] text-gray-500 text-[2rem]">
                Search Matched Applicants
              </h1>
              <Users2 className="text-color-DB w-[3rem] h-[3rem]" />
            </div>
          </div>
          {/* SEARCH MATCHED APPLICANTS */}
          <div>
            <input
              type="text"
              className="w-full px-[1rem] py-[0.5rem] outline-none border-2 border-gray-100 rounded-md text-gray-500"
              placeholder="Search Applicants By Name or Email"
              onChange={(e) => setInput(e.target.value)}
            />
          </div>
          {/* SCORING CRITERIA */}
          <div className="flex flex-col gap-[1rem]">
            {/* HEADING */}
            <h1 className="flex items-center gap-[0.5rem] text-gray-500 font-[600] text-[1.75rem]">
              <span>
                <ChartColumnBig className="text-gray-500 w-[2rem] h-[2rem]" />
              </span>
              Scoring Criteria :
            </h1>
            {/* SCORING CATEGORIES */}
            <div className="flex items-center justify-start gap-[2.5rem] flex-wrap">
              <div className="flex items-center gap-[1rem] text-gray-500 text-[1.1rem]">
                <span>0 - 20 %</span>{" "}
                <div className="w-7 h-7 rounded-md bg-gray-200"></div>
              </div>
              <div className="flex items-center gap-[1rem] text-gray-500 text-[1.1rem]">
                <span>20 - 40 %</span>{" "}
                <div className="w-7 h-7 rounded-md bg-yellow-200"></div>
              </div>
              <div className="flex items-center gap-[1rem] text-gray-500 text-[1.1rem]">
                <span>40 - 60 %</span>{" "}
                <div className="w-7 h-7 rounded-md bg-blue-200"></div>
              </div>
              <div className="flex items-center gap-[1rem] text-gray-500 text-[1.1rem]">
                <span>60 - 80 %</span>{" "}
                <div className="w-7 h-7 rounded-md bg-red-200"></div>
              </div>
              <div className="flex items-center gap-[1rem] text-gray-500 text-[1.1rem]">
                <span>80 - 100%</span>{" "}
                <div className="w-7 h-7 rounded-md bg-green-200"></div>
              </div>
            </div>
            {/* INFO */}
            <h1 className="md:w-2/4 w-full rounded-lg p-3 bg-gray-100 text-gray-500">
              The Percentage Score is Calculated by making a Matching Comparison
              between the Jobs Required Skills and the Skills of the Applicant
            </h1>
          </div>
          {/* APPLICANTS TABLE */}
          {loading ? (
            <div className="flex items-center justify-center py-10">
              <Loader2 className="animate-spin w-12 h-12 text-color-DB" />
            </div>
          ) : (
            <BestMatchedApplicantsTable matchedApplicants={matchedApplicants} />
          )}
        </section>
      </section>
    </>
  );
};

export default MatchedApplicants;
