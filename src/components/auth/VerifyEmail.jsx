// <= IMPORTS =>
import { Loader2, Mail } from "lucide-react";
import Navbar from "../shared/Navbar";
import { useLocation, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { useState } from "react";
import { Button } from "../ui/button";
import { toast } from "sonner";
import { setLoading } from "@/redux/authSlice";
import axios from "axios";
import { USER_API_ENDPOINT } from "@/utils/constants";

const VerifyEmail = () => {
  // LOADING STATE
  const { loading } = useSelector((store) => store.auth);
  // LOCATION
  const location = useLocation();
  // NAVIGATION
  const navigate = useNavigate();
  // DISPATCH
  const dispatch = useDispatch();
  // GETTING EMAIL FROM LOCATION STATE
  const { email } = location.state || {};
  // STATE MANAGEMENT
  const [code, setCode] = useState("");
  // SUBMIT HANDLER
  const submitHandler = async (e) => {
    // PREVENTING PAGE REFRESH
    e.preventDefault();
    // IF NO CODE PROVIDED
    if (!code) {
      toast.error("Please Provide the Confirmation Code!");
      return;
    }
    try {
      // LOADING STATE
      dispatch(setLoading(true));
      // MAKING REQUEST
      const response = await axios.post(
        `${USER_API_ENDPOINT}/verifyEmail`,
        { email, code },
        { withCredentials: true }
      );
      // IF RESPONSE SUCCESS
      if (response.data.success) {
        // TOASTING SUCCESS MESSAGE
        toast.success(response.data.message);
        // NAVIGATING TO LOGIN PAGE
        navigate("/login");
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
      {/* VERIFY EMAIL MAIN WRAPPER */}
      <section className="w-full flex items-center justify-center sm:px-[2rem] px-[1rem] py-[2rem]">
        {/* VERIFY EMAIL CONTENT WRAPPER */}
        <section className="flex flex-col items-center justify-center gap-[2rem] w-full border-2 border-gray-100 rounded-xl sm:p-[2rem] p-[1rem] tracking-[0.5px]">
          {/* HEADING */}
          <div className="w-full flex items-center justify-between flex-wrap gap-[2rem]">
            <div className="flex items-center gap-[1rem]">
              <Mail className="text-color-DB w-[3rem] h-[3rem]" />
              <h1 className="font-[600] text-gray-500 text-[2rem]">
                Email Verification
              </h1>
            </div>
          </div>
          {/* INFO */}
          <div className="w-full flex items-center justify-center">
            <p className="text-sm italic font-medium text-gray-600 text-center">
              An Email with a 6-Digit Confirmation Code was Sent to Your Email
              Address :{" "}
              <span className="font-[600] text-color-DB underline underline-offset-4">
                {email}
              </span>
              . Please Enter the Code Below to Complete your Account
              Registration Verification.
            </p>
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

export default VerifyEmail;
