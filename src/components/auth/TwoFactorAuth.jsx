// <= IMPORTS =>
import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import Navbar from "../shared/Navbar";
import {
  ArrowLeftCircle,
  Check,
  CheckCircle2,
  Loader2,
  ShieldCheck,
} from "lucide-react";
import { Button } from "../ui/button";
import { useNavigate } from "react-router-dom";
import { setLoading, setUser } from "@/redux/authSlice";
import axios from "axios";
import { USER_API_ENDPOINT } from "@/utils/constants";
import { toast } from "sonner";
import OTPInput from "../shared/OTPInput";

const TwoFactorAuth = () => {
  // CURRENT USER CREDENTIALS
  const { user, loading } = useSelector((store) => store.auth);
  // STATE MANAGEMENT
  const [qrCode, setQrCode] = useState("");
  const [token, setToken] = useState("");
  const [otp, setOtp] = useState("");
  const [step, setStep] = useState(1);
  // DISPATCH
  const dispatch = useDispatch();
  // NAVIGATION
  const navigate = useNavigate();
  // VERIFY EMAIL HANDLER
  const handleVerifyEmail = async () => {
    // LOADING STATE
    dispatch(setLoading(true));
    try {
      // MAKING REQUEST
      const response = await axios.post(
        `${USER_API_ENDPOINT}/enable-2FA/request`,
        {},
        { withCredentials: true }
      );
      // IF RESPONSE SUCCESS
      if (response.data.success) {
        // TOASTING SUCCESS MESSAGE
        toast.success(response.data.message);
        // UPDATING PROCESS STAGE
        setStep(2);
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
  // ENABLE 2FA HANDLER
  const handleEnable2FA = async () => {
    // IF EMAIL CONFIRMATION CODE IS NOT PROVIDED
    if (!otp) {
      toast.error("Confirmation Code is Required!");
      return;
    }
    // LOADING STATE
    dispatch(setLoading(true));
    try {
      // MAKING REQUEST
      const response = await axios.post(
        `${USER_API_ENDPOINT}/enable-2FA/start`,
        { code: otp },
        {
          withCredentials: true,
        }
      );
      // IF RESPONSE SUCCESS
      if (response.data.success) {
        // SETTING QR CODE
        setQrCode(response.data.qrCodeDataURL);
        // SETTING UPDATED USER IN AUTH STATE
        dispatch(setUser(response.data.user));
        // UPDATING PROCESS STAGE
        setStep(3);
      }
    } catch (error) {
      console.log(error.response.data.message);
      // TOASTING ERROR MESSAGE
      toast.error(error.response.data.message || "Failed to Initiate 2FA");
    } finally {
      // LOADING STATE
      dispatch(setLoading(false));
    }
  };
  // VERIFY CODE HANDLER
  const handleVerifyCode = async () => {
    // IF TOKEN NOT PROVIDED
    if (!token) {
      toast.error("Verification Code is Required!");
      return;
    }
    // LOADING STATE
    dispatch(setLoading(true));
    try {
      // MAKING REQUEST
      const response = await axios.post(
        `${USER_API_ENDPOINT}/enable-2FA/verify`,
        { token },
        { withCredentials: true }
      );
      // IF RESPONSE SUCCESS
      if (response.data.success) {
        // SETTING UPDATED USER IN THE AUTH STATE
        dispatch(setUser(response.data.user));
        // TOASTING SUCCESS MESSAGE
        toast.success(response.data.message);
        // NAVIGATING TO PROFILE PAGE
        navigate(user?.role === "STUDENT" ? "/profile" : "/admin/profile");
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
      {/* TWO FACTOR AUTH MAIN WRAPPER */}
      <section className="w-full flex items-center justify-center sm:px-[2rem] px-[1rem] py-[2rem]">
        {/* TWO FACTOR AUTH CONTENT WRAPPER */}
        <section className="flex flex-col items-center justify-center gap-[2rem] w-full border-2 border-gray-100 rounded-xl sm:p-[2rem] p-[1rem] tracking-[0.5px]">
          {/* HEADING & GO BACK BUTTON */}
          <div className="w-full flex items-center justify-between flex-wrap-reverse gap-[2rem]">
            <div className="flex items-center gap-[1rem]">
              <ShieldCheck className="text-color-DB w-[3rem] h-[3rem]" />
              <h1 className="font-[600] text-gray-500 text-[2rem]">
                2 Factor Authentication
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
          {/* SENDING EMAIL VERIFICATION CODE */}
          <div className="flex flex-col items-center justify-center gap-[1rem]">
            {step === 1 && (
              <>
                <h1 className="italic text-[1.2rem] text-center">
                  A 6-Digit Verification Code will be sent to your Email :{" "}
                  <span className="font-[600] underline underline-offset-4 text-color-DB">
                    {user?.email}
                  </span>
                </h1>
                {/* BUTTON */}
                <div className="flex items-center justify-center flex-wrap">
                  <Button
                    className="bg-color-DB hover:bg-color-LB font-medium text-[1rem] focus:outline-none outline-none border-none my-[1rem]"
                    onClick={handleVerifyEmail}
                    disabled={loading}
                  >
                    {loading ? (
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
          {/* VERIFYING EMAIL VERIFICATION CODE & STARTING 2FA ACTIVATION */}
          {step === 2 && (
            <div className="flex flex-col gap-[1rem] items-center justify-center w-full md:w-2/3">
              {/* INFO */}
              <h1 className="italic text-[1.2rem] text-center text-gray-500">
                A 6-Digit Verification Code was sent to your Email :{" "}
                <span className="font-[600] underline underline-offset-4 text-color-DB">
                  {user?.email}
                </span>
                . Please enter it below to Start Two Factor Authentication
                Activation
              </h1>
              {/* CODE */}
              <div className="flex items-center justify-center flex-col gap-[1rem] my-[1rem]">
                <label
                  htmlFor="otp"
                  className="text-[1rem] font-[600] uppercase text-gray-500"
                >
                  Verification Code
                </label>
                <OTPInput value={otp} onChange={setOtp} />
              </div>
              {/* BUTTON */}
              <div className="w-full">
                {loading ? (
                  <Button
                    disabled={loading}
                    className="w-full bg-color-DB hover:bg-color-LB font-medium text-[1rem] focus:outline-none outline-none border-none my-[1rem]"
                  >
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Verifying Code
                  </Button>
                ) : (
                  <Button
                    onClick={handleEnable2FA}
                    className="w-full bg-color-DB hover:bg-color-LB font-medium text-[1rem] focus:outline-none outline-none border-none my-[1rem]"
                  >
                    <CheckCircle2 />
                    Verify Code
                  </Button>
                )}
              </div>
            </div>
          )}
          {/* ENABLING 2FA */}
          {step === 3 && (
            <div className="flex flex-col gap-[1rem] items-center justify-center w-full md:w-2/3">
              {/* INFO */}
              <h1 className="italic text-center text-gray-500 text-[1.2rem]">
                Scan the Code below with your Authenticator App{" "}
                <span className="font-[600] text-color-DB underline underline-offset-4">
                  (e.g., Google Authenticator)
                </span>{" "}
                and Enter the{" "}
                <span className="font-[600] text-color-DB underline underline-offset-4">
                  6-Digit Code
                </span>
              </h1>
              {/* QR CODE */}
              <div>
                <img
                  src={qrCode}
                  alt="2FA QR Code"
                  className="w-[13rem] h-[13rem]"
                />
              </div>
              {/* CODE */}
              <div className="flex items-center justify-center flex-col gap-[1rem] my-[1rem]">
                <label
                  htmlFor="token"
                  className="text-[1rem] font-[600] uppercase text-gray-500"
                >
                  Verification Code
                </label>
                <OTPInput value={token} onChange={setToken} />
              </div>
              {/* BUTTON */}
              <div className="w-full">
                {loading ? (
                  <Button
                    disabled={loading}
                    className="w-full bg-color-DB hover:bg-color-LB font-medium text-[1rem] focus:outline-none outline-none border-none my-[1rem]"
                  >
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Verifying Code
                  </Button>
                ) : (
                  <Button
                    onClick={handleVerifyCode}
                    className="w-full bg-color-DB hover:bg-color-LB font-medium text-[1rem] focus:outline-none outline-none border-none my-[1rem]"
                  >
                    <CheckCircle2 />
                    Verify Code
                  </Button>
                )}
              </div>
            </div>
          )}
        </section>
      </section>
    </>
  );
};

export default TwoFactorAuth;
