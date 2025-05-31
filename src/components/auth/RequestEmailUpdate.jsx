// <= IMPORTS =>
import { ArrowLeftCircle, Check, Loader2, Mail } from "lucide-react";
import Navbar from "../shared/Navbar";
import { useNavigate } from "react-router-dom";
import { Button } from "../ui/button";
import { useDispatch, useSelector } from "react-redux";
import { useState } from "react";
import { toast } from "sonner";
import axios from "axios";
import { USER_API_ENDPOINT } from "@/utils/constants";
import { setLoading } from "@/redux/authSlice";

const RequestEmailUpdate = () => {
  // GETTING USER CREDENTIALS
  const { user, loading } = useSelector((store) => store.auth);
  // LOCAL LOADING STATE
  const [localLoading, setLocalLoading] = useState(false);
  // NAVIGATION
  const navigate = useNavigate();
  // DISPATCH
  const dispatch = useDispatch();
  // STATE MANAGEMENT
  const [code, setCode] = useState("");
  const [newEmail, setNewEmail] = useState("");
  // CURRENT EMAIL VERIFICATION HANDLER
  const requestCurrentEmailVerification = async () => {
    // LOADING STATE
    setLocalLoading(true);
    try {
      // MAKING REQUEST
      const response = await axios.post(
        `${USER_API_ENDPOINT}/requestEmailUpdate`,
        {},
        { withCredentials: true }
      );
      // IF RESPONSE SUCCESS
      if (response.data.success) {
        // TOASTING SUCCESS MESSAGE
        toast.success(response.data.message);
      }
    } catch (error) {
      console.log(error.response.data.message);
      // TOASTING ERROR MESSAGE
      toast.error(error.response.data.message);
    } finally {
      // LOADING STATE
      setLocalLoading(false);
    }
  };
  // SUBMIT HANDLER
  const submitHandler = async (e) => {
    // PREVENTING PAGE REFRESH
    e.preventDefault();
    // IF NEW EMAIL OR CODE IS NOT PROVIDED
    if (!code || !newEmail) {
      toast.error("New Email & Confirmation Code are Required!");
      return;
    }
    // LOADING STATE
    dispatch(setLoading(true));
    try {
      // MAKING REQUEST
      const response = await axios.post(
        `${USER_API_ENDPOINT}/initiateNewEmailUpdate`,
        { newEmail, code },
        { withCredentials: true }
      );
      // IF RESPONSE SUCCESS
      if (response.data.success) {
        // TOASTING SUCCESS MESSAGE
        toast.success(response.data.message);
        // NAVIGATING TO FINALIZE EMAIL UPDATE PAGE WITH NEW EMAIL STATE
        navigate("/finalizeEmailUpdate", { state: { newEmail } });
      }
    } catch (error) {
      console.log(error.response.data.message);
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
      {/* REQUEST EMAIL UPDATE MAIN WRAPPER */}
      <section className="w-full flex items-center justify-center sm:px-[2rem] px-[1rem] py-[2rem]">
        {/* REQUEST EMAIL UPDATE CONTENT WRAPPER */}
        <section className="flex flex-col items-center justify-center gap-[2rem] w-full border-2 border-gray-100 rounded-xl sm:p-[2rem] p-[1rem] tracking-[0.5px]">
          {/* HEADING & GO BACK BUTTON */}
          <div className="w-full flex items-center justify-between flex-wrap-reverse gap-[2rem]">
            <div className="flex items-center gap-[1rem]">
              <Mail className="text-color-DB w-[3rem] h-[3rem]" />
              <h1 className="font-[600] text-gray-500 text-[2rem]">
                Update Email Verification
              </h1>
            </div>
            <Button
              onClick={() => navigate("/profile")}
              className="bg-color-DB outline-none border-none focus:outline-none hover:bg-color-LB text-[1rem] font-medium"
            >
              <ArrowLeftCircle /> Go Back
            </Button>
          </div>
          {/* INFO */}
          <div className="w-full flex items-center justify-center">
            <p className="text-sm italic font-medium text-gray-600 text-center">
              An Email with a 6-Digit Confirmation Code will be Sent to Your
              Email Address :{" "}
              <span className="font-[600] text-color-DB underline underline-offset-4">
                {user?.email}
              </span>
            </p>
          </div>
          {/* REQUEST VERIFICATION FOR CURRENT EMAIL */}
          <div className="flex items-center justify-center flex-wrap">
            <Button
              className="bg-color-DB hover:bg-color-LB font-medium text-[1rem] focus:outline-none outline-none border-none my-[1rem]"
              onClick={requestCurrentEmailVerification}
              disabled={localLoading}
            >
              {localLoading ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Sending Verification Code
                </>
              ) : (
                <>
                  <Check /> Send Verification Code
                </>
              )}
            </Button>
          </div>
          <form onSubmit={submitHandler} className="w-full md:w-2/3">
            {/* CONFIRMATION CODE */}
            <div className="my-[1rem]">
              <label
                htmlFor="code"
                className="text-[1rem] font-[600] uppercase text-gray-500"
              >
                Confirmation Code
              </label>
              <input
                type="text"
                id="code"
                name="code"
                value={code}
                onChange={(e) => setCode(e.target.value)}
                placeholder="Enter Confirmation Code"
                className="w-full px-[1rem] py-[0.5rem] outline-none border-2 border-gray-100 rounded-md text-gray-500"
                spellCheck="false"
                autoComplete="off"
              />
            </div>
            {/* NEW EMAIL */}
            <div className="my-[1rem]">
              <label
                htmlFor="newEmail"
                className="text-[1rem] font-[600] uppercase text-gray-500"
              >
                New Email
              </label>
              <input
                type="email"
                id="newEmail"
                name="newEmail"
                value={newEmail}
                onChange={(e) => setNewEmail(e.target.value)}
                placeholder="Enter New Email"
                className="w-full px-[1rem] py-[0.5rem] outline-none border-2 border-gray-100 rounded-md text-gray-500"
                spellCheck="false"
                autoComplete="off"
              />
            </div>
            {/* BUTTON */}
            <div className="w-full">
              {loading ? (
                <Button className="w-full bg-color-DB hover:bg-color-LB font-medium focus:outline-none outline-none border-none my-[1rem] text-[1rem]">
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Verifying Email
                </Button>
              ) : (
                <Button
                  type="submit"
                  className="w-full bg-color-DB hover:bg-color-LB font-medium  focus:outline-none outline-none border-none my-[1rem] text-[1rem]"
                >
                  <Mail />
                  Verify Email
                </Button>
              )}
            </div>
          </form>
        </section>
      </section>
    </>
  );
};

export default RequestEmailUpdate;
