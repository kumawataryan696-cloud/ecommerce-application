import axios, { type AxiosInstance } from "axios";

const BASE_URL: string = import.meta.env.VITE_API_BASE_URL as string;

export const api: AxiosInstance = axios.create({
  baseURL: BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});