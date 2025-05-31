// <= IMPORTS =>
import axios from "axios";
import { toast } from "sonner";
import Select from "react-select";
import Navbar from "../shared/Navbar";
import { Button } from "../ui/button";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import SectionEditor from "../shared/SectionEditor";
import { ARTICLE_API_ENDPOINT } from "@/utils/constants";
import {
  ArrowLeft,
  FileText,
  MinusCircle,
  PlusCircleIcon,
  Send,
} from "lucide-react";

const CreateArticle = () => {
  // NAVIGATION
  const navigate = useNavigate();
  // STATE MANAGEMENT
  const [title, setTitle] = useState("");
  const [resetKey, setResetKey] = useState(0);
  const [bannerFile, setBannerFile] = useState(null);
  const [categoryOptions, setCategoryOptions] = useState([]);
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [sections, setSections] = useState([
    { heading: "", content: "", file: null, preview: null },
  ]);
  const [submitting, setSubmitting] = useState(false);
  // FETCHING EXISTING CATEGORIES FOR SUGGESTIONS
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await axios.get(`${ARTICLE_API_ENDPOINT}/categories`);
        // IF RESPONSE SUCCESS
        if (response.data.success) {
          const options = response.data.data.map((cat) => ({
            label: cat,
            value: cat,
          }));
          // SETTING CATEGORIES SUGGESTIONS IN THE LIST
          setCategoryOptions(options);
        }
      } catch (error) {
        console.error("Error Loading Category Suggestions!", error);
      }
    };
    fetchCategories();
  }, []);
  // ADD NEW SECTION
  const addSection = () => {
    setSections((s) => [
      ...s,
      { heading: "", content: "", file: null, preview: null },
    ]);
  };
  // REMOVE SECTION
  const removeSection = (idx) => {
    setSections((s) => s.filter((_, i) => i !== idx));
  };
  // UPDATE SECTION
  const updateSection = (idx, key, value) => {
    setSections((s) => {
      const copy = [...s];
      copy[idx] = { ...copy[idx], [key]: value };
      return copy;
    });
  };
  // BANNER IMAGE CHANGE HANDLER
  const onBannerChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setBannerFile({ file, preview: URL.createObjectURL(file) });
  };
  // SECTION IMAGE CHANGE HANDLER
  const onSectionImageChange = (idx, e) => {
    const file = e.target.files[0];
    if (!file) return;
    const preview = URL.createObjectURL(file);
    updateSection(idx, "file", file);
    updateSection(idx, "preview", preview);
  };
  // SUBMIT HANDLER
  const submitHandler = async (e) => {
    // PREVENTING PAGE REFRESH
    e.preventDefault();
    // DATA VALIDATION
    if (!title.trim()) return toast.error("Title is Required!");
    if (!bannerFile) return toast.error("Banner Image is Required!");
    if (sections.some((sec) => !sec.heading.trim() || !sec.content.trim())) {
      return toast.error("All Sections must have a Heading & Content!");
    }
    // SUBMITTING FLAG
    setSubmitting(true);
    try {
      // CREATING FORM DATA INSTANCE
      const formData = new FormData();
      // APPENDING DATA TO FORM DATA
      formData.append("title", title);
      formData.append(
        "categories",
        JSON.stringify(selectedCategories.map((c) => c.value))
      );
      formData.append(
        "sectionsData",
        JSON.stringify(
          sections.map(({ heading, content }) => ({ heading, content }))
        )
      );
      formData.append("banner", bannerFile.file);
      sections.forEach((sec) => {
        if (sec.file) formData.append("sectionImages", sec.file);
      });
      // MAKING REQUEST
      const response = await axios.post(
        `${ARTICLE_API_ENDPOINT}/create`,
        formData,
        { withCredentials: true }
      );
      // IF RESPONSE SUCCESS
      if (response.data.success) {
        // TOASTING SUCCESS MESSAGE
        toast.success(response.data.message);
        // NAVIGATING TO ARTICLES PAGE
        navigate("/admin/articles");
        // RESETTING FORM
        setTitle("");
        setBannerFile(null);
        setSelectedCategories([]);
        setSections([{ heading: "", content: "", file: null }]);
        setResetKey((k) => k + 1);
      }
    } catch (error) {
      console.error(
        error?.response?.data?.message || "Error Publishing Article!"
      );
      // TOASTING ERROR MESSAGE
      toast.error(
        error?.response?.data?.message || "Error Publishing Article!"
      );
    } finally {
      // SUBMITTING FLAG
      setSubmitting(false);
    }
  };
  return (
    <>
      <Navbar />
      {/* CREATE ARTICLE MAIN WRAPPER */}
      <section className="w-full flex items-center justify-center sm:px-[2rem] px-[1rem] py-[2rem]">
        {/* CREATE ARTICLE CONTENT WRAPPER */}
        <section className="flex flex-col items-center justify-center gap-[2rem] w-full border-2 border-gray-100 rounded-xl sm:p-[2rem] p-[1rem] tracking-[0.5px]">
          {/* HADING & GO BACK BUTTON */}
          <div className="w-full flex items-center justify-between flex-wrap-reverse gap-[1rem]">
            <h1 className="flex items-center gap-[0.5rem] font-[600] text-gray-500 text-[2rem]">
              <FileText className="text-color-DB w-[3rem] h-[3rem]" /> Create
              Article
            </h1>
            <Button
              onClick={() => navigate("/admin/articles")}
              className="bg-color-DB hover:bg-color-LB font-medium text-[1rem] focus:outline-none outline-none border-none"
              disabled={submitting}
            >
              <ArrowLeft />
              Go Back
            </Button>
          </div>
          {/* MAIN FORM ELEMENT */}
          <form
            onSubmit={submitHandler}
            className="border-2 border-gray-100 rounded-md p-[1rem] w-full"
          >
            {/* TITLE */}
            <div className="my-[1rem]">
              <label
                htmlFor="title"
                className="text-[1rem] font-[600] uppercase text-gray-500"
              >
                Article Title
              </label>
              <input
                type="text"
                id="title"
                name="title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full px-[1rem] py-[0.5rem] outline-none border-2 border-gray-100 rounded-md text-gray-500 uppercase font-[600]"
                placeholder="Article Title"
                spellCheck="true"
                autoComplete="off"
                disabled={submitting}
              />
            </div>
            {/* BANNER IMAGE */}
            <div className="my-[1rem]">
              <label
                htmlFor="banner"
                className="text-[1rem] font-[600] uppercase text-gray-500"
              >
                Banner Image
              </label>
              <input
                key={`banner-${resetKey}`}
                accept="image/*"
                type="file"
                id="banner"
                name="banner"
                onChange={onBannerChange}
                className="w-full px-[1rem] py-[0.5rem] outline-none border-2 border-gray-100 rounded-md text-gray-500 cursor-pointer"
                disabled={submitting}
              />
            </div>
            {/* BANNER IMAGE PREVIEW */}
            {bannerFile?.preview && (
              <div className="my-[1rem]">
                <label className="text-[1rem] font-[600] uppercase text-gray-500">
                  Banner Image
                </label>
                <div className="w-full flex items-center justify-center border-2 border-gray-200 p-2 rounded-lg">
                  <img
                    src={bannerFile.preview}
                    alt="Banner Image"
                    className="rounded-lg mt-[0.5rem]"
                  />
                </div>
              </div>
            )}
            {/* CATEGORIES */}
            <div className="my-[1rem]">
              <label
                htmlFor="categories"
                className="text-[1rem] font-[600] uppercase text-gray-500"
              >
                Categories
              </label>
              <Select
                isMulti
                id="categories"
                name="categories"
                options={categoryOptions}
                value={selectedCategories}
                onChange={(selections) => setSelectedCategories(selections)}
                className="w-full px-[1rem] py-[0.5rem] outline-none border-2 border-gray-100 rounded-md text-gray-500 uppercase"
                placeholder="Choose Categories"
                classNamePrefix="react-select"
                isDisabled={submitting}
                styles={{
                  control: (provided) => ({
                    ...provided,
                    border: "2px solid #E5E7EB",
                    boxShadow: "none",
                    padding: "0.75rem",
                    "&:hover": { borderColor: "#D1D5DB" },
                  }),
                  multiValue: (provided) => ({
                    ...provided,
                    backgroundColor: "#bed8fb",
                    padding: "0.5rem",
                    borderRadius: "8px",
                  }),
                  multiValueLabel: (provided) => ({
                    ...provided,
                    color: "white",
                    fontWeight: 600,
                    letterSpacing: "2px",
                  }),
                  multiValueRemove: (provided) => ({
                    ...provided,
                    borderRadius: "3px",
                    color: "gray",
                    backgroundColor: "#E5E7EB",
                  }),
                }}
              />
              <span className="text-sm text-color-DB font-[600]">
                • Select Multiple Categories (At Least 1)
              </span>
            </div>
            {/* DYNAMIC SECTIONS */}
            <div>
              {sections.map((sec, idx) => (
                <div
                  className="my-[1rem] flex flex-col items-start justify-center gap-[0.75rem] border-b-2 border-gray-300 pb-[2rem]"
                  key={idx}
                >
                  {/* SECTION HEADING & BUTTON */}
                  <div className="w-full flex items-center justify-between flex-wrap">
                    <h2 className="text-[1.3rem] font-[600] uppercase text-gray-500">
                      Section ({idx + 1})
                    </h2>
                    <Button
                      onClick={() => removeSection(idx)}
                      className="bg-color-DB hover:bg-color-LB font-medium text-sm focus:outline-none outline-none border-none"
                      disabled={submitting}
                    >
                      <MinusCircle />
                      Remove Section
                    </Button>
                  </div>
                  {/* HEADING */}
                  <div className="w-full">
                    <label
                      htmlFor="sectionHeading"
                      className="text-[1rem] font-[600] uppercase text-gray-500"
                    >
                      Heading
                    </label>
                    <input
                      type="text"
                      name="sectionHeading"
                      id="sectionHeading"
                      value={sec.heading}
                      onChange={(e) =>
                        updateSection(idx, "heading", e.target.value)
                      }
                      className="w-full px-[1rem] py-[0.5rem] outline-none border-2 border-gray-100 rounded-md text-gray-500 uppercase font-[600]"
                      placeholder="Section Heading"
                      spellCheck="true"
                      autoComplete="off"
                      disabled={submitting}
                    />
                  </div>
                  {/* CONTENT */}
                  <div className="w-full">
                    <h2 className="text-[1rem] font-[600] uppercase text-gray-500">
                      Content
                    </h2>
                    {/* QUILL EDITOR */}
                    <SectionEditor
                      content={sec.content}
                      onContentChange={(html) =>
                        updateSection(idx, "content", html)
                      }
                      disabled={submitting}
                    />
                  </div>
                  {/* SECTION IMAGE */}
                  <div className="w-full">
                    <h2 className="text-[1rem] font-[600] uppercase text-gray-500">
                      Section Image
                    </h2>
                    <input
                      key={`sectionImage-${idx}-${resetKey}`}
                      accept="image/*"
                      type="file"
                      onChange={(e) => onSectionImageChange(idx, e)}
                      className="w-full px-[1rem] py-[0.5rem] outline-none border-2 border-gray-100 rounded-md text-gray-500 cursor-pointer"
                      disabled={submitting}
                    />
                  </div>
                  {/* SECTION IMAGE PREVIEW */}
                  {sec.preview && (
                    <div className="w-full">
                      <label className="text-[1rem] font-[600] uppercase text-gray-500">
                        Section Image
                      </label>
                      <div className="w-full flex items-center justify-center border-2 border-gray-200 p-2 rounded-lg">
                        <img
                          src={sec.preview}
                          alt="Section Image"
                          className="mt-[0.5rem] rounded-lg"
                        />
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
            {/* ADD NEW SECTION & PUBLISH BUTTON */}
            <div className="w-full flex items-center justify-start gap-[1rem]">
              <Button
                type="button"
                onClick={addSection}
                className="bg-color-DB hover:bg-color-LB font-medium text-[1rem] focus:outline-none outline-none border-none"
                disabled={submitting}
              >
                <PlusCircleIcon />
                Add Section
              </Button>
              <Button
                type="submit"
                className="bg-color-DB hover:bg-color-LB font-medium text-[1rem] focus:outline-none outline-none border-none"
                disabled={submitting}
              >
                <Send />
                Publish Article
              </Button>
            </div>
          </form>
        </section>
      </section>
    </>
  );
};

export default CreateArticle;
