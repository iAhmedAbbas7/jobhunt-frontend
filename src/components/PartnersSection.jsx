// <= IMPORTS =>
import COMPANY from "../assets/images/COMPANY.png";
import GOOGLE from "../assets/images/GOOGLE.png";
import NETFLIX from "../assets/images/NETFLIX.png";
import MICROSOFT from "../assets/images/MICROSOFT.png";
import INSTAGRAM from "../assets/images/INSTAGRAM.png";
import APPLE from "../assets/images/APPLE.png";
import YOUTUBE from "../assets/images/YOUTUBE.png";
import AMAZON from "../assets/images/AMAZON.png";


const PartnersSection = () => {
  return (
    // PARTNERS SECTION MAIN WRAPPER
    <div className="flex items-center justify-center flex-col gap-[3rem] w-full sm:px-[2rem] px-[1rem] tracking-[0.5px] py-[5rem]">
      {/* HEADING */}
      <div className="flex items-center justify-center gap-[1rem] font-bold text-color-DB text-[3rem] text-center flex-wrap-reverse">
        <img src={COMPANY} alt="Company" className="w-[44px] h-[44px]" />
        <h1>
          Trending <span className="text-color-MAIN">Companies</span>
        </h1>
      </div>
      {/* ICONS */}
      <div className="flex items-center justify-center gap-[2rem] flex-wrap">
        <img src={GOOGLE} alt="Google" className="w-[74px] h-[74px]" />
        <img src={YOUTUBE} alt="YouTube" className="w-[74px] h-[74px]" />
        <img src={INSTAGRAM} alt="Instagram" className="w-[74px] h-[74px]" />
        <img src={AMAZON} alt="Amazon" className="w-[74px] h-[74px]" />
        <img src={NETFLIX} alt="Netflix" className="w-[74px] h-[74px]" />
        <img src={APPLE} alt="Apple" className="w-[74px] h-[74px]" />
        <img src={MICROSOFT} alt="Microsoft" className="w-[74px] h-[74px]" />
      </div>
    </div>
  );
};

export default PartnersSection;
