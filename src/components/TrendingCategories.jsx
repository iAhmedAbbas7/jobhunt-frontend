// <= IMPORTS =>
import { setSearchedQuery } from "@/redux/jobSlice";
import {
  Code2Icon,
  DatabaseIcon,
  Edit2Icon,
  ImageIcon,
  LucideTrendingUp,
  VideoIcon,
} from "lucide-react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";

// <= JOB CATEGORIES =>
const jobCategories = [
  "Frontend Developer",
  "Backend Developer",
  "Data Scientist",
  "MERN Stack Developer",
  "Graphic Designer",
  "Next JS Developer",
];

const TrendingCategories = () => {
  // DISPATCH
  const dispatch = useDispatch();
  // NAVIGATION
  const navigate = useNavigate();
  // SEARCH JOB HANDLER
  const searchJobHandler = (query) => {
    dispatch(setSearchedQuery(query));
    navigate("/browse");
  };
  return (
    // TRENDING CATEGORIES MAIN WRAPPER
    <div className="flex items-center justify-center flex-col gap-[3rem] w-full sm:px-[2rem] px-[1rem] tracking-[0.5px] py-[5rem]">
      {/* HEADING */}
      <div className="flex items-center justify-center gap-[1rem] font-bold text-color-DB text-[3rem] text-center flex-wrap-reverse">
        <span>
          <LucideTrendingUp size={50} />
        </span>
        <h1>
          Trending <span className="text-color-MAIN">Categories</span>
        </h1>
      </div>
      {/* ICONS */}
      <div className="flex items-center justify-center gap-[1rem] flex-wrap text-color-DB">
        <Code2Icon size={50} />
        <DatabaseIcon size={50} />
        <VideoIcon size={50} />
        <ImageIcon size={50} />
        <Edit2Icon size={50} />
      </div>
      {/* CATEGORIES */}
      <div className="w-full md:w-2/3 flex items-center justify-center gap-[1.5rem] flex-wrap">
        {jobCategories.map((cat, index) => (
          <button
            onClick={() => searchJobHandler(cat)}
            className="rounded-full px-4 py-2 bg-color-MAIN hover:bg-color-LBR text-white"
            key={index}
          >
            {cat}
          </button>
        ))}
      </div>
    </div>
  );
};

export default TrendingCategories;
