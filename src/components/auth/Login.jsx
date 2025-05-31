// <= IMPORTS =>
import axios from "axios";
import { toast } from "sonner";
import { useEffect, useState } from "react";
import Navbar from "../shared/Navbar";
import { Button } from "../ui/button";
import OTPInput from "../shared/OTPInput";
import { RadioGroup } from "../ui/radio-group";
import { Link, useNavigate } from "react-router-dom";
import { USER_API_ENDPOINT } from "@/utils/constants";
import { useDispatch, useSelector } from "react-redux";
import { setLoading, setLoggedIn, setUser } from "@/redux/authSlice";
import { Eye, EyeOff, Loader2, LogIn, ShieldCheck } from "lucide-react";

const Login = () => {
  // DISPATCH
  const dispatch = useDispatch();
  // SETTING LOADING STATE ON COMPONENT UNMOUNT
  useEffect(() => {
    return () => {
      dispatch(setLoading(false));
    };
  }, [dispatch]);
  // NAVIGATION
  const navigate = useNavigate();
  // LOADING STATE
  const { loading } = useSelector((store) => store.auth);
  // STATE MANAGEMENT
  const [input, setInput] = useState({
    email: "",
    password: "",
    role: "",
  });
  const [tempToken, setTempToken] = useState(null);
  const [otp, setOtp] = useState("");
  // VIEW & HIDE PASSWORD STATE
  const [showPassword, setShowPassword] = useState(false);
  // EVENT HANDLER
  const changeEventHandler = (e) => {
    setInput({ ...input, [e.target.name]: e.target.value });
  };
  // FORM SUBMIT HANDLER
  const submitHandler = async (e) => {
    // PREVENTING PAGE REFRESH
    e.preventDefault();
    // LOADING STATE
    dispatch(setLoading(true));
    try {
      // MAKING REQUEST
      const response = await axios.post(`${USER_API_ENDPOINT}/login`, input, {
        headers: {
          "Content-Type": "application/json",
        },
        withCredentials: true,
      });
      // IF RESPONSE 2FA ENABLE
      if (response.data.twoFactorRequired) {
        // SETTING TEMPORARY TOKEN IN THE LOCAL STATE
        setTempToken(response.data.tempToken);
        // TOASTING SUCCESS MESSAGE
        toast.success(response.data.message);
      } else {
        // SAVING USER IN THE AUTH STATE
        dispatch(setUser(response.data.user));
        // NAVIGATING TO LOGIN
        navigate("/");
        // LOGGED IN STATE
        dispatch(setLoggedIn(true));
        // TOASTING SUCCESS MESSAGE
        toast.success(response.data.message);
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
  // 2FA LOGIN HANDLER
  const handleOTPSubmit = async (e) => {
    // PREVENTING PAGE REFRESH
    e.preventDefault();
    // LOADING STATE
    dispatch(setLoading(true));
    try {
      // MAKING REQUEST
      const response = await axios.post(
        `${USER_API_ENDPOINT}/verify-2FA-login`,
        { tempToken, otp },
        { withCredentials: true }
      );
      // IF RESPONSE SUCCESS
      if (response.data.success) {
        // SAVING USER IN THE AUTH STATE
        dispatch(setUser(response.data.user));
        // NAVIGATING TO LOGIN
        navigate("/");
        // LOGGED IN STATE
        dispatch(setLoggedIn(true));
        // TOASTING SUCCESS MESSAGE
        toast.success(response.data.message);
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
      {/* NAVBAR */}
      <Navbar />
      {/* SIGNUP FORM MAIN WRAPPER */}
      <div className="w-full tracking-[0.5px] sm:px-[2rem] px-[1rem] flex items-center justify-center mt-[1.75rem]">
        {/* SIGN UP FORM FOR USERS WITHOUT 2FA ENABLED */}
        {!tempToken && (
          <form
            onSubmit={submitHandler}
            className="border-2 border-gray-100 rounded-md p-[1rem] md:w-2/3 w-full"
          >
            {/* FORM HEADING */}
            <h1 className="flex items-center gap-2 text-gray-500 font-bold text-[1.75rem] mb-[1rem]">
              <span>
                <LogIn size={28} color="#cc9675" />
              </span>
              <span>Login</span>
            </h1>
            {/* EMAIL */}
            <div className="my-[1rem]">
              <label
                htmlFor="email"
                className="text-[1rem] font-[600] uppercase text-gray-500"
              >
                EMAIL
              </label>
              <input
                type="email"
                id="email"
                name="email"
                value={input.email}
                onChange={changeEventHandler}
                className="w-full px-[1rem] py-[0.5rem] outline-none border-2 border-gray-100 rounded-md text-gray-500"
              />
            </div>
            {/* PASSWORD */}
            <div className="my-[1rem]">
              <label
                htmlFor="password"
                className="text-[1rem] font-[600] uppercase text-gray-500"
              >
                PASSWORD
              </label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  id="password"
                  name="password"
                  value={input.password}
                  onChange={changeEventHandler}
                  className="w-full px-[1rem] py-[0.5rem] outline-none border-2 border-gray-100 rounded-md text-gray-500"
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
            {/* FORGOT PASSWORD */}
            <div className="my-[1rem]">
              <Link
                to="/forgotPassword"
                className="text-color-DB text-sm hover:underline hover:underline-offset-4"
              >
                Forgot Password ?
              </Link>
            </div>
            {/* ROLE */}
            <div className="mb-[1rem] mt-[1.5rem] text-gray-500 uppercase">
              <RadioGroup className="flex items-center justify-start gap-[1rem]">
                <div className="flex items-center space-x-2">
                  <input
                    type="radio"
                    id="student"
                    name="role"
                    value="STUDENT"
                    checked={input.role === "STUDENT"}
                    onChange={changeEventHandler}
                    className="cursor-pointer"
                  />
                  <label className="font-[600]" htmlFor="student">
                    Student
                  </label>
                </div>
                <div className="flex items-center space-x-2">
                  <input
                    type="radio"
                    id="recruiter"
                    name="role"
                    value="RECRUITER"
                    checked={input.role === "RECRUITER"}
                    onChange={changeEventHandler}
                    className="cursor-pointer"
                  />
                  <label className="font-[600]" htmlFor="recruiter">
                    Recruiter
                  </label>
                </div>
              </RadioGroup>
            </div>
            {/* SUBMIT & LOADING BUTTON */}
            {loading ? (
              <Button
                disabled={loading}
                className="w-full bg-color-DB hover:bg-color-LB font-medium text-[1rem] focus:outline-none outline-none border-none"
              >
                <Loader2 className="h-4 w-4 animate-spin" />
                Logging In
              </Button>
            ) : (
              <Button
                type="submit"
                className="w-full bg-color-DB hover:bg-color-LB font-medium text-[1rem] focus:outline-none outline-none border-none"
              >
                <LogIn />
                Login
              </Button>
            )}
            {/* ACCOUNT SIGNUP */}
            <div className="mt-[1rem] text-[1rem] text-gray-500 font-medium">
              Don&apos;t have an Account ?{" "}
              <Link
                className="text-color-DB hover:underline underline-offset-4"
                to="/signup"
              >
                SignUp
              </Link>
            </div>
          </form>
        )}
        {/* 2FA ENABLED VERIFICATION FORM */}
        {tempToken && (
          // MAIN FORM ELEMENT
          <form
            onSubmit={handleOTPSubmit}
            className="flex flex-col gap-[1rem] border-2 border-gray-100 rounded-md p-[1rem] md:w-2/3 w-full"
          >
            {/* HEADING */}
            <div className="w-full flex items-center justify-start flex-wrap-reverse gap-[2rem]">
              <div className="flex items-center gap-[1rem]">
                <ShieldCheck className="text-color-DB w-[3rem] h-[3rem]" />
                <h1 className="font-[600] text-gray-500 text-[2rem]">
                  2 Factor Authentication
                </h1>
              </div>
            </div>
            {/* INFO */}
            <h1 className="w-full italic text-sm text-center text-gray-600">
              Two Factor Authentication is enabled for your Account. Please
              Enter the{" "}
              <span className="text-color-DB underline underline-offset-4">
                6-Digit Code
              </span>{" "}
              from your Authenticator App Complete the Login Request
            </h1>
            {/* VERIFICATION CODE */}
            <div className="flex items-center justify-center flex-col gap-[1rem] my-[1rem]">
              <label
                htmlFor="otp"
                className="text-[1rem] font-[600] uppercase text-gray-500"
              >
                Verification Code
              </label>
              <OTPInput value={otp} onChange={setOtp} />
            </div>
            {/* SUBMIT & LOADING BUTTON */}
            {loading ? (
              <Button
                disabled={loading}
                className="w-full bg-color-DB hover:bg-color-LB font-medium text-[1rem] focus:outline-none outline-none border-none"
              >
                <Loader2 className="h-4 w-4 animate-spin" />
                Verifying Code
              </Button>
            ) : (
              <Button
                type="submit"
                className="w-full bg-color-DB hover:bg-color-LB font-medium text-[1rem] focus:outline-none outline-none border-none"
              >
                <LogIn />
                Verify Code
              </Button>
            )}
          </form>
        )}
      </div>
    </>
  );
};

export default Login;
