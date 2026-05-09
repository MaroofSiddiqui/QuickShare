import axios from "axios";

const API = axios.create({
  baseURL: "https://quickshare-x03n.onrender.com",
});

export default API;