// <= IMPORTS =>
import axios from "axios";
import { useEffect, useState } from "react";
import { COMMENTS_API_ENDPOINT } from "@/utils/constants";

const useComments = (articleId, page = 1, limit = 20) => {
  // STATE MANAGEMENT
  const [pages, setPages] = useState(1);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);
  const [comments, setComments] = useState([]);
  // REPLIES RE-ORDER HELPER FUNCTION
  const reorderReplies = (replies) => {
    // PINNED REPLY
    const pinned = replies.filter((r) => r.pinned);
    // UNPINNED REPLIES
    const unpinned = replies
      .filter((r) => !r.pinned)
      .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    return [...pinned, ...unpinned];
  };
  // FETCHING COMMENTS
  useEffect(() => {
    const fetchComments = async () => {
      // LOADING STATE
      setLoading(true);
      // CLEARING ERROR ON NEW REQUEST
      setError("");
      // CLEARING COMMENTS ON NEW REQUEST
      setComments([]);
      try {
        // BUILDING QUERY STRING
        const params = new URLSearchParams({
          page: page.toString(),
          limit: limit.toString(),
        }).toString();
        const response = await axios.get(
          `${COMMENTS_API_ENDPOINT}/article/${articleId}?${params}`
        );
        // IF RESPONSE SUCCESS
        if (response.data.success) {
          // RE-ORDERING REPLIES
          const orderedComments = response.data.data.map((c) => ({
            ...c,
            replies: reorderReplies(c.replies),
          }));
          // SETTING COMMENTS
          setComments(orderedComments);
          // SETTING PAGES
          setPages(response.data.pages);
        }
      } catch (error) {
        console.error("Error Fetching Comments", error);
        // SETTING ERROR
        setError(error?.response?.data?.message || "Error Fetching Comments!");
      } finally {
        // LOADING STATE
        setLoading(false);
      }
    };
    fetchComments();
  }, [articleId, limit, page]);
  return { pages, error, loading, comments, setComments };
};

export default useComments;
