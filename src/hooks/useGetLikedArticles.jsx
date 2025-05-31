// <= IMPORTS =>
import axios from "axios";
import { useDispatch } from "react-redux";
import { useEffect, useState } from "react";
import { setLikedArticles } from "@/redux/articleSlice";
import { ARTICLE_API_ENDPOINT } from "@/utils/constants";

const useGetLikedArticles = () => {
  // DISPATCH
  const dispatch = useDispatch();
  // LOADING STATE
  const [loading, setLoading] = useState(true);
  // FETCHING ALL ARTICLES
  useEffect(() => {
    // FETCH ALL ARTICLES FUNCTION
    const fetchAllLikedArticles = async () => {
      try {
        // MAKING REQUEST
        const response = await axios.get(`${ARTICLE_API_ENDPOINT}/likes`, {
          withCredentials: true,
        });
        // IF RESPONSE SUCCESS
        if (response.data.success) {
          // SETTING ARTICLES IN ARTICLE SLICE
          dispatch(setLikedArticles(response.data.likedArticles));
        }
      } catch (error) {
        console.error(error);
      } finally {
        // LOADING STATE
        setLoading(false);
      }
    };
    fetchAllLikedArticles();
  }, [dispatch]);
  // FORWARDING LOADING STATE UNTIL REQUEST COMPLETES
  return { loading };
};

export default useGetLikedArticles;
