// api.js
import axios from "axios";

const API = axios.create({
  baseURL: "http://192.168.3.147:3000/api", // Replace with your backend IP
  withCredentials: true, // 🔥 This enables cookies!
});

export default API;
