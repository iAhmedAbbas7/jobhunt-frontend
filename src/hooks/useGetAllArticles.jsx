// <= IMPORTS =>
import axios from "axios";
import { useDispatch } from "react-redux";
import { useEffect, useState } from "react";
import { setAllArticles } from "@/redux/articleSlice";
import { ARTICLE_API_ENDPOINT } from "@/utils/constants";

const useGetAllArticles = (
  page = 1,
  limit = 10,
  search = "",
  category = ""
) => {
  // DISPATCH
  const dispatch = useDispatch();
  // STATE MANAGEMENT
  const [loading, setLoading] = useState(true);
  const [pages, setPages] = useState(1);
  const [total, setTotal] = useState(0);
  const [error, setError] = useState("");
  // EFFECT TO FETCH ARTICLES
  useEffect(() => {
    const fetchAllArticles = async () => {
      // LOADING STATE
      setLoading(true);
      // CLEARING ERROR ON NEW REQUEST
      setError("");
      // CLEARING ARTICLES ON NEW REQUEST
      dispatch(setAllArticles([]));
      try {
        // BUILDING QUERY STRING
        const params = new URLSearchParams({
          page: page.toString(),
          limit: limit.toString(),
          ...(search ? { search } : {}),
          ...(category ? { category } : {}),
        }).toString();
        const response = await axios.get(`${ARTICLE_API_ENDPOINT}/?${params}`, {
          withCredentials: true,
        });
        // IF RESPONSE SUCCESS
        if (response.data.success) {
          // SETTING MY ARTICLES IN REDUX STATE
          dispatch(setAllArticles(response.data.data));
          // TOTAL PAGES
          setPages(response.data.pages);
          // TOTAL COUNT
          setTotal(response.data.totalArticles);
        }
      } catch (error) {
        console.error("Failed to Fetch Articles", error);
        // SETTING ERROR TO FORWARD
        setError(error?.response?.data?.message || "No Articles Found!");
      } finally {
        // LOADING STATE
        setLoading(false);
      }
    };
    // FETCHING MY ARTICLES
    fetchAllArticles();
  }, [dispatch, page, limit, search, category]);
  return { loading, pages, total, error };
};

export default useGetAllArticles;
