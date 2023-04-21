import axios from "axios";

const API = axios.create({ baseURL: "https://taskmaster-production-d274.up.railway.app/" });

export const logIn = (formData) => API.post("/user/login", formData);
export const signUp = (formData) => API.post("/user/signup", formData); 