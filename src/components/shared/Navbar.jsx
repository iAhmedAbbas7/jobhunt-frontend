// <= IMPORTS =>
import axios from "axios";
import { toast } from "sonner";
import { Button } from "../ui/button";
import { resetChat } from "@/redux/chatSlice";
import LOGO from "../../assets/images/LOGO.png";
import { Avatar, AvatarImage } from "../ui/avatar";
import { clearAuthState } from "@/redux/authSlice";
import AVATAR from "../../assets/images/AVATAR.png";
import { Link, useNavigate } from "react-router-dom";
import { USER_API_ENDPOINT } from "@/utils/constants";
import { useDispatch, useSelector } from "react-redux";
import { setAdminCompanies } from "@/redux/companySlice";
import HAMBURGER from "../../assets/images/HAMBURGER.png";
import { clearApplicants } from "@/redux/applicationSlice";
import { clearNotifications } from "@/redux/notificationSlice";
import { setAllAdminJobs, setAllAppliedJobs } from "@/redux/jobSlice";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";
import {
  Briefcase,
  Building2,
  FileText,
  HomeIcon,
  LogIn,
  LogOut,
  MessageCircleMore,
  User2Icon,
} from "lucide-react";

const Navbar = () => {
  // CURRENT USER CREDENTIALS
  const { user } = useSelector((store) => store.auth);
  // GLOBAL CHATS UNREAD COUNT
  const { unreadCounts = {} } = useSelector((store) => store.chat);
  // CHECKING IF THERE IS UNREAD COUNT FOR ANY CHAT
  const hasAnyUnread = Object.values(unreadCounts).some((c) => c > 0);
  // DISPATCH
  const dispatch = useDispatch();
  // NAVIGATION
  const navigate = useNavigate();
  // LOGOUT HANDLER
  const logoutHandler = async () => {
    try {
      // MAKING REQUEST
      const response = await axios.get(`${USER_API_ENDPOINT}/logout`, {
        withCredentials: true,
      });
      // IF RESPONSE SUCCESS
      if (response.data.success) {
        // CLEARING AUTH STATE ON SUCCESSFUL LOGOUT
        dispatch(clearAuthState());
        // CLEARING ALL ADMIN JOBS ON SUCCESSFUL LOGOUT (RECRUITER)
        user?.role === "RECRUITER" && dispatch(setAllAdminJobs([]));
        // CLEARING ALL ADMIN COMPANIES ON SUCCESSFUL LOGOUT (RECRUITER)
        user?.role === "RECRUITER" && dispatch(setAdminCompanies([]));
        // CLEARING APPLIED JOBS
        dispatch(setAllAppliedJobs([]));
        // CLEARING NOTIFICATIONS ON LOGOUT
        dispatch(clearNotifications());
        // CLEARING APPLICANTS
        dispatch(clearApplicants());
        // CLEARING CHAT STATE
        dispatch(resetChat());
        // NAVIGATING TO HOMEPAGE
        navigate("/");
        // TOASTING SUCCESS MESSAGE
        toast.success(response.data.message);
      }
    } catch (error) {
      console.log(error);
      // TOASTING ERROR MESSAGE
      toast.error(error.response.data.message);
    }
  };
  return (
    // NAVBAR MAIN WRAPPER
    <div className="sticky top-0 left-0 z-[9999] w-full tracking-[0.5px] sm:px-[2rem] px-[1rem] overflow-hidden bg-white border-b-2 border-gray-100">
      {/* NAVBAR CONTENT WRAPPER */}
      <div className="flex items-center justify-between flex-wrap py-[1rem]">
        {/* LOGO SECTION */}
        <Link
          title="Home"
          to={!user ? "/" : user?.role === "STUDENT" ? "/" : "/admin/companies"}
          className="flex items-center justify-center gap-[0.5rem]"
        >
          <img src={LOGO} alt="JobHunt Logo" className="w-[44px] h-[44px]" />
          <h1 className="text-2xl font-bold text-gray-500">
            Job<span className="text-color-MAIN">Hunt</span>
          </h1>
        </Link>
        {/* HAMBURGER MENU (SMALL DEVICES) */}
        <div className="lg:hidden flex gap-[1.25rem]">
          {/* HAMBURGER POPOVER */}
          <Popover>
            {/* POPOVER TRIGGER */}
            <PopoverTrigger className="cursor-pointer" asChild>
              <img src={HAMBURGER} alt="Menu" className="w-[44px] h-[44px]" />
            </PopoverTrigger>
            {/* POPOVER CONTENT */}
            <PopoverContent className=" flex flex-col gap-[1.5rem] z-[100000]">
              {/* LOGO SECTION */}
              <Link
                to="/"
                className="flex items-center justify-start gap-[0.5rem]"
              >
                <img
                  src={LOGO}
                  alt="JobHunt Logo"
                  className="w-[44px] h-[44px]"
                />
                <h1 className="text-2xl font-bold text-gray-500">
                  Job<span className="text-color-MAIN">Hunt</span>
                </h1>
              </Link>
              {/* APP NAVIGATION */}
              <section>
                {user?.role === "RECRUITER" ? (
                  <ul className="flex flex-col items-start justify-center gap-5 font-medium text-gray-500 text-[1.15rem]">
                    <Link
                      to={user !== null ? `/admin/companies` : "/redirect"}
                      className="flex items-center gap-2 cursor-pointer hover:underline underline-offset-4"
                    >
                      <Building2 color="#365e7d" /> Companies
                    </Link>
                    <Link
                      to={user !== null ? "/admin/jobs" : "/redirect"}
                      className="flex items-center gap-2 cursor-pointer hover:underline underline-offset-4"
                    >
                      <Briefcase color="#365e7d" /> Jobs
                    </Link>
                    <Link
                      to={user !== null ? "/chats" : "/redirect"}
                      className="flex items-center gap-2 cursor-pointer hover:underline underline-offset-4 relative"
                    >
                      {hasAnyUnread && (
                        <span className="absolute bg-color-DB w-2.5 h-2.5 rounded-full left-5 top-0"></span>
                      )}
                      <MessageCircleMore color="#365e7d" /> Chats
                    </Link>
                    <Link
                      to={user !== null ? "/admin/articles" : "/redirect"}
                      className="flex items-center gap-2 cursor-pointer hover:underline underline-offset-4"
                    >
                      <FileText color="#365e7d" /> Articles
                    </Link>
                  </ul>
                ) : (
                  <ul className="flex flex-col items-start justify-center gap-5 font-medium text-gray-500 text-[1.15rem]">
                    <Link
                      to="/"
                      className="flex items-center gap-2 cursor-pointer hover:underline underline-offset-4"
                    >
                      <HomeIcon color="#365e7d" /> Home
                    </Link>
                    <Link
                      to="/jobs"
                      className="flex items-center gap-2 cursor-pointer hover:underline underline-offset-4"
                    >
                      <Briefcase color="#365e7d" /> Jobs
                    </Link>
                    <Link
                      to={user !== null ? "/companies" : "/redirect"}
                      className="flex items-center gap-2 cursor-pointer hover:underline underline-offset-4"
                    >
                      <Building2 color="#365e7d" /> Companies
                    </Link>
                    {user && (
                      <Link
                        to={user !== null ? "/chats" : "/redirect"}
                        className="flex items-center gap-2 cursor-pointer hover:underline underline-offset-4 relative"
                      >
                        {hasAnyUnread && (
                          <span className="absolute bg-color-DB w-2.5 h-2.5 rounded-full left-5 top-0"></span>
                        )}
                        <MessageCircleMore color="#365e7d" /> Chats
                      </Link>
                    )}
                    <Link
                      to="/articles"
                      className="flex items-center gap-2 cursor-pointer hover:underline underline-offset-4"
                    >
                      <FileText color="#365e7d" /> Articles
                    </Link>
                  </ul>
                )}
              </section>
              {/* LOGIN & SIGNUP NAVIGATION */}
              {!user ? (
                <div className="flex items-center gap-6">
                  <Link to="/login">
                    <Button className="bg-color-DB outline-none border-none focus:outline-none hover:bg-color-LB text-[1rem] font-medium">
                      <LogIn /> Login
                    </Button>
                  </Link>
                  <Link to="/signup">
                    <Button className="bg-color-MAIN outline-none border-none focus:outline-none hover:bg-color-LBR text-[1rem] font-medium">
                      <User2Icon /> Sign Up
                    </Button>
                  </Link>
                </div>
              ) : (
                <div className="hidden"></div>
              )}
            </PopoverContent>
          </Popover>
          {/* USER PROFILE POPOVER */}
          {user ? (
            <Popover>
              {/* POPOVER TRIGGER */}
              <PopoverTrigger asChild>
                <Avatar className="cursor-pointer">
                  <AvatarImage
                    src={user?.profile?.profilePhoto || AVATAR}
                    alt={user?.fullName}
                  />
                </Avatar>
              </PopoverTrigger>
              {/* POPOVER CONTENT */}
              <PopoverContent className="w-[350px] flex flex-col items-center justify-center gap-3 tracking-[0.5px] z-[100000]">
                {/* AVATAR & BIO SECTION */}
                <Avatar className="cursor-pointer w-[66px] h-[66px]">
                  <AvatarImage
                    src={user?.profile?.profilePhoto || AVATAR}
                    alt={user?.fullName}
                  />
                </Avatar>
                <h4 className="font-medium text-[1.2rem]">{user?.fullName}</h4>
                <p className="text-sm text-muted-foreground text-center">
                  {user?.profile?.bio}
                </p>
                {/* NAVIGATION SECTION */}
                <div className="flex items-center gap-6">
                  <Link
                    to={
                      user?.role === "STUDENT" ? "/profile" : "/admin/profile"
                    }
                  >
                    <Button className="bg-color-DB outline-none border-none focus:outline-none hover:bg-color-LB text-[1rem] font-medium">
                      <User2Icon /> View Profile
                    </Button>
                  </Link>
                  <Link to="">
                    <Button className="bg-color-MAIN outline-none border-none focus:outline-none hover:bg-color-LBR text-[1rem] font-medium">
                      <LogOut /> Logout
                    </Button>
                  </Link>
                </div>
              </PopoverContent>
            </Popover>
          ) : (
            <div className="hidden"></div>
          )}
        </div>
        {/* PROFILE & NAVIGATION SECTION (LARGE DEVICES) */}
        <div className="lg:flex hidden items-center gap-12">
          {/* APP NAVIGATION */}
          <section>
            {user?.role === "RECRUITER" ? (
              <ul className="flex items-center gap-5 font-medium text-[1.15rem] text-gray-500">
                <Link
                  to={user !== null ? `/admin/companies` : "/redirect"}
                  className="flex items-center gap-2 cursor-pointer hover:underline underline-offset-4"
                >
                  <Building2 color="#365e7d" /> Companies
                </Link>
                <Link
                  to={user !== null ? "/admin/jobs" : "/redirect"}
                  className="flex items-center gap-2 cursor-pointer hover:underline underline-offset-4"
                >
                  <Briefcase color="#365e7d" /> Jobs
                </Link>
                <Link
                  to={user !== null ? "/chats" : "/redirect"}
                  className="flex items-center gap-2 cursor-pointer hover:underline underline-offset-4 relative"
                >
                  {hasAnyUnread && (
                    <span className="absolute bg-color-DB w-2.5 h-2.5 rounded-full left-5 top-0"></span>
                  )}
                  <MessageCircleMore color="#365e7d" /> Chats
                </Link>
                <Link
                  to={user !== null ? "/admin/articles" : "/redirect"}
                  className="flex items-center gap-2 cursor-pointer hover:underline underline-offset-4"
                >
                  <FileText color="#365e7d" /> Articles
                </Link>
              </ul>
            ) : (
              <ul className="flex items-center gap-5 font-medium text-[1.15rem] text-gray-500">
                <Link
                  to="/"
                  className="flex items-center gap-2 cursor-pointer hover:underline underline-offset-4"
                >
                  <HomeIcon color="#365e7d" /> Home
                </Link>
                <Link
                  to="/jobs"
                  className="flex items-center gap-2 cursor-pointer hover:underline underline-offset-4"
                >
                  <Briefcase color="#365e7d" /> Jobs
                </Link>
                <Link
                  to={user !== null ? "/companies" : "/redirect"}
                  className="flex items-center gap-2 cursor-pointer hover:underline underline-offset-4"
                >
                  <Building2 color="#365e7d" /> Companies
                </Link>
                {user && (
                  <Link
                    to={user !== null ? "/chats" : "/redirect"}
                    className="flex items-center gap-2 cursor-pointer hover:underline underline-offset-4 relative"
                  >
                    {hasAnyUnread && (
                      <span className="absolute bg-color-DB w-2.5 h-2.5 rounded-full left-5 top-0"></span>
                    )}
                    <MessageCircleMore color="#365e7d" /> Chats
                  </Link>
                )}
                <Link
                  to="/articles"
                  className="flex items-center gap-2 cursor-pointer hover:underline underline-offset-4"
                >
                  <FileText color="#365e7d" /> Articles
                </Link>
              </ul>
            )}
          </section>
          {/* CONDITIONAL CONTENT */}
          {!user ? (
            // LOGIN & SIGNUP NAVIGATION
            <div className="flex items-center gap-6">
              <Link to="/login">
                <Button className="bg-color-DB outline-none border-none focus:outline-none hover:bg-color-LB text-[1rem] font-medium">
                  <LogIn /> Login
                </Button>
              </Link>
              <Link to="/signup">
                <Button className="bg-color-MAIN outline-none border-none focus:outline-none hover:bg-color-LBR text-[1rem] font-medium">
                  <User2Icon /> Sign Up
                </Button>
              </Link>
            </div>
          ) : (
            /* AVATAR POPOVER */
            <Popover>
              {/* POPOVER TRIGGER */}
              <PopoverTrigger asChild>
                <Avatar className="cursor-pointer">
                  <AvatarImage
                    src={user?.profile?.profilePhoto || AVATAR}
                    alt={user?.fullName}
                  />
                </Avatar>
              </PopoverTrigger>
              {/* POPOVER CONTENT */}
              <PopoverContent className="w-[350px] flex flex-col items-center justify-center gap-3 tracking-[0.5px] z-[100000]">
                {/* AVATAR */}
                <Avatar className="cursor-pointer w-[66px] h-[66px]">
                  <AvatarImage
                    src={user?.profile?.profilePhoto || AVATAR}
                    alt={user?.fullName}
                  />
                </Avatar>
                {/* NAME */}
                <h4 className="font-medium text-[1.2rem]">{user?.fullName}</h4>
                {/* BIO */}
                <p className="text-sm text-muted-foreground text-center">
                  {user?.profile?.bio}
                </p>
                {/* NAVIGATION SECTION */}
                <div className="flex items-center gap-6">
                  <Button
                    onClick={() =>
                      navigate(
                        `${
                          user && user.role === "STUDENT"
                            ? "/profile"
                            : "/admin/profile"
                        }`
                      )
                    }
                    className="bg-color-DB outline-none border-none focus:outline-none hover:bg-color-LB text-[1rem] font-medium"
                  >
                    <User2Icon /> View Profile
                  </Button>
                  <Button
                    onClick={logoutHandler}
                    className="bg-color-MAIN outline-none border-none focus:outline-none hover:bg-color-LBR text-[1rem] font-medium"
                  >
                    <LogOut /> Logout
                  </Button>
                </div>
              </PopoverContent>
            </Popover>
          )}
        </div>
      </div>
    </div>
  );
};

export default Navbar;
