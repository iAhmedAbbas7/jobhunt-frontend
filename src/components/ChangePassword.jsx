// <= IMPORTS =>
import { clearAuthState, setLoading } from "@/redux/authSlice";
import { USER_API_ENDPOINT } from "@/utils/constants";
import axios from "axios";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import Navbar from "./shared/Navbar";
import {
  ArrowLeftCircle,
  Check,
  CheckCircle2,
  Eye,
  EyeOff,
  Info,
  Loader2,
  Lock,
} from "lucide-react";
import { Button } from "./ui/button";
import OTPInput from "./shared/OTPInput";

const ChangePassword = () => {
  // STATE MANAGEMENT
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [otp, setOtp] = useState("");
  const [match, setMatch] = useState(false);
  // STATE MANAGEMENT FOR INDIVIDUAL CONDITIONS
  const [hasMinLength, setHasMinLength] = useState(false);
  const [hasLower, setHasLower] = useState(false);
  const [hasUpper, setHasUpper] = useState(false);
  const [hasDigit, setHasDigit] = useState(false);
  const [hasSpecial, setHasSpecial] = useState(false);
  // VIEW & HIDE PASSWORD STATE
  const [showPassword, setShowPassword] = useState(false);
  // FLAG FOR OTP SENT OR NOT
  const [otpSent, setOtpSent] = useState(false);
  // VALIDATION CHECK FOR OTP
  const [isOtpValid, setIsOtpValid] = useState(false);
  // LOADING STATE
  const { loading, user } = useSelector((store) => store.auth);
  // DISPATCH
  const dispatch = useDispatch();
  // NAVIGATION
  const navigate = useNavigate();
  // CHECKING FOR PASSWORD MATCH ON EACH CHANGE
  useEffect(() => {
    setMatch(newPassword !== "" && newPassword === confirmPassword);
  }, [newPassword, confirmPassword]);
  // CHECKING FOR EACH PASSWORD CONDITION WHEN NEW PASSWORD CHANGES
  useEffect(() => {
    setHasMinLength(newPassword.length >= 8);
    setHasLower(/[a-z]/.test(newPassword));
    setHasUpper(/[A-Z]/.test(newPassword));
    setHasDigit(/[0-9]/.test(newPassword));
    setHasSpecial(/[^A-Za-z0-9]/.test(newPassword));
  }, [newPassword]);
  // CHECKING FOR OTP VALIDATION ON EACH OTP VALUE CHANGE
  useEffect(() => {
    setIsOtpValid(/^\d{6}$/.test(otp));
  }, [otp]);
  // VALIDATION CHECK
  const allValid =
    hasMinLength && hasLower && hasUpper && hasDigit && hasSpecial;
  // SEND OTP HANDLER
  const sendOtpHandler = async () => {
    try {
      // LOADING STATE
      dispatch(setLoading(true));
      // MAKING REQUEST
      const response = await axios.post(
        `${USER_API_ENDPOINT}/changePassword/initiate`,
        {},
        { withCredentials: true }
      );
      // IF RESPONSE SUCCESS
      if (response.data.success) {
        // TOASTING SUCCESS MESSAGE
        toast.success(response.data.message);
        // SETTING OPT SENT FLAG
        setOtpSent(true);
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
  // SUBMIT HANDLER
  const submitHandler = async (e) => {
    // PREVENTING PAGE REFRESH
    e.preventDefault();
    // IF PASSWORDS DOES NOT MATCH THE GIVEN FORMAT
    if (!allValid) {
      toast.error("Please Choose Password within the Given Format!");
      return;
    }
    // IF NEW PASSWORD & CONFIRM PASSWORD DOES NOT MATCH
    if (!match) {
      toast.error("Passwords Does Not Match!");
      return;
    }
    // IF RESET CODE IS NOT PROVIDED
    if (!otp) {
      toast.error("Please Provide the Confirmation Code!");
      return;
    }
    // LOADING STATE
    dispatch(setLoading(true));
    try {
      // MAKING REQUEST
      const response = await axios.patch(
        `${USER_API_ENDPOINT}/changePassword`,
        { newPassword, code: otp },
        { withCredentials: true }
      );
      // IF RESPONSE SUCCESS
      if (response.data.success) {
        // TOASTING SUCCESS MESSAGE
        toast.success(response.data.message);
        // CLEARING AUTH STATE
        dispatch(clearAuthState());
        // NAVIGATING TO HOME PAGE
        navigate("/");
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
  // CONDITION ITEMS
  const ConditionItem = ({ label, passed }) => (
    <div
      className={`flex items-center gap-[0.5rem] p-1 rounded ${
        passed ? "bg-green-100 text-green-500" : "bg-gray-100 text-gray-500"
      }`}
    >
      {passed ? <CheckCircle2 size={16} /> : <Lock size={16} />}
      <span className="text-sm">{label}</span>
    </div>
  );
  return (
    <>
      <Navbar />
      {/* CHANGE PASSWORD MAIN WRAPPER */}
      <section className="w-full flex items-center justify-center sm:px-[2rem] px-[1rem] py-[2rem]">
        {/* CHANGE PASSWORD CONTENT WRAPPER */}
        <section className="flex flex-col items-center justify-center gap-[2rem] w-full border-2 border-gray-100 rounded-xl sm:p-[2rem] p-[1rem] tracking-[0.5px]">
          {/* HEADING & GO BACK BUTTON */}
          <div className="w-full flex items-center justify-between flex-wrap-reverse gap-[2rem]">
            <div className="flex items-center gap-[1rem]">
              <Lock className="text-color-DB w-[3rem] h-[3rem]" />
              <h1 className="font-[600] text-gray-500 text-[2rem]">
                {otpSent ? "Change Password" : "Change Password Verification"}
              </h1>
            </div>
            <Button
              onClick={() =>
                navigate(
                  `${user.role === "STUDENT" ? "/profile" : "/admin/profile"}`
                )
              }
              className="bg-color-DB outline-none border-none focus:outline-none hover:bg-color-LB text-[1rem] font-medium"
            >
              <ArrowLeftCircle /> Go Back
            </Button>
          </div>
          {/* IF OTP NOT SENT */}
          {!otpSent && (
            <div>
              {loading ? (
                <Button className="bg-color-DB hover:bg-color-LB font-medium text-[1rem] focus:outline-none outline-none border-none my-[1rem]">
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Sending Code
                </Button>
              ) : (
                <Button
                  onClick={sendOtpHandler}
                  className="bg-color-DB hover:bg-color-LB font-medium text-[1rem] focus:outline-none outline-none border-none my-[1rem]"
                >
                  <Check />
                  Send verification Code
                </Button>
              )}
            </div>
          )}
          {/* IF OTP SENT */}
          {otpSent && (
            // MAIN FORM ELEMENT
            <form onSubmit={submitHandler} className="w-full md:w-2/3">
              {/* CONFIRMATION CODE */}
              <div className="flex items-center justify-center flex-col gap-[1rem] my-[1rem]">
                <label
                  htmlFor="otp"
                  className="text-[1rem] font-[600] uppercase text-gray-500"
                >
                  Verification Code
                </label>
                <OTPInput value={otp} onChange={setOtp} />
              </div>
              {/* NEW PASSWORD */}
              <div className="my-[1rem]">
                <label
                  htmlFor="newPassword"
                  className="text-[1rem] font-[600] uppercase text-gray-500"
                >
                  New Password
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    id="newPassword"
                    name="newPassword"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    className={`w-full px-[1rem] py-[0.5rem] outline-none border-2 ${
                      match ? "border-green-500" : "border-gray-100"
                    } rounded-md text-gray-500`}
                  />
                  <button
                    onClick={() => setShowPassword((prev) => !prev)}
                    type="button"
                    title={showPassword ? "Hide" : "Show"}
                    className="flex items-center absolute inset-y-0 right-0 pr-[0.5rem] text-gray-600"
                  >
                    {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                  </button>
                </div>
              </div>
              {/* CONFIRM PASSWORD */}
              <div className="my-[1rem]">
                <label
                  htmlFor="confirmPassword"
                  className="text-[1rem] font-[600] uppercase text-gray-500"
                >
                  Confirm Password
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    id="confirmPassword"
                    name="confirmPassword"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className={`w-full px-[1rem] py-[0.5rem] outline-none border-2 ${
                      match ? "border-green-500" : "border-gray-100"
                    } rounded-md text-gray-500`}
                  />
                  <button
                    onClick={() => setShowPassword((prev) => !prev)}
                    type="button"
                    title={showPassword ? "Hide" : "Show"}
                    className="flex items-center absolute inset-y-0 right-0 pr-[0.5rem] text-gray-600"
                  >
                    {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                  </button>
                </div>
              </div>
              {/* CONDITIONS */}
              <div className="flex flex-col gap-[0.5rem] my-[1rem]">
                <ConditionItem
                  label="Minimum 8 Characters"
                  passed={hasMinLength}
                />
                <ConditionItem
                  label="At Least One Lowercase Letter"
                  passed={hasLower}
                />
                <ConditionItem
                  label="At Least One Uppercase Letter"
                  passed={hasUpper}
                />
                <ConditionItem label="At Least One Digit" passed={hasDigit} />
                <ConditionItem
                  label="At Least One Special Character"
                  passed={hasSpecial}
                />
              </div>
              {/* MESSAGES */}
              <div className="flex flex-col gap-[0.5rem]">
                {/* PASSWORD MATCH MESSAGE */}
                {match && allValid && (
                  <div className="rounded p-1 bg-green-100 flex items-center gap-[0.5rem] text-green-500">
                    <CheckCircle2 size={20} />
                    <span className="text-[1rem]">Passwords Match</span>
                  </div>
                )}
                {/* OTP VALID */}
                {isOtpValid && (
                  <div className="rounded p-1 bg-green-100 flex items-center gap-[0.5rem] text-green-500">
                    <CheckCircle2 size={20} />
                    <span className="text-[1rem]">Confirmation Code</span>
                  </div>
                )}
              </div>
              {/* SUBMIT BUTTON */}
              {match && allValid && (
                <div>
                  {loading ? (
                    <Button className="bg-color-DB hover:bg-color-LB font-medium text-[1rem] focus:outline-none outline-none border-none my-[1rem]">
                      <Loader2 className="h-4 w-4 animate-spin" />
                      Changing Password
                    </Button>
                  ) : (
                    <Button
                      type="submit"
                      className="bg-color-DB hover:bg-color-LB font-medium text-[1rem] focus:outline-none outline-none border-none my-[1rem]"
                    >
                      <Check />
                      Change Password
                    </Button>
                  )}
                </div>
              )}
              {/* INFO */}
              <div className="italic text-sm text-gray-600 mt-[0.5rem]">
                <p className="flex items-center gap-[0.5rem]">
                  <Info size={20} />
                  You need to Login Again after Password Change
                </p>
              </div>
            </form>
          )}
        </section>
      </section>
    </>
  );
};

export default ChangePassword;
