// <= IMPORTS =>
import { Building, Check, Info, Loader2 } from "lucide-react";
import Navbar from "../shared/Navbar";
import { Button } from "../ui/button";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { COMPANY_API_ENDPOINT } from "@/utils/constants";
import { useState } from "react";
import { toast } from "sonner";
import { useDispatch, useSelector } from "react-redux";
import { setSingleCompany } from "@/redux/companySlice";
import { setLoading } from "@/redux/authSlice";

const CreateCompany = () => {
  // NAVIGATION
  const navigate = useNavigate();
  // DISPATCH
  // LOADING STATE
  const { loading } = useSelector((store) => store.auth);
  const dispatch = useDispatch();
  // COMPANY NAME STATE MANAGEMENT
  const [companyName, setCompanyName] = useState();
  // REGISTER NEW COMPANY HANDLER
  const registerNewCompany = async () => {
    try {
      // LOADING STATE
      dispatch(setLoading(true));
      // MAKING REQUEST
      const response = await axios.post(
        `${COMPANY_API_ENDPOINT}/register`,
        { companyName },
        {
          headers: {
            "Content-Type": "application/json",
          },
          withCredentials: true,
        }
      );
      if (response?.data?.success) {
        // SAVING SINGLE COMPANY IN THE COMPANY SLICE
        dispatch(setSingleCompany(response?.data?.company));
        // TOASTING SUCCESS MESSAGE
        toast.success(response.data.message);
        // GETTING COMPANY ID FROM THE RESPONSE
        const companyId = response?.data?.company?._id;
        // NAVIGATING TO COMPANY DETAILS ROUTE
        navigate(`/admin/companies/${companyId}`);
      }
    } catch (error) {
      // TOASTING ERROR MESSAGE
      toast.error(error.response.data.message);
      console.log(error);
    } finally {
      // LOADING STATE
      dispatch(setLoading(false));
    }
  };

  return (
    <>
      <Navbar />
      {/* CREATE COMPANY MAIN WRAPPER */}
      <section className="w-full flex items-center justify-center sm:px-[2rem] px-[1rem] py-[2rem]">
        {/* CREATE COMPANY CONTENT WRAPPER */}
        <section className="flex flex-col gap-[2rem] w-full border-2 border-gray-100 rounded-xl sm:p-[2rem] p-[1rem]">
          {/* HEADING */}
          <div className="flex items-center gap-[1rem]">
            <Building className="text-color-DB w-[3rem] h-[3rem]" />
            <h1 className="font-[600] text-gray-500 text-[2rem]">
              Your Company Name
            </h1>
          </div>
          {/* INFO CAPTION */}
          <span className="flex items-center gap-[0.5rem] italic text-gray-500 text-sm">
            <Info />
            <span>
              Your Company&apos;s Name will represent your Organization & you
              can always change it later.
            </span>
          </span>
          {/* COMPANY NAME */}
          <div>
            <input
              type="text"
              id="companyName"
              name="companyName"
              onChange={(e) => setCompanyName(e.target.value)}
              className="w-full px-[1rem] py-[0.5rem] outline-none border-2 border-gray-100 rounded-md text-gray-500"
              spellCheck={false}
              placeholder="Your Company Name"
            />
          </div>
          {/* BUTTONS */}
          <div className="flex items-center gap-[2rem]">
            <Button
              onClick={() => navigate("/admin/companies")}
              className="bg-color-DB outline-none border-none focus:outline-none hover:bg-color-LB text-[1rem] font-medium"
            >
              <span>X</span> Cancel
            </Button>
            {loading ? (
              <Button className="bg-color-MAIN hover:bg-color-LBR font-medium text-[1rem] focus:outline-none outline-none border-none">
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Registering Company
              </Button>
            ) : (
              <Button
                onClick={registerNewCompany}
                className="bg-color-MAIN hover:bg-color-LBR font-medium text-[1rem] focus:outline-none outline-none border-none"
              >
                <Check />
                Register
              </Button>
            )}
          </div>
        </section>
      </section>
    </>
  );
};

export default CreateCompany;
