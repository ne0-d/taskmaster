import axios from "axios";

const API = axios.create({ baseURL: "http://localhost:5000" });

export const createTask = (formData) => API.post("/user/create", formData);
export const updateTask = (formData) => API.post("/user/updateTask", formData); 
export const getTasks = (formData) => API.post("/user/getTasks", formData); 
export const deleteTask = (formData) => API.post("/user/deleteTask", formData); 