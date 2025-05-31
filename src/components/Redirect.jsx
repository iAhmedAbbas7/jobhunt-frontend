// <= IMPORTS =>
import { Link } from "react-router-dom";
import LOGO from "../assets/images/LOGO.png";
import { LogIn, User2 } from "lucide-react";

const Redirect = () => {
  return (
    // REDIRECT MAIN WRAPPER
    <div className="w-screen h-screen flex items-center justify-center flex-col gap-[1rem]">
        {/* LOGO */}
      <div>
        <img src={LOGO} alt="Logo" className="w-[74px] h-[74px]" />
      </div>
      {/* LOGIN */}
      <Link
        to="/login"
        className="text-gray-500 bg-gray-100 px-[1rem] py-[0.5rem] flex items-center gap-[0.5rem] font-medium rounded-lg hover:bg-gray-200"
      >
        <LogIn /> Login to Access More Features
      </Link>
      {/* SIGN UP */}
      <Link
        to="/signup"
        className="text-gray-500 bg-gray-100 px-[1rem] py-[0.5rem] flex items-center gap-[0.5rem] font-medium rounded-lg hover:bg-gray-200"
      >
        <User2 /> Sign Up To Create Account
      </Link>
    </div>
  );
};

export default Redirect;
