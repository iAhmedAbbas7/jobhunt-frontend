// <= IMPORTS =>
import { CheckCircle2, Loader2, Lock } from "lucide-react";
import Navbar from "../shared/Navbar";
import { Button } from "../ui/button";
import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { setLoading } from "@/redux/authSlice";
import axios from "axios";
import { USER_API_ENDPOINT } from "@/utils/constants";

const ForgotPassword = () => {
  // LOADING STATE
  const { loading } = useSelector((store) => store.auth);
  // STATE MANAGEMENT
  const [email, setEmail] = useState("");
  // DISPATCH
  const dispatch = useDispatch();
  // NAVIGATION
  const navigate = useNavigate();
  // SUBMIT HANDLER
  const submitHandler = async (e) => {
    // PREVENTING PAGE REFRESH
    e.preventDefault();
    // IF NO EMAIL PROVIDED
    if (!email) {
      toast.error("Please Provide an Email!");
      return;
    }
    // LOADING STATE
    dispatch(setLoading(true));
    try {
      // MAKING REQUEST
      const response = await axios.post(
        `${USER_API_ENDPOINT}/forgotPassword`,
        { email },
        { withCredentials: true }
      );
      // IF RESPONSE SUCCESS
      if (response.data.success) {
        // TOASTING SUCCESS MESSAGE
        toast.success(response.data.message);
        // NAVIGATING TO RESET PASSWORD PAGE
        navigate("/resetPassword", { state: { email } });
      }
    } catch (error) {
      // IF THE EMAIL IS NOT VERIFIED
      if (error.response.data.message.includes("Email not Verified")) {
        // TOASTING ERROR MESSAGE
        toast.error(error.response.data.message);
      } else {
        // TOASTING ERROR MESSAGE
        toast.error(error.response.data.message);
      }
    } finally {
      // LOADING STATE
      dispatch(setLoading(false));
    }
  };
  return (
    <>
      <Navbar />
      {/* FORGOT PASSWORD MAIN WRAPPER */}
      <section className="w-full flex items-center justify-center sm:px-[2rem] px-[1rem] py-[2rem]">
        {/* FORGOT PASSWORD CONTENT WRAPPER */}
        <section className="flex flex-col items-center justify-center gap-[1rem] w-full border-2 border-gray-100 rounded-xl sm:p-[2rem] p-[1rem] tracking-[0.5px]">
          {/* HEADING */}
          <div className="w-full flex items-center justify-between flex-wrap gap-[2rem]">
            <div className="flex items-center gap-[1rem]">
              <Lock className="text-color-DB w-[3rem] h-[3rem]" />
              <h1 className="font-[600] text-gray-500 text-[2rem]">
                Forgot Password
              </h1>
            </div>
          </div>
          {/* MAIN FORM ELEMENT */}
          <form onSubmit={submitHandler} className="w-full md:w-2/3">
            {/* CODE */}
            <div className="my-[1rem]">
              <label
                htmlFor="email"
                className="text-[1rem] font-[600] uppercase text-gray-500"
              >
                Email
              </label>
              <input
                type="email"
                id="email"
                name="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter Your Email"
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
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Sending Code
                </Button>
              ) : (
                <Button
                  type="submit"
                  className="w-full bg-color-DB hover:bg-color-LB font-medium text-[1rem] focus:outline-none outline-none border-none my-[1rem]"
                >
                  <CheckCircle2 />
                  Send Reset Code
                </Button>
              )}
            </div>
          </form>
        </section>
      </section>
    </>
  );
};

export default ForgotPassword;
