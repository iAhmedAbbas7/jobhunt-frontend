// <= IMPORTS =>
import { Badge } from "./ui/badge";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { Avatar, AvatarImage } from "./ui/avatar";

const LatestJobCard = ({ job }) => {
  // NAVIGATION
  const navigate = useNavigate();
  // USER CREDENTIALS
  const { user } = useSelector((store) => store.auth);
  return (
    // LATEST JOB CARD MAIN WRAPPER
    <div
      onClick={() =>
        user ? navigate(`/jobs/description/${job._id}`) : navigate("/redirect")
      }
      className="w-full flex items-start justify-start flex-col gap-[1rem] border-2 shadow-lg border-gray-200 bg-gray-50 rounded-lg p-[1rem]  cursor-pointer tracking-[0.5px]"
    >
      {/* COMPANY NAME & AVATAR */}
      <div className="w-full flex items-center gap-[1rem]">
        <button>
          <Avatar className="w-[54px] h-[54px] rounded-none">
            <AvatarImage
              src={job?.company?.logo}
              alt="Logo"
              className="w-[54px] h-[54px]"
            />
          </Avatar>
        </button>
        <div>
          <h1 className="font-[600] text-[1.25rem] text-color-DB">
            {job?.company?.name}
          </h1>
          <span className="text-muted-foreground">{job?.location}</span>
        </div>
      </div>
      {/* JOB TITLE & DESCRIPTION */}
      <div>
        <h1 className="text-[1.5rem] text-color-MAIN font-[600]">
          {job?.title}
        </h1>
        <p className="text-gray-500">{job?.description}</p>
      </div>
      {/* JOB DETAILS */}
      <div className="flex items-center gap-[1.5rem]">
        <Badge className="bg-color-LB text-white border-none hover:bg-color-LB focus:outline-none outline-none rounded-full font-medium px-2 text-center">
          {job?.position === 1 ? "1 Position" : `${job?.position} Positions`}
        </Badge>
        <Badge className="bg-color-DB text-white border-none hover:bg-color-DB focus:outline-none outline-none rounded-full font-medium px-2 text-center">
          {job?.jobType}
        </Badge>
        <Badge className="bg-color-MAIN text-white border-none hover:bg-color-MAIN focus:outline-none outline-none rounded-full font-medium px-2 text-center">
          {job?.salary} LPA
        </Badge>
      </div>
    </div>
  );
};

export default LatestJobCard;
