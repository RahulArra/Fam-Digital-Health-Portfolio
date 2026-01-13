import axios from "axios";

const API = axios.create({
  baseURL: "http://localhost:5000/api"
});

API.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const fetchNotifications = () =>
  API.get("/notifications");

export const fetchUnreadCount = () =>
  API.get("/notifications/unread-count");

export const markNotificationRead = (id) =>
  API.put(`/notifications/${id}/read`);
