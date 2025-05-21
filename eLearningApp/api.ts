// api.js
import axios from "axios";

// 🔧 Extract the root host separately (no `/api`)
export const BASE_URL = "http://172.20.22.121:3000"; // Only root, for images
export const API_URL = `${BASE_URL}/api`;           // Full API path

const API = axios.create({
  baseURL: API_URL,
  withCredentials: true,
});   

export default API;
