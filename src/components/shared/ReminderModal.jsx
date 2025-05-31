// <= IMPORTS =>
import Swal from "sweetalert2";
import { useSelector } from "react-redux";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const ReminderModal = () => {
  // STATE MANAGEMENT
  const [shown, setShown] = useState(false);
  // NAVIGATION
  const navigate = useNavigate();
  // CURRENT USER CREDENTIALS
  const { user } = useSelector((store) => store.auth);
  // EFFECT TO SHOW MODAL
  useEffect(() => {
    // IF THERE IS NO USER OR THE MEDAL IS ALREADY SHOWN
    if (!user || user?.role === "RECRUITER" || shown) return;
    // CHECKING IF THE LOGGED IN USER HAS RESUME ADDED
    const notHasResume = !user?.profile?.resume;
    // CHECKING IF THE LOGGED IN USER HAS ADDED SKILLS
    const notHasSkills =
      !user?.profile?.skills || user?.profile?.skills.length === 0;
    // MODAL MESSAGES BASED ON WHAT IS MISSING
    // 1 : IF RESUME IS MISSING
    const resumeMessage =
      notHasResume &&
      "It Looks like you haven't added your Resume Yet. Add Resume to get the most out of JobHunt App";
    // 2 : IF SKILLS ARE MISSING
    const skillsMessage =
      notHasSkills &&
      "It Looks like you haven't added your Skills Yet. Add Skills to get the most out of JobHunt App";
    // 3 : IF BOTH RESUME AND SKILLS ARE MISSING
    const bothMessage =
      notHasResume &&
      notHasSkills &&
      "It Looks like you haven't added your Resume and Skills Yet. Add Resume and Skills to get the most out of JobHunt App";
    // IF HE HAS MISSING RESUME OR SKILLS
    if (notHasResume || notHasSkills) {
      // CREATING A TIMEOUT FUNCTION
      const timeOut = setTimeout(async () => {
        const result = await Swal.fire({
          title: "Complete Your Profile",
          text: `${
            (notHasResume && resumeMessage) ||
            (notHasSkills && skillsMessage) ||
            (notHasResume && notHasSkills && bothMessage)
          }`,
          icon: "info",
          showCancelButton: true,
          cancelButtonText: "Skip",
          confirmButtonColor: "#cc9675",
          cancelButtonColor: "#365e7d",
          allowOutsideClick: false,
          confirmButtonText: "Update Profile",
          customClass: {
            container: "my-swal-container",
          },
        });
        // SETTING THE MODAL SHOWN STATE TO TRUE
        setShown(true);
        // IF THE USER CANCELS, RETURNING
        if (!result.isConfirmed) return;
        // IF CONFIRMED NAVIGATING TO PROFILE UPDATE PAGE
        if (result.isConfirmed) navigate("/profile/update");
      }, 30000);
      // CLEANUP ON UNMOUNT
      return () => {
        clearTimeout(timeOut);
      };
    }
  }, [user, navigate, shown]);
  return null;
};

export default ReminderModal;
