// <= IMPORTS =>
import { useNavigate, useParams } from "react-router-dom";
import Navbar from "../shared/Navbar";
import { Button } from "../ui/button";
import { ArrowLeftCircle, Building, Edit2, Loader2 } from "lucide-react";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setLoading } from "@/redux/authSlice";
import axios from "axios";
import { COMPANY_API_ENDPOINT } from "@/utils/constants";
import { toast } from "sonner";
import useGetSingleCompanyById from "@/hooks/useGetCompanyById";

const CompanySetup = () => {
  // NAVIGATION
  const navigate = useNavigate();
  // LOADING STATE
  const { loading } = useSelector((store) => store.auth);
  // DISPATCH
  const dispatch = useDispatch();
  // RETRIEVING COMPANY ID FROM URL PARAMS
  const params = useParams();
  const companyId = params.id;
  // USING GET COMPANY BY IF HOOK
  useGetSingleCompanyById(companyId);
  // GETTING SINGLE COMPANY FROM COMPANY SLICE
  const { singleCompany } = useSelector((store) => store.company);
  // STATE MANAGEMENT
  const [input, setInput] = useState({
    name: "",
    description: "",
    website: "",
    location: "",
    file: null,
  });
  // EVENT HANDLER
  const changeEventHandler = (e) => {
    setInput({ ...input, [e.target.name]: e.target.value });
  };
  // FILE EVENT HANDLER
  const changeFileHandler = (e) => {
    setInput({ ...input, file: e.target.files?.[0] });
  };
  // SUBMIT HANDLER
  const submitHandler = async (e) => {
    // PREVENTING PAGE REFRESH
    e.preventDefault();
    // CREATING FORM DATA OBJECT
    const formData = new FormData();
    formData.append("name", input.name);
    formData.append("description", input.description);
    formData.append("website", input.website);
    formData.append("location", input.location);
    // IF LOGO PROVIDED
    if (input.file) {
      formData.append("file", input.file);
    }
    try {
      // LOADING STATE
      dispatch(setLoading(true));
      // MAKING REQUEST
      const response = await axios.put(
        `${COMPANY_API_ENDPOINT}/update/${companyId}`,
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
        // TOASTING SUCCESS MESSAGE
        toast.success(response.data.message);
        // NAVIGATING TO ADMIN HOMEPAGE
        navigate("/admin/companies");
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
  // PREFETCHING EXISTING DATA FOR THE COMPANY
  useEffect(() => {
    setInput({
      name: singleCompany.name || "",
      description: singleCompany.description || "",
      website: singleCompany.website || "",
      location: singleCompany.location || "",
      file: singleCompany.file || null,
    });
  }, [singleCompany]);
  return (
    <>
      <Navbar />
      {/* COMPANY SETUP MAIN WRAPPER */}
      <section className="w-full flex items-center justify-center sm:px-[2rem] px-[1rem] py-[2rem]">
        {/* COMPANY SETUP CONTENT WRAPPER */}
        <section className="flex flex-col items-center justify-center gap-[2rem] w-full border-2 border-gray-100 rounded-xl sm:p-[2rem] p-[1rem] tracking-[0.5px]">
          {/* HEADING & GO BACK */}
          <div className="w-full flex items-center justify-between flex-wrap-reverse gap-[2rem]">
            <div className="flex items-center gap-[1rem]">
              <Building className="text-color-DB w-[3rem] h-[3rem]" />
              <h1 className="font-[600] text-gray-500 text-[2rem]">
                Company Setup
              </h1>
            </div>
            <Button
              onClick={() => navigate("/admin/companies")}
              className="bg-color-DB outline-none border-none focus:outline-none hover:bg-color-LB text-[1rem] font-medium"
            >
              <ArrowLeftCircle /> Go Back
            </Button>
          </div>
          {/* MAIN FORM ELEMENT */}
          <form onSubmit={submitHandler} className="w-full md:w-2/3">
            {/* COMPANY NAME */}
            <div className="my-[1rem]">
              <label
                htmlFor="name"
                className="text-[1rem] font-[600] uppercase text-gray-500"
              >
                Company Name
              </label>
              <input
                type="text"
                id="name"
                name="name"
                value={input.name}
                onChange={changeEventHandler}
                className="w-full px-[1rem] py-[0.5rem] outline-none border-2 border-gray-100 rounded-md text-gray-500"
                spellCheck={false}
              />
            </div>
            {/* DESCRIPTION */}
            <div className="my-[1rem]">
              <label
                htmlFor="description"
                className="text-[1rem] font-[600] uppercase text-gray-500"
              >
                Description
              </label>
              <textarea
                type="text"
                id="description"
                name="description"
                value={input.description}
                onChange={changeEventHandler}
                className="w-full px-[1rem] py-[0.5rem] outline-none border-2 border-gray-100 rounded-md text-gray-500"
                spellCheck={false}
              />
            </div>
            {/* WEBSITE */}
            <div className="my-[1rem]">
              <label
                htmlFor="website"
                className="text-[1rem] font-[600] uppercase text-gray-500"
              >
                Website
              </label>
              <input
                type="text"
                id="website"
                name="website"
                value={input.website}
                onChange={changeEventHandler}
                className="w-full px-[1rem] py-[0.5rem] outline-none border-2 border-gray-100 rounded-md text-gray-500"
                spellCheck={false}
              />
            </div>
            {/* LOCATION */}
            <div className="my-[1rem]">
              <label
                htmlFor="location"
                className="text-[1rem] font-[600] uppercase text-gray-500"
              >
                Location
              </label>
              <input
                type="text"
                id="location"
                name="location"
                value={input.location}
                onChange={changeEventHandler}
                className="w-full px-[1rem] py-[0.5rem] outline-none border-2 border-gray-100 rounded-md text-gray-500"
                spellCheck={false}
              />
            </div>
            {/* COMPANY LOGO */}
            <div className="my-[1rem]">
              <label
                htmlFor="file"
                className="text-[1rem] font-[600] uppercase text-gray-500"
              >
                Company Logo
              </label>
              <input
                type="file"
                id="file"
                name="file"
                accept="image/*"
                onChange={changeFileHandler}
                className="w-full px-[1rem] py-[0.5rem] outline-none border-2 border-gray-100 rounded-md text-gray-500"
              />
            </div>
            {/* UPDATE & LOADING BUTTON */}
            {loading ? (
              <Button
                type="submit"
                className="w-full bg-color-DB hover:bg-color-LB font-medium text-[1rem] focus:outline-none outline-none border-none"
              >
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Updating Company
              </Button>
            ) : (
              <Button
                type="submit"
                className="w-full bg-color-DB hover:bg-color-LB font-medium text-[1rem] focus:outline-none outline-none border-none"
              >
                <Edit2 />
                Update Company
              </Button>
            )}
          </form>
        </section>
      </section>
    </>
  );
};

export default CompanySetup;
