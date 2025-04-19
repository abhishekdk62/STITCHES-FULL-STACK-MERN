import apiClient from "../services/apiClient";

export const getReportsApi = async (customStartDate,customEndDate,dateRange) => {
  try {
    const response = await apiClient.get(`/admin/salesreport?r=${dateRange}&s=${customStartDate}&e=${customEndDate}`);
    
    return response.data
  } catch (error) {
    throw error;
  }
};
