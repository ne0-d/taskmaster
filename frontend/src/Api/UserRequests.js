import axios from "axios";

const API = axios.create({ baseURL: "https://taskmaster-production-d274.up.railway.app/" });

export const createTask = (formData) => API.post("/user/create", formData);
export const updateTask = (formData) => API.post("/user/updateTask", formData); 
export const getTasks = (formData) => API.post("/user/getTasks", formData); 
export const deleteTask = (formData) => API.post("/user/deleteTask", formData); 