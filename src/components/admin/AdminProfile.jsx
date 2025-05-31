// <= IMPORTS =>
import {
  Briefcase,
  Building2,
  Edit2,
  Lock,
  Mail,
  Phone,
  ShieldBanIcon,
  ShieldCheckIcon,
  Trash2,
  Verified,
} from "lucide-react";
import { Avatar, AvatarImage } from "../ui/avatar";
import { Button } from "../ui/button";
import SKILL from "../../assets/images/SKILL.png";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import AVATAR from "../../assets/images/AVATAR.png";
import Navbar from "../shared/Navbar";
import Swal from "sweetalert2";

const AdminProfile = () => {
  // NAVIGATION
  const navigate = useNavigate();
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
            <div className="w-full flex items-center justify-end">
              <Button
                onClick={() => navigate("/profile/update")}
                className="bg-color-DB outline-none border-none focus:outline-none hover:bg-color-LB text-[1rem] font-medium"
              >
                <Edit2 /> Edit Profile
              </Button>
            </div>
            {/* AVATAR */}
            <div className="w-full">
              <Avatar className="w-[76px] h-[76px]">
                <AvatarImage
                  src={user?.profile?.profilePhoto || AVATAR}
                  alt={user?.fullName}
                />
              </Avatar>
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
            {/* LINKS */}
            <div className="w-full flex flex-col items-start justify-center gap-[1rem]">
              <h1 className="font-medium text-[1.5rem] text-gray-600">Links</h1>
              <div className="flex items-center flex-wrap gap-[1rem]">
                <Button
                  onClick={() => navigate("/admin/companies")}
                  className="bg-color-DB outline-none border-none focus:outline-none hover:bg-color-LB text-[1rem] font-medium"
                >
                  <Building2 /> View Companies
                </Button>
                <Button
                  onClick={() => navigate("/admin/jobs")}
                  className="bg-color-DB outline-none border-none focus:outline-none hover:bg-color-LB text-[1rem] font-medium"
                >
                  <Briefcase /> View Jobs
                </Button>
              </div>
            </div>
            {/* ACTIONS */}
            <div className="w-full flex flex-col items-start justify-center flex-wrap gap-[1rem]">
              <h1 className="font-medium text-[1.5rem] text-gray-600">
                Actions
              </h1>
              <div className="flex items-center flex-wrap gap-[1rem]">
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

export default AdminProfile;
