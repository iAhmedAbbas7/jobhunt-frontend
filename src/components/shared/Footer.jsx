// <= IMPORTS =>
import LOGO from "../../assets/images/LOGO.png";
import MAIL from "../../assets/images/MAIL.png";
import FACEBOOK from "../../assets/images/FACEBOOK.png";
import INSTA from "../../assets/images/INSTA.png";
import TWITTER from "../../assets/images/TWITTER.png";

const Footer = () => {
  return (
    <div className="w-full flex items-center flex-wrap justify-between sm:px-[2rem] px-[1rem] py-[1.5rem] bg-gray-200">
      {/* LOGO SECTION */}
      <div className="flex items-center justify-start gap-[0.5rem]">
        <img src={LOGO} alt="Logo" className="w-[44px] h-[44px]" />
        <h1 className="font-[600] text-2xl text-gray-500">
          Job
          <span className="text-color-MAIN">Hunt</span>
        </h1>
      </div>
      {/* SOCIAL LINKS */}
      <div className="flex items-center justify-center gap-[1.5rem]">
        <img src={MAIL} alt="Mail" className="w-[44px] h-[44px]" />
        <img src={FACEBOOK} alt="Mail" className="w-[44px] h-[44px]" />
        <img src={INSTA} alt="Instagram" className="w-[44px] h-[44px]" />
        <img src={TWITTER} alt="Twitter" className="w-[44px] h-[44px]" />
      </div>
    </div>
  );
};

export default Footer;
