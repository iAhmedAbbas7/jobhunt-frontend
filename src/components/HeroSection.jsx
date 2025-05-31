// <= IMPORTS =>
import { Search, TrophyIcon } from "lucide-react";
import LOGO from "../assets/images/LOGO.png";
import { useState } from "react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { setSearchedQuery } from "@/redux/jobSlice";

const HeroSection = () => {
  // DISPATCH
  const dispatch = useDispatch();
  // NAVIGATION
  const navigate = useNavigate();
  // SEARCH STATE MANAGEMENT
  const [searchQuery, setSearchQuery] = useState("");
  // SEARCH JOB HANDLER
  const searchJobHandler = () => {
    dispatch(setSearchedQuery(searchQuery));
    navigate("/browse");
  };
  return (
    // HERO SECTION MAIN WRAPPER
    <div className="w-full flex items-center justify-center flex-col tracking-[0.5px] sm:px-[2rem] px-[1rem] py-[2rem] text-center gap-[1.5rem]">
      {/* RANKING  */}
      <span className="flex items-center justify-center gap-3 px-4 py-2 rounded-full bg-gray-100 text-color-DB sm:text-[1.15rem] text-[1.05rem] font-[500]">
        <TrophyIcon /> Ranked #1 Job Application Site in the World
      </span>
      {/* LOGO */}
      <img src={LOGO} alt="JobHunt Logo" className="w-[100px] h-[100px]" />
      {/* HEADING */}
      <h1 className="sm:text-[3.5rem] text-[3rem] font-bold text-color-DB">
        Search, Apply & <br />
        Get Your <span className="text-color-MAIN">Dream Jobs</span>
      </h1>
      {/* TAGLINE */}
      <p className="text-[1.1rem] font-medium text-gray-500">
        Dive in to the World of Highest Paying Jobs listed by the Leading Tech
        Companies over the Globe
      </p>
      {/* SEARCH */}
      <div className="relative w-full flex items-center justify-start sm:w-2/4">
        <input
          type="text"
          placeholder="Search Your Dream Job Here"
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full outline-none border-gray-500 px-[1rem] py-[0.8rem] rounded-full bg-gray-100 text-gray-500"
        />
        <button
          onClick={searchJobHandler}
          disabled={!searchQuery}
          className="h-full absolute bg-none right-0 px-[1rem] py-[0.8rem] rounded-r-full bg-color-DB hover:bg-color-LB"
        >
          <Search className="text-white" />
        </button>
      </div>
    </div>
  );
};

export default HeroSection;
