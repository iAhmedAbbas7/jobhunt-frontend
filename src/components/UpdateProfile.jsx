// <= IMPORTS =>
import { Edit2, Loader2 } from "lucide-react";
import Navbar from "./shared/Navbar";
import { useState } from "react";
import { Button } from "./ui/button";
import { useDispatch, useSelector } from "react-redux";
import axios from "axios";
import { USER_API_ENDPOINT } from "@/utils/constants";
import { setLoading, setUser } from "@/redux/authSlice";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";

const UpdateProfile = () => {
  // NAVIGATE
  const navigate = useNavigate();
  // LOADING STATE
  const { loading } = useSelector((store) => store.auth);
  // DISPATCH
  const dispatch = useDispatch();
  // USER CREDENTIALS
  const { user } = useSelector((store) => store.auth);
  // STATE MANAGEMENT
  const [input, setInput] = useState({
    fullName: user?.fullName,
    phoneNumber: user?.phoneNumber,
    bio: user?.profile?.bio,
    skills: user?.profile?.skills?.map((skill) => skill),
  });
  // EVENT HANDLER
  const changeEventHandler = (e) => {
    setInput({ ...input, [e.target.name]: e.target.value });
  };
  // SUBMIT HANDLER
  const submitHandler = async (e) => {
    // PREVENTING PAGE REFRESH
    e.preventDefault();
    // CREATING FORM DATA OBJECT
    const formData = new FormData();
    formData.append("fullName", input.fullName);
    formData.append("email", input.email);
    formData.append("phoneNumber", input.phoneNumber);
    formData.append("bio", input.bio);
    formData.append("skills", input.skills);
    // IF RESUME PROVIDED
    if (input.file) {
      formData.append("file", input.file);
    }
    try {
      // LOADING STATE
      dispatch(setLoading(true));
      // MAKING REQUEST
      const response = await axios.post(
        `${USER_API_ENDPOINT}/profile/update`,
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
        // CREATING THE UPDATED USER
        const updatedUser = response.data.updatedUser;
        // SAVING UPDATED USER IN THE AUTH STATE
        dispatch(setUser(updatedUser));
        // TOASTING SUCCESS MESSAGE
        toast.success(response.data.message);
        // NAVIGATING TO THE USER PROFILE PAGE AFTER UPDATE
        navigate(
          updatedUser.role === "STUDENT" ? "/profile" : "/admin/profile"
        );
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
      {/* UPDATE PROFILE MAIN WRAPPER */}
      <section className="w-full sm:px-[2rem] px-[1rem] py-[2rem] tracking-[0.5px] flex items-center justify-center">
        {/* UPDATE PROFILE CONTENT WRAPPER */}
        <section className="w-full flex items-start justify-center flex-col flex-wrap gap-[1rem] tracking-[0.5px] border-2 border-gray-100 rounded-xl sm:p-[2rem] p-[1rem] md:w-2/3">
          {/* HEADING */}
          <div className="text-gray-500 font-MEDIUM text-[2rem] flex items-center justify-center gap-[1rem]">
            <span className="text-color-MAIN">
              <Edit2 />
            </span>
            <h1>Update Profile</h1>
          </div>
          {/* MAIN FORM ELEMENT */}
          <form onSubmit={submitHandler} className="w-full">
            {/* NAME */}
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
                spellCheck={false}
              />
            </div>
            {/* PROFILE BIO */}
            <div className="my-[1rem]">
              <label
                htmlFor="bio"
                className="text-[1rem] font-[600] uppercase text-gray-500"
              >
                Profile Bio
              </label>
              <textarea
                type="text"
                id="bio"
                name="bio"
                value={input.bio}
                onChange={changeEventHandler}
                className="w-full px-[1rem] py-[0.5rem] outline-none border-2 border-gray-100 rounded-md text-gray-500"
                spellCheck="false"
              />
            </div>
            {/* NUMBER */}
            <div className="my-[1rem]">
              <label
                htmlFor="phoneNumber"
                className="text-[1rem] font-[600] uppercase text-gray-500"
              >
                Phone Number
              </label>
              <input
                type="text"
                id="phoneNumber"
                name="phoneNumber"
                value={input.phoneNumber}
                onChange={changeEventHandler}
                className="w-full px-[1rem] py-[0.5rem] outline-none border-2 border-gray-100 rounded-md text-gray-500"
              />
            </div>
            {/* SKILLS */}
            <div className="my-[1rem]">
              <label
                htmlFor="skills"
                className="text-[1rem] font-[600] uppercase text-gray-500"
              >
                Skills
              </label>
              <input
                type="text"
                id="skills"
                name="skills"
                value={input.skills}
                onChange={changeEventHandler}
                className="w-full px-[1rem] py-[0.5rem] outline-none border-2 border-gray-100 rounded-md text-gray-500"
                spellCheck="false"
              />
            </div>
            {/* UPDATE & LOADING BUTTON */}
            {loading ? (
              <Button
                type="submit"
                className="w-full bg-color-DB hover:bg-color-LB font-medium text-[1rem] focus:outline-none outline-none border-none"
              >
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Updating Profile
              </Button>
            ) : (
              <Button
                type="submit"
                className="w-full bg-color-DB hover:bg-color-LB font-medium text-[1rem] focus:outline-none outline-none border-none"
              >
                <Edit2 />
                Update
              </Button>
            )}
          </form>
        </section>
      </section>
    </>
  );
};

export default UpdateProfile;
