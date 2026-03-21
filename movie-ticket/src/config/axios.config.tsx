import axios, {  AxiosError, type AxiosResponse } from "axios";

export interface SuccessResponse{
  data: any,
  message: string,
  status: string,
  options: any
}

export const axiosInstance = axios.create({
    baseURL: import.meta.env.VITE_APP_API_V1_URL,
    timeout:30000,
    timeoutErrorMessage: "Request timed out. Please try again.",
    responseType: "json",
    headers: {
        "Content-Type": "application/json",
    }
})

axiosInstance.interceptors.request.use((config) => {
    const token = localStorage.getItem("_at_movieticket") || null
    if(token) {
        config.headers.Authorization = "Bearer "+token
    }
    return config
})


axiosInstance.interceptors.response.use(
    (response: AxiosResponse) => {
        return response.data as AxiosResponse
    },
    (exception: AxiosError) => {
        if(exception.response) {
            throw exception.response?.data
        } else {
            throw exception
        }
    }
)