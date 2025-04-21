import React, { useEffect, useState } from "react";
import { toast } from "react-hot-toast";
import { fetchReturnReqAPI, approveReturnAPI, rejectReturnAPI } from "../../../services/orderServices";
import ReturnRequestList from "./elements/ReturnRequestList";

const AdminReturnRequests = () => {
  const [returnRequests, setReturnRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchReturnRequests = async () => {
      try {
        setLoading(true);
        const response = await fetchReturnReqAPI();
        setReturnRequests(response);
      } catch (err) {
        setError("Failed to fetch return requests.");
      } finally {
        setLoading(false);
      }
    };
    fetchReturnRequests();
  }, []);

  const handleApproveRequest = async (
    requestId,
    userId,
    rate,
    quantity,
    pid,
    vid
  ) => {
    try {
      await approveReturnAPI(requestId, userId, rate, quantity, pid, vid);
      setReturnRequests((prev) => prev.filter((req) => req._id !== requestId));
      toast.success("Return approved.");
    } catch (err) {
      console.error("Error approving return request:", err);
    }
  };

  const handleRejectRequest = async (requestId) => {
    try {
      await rejectReturnAPI(requestId);
      setReturnRequests((prev) => prev.filter((req) => req._id !== requestId));
      toast.success("Return rejected.");
    } catch (err) {
      console.error("Error rejecting return request:", err);
    }
  };

  return (
    <ReturnRequestList
      returnRequests={returnRequests}
      loading={loading}
      error={error}
      handleApproveRequest={handleApproveRequest}
      handleRejectRequest={handleRejectRequest}
    />
  );
};

export default AdminReturnRequests;