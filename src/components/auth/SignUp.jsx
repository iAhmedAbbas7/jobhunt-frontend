// <= IMPORTS =>
import {
  CheckCircle2,
  Eye,
  EyeOff,
  Loader2,
  Lock,
  MailWarningIcon,
  User2Icon,
} from "lucide-react";
import Navbar from "../shared/Navbar";
import { RadioGroup } from "../ui/radio-group";
import { Button } from "../ui/button";
import { Link, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";
import { USER_API_ENDPOINT } from "@/utils/constants";
import { toast } from "sonner";
import { useDispatch, useSelector } from "react-redux";
import { setLoading } from "@/redux/authSlice";
import PhoneInputComponent from "../shared/PhoneInputComponent";

const SignUp = () => {
  // NAVIGATION
  const navigate = useNavigate();
  // DISPATCH
  const dispatch = useDispatch();
  // LOADING STATE
  const { loading } = useSelector((store) => store.auth);
  // PASSWORD STATE MANAGEMENT
  // STATE MANAGEMENT FOR INDIVIDUAL CONDITIONS
  const [hasMinLength, setHasMinLength] = useState(false);
  const [hasLower, setHasLower] = useState(false);
  const [hasUpper, setHasUpper] = useState(false);
  const [hasDigit, setHasDigit] = useState(false);
  const [hasSpecial, setHasSpecial] = useState(false);
  // VIEW & HIDE PASSWORD STATE
  const [showPassword, setShowPassword] = useState(false);
  // STATE MANAGEMENT
  const [input, setInput] = useState({
    fullName: "",
    email: "",
    phoneNumber: "",
    password: "",
    role: "",
    file: "",
  });
  // CHECKING PASSWORD CONDITIONS ON EACH CHANGE
  useEffect(() => {
    const password = input.password;
    setHasMinLength(password.length >= 8);
    setHasLower(/[a-z]/.test(password));
    setHasUpper(/[A-Z]/.test(password));
    setHasDigit(/[0-9]/.test(password));
    setHasSpecial(/[^A-Za-z0-9]/.test(password));
  }, [input.password]);
  // VALIDATION CHECK
  const allValid =
    hasMinLength && hasLower && hasUpper && hasDigit && hasSpecial;
  // EVENT HANDLER
  const changeEventHandler = (e) => {
    setInput({ ...input, [e.target.name]: e.target.value });
  };
  // FILE EVENT HANDLER
  const changeFileHandler = (e) => {
    setInput({ ...input, file: e.target.files?.[0] });
  };
  // FORM SUBMIT HANDLER
  const submitHandler = async (e) => {
    // PREVENTING PAGE REFRESH
    e.preventDefault();
    // IF PASSWORDS DO NOT MATCH
    if (!allValid) {
      toast.error("Please Choose Password within the Given Format!");
      return;
    }
    // CREATING FORM DATA OBJECT
    const formData = new FormData();
    formData.append("fullName", input.fullName);
    formData.append("email", input.email);
    formData.append("phoneNumber", input.phoneNumber);
    formData.append("password", input.password);
    formData.append("role", input.role);
    if (input.file) {
      formData.append("file", input.file);
    }
    // SUBMITTING FORM REQUEST
    try {
      // LOADING STATE
      dispatch(setLoading(true));
      const response = await axios.post(
        `${USER_API_ENDPOINT}/register`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
          withCredentials: true,
        }
      );
      // IF RESPONSE SUCCESS
      if (response.data.success) {
        // NAVIGATING TO LOGIN
        navigate("/verifyEmail", { state: { email: input.email } });
        // TOASTING MESSAGE
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
      {/* NAVBAR */}
      <Navbar />
      {/* SIGNUP FORM MAIN WRAPPER */}
      <div className="w-full tracking-[0.5px] sm:px-[2rem] px-[1rem] flex items-center justify-center mt-[1.75rem]">
        {/* SIGN UP FORM */}
        <form
          onSubmit={submitHandler}
          className="border-2 border-gray-100 rounded-md p-[1rem] md:w-2/3 w-full"
        >
          {/* FORM HEADING */}
          <h1 className="flex items-center gap-2 text-gray-500 font-bold text-[1.75rem] mb-[1rem]">
            <span>
              <User2Icon size={28} color="#cc9675" />
            </span>
            <span>Sign Up</span>
          </h1>
          {/* FULL NAME */}
          <div className="my-[1rem]">
            <label
              htmlFor="fullName"
              className="text-[1rem] font-[600] uppercase text-gray-500"
            >
              Full Name
            </label>
            <input
              type="text"
              id="fullName"
              name="fullName"
              value={input.fullName}
              onChange={changeEventHandler}
              className="w-full px-[1rem] py-[0.5rem] outline-none border-2 border-gray-100 rounded-md text-gray-500"
              spellCheck="false"
              autoComplete="off"
            />
          </div>
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
          {/* EMAIL INFO */}
          <div className="flex items-start text-sm sm:justify-start justify-center gap-[0.5rem] font-medium text-gray-600 rounded p-1 bg-gray-100 sm:text-start text-center">
            <div>
              <MailWarningIcon size={16} />
            </div>
            <span>
              Your Email will be Verified after Sign Up, Please choose a Valid
              Email Address
            </span>
          </div>
          {/* PHONE NUMBER */}
          <div className="my-[1rem]">
            <label
              htmlFor="phoneNumber"
              className="text-[1rem] font-[600] uppercase text-gray-500"
            >
              PHONE NUMBER
            </label>
            <PhoneInputComponent
              id="phoneNumber"
              name="phoneNumber"
              value={input.phoneNumber}
              onChange={(phone) => setInput({ ...input, phoneNumber: phone })}
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
          {/* PASSWORD VALIDATION CONDITIONS */}
          <div className="flex flex-col gap-[0.5rem] my-[1rem]">
            <ConditionItem label="Minimum 8 Characters" passed={hasMinLength} />
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
          {/* AVATAR */}
          <div className="my-[1rem]">
            <label
              htmlFor="avatar"
              className="text-[1rem] font-[600] uppercase text-gray-500"
            >
              AVATAR
            </label>
            <input
              accept="image/*"
              type="file"
              id="avatar"
              name="avatar"
              onChange={changeFileHandler}
              className="w-full px-[1rem] py-[0.5rem] outline-none border-2 border-gray-100 rounded-md text-gray-500 cursor-pointer"
            />
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
              type="submit"
              className="w-full bg-color-DB hover:bg-color-LB font-medium text-[1rem] focus:outline-none outline-none border-none"
            >
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Registering
            </Button>
          ) : (
            <Button
              type="submit"
              className="w-full bg-color-DB hover:bg-color-LB font-medium text-[1rem] focus:outline-none outline-none border-none"
            >
              <User2Icon />
              Sign Up
            </Button>
          )}
          {/* ACCOUNT LOGIN */}
          <div className="mt-[1rem] text-[1rem] text-gray-500 font-medium">
            Already have an Account ?{" "}
            <Link
              className="text-color-DB hover:underline underline-offset-4"
              to="/login"
            >
              Login
            </Link>
          </div>
        </form>
      </div>
    </>
  );
};

export default SignUp;
