// api.js
import axios from "axios";

const API = axios.create({
  baseURL: "http://172.20.14.201:3000/api", // Replace with your backend IP
  withCredentials: true, // 🔥 This enables cookies!
});

export default API;
