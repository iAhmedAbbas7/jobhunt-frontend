// <= IMPORTS =>
import Swal from "sweetalert2";
import Navbar from "./shared/Navbar";
import { Button } from "./ui/button";
import PDF from "../assets/images/PDF.png";
import SKILL from "../assets/images/SKILL.png";
import { useNavigate } from "react-router-dom";
import AVATAR from "../assets/images/AVATAR.png";
import { Avatar, AvatarImage } from "./ui/avatar";
import { useDispatch, useSelector } from "react-redux";
import useGetAppliedJobs from "@/hooks/useGetAppliedJobs";
import {
  Bookmark,
  Briefcase,
  Check,
  Edit2,
  Lock,
  Mail,
  Phone,
  Plus,
  ShieldBanIcon,
  ShieldCheckIcon,
  ThumbsUp,
  Trash2,
  Verified,
} from "lucide-react";
import {
  deleteResumeWithModal,
  uploadResumeWithModal,
} from "@/utils/resumeModals";
import {
  deleteAvatarWithModal,
  uploadAvatarWithModal,
} from "@/utils/avatarModals";

const Profile = () => {
  // USING ALL APPLIED JOBS HOOK
  useGetAppliedJobs();
  // NAVIGATION
  const navigate = useNavigate();
  // DISPATCH
  const dispatch = useDispatch();
  // USER CREDENTIALS
  const { user } = useSelector((store) => store.auth);
  // DELETE USER MODAL
  const deleteUserModal = async () => {
    // CONFIRMATION DIALOG BEFORE DELETING ACCOUNT
    const result = await Swal.fire({
      title: "Account Deletion Requested",
      text: "You will be Directed to a Deletion Verification Page where after Confirmation your Account will be Permanently Deleted",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#cc9675",
      cancelButtonColor: "#365e7d",
      confirmButtonText: "Start Verification",
      customClass: {
        container: "my-swal-container",
      },
    });
    // IF THE USER CANCELS, RETURNING
    if (!result.isConfirmed) return;
    // IF CONFIRMED NAVIGATING TO DELETION VERIFICATION PAGE
    navigate("/deleteAccountVerification");
  };
  // CHANGE PASSWORD MODAL
  const changePasswordModal = async () => {
    // CONFIRMATION DIALOG BEFORE DELETING ACCOUNT
    const result = await Swal.fire({
      title: "Password Change Requested",
      text: "You will need to Complete a Verification Process in Order to Change the Password for your Account",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#cc9675",
      cancelButtonColor: "#365e7d",
      confirmButtonText: "Start Verification",
      customClass: {
        container: "my-swal-container",
      },
    });
    // IF THE USER CANCELS, RETURNING
    if (!result.isConfirmed) return;
    // IF CONFIRMED NAVIGATING TO DELETION VERIFICATION PAGE
    navigate("/changePassword");
  };
  // CHANGE EMAIL MODAL
  const changeEmailModal = async () => {
    // CONFIRMATION DIALOG BEFORE DELETING ACCOUNT
    const result = await Swal.fire({
      title: "Email Update Requested",
      text: "You will need to Complete a Verification Process in Order to Update the Email for your Account",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#cc9675",
      cancelButtonColor: "#365e7d",
      confirmButtonText: "Start Verification",
      customClass: {
        container: "my-swal-container",
      },
    });
    // IF THE USER CANCELS, RETURNING
    if (!result.isConfirmed) return;
    // IF CONFIRMED NAVIGATING TO DELETION VERIFICATION PAGE
    navigate("/updateEmail");
  };
  // UPLOAD RESUME HANDLING
  const handleResumeUpload = async () => {
    await uploadResumeWithModal(dispatch);
  };
  // UPLOAD RESUME HANDLING
  const handleResumeDelete = async () => {
    await deleteResumeWithModal(dispatch);
  };
  // UPLOAD RESUME HANDLING
  const handleAvatarUpload = async () => {
    await uploadAvatarWithModal(dispatch);
  };
  // UPLOAD RESUME HANDLING
  const handleAvatarDelete = async () => {
    await deleteAvatarWithModal(dispatch);
  };
  // ENABLE 2FA MODAL
  const enable2FAModal = async () => {
    // CONFIRMATION DIALOG BEFORE DELETING ACCOUNT
    const result = await Swal.fire({
      title: "Enable 2FA Requested",
      text: "You will need to Complete a Verification Process in Order to Enable Two Factor Authentication for your Account",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#cc9675",
      cancelButtonColor: "#365e7d",
      confirmButtonText: "Start Verification",
      customClass: {
        container: "my-swal-container",
      },
    });
    // IF THE USER CANCELS, RETURNING
    if (!result.isConfirmed) return;
    // IF CONFIRMED NAVIGATING TO DELETION VERIFICATION PAGE
    navigate("/enable2FA");
  };
  // DISABLE 2FA MODAL
  const disable2FAModal = async () => {
    // CONFIRMATION DIALOG BEFORE DELETING ACCOUNT
    const result = await Swal.fire({
      title: "Disable 2FA Requested",
      text: "You will need to Complete a Verification Process in Order to Disable Two Factor Authentication for your Account",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#cc9675",
      cancelButtonColor: "#365e7d",
      confirmButtonText: "Start Verification",
      customClass: {
        container: "my-swal-container",
      },
    });
    // IF THE USER CANCELS, RETURNING
    if (!result.isConfirmed) return;
    // IF CONFIRMED NAVIGATING TO DELETION VERIFICATION PAGE
    navigate("/disable2FA");
  };
  return (
    <>
      <section>
        <Navbar />
        {/* PROFILE MAIN WRAPPER */}
        <section className="w-full sm:px-[2rem] px-[1rem] py-[2rem]">
          {/* PROFILE CONTENT WRAPPER */}
          <section className="w-full flex items-start justify-center flex-col gap-[1rem] border-2 border-gray-100 rounded-xl sm:p-[2rem] p-[1rem]">
            {/* EDIT PROFILE */}
            <div className="w-full flex items-center justify-end flex-wrap">
              <Button
                onClick={() => navigate("/profile/update")}
                className="bg-color-DB outline-none border-none focus:outline-none hover:bg-color-LB text-[1rem] font-medium"
              >
                <Edit2 /> Edit Profile
              </Button>
            </div>
            {/* AVATAR */}
            <div className="w-full flex items-center gap-[1rem]">
              <Avatar className="w-[94px] h-[94px]">
                <AvatarImage
                  src={user?.profile?.profilePhoto || AVATAR}
                  alt={user?.fullName}
                />
              </Avatar>
              {user.profile.profilePhoto ? (
                <div
                  onClick={handleAvatarDelete}
                  title="Delete Avatar"
                  className="cursor-pointer rounded-full p-1 bg-color-LB text-white hover:bg-color-DB"
                >
                  <Trash2 />
                </div>
              ) : (
                <div
                  onClick={handleAvatarUpload}
                  title="Upload Avatar"
                  className="cursor-pointer rounded-full p-1 bg-color-LB text-white hover:bg-color-DB"
                >
                  <Plus />
                </div>
              )}
            </div>
            {/* NAME & BIO */}
            <div className="w-full">
              <h1 className="font-[500] text-[1.75rem] text-gray-600">
                {user?.fullName}
              </h1>
              <p className="text-sm text-gray-500">{user?.profile?.bio}</p>
            </div>
            {/* CONTACT DETAILS */}
            <div className="w-full flex items-start justify-center flex-col gap-[1rem]">
              <div className="flex items-center gap-[1rem] text-color-MAIN">
                <Mail size={40} />
                <span className="text-gray-500 font-medium text-[1.1rem]">
                  {user?.email}
                </span>
                <span title="Verified">
                  {user?.isEmailVerified && <Verified />}
                </span>
              </div>
              <div className="flex items-center gap-[1rem] text-color-MAIN">
                <Phone size={40} />
                <span className="text-gray-500 font-medium text-[1.1rem]">
                  {user?.phoneNumber}
                </span>
              </div>
            </div>
            {/* SKILLS */}
            <div className="w-full flex flex-col items-start justify-center gap-[1rem]">
              <h1 className="font-medium text-[1.5rem] text-gray-600">
                Skills
              </h1>
              <div className="flex flex-wrap gap-[1rem]">
                {user?.profile?.skills.length !== 0 ? (
                  user?.profile?.skills.map((skill, index) => (
                    <div
                      key={index}
                      className="px-[1rem] py-[0.5rem] bg-gray-100 text-gray-500 rounded-full"
                    >
                      <div>{skill}</div>
                    </div>
                  ))
                ) : (
                  <span className="font-medium text-gray-500 bg-gray-100 px-[1rem] py-[0.5rem] rounded-lg flex items-center gap-[0.5rem]">
                    <img
                      src={SKILL}
                      alt="Skill Icon"
                      className="w-[34px] h-[34px]"
                    />
                    <span>No Added Skills</span>
                  </span>
                )}
              </div>
            </div>
            {/* RESUME */}
            <div className="w-full flex flex-col items-start justify-center gap-[1rem]">
              <h1 className="font-medium text-[1.5rem] text-gray-600">
                Resume
              </h1>
              {user?.profile?.resume ? (
                <div className="flex items-center gap-[0.5rem]">
                  <div className="font-medium text-gray-500 bg-gray-100 px-[1rem] py-[0.5rem] rounded-lg flex items-center gap-[0.5rem]">
                    <img
                      src={PDF}
                      alt="Pdf Icon"
                      className="w-[34px] h-[34px]"
                    />
                    <a target="_blank" href={user?.profile?.resume}>
                      {user?.profile?.resumeOriginalName}
                    </a>
                  </div>
                  <div
                    onClick={handleResumeDelete}
                    title="Delete Resume"
                    className="cursor-pointer rounded-full p-1 bg-color-LB text-white hover:bg-color-DB"
                  >
                    <Trash2 />
                  </div>
                </div>
              ) : (
                <div className="flex items-center gap-[0.5rem]">
                  <div className="font-medium text-gray-500 bg-gray-100 px-[1rem] py-[0.5rem] rounded-lg flex items-center gap-[0.5rem]">
                    <img
                      src={PDF}
                      alt="Pdf Icon"
                      className="w-[34px] h-[34px]"
                    />
                    <span>No Added Resume</span>
                  </div>
                  <div
                    onClick={handleResumeUpload}
                    title="Add Resume"
                    className="cursor-pointer rounded-full p-1 bg-color-LB text-white hover:bg-color-DB"
                  >
                    <Plus />
                  </div>
                </div>
              )}
            </div>
            {/* SECURITY */}
            <div className="w-full flex flex-col items-start justify-center gap-[1rem]">
              <h1 className="font-medium text-[1.5rem] text-gray-600">
                Security
              </h1>
              <div className="flex items-center flex-wrap gap-[1rem]">
                <Button
                  onClick={
                    user?.isTwoFactorEnabled ? disable2FAModal : enable2FAModal
                  }
                  className="bg-color-DB outline-none border-none focus:outline-none hover:bg-color-LB text-[1rem] font-medium"
                >
                  {user?.isTwoFactorEnabled ? (
                    <>
                      <ShieldBanIcon /> Disable 2 Factor Authentication
                    </>
                  ) : (
                    <>
                      <ShieldCheckIcon /> Enable 2 Factor Authentication
                    </>
                  )}
                </Button>
              </div>
            </div>
            {/* PERSONAL */}
            <div className="w-full flex flex-col items-start justify-center flex-wrap gap-[1rem]">
              <h1 className="font-medium text-[1.5rem] text-gray-600">
                Personal
              </h1>
              <div className="flex items-start justify-center flex-col gap-[0.5rem]">
                <Button
                  onClick={() => navigate("/articles/liked")}
                  className="bg-color-DB outline-none border-none focus:outline-none hover:bg-color-LB text-[1rem] font-medium"
                >
                  <ThumbsUp /> View Liked Articles
                </Button>
                <Button
                  onClick={() => navigate("/articles/bookmarked")}
                  className="bg-color-DB outline-none border-none focus:outline-none hover:bg-color-LB text-[1rem] font-medium"
                >
                  <Bookmark /> View Bookmarked Articles
                </Button>
                <Button
                  onClick={() => navigate("/appliedJobs")}
                  className="bg-color-DB outline-none border-none focus:outline-none hover:bg-color-LB text-[1rem] font-medium"
                >
                  <Check /> View Applied Jobs
                </Button>
                <Button
                  onClick={() => navigate("/savedJobs")}
                  className="bg-color-DB outline-none border-none focus:outline-none hover:bg-color-LB text-[1rem] font-medium"
                >
                  <Bookmark /> View Saved Jobs
                </Button>
                <Button
                  onClick={() => navigate("/jobs/recommended")}
                  className="bg-color-DB outline-none border-none focus:outline-none hover:bg-color-LB text-[1rem] font-medium"
                >
                  <Briefcase /> View Recommended Jobs
                </Button>
              </div>
            </div>
            {/* ACTIONS */}
            <div className="w-full flex flex-col items-start justify-center flex-wrap gap-[1rem]">
              <h1 className="font-medium text-[1.5rem] text-gray-600">
                Actions
              </h1>
              <div className="flex items-start justify-center flex-col gap-[0.5rem]">
                <Button
                  onClick={changePasswordModal}
                  className="bg-color-DB outline-none border-none focus:outline-none hover:bg-color-LB text-[1rem] font-medium"
                >
                  <Lock /> Change Password
                </Button>
                <Button
                  onClick={changeEmailModal}
                  className="bg-color-DB outline-none border-none focus:outline-none hover:bg-color-LB text-[1rem] font-medium"
                >
                  <Mail /> Change Email
                </Button>
                <Button
                  onClick={deleteUserModal}
                  className="bg-color-DB outline-none border-none focus:outline-none hover:bg-color-LB text-[1rem] font-medium"
                >
                  <Trash2 /> Delete Profile
                </Button>
              </div>
            </div>
          </section>
        </section>
      </section>
    </>
  );
};

export default Profile;
