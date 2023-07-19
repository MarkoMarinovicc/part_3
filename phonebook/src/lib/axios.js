import axios from "axios";

export const client = axios.create({
  baseURL: "https://backendphonebook-piau.onrender.com",
});

