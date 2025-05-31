// <= IMPORTS =>
import { X } from "lucide-react";

const UnAuthorized = () => {
  return (
    <div className="w-screen h-screen flex items-center justify-center flex-col gap-[1rem]">
      {/* ICON */}
      <X className="text-color-MAIN" size={100} />
      {/* MESSAGE */}
      <span className="text-[1.25rem] text-gray-600">
        You are not Authorized to Access this Page
      </span>
    </div>
  );
};

export default UnAuthorized;
