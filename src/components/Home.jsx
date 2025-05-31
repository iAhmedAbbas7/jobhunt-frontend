// <= IMPORTS =>
import { useEffect } from "react";
import Navbar from "./shared/Navbar";
import Footer from "./shared/Footer";
import LatestJobs from "./LatestJobs";
import useChat from "@/hooks/useChat";
import HeroSection from "./HeroSection";
import { useNavigate } from "react-router-dom";
import PartnersSection from "./PartnersSection";
import { setLoggedIn } from "@/redux/authSlice";
import useGetAllJobs from "@/hooks/useGetAllJobs";
import TrendingCategories from "./TrendingCategories";
import { useDispatch, useSelector } from "react-redux";
import useGetAllArticles from "@/hooks/useGetAllArticles";
import useGetAllCompanies from "@/hooks/useGetAllCompanies";

const Home = () => {
  // USING LOAD ROOMS FUNCTION FROM USE CHAT HOOK
  const { loadRooms } = useChat();
  // DISPATCH
  const dispatch = useDispatch();
  // USER CREDENTIALS
  const { user } = useSelector((store) => store.auth);
  // USING GET ALL JOBS HOOK
  useGetAllJobs();
  // USING GET ALL COMPANIES HOOK
  useGetAllCompanies();
  // USING GET ALL ARTICLES HOOK
  useGetAllArticles();
  // NAVIGATION
  const navigate = useNavigate();
  // LOGOUT NAVIGATION HANDLING
  useEffect(() => {
    if (!user) {
      dispatch(setLoggedIn(false));
    }
  });
  // RECRUITER HOMEPAGE NAVIGATION
  useEffect(() => {
    if (user?.role === "RECRUITER") {
      navigate("/admin/companies");
    }
  }, [navigate, user?.role]);
  // USING LOAD ROOMS FUNCTION
  useEffect(() => {
    loadRooms();
  }, [loadRooms]);
  return (
    <>
      <Navbar />
      <HeroSection />
      <TrendingCategories />
      <PartnersSection />
      <LatestJobs />
      <Footer />
    </>
  );
};

export default Home;
