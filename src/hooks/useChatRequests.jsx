// <= IMPORTS =>
import axios from "axios";
import { CHAT_API_ENDPOINT } from "@/utils/constants";
import { useCallback, useEffect, useState } from "react";

const useChatRequests = () => {
  // STATE MANAGEMENT
  const [requests, setRequests] = useState([]);
  const [sentRequests, setSentRequests] = useState([]);
  const [acceptedRequests, setAcceptedRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  // FETCHING CHAT REQUESTS
  const fetchRequests = useCallback(async () => {
    // LOADING STATE
    setLoading(true);
    try {
      // MAKING REQUEST FOR BOTH INCOMING AND OUTGOING REQUESTS
      const [incoming, outgoing] = await Promise.all([
        axios.get(`${CHAT_API_ENDPOINT}/requests`, { withCredentials: true }),
        axios.get(`${CHAT_API_ENDPOINT}/requests/sent`, {
          withCredentials: true,
        }),
      ]);
      // IF RESPONSE SUCCESS
      // SETTING REQUESTS FOR RECRUITER (INCOMING)
      if (incoming.data.success) setRequests(incoming.data.requests);
      // SETTING REQUESTS FOR STUDENT (OUTGOING)
      if (outgoing.data.success) setSentRequests(outgoing.data.requests);
    } catch (error) {
      // SETTING ERROR
      setError(error);
    } finally {
      // LOADING STATE
      setLoading(false);
    }
  }, []);
  // FETCHING ACCEPTED CHAT REQUESTS
  const fetchAcceptedRequests = useCallback(async () => {
    // LOADING STATE
    setLoading(true);
    try {
      // MAKING REQUEST
      const response = await axios.get(
        `${CHAT_API_ENDPOINT}/requests/accepted`,
        { withCredentials: true }
      );
      // IF RESPONSE SUCCESS
      if (response.data.success) {
        // SETTING ACCEPTED REQUESTS
        setAcceptedRequests(response.data.acceptedRequests);
      }
    } catch (error) {
      // SETTING ERROR
      setError(error);
    } finally {
      // LOADING STATE
      setLoading(false);
    }
  }, []);
  // SENDING CHAT REQUEST
  const sendMessageRequest = async ({ to, job }) => {
    // LOADING STATE
    setLoading(true);
    try {
      // MAKING REQUEST
      const response = await axios.post(
        `${CHAT_API_ENDPOINT}/request`,
        { to, job },
        { withCredentials: true }
      );
      // IF RESPONSE SUCCESS
      if (response.data.success) {
        // SETTING CHAT REQUESTS
        setRequests((previousRequests) => [
          response.data.chatRequest,
          ...previousRequests,
        ]);
        // RETURNING DATA
        return response.data;
      }
    } catch (error) {
      // SETTING ERROR
      setError(error);
      throw error;
    } finally {
      // LOADING STATE
      setLoading(false);
    }
  };
  // RESPOND TO CHAT REQUEST
  const respondToChatRequest = async ({ id, action }) => {
    // LOADING STATE
    setLoading(true);
    try {
      // MAKING REQUEST
      const response = await axios.post(
        `${CHAT_API_ENDPOINT}/request/${id}/respond`,
        { action },
        { withCredentials: true }
      );
      // IF RESPONSE SUCCESS
      if (response.data.success) {
        // REMOVING REQUEST FROM PENDING REQUESTS LIST
        setRequests((previousRequests) =>
          previousRequests.filter((req) => req._id !== id)
        );
        // RETURNING DATA
        return response.data;
      }
    } catch (error) {
      // SETTING ERROR
      setError(error);
      throw error;
    } finally {
      // LOADING STATE
      setLoading(false);
    }
  };
  // EFFECT TO FETCH REQUESTS
  useEffect(() => {
    fetchRequests();
    fetchAcceptedRequests();
  }, [fetchRequests, fetchAcceptedRequests]);
  return {
    requests,
    sentRequests,
    acceptedRequests,
    loading,
    error,
    fetchRequests,
    fetchAcceptedRequests,
    sendMessageRequest,
    respondToChatRequest,
  };
};

export default useChatRequests;
