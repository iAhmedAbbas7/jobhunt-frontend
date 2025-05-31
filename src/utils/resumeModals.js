// <= IMPORTS =>
import axios from "axios";
import Swal from "sweetalert2";
import { USER_API_ENDPOINT } from "./constants";
import { toast } from "sonner";
import { setUser } from "@/redux/authSlice";

/**
 * OPENS A SWEET ALERT 2 MODAL FOR RESUME UPLOAD
 * @param {Function} dispatch - Redux Dispatch Function
 */
// <= RESUME UPLOAD MODAL =>
export const uploadResumeWithModal = async (dispatch) => {
  // SETTING VALUE AS FILE WHEN FIRING MODAL
  const { value: file } = await Swal.fire({
    title: "Upload Resume",
    html: `<input type="file" class="rounded-md border border-gray-200 p-[1rem] bg-gray-100 outline-none focus:outline-none" accept="application/pdf" id="resumeInput" />`,
    showCancelButton: true,
    focusConfirm: false,
    confirmButtonText: "Upload",
    confirmButtonColor: "#cc9675",
    cancelButtonColor: "#365e7d",
    customClass: {
      container: "my-swal-container",
    },
    // CHECKING IF THE FILE IS SELECTED OR NOT
    preConfirm: () => {
      const input = document.getElementById("resumeInput");
      if (!input || !input.files || input.files.length === 0) {
        Swal.showValidationMessage("Please Select a File");
        return null;
      }
      return input.files[0];
    },
  });
  // IF FILE IS SELECTED
  if (file) {
    // CREATING FORM DATA INSTANCE
    const formData = new FormData();
    formData.append("file", file);
    // MAKING RESUME UPLOAD REQUEST
    try {
      const response = await axios.post(
        `${USER_API_ENDPOINT}/resume/upload`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
          withCredentials: true,
        }
      );
      if (response.data.success) {
        // TOASTING SUCCESS MESSAGE
        toast.success(response.data.message);
        // SAVING UPDATED USER IN THE AUTH SLICE
        dispatch(setUser(response.data.updatedUser));
      }
    } catch (error) {
      console.log(error.response.data.message);
      // TOASTING ERROR MESSAGE
      toast.error(error.response.data.message || "Failed to Upload Resume");
    }
  }
};

/**
 * OPENS A SWEET ALERT 2 MODAL FOR RESUME DELETE
 * @param {Function} dispatch - Redux Dispatch Function
 */
// <= RESUME DELETE MODAL =>
export const deleteResumeWithModal = async (dispatch) => {
  const result = await Swal.fire({
    title: "Resume Delete Requested",
    text: "This Action will Permanently Delete your Resume",
    icon: "warning",
    showCancelButton: true,
    confirmButtonText: "Yes Delete Resume",
    cancelButtonText: "Cancel",
    confirmButtonColor: "#cc9675",
    cancelButtonColor: "#365e7d",
    customClass: {
      container: "my-swal-container",
    },
  });
  // IF RESULT IS CONFIRMED
  if (result.isConfirmed) {
    // MAKING RESUME DELETE REQUEST
    try {
      const response = await axios.delete(
        `${USER_API_ENDPOINT}/resume/delete`,
        { withCredentials: true }
      );
      // IF RESPONSE SUCCESS
      if (response.data.success) {
        toast.success(response.data.message);
        // SAVING UPDATED USER IN THE AUTH SLICE
        dispatch(setUser(response.data.updatedUser));
      }
    } catch (error) {
      console.log(error.response.data.message);
      // TOASTING ERROR MESSAGE
      toast.error(error.response.data.message || "Failed to Delete Resume");
    }
  }
};
