import apiClient from "./apiClient"

export const getAddressApi=async()=>{
try {const response=await apiClient.get("/user/address")
    return response.data
    
} catch (error) {
    throw error
    
}
}