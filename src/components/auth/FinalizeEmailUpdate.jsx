// <= IMPORTS =>
import { useLocation, useNavigate } from "react-router-dom";
import Navbar from "../shared/Navbar";
import { Loader2, Mail } from "lucide-react";
import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Button } from "../ui/button";
import { toast } from "sonner";
import { setLoading, setUser } from "@/redux/authSlice";
import axios from "axios";
import { USER_API_ENDPOINT } from "@/utils/constants";

const FinalizeEmailUpdate = () => {
  // LOADING STATE
  const { loading } = useSelector((store) => store.auth);
  // LOCATION
  const location = useLocation();
  // GETTING NEW EMAIL FROM LOCATION STATE
  const { newEmail } = location.state || {};
  // STATE MANAGEMENT
  const [code, setCode] = useState("");
  // DISPATCH
  const dispatch = useDispatch();
  // NAVIGATION
  const navigate = useNavigate();
  // SUBMIT HANDLER
  const submitHandler = async (e) => {
    // PREVENTING PAGE REFRESH
    e.preventDefault();
    // IF CODE WAS NOT PROVIDED
    if (!code) {
      toast.error("Confirmation Code is Required");
      return;
    }
    // LOADING STATE
    dispatch(setLoading(true));
    try {
      // MAKING REQUEST
      const response = await axios.post(
        `${USER_API_ENDPOINT}/finalizeEmailUpdate`,
        { newEmail, code },
        { withCredentials: true }
      );
      // IF RESPONSE SUCCESS
      if (response.data.success) {
        // TOASTING SUCCESS MESSAGE
        toast.success(response.data.message);
        // SAVING THE UPDATED USER IN THE AUTH STATE
        dispatch(setUser(response.data.updatedUser));
        // NAVIGATING TO PROFILE PAGE
        navigate("/profile");
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
      {/* FINALIZE EMAIL UPDATE MAIN WRAPPER */}
      <section className="w-full flex items-center justify-center sm:px-[2rem] px-[1rem] py-[2rem]">
        {/* FINALIZE EMAIL UPDATE CONTENT WRAPPER */}
        <section className="flex flex-col items-center justify-center gap-[2rem] w-full border-2 border-gray-100 rounded-xl sm:p-[2rem] p-[1rem] tracking-[0.5px]">
          {/* HEADING */}
          <div className="w-full flex items-center justify-between flex-wrap gap-[2rem]">
            <div className="flex items-center gap-[1rem]">
              <Mail className="text-color-DB w-[3rem] h-[3rem]" />
              <h1 className="font-[600] text-gray-500 text-[2rem]">
                New Email Verification
              </h1>
            </div>
          </div>
          {/* INFO */}
          <div className="w-full flex items-center justify-center">
            <p className="text-sm italic font-medium text-gray-600 text-center">
              An Email with a 6-Digit Confirmation Code is Sent to Your Email
              Address :{" "}
              <span className="font-[600] text-color-DB underline underline-offset-4">
                {newEmail}
              </span>
              Enter the Code below to Verify your new Email.
            </p>
          </div>
          {/* MAIN FROM ELEMENT */}
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
            {/* BUTTON */}
            <div className="w-full">
              {loading ? (
                <Button
                  className="w-full bg-color-DB hover:bg-color-LB font-medium focus:outline-none outline-none border-none my-[1rem] text-[1rem]"
                  disabled={loading}
                >
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Verifying New Email
                </Button>
              ) : (
                <Button
                  type="submit"
                  className="w-full bg-color-DB hover:bg-color-LB font-medium  focus:outline-none outline-none border-none my-[1rem] text-[1rem]"
                >
                  <Mail />
                  Verify New Email
                </Button>
              )}
            </div>
          </form>
        </section>
      </section>
    </>
  );
};

export default FinalizeEmailUpdate;
