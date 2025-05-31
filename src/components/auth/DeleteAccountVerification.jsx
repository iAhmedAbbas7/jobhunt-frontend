// <= IMPORTS =>
import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import Navbar from "../shared/Navbar";
import { Check, CheckCircle2, Loader2, Trash2, User2 } from "lucide-react";
import { Button } from "../ui/button";
import { toast } from "sonner";
import { clearAuthState, setLoading } from "@/redux/authSlice";
import axios from "axios";
import { USER_API_ENDPOINT } from "@/utils/constants";

const DeleteAccountVerification = () => {
  // CURRENT USER CREDENTIALS
  const { user, loading } = useSelector((store) => store.auth);
  // DISPATCH
  const dispatch = useDispatch();
  // NAVIGATION
  const navigate = useNavigate();
  // STATE MANAGEMENT
  const [code, setCode] = useState("");
  const [emailSent, setEmailSent] = useState(false);
  const [localLoading, setLocalLoading] = useState(false);
  // SEND CODE HANDLER
  const handleSendCode = async () => {
    try {
      // LOADING STATE
      setLocalLoading(true);
      // MAKING REQUEST
      const response = await axios.post(
        `${USER_API_ENDPOINT}/sendDeletionVerificationEmail`,
        {},
        { withCredentials: true }
      );
      // IF RESPONSE SUCCESS
      if (response.data.success) {
        // TOASTING SUCCESS MESSAGE
        toast.success(response.data.message);
        // SETTING SENT EMAIL STATE
        setEmailSent(true);
      }
    } catch (error) {
      console.log(error);
      // TOASTING ERROR MESSAGE
      toast.error(error.response.data.message);
    } finally {
      // LOADING STATE
      setLocalLoading(false);
    }
  };
  // VERIFY CODE HANDLER
  const handleVerifyAndDelete = async (e) => {
    // PREVENTING PAGE REFRESH
    e.preventDefault();
    // IF CODE NOT PROVIDED
    if (!code) {
      // TOASTING ERROR MESSAGE
      toast.error("Please Enter the Verification Code!");
      return;
    }
    // LOADING STATE
    dispatch(setLoading(true));
    try {
      // MAKING REQUEST
      const codeVerifyResponse = await axios.post(
        `${USER_API_ENDPOINT}/verifyDeletionCode`,
        { email: user.email, code },
        { withCredentials: true }
      );
      // IF CODE VERIFICATION SUCCESS
      if (codeVerifyResponse.data.success) {
        // AFTER SUCCESSFUL CODE VERIFICATION STARTING ACCOUNT DELETION
        const deleteAccountResult = await axios.delete(
          `${USER_API_ENDPOINT}/delete`,
          { withCredentials: true }
        );
        // IF DELETE ACCOUNT RESPONSE SUCCESS
        if (deleteAccountResult.data.success) {
          // TOASTING SUCCESS MESSAGE
          toast.success(deleteAccountResult.data.message);
          // CLEARING AUTH STATE
          dispatch(clearAuthState());
          // NAVIGATING TO HOMEPAGE
          navigate("/");
        }
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
      {/* DELETE ACCOUNT VERIFICATION MAIN WRAPPER */}
      <section className="w-full flex items-center justify-center sm:px-[2rem] px-[1rem] py-[2rem]">
        {/* DELETE ACCOUNT VERIFICATION CONTENT WRAPPER */}
        <section className="flex flex-col items-center justify-center gap-[1rem] w-full border-2 border-gray-100 rounded-xl sm:p-[2rem] p-[1rem] tracking-[0.5px]">
          {/* HEADING & Go BACK BUTTON */}
          <div className="w-full flex items-center justify-between flex-wrap-reverse gap-[2rem]">
            <div className="flex items-center gap-[1rem]">
              <Trash2 className="text-color-DB w-[3rem] h-[3rem]" />
              <h1 className="font-[600] text-gray-500 text-[2rem]">
                Account Deletion Verification
              </h1>
            </div>
            <Button
              onClick={() =>
                navigate(
                  `${user.role === "STUDENT" ? "/profile" : "/admin/profile"}`
                )
              }
              className="bg-color-DB hover:bg-color-LB font-medium text-[1rem] focus:outline-none outline-none border-none my-[1rem]"
            >
              <User2 />
              Back to Profile
            </Button>
          </div>
          {/* IF THE EMAIL IS NOT SENT */}
          <div className="flex flex-col items-center justify-center gap-[1rem]">
            {!emailSent && (
              <>
                {/* TEXT */}
                <h3 className="text-gray-600 font-[600] sm:text-[1.5rem] text-[1.2rem] text-center">
                  Would You Like to Start your Account Deletion Verification
                  Process ?
                </h3>
                {/* BUTTON */}
                <div className="flex items-center justify-center flex-wrap">
                  <Button
                    className="bg-color-DB hover:bg-color-LB font-medium text-[1rem] focus:outline-none outline-none border-none my-[1rem]"
                    onClick={handleSendCode}
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
              </>
            )}
          </div>
          {/* IF EMAIL IS SENT */}
          {emailSent && (
            // MAIN FORM ELEMENT
            <form onSubmit={handleVerifyAndDelete} className="w-full md:w-2/3">
              {/* CODE */}
              <div className="my-[1rem]">
                <label
                  htmlFor="code"
                  className="text-[1rem] font-[600] uppercase text-gray-500"
                >
                  Verification Code
                </label>
                <input
                  type="text"
                  id="code"
                  name="code"
                  value={code}
                  onChange={(e) => setCode(e.target.value)}
                  placeholder="Enter Verification Code"
                  className="w-full px-[1rem] py-[0.5rem] outline-none border-2 border-gray-100 rounded-md text-gray-500"
                  spellCheck="false"
                  autoComplete="off"
                />
              </div>
              {/* BUTTON */}
              <div className="w-full">
                {loading ? (
                  <Button
                    type="submit"
                    className="w-full bg-color-DB hover:bg-color-LB font-medium text-[1rem] focus:outline-none outline-none border-none my-[1rem]"
                  >
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Verifying Email
                  </Button>
                ) : (
                  <Button
                    type="submit"
                    className="w-full bg-color-DB hover:bg-color-LB font-medium text-[1rem] focus:outline-none outline-none border-none my-[1rem]"
                  >
                    <CheckCircle2 />
                    Verify Email
                  </Button>
                )}
              </div>
            </form>
          )}
        </section>
      </section>
    </>
  );
};

export default DeleteAccountVerification;
