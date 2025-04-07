import axios from "axios";
import { BACKEND_URL } from "../config";

const API_BASE = `${BACKEND_URL}/api/v1/flow`

const getAuthToken = () => {
    return localStorage.getItem("token"); // or sessionStorage or your auth context
};

const axiosInstance = axios.create();

axiosInstance.interceptors.request.use(
    (config) => {
      const token = getAuthToken();
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
      return config;
    },
    (error) => Promise.reject(error)
);

export const fetchFlows = async () => {
    const res = await axiosInstance.get(API_BASE);
    return res.data.flows;
};

export const toggleFlowStatus = async (id: string) => {
    const res = await axiosInstance.patch(`${API_BASE}/${id}/toggle/`);
    return res.data;
};
  
export const deleteFlow = async (id: string) => {
    const res = await axiosInstance.delete(`${API_BASE}/${id}/delete/`);
    return res.data;
};