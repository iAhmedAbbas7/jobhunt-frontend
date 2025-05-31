// <= IMPORTS =>
import axios from "axios";
import { useDispatch } from "react-redux";
import { useEffect, useState } from "react";
import { ARTICLE_API_ENDPOINT } from "@/utils/constants";
import { setBookmarkedArticles } from "@/redux/articleSlice";

const useGetBookmarkedArticles = () => {
  // DISPATCH
  const dispatch = useDispatch();
  // LOADING STATE
  const [loading, setLoading] = useState(true);
  // FETCHING ALL ARTICLES
  useEffect(() => {
    // FETCH ALL ARTICLES FUNCTION
    const fetchAllBookmarkedArticles = async () => {
      try {
        // MAKING REQUEST
        const response = await axios.get(`${ARTICLE_API_ENDPOINT}/bookmarks`, {
          withCredentials: true,
        });
        // IF RESPONSE SUCCESS
        if (response.data.success) {
          // SETTING ARTICLES IN ARTICLE SLICE
          dispatch(setBookmarkedArticles(response.data.bookmarkedArticles));
        }
      } catch (error) {
        console.error(error);
      } finally {
        // LOADING STATE
        setLoading(false);
      }
    };
    fetchAllBookmarkedArticles();
  }, [dispatch]);
  // FORWARDING LOADING STATE UNTIL REQUEST COMPLETES
  return { loading };
};

export default useGetBookmarkedArticles;
