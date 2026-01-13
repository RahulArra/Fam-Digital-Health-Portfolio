import React, { useEffect, useState } from "react";
import {
  fetchNotifications,
  fetchUnreadCount,
  markNotificationRead
} from "../api/notificationApi";

const getBgColor = (priority, isRead) => {
  if (isRead) return "#f5f5f5";
  if (priority === "HIGH") return "#ffe5e5";
  if (priority === "MEDIUM") return "#fff4cc";
  return "#e8f0fe";
};

const NotificationBell = () => {
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [open, setOpen] = useState(false);

  const loadData = async () => {
    try {
      const n = await fetchNotifications();
      const c = await fetchUnreadCount();
      setNotifications(n.data);
      setUnreadCount(c.data.unreadCount);
    } catch (err) {}
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleRead = async (id) => {
    await markNotificationRead(id);
    loadData();
  };
const todayDate = new Date().toDateString();

const todayNotifications = notifications.filter(
  n => new Date(n.createdAt).toDateString() === todayDate
);

const earlierNotifications = notifications.filter(
  n => new Date(n.createdAt).toDateString() !== todayDate
);

  return (
    <div
      style={{
        position: "relative",
        display: "inline-flex",
        alignItems: "center",
        pointerEvents: "none"
      }}
    >
      <button
        style={{
          pointerEvents: "auto",
          background: "transparent",
          border: "none",
          cursor: "pointer",
          fontSize: "1.2rem"
        }}
        onClick={(e) => {
          e.stopPropagation();
          setOpen(!open);
        }}
      >
        🔔 {unreadCount > 0 && <span>({unreadCount})</span>}
      </button>

      {open && (
        <div
          onClick={(e) => e.stopPropagation()}
          style={{
            position: "absolute",
            right: 0,
            top: "120%",
            zIndex: 9999,
            width: 320,
            background: "#fff",
            border: "1px solid #ccc",
            borderRadius: 6,
            boxShadow: "0 4px 10px rgba(0,0,0,0.15)",
            pointerEvents: "auto"
          }}
        >
          {notifications.length === 0 && (
            <div style={{ padding: 10 }}>No notifications</div>
          )}

          {todayNotifications.length > 0 && (
  <>
    <div style={{ padding: "6px 10px", fontWeight: "bold" }}>
      Today
    </div>

    {todayNotifications.map((n) => (
      <div
        key={n._id}
        onClick={() => handleRead(n._id)}
        style={{
          padding: 10,
          cursor: "pointer",
          background: getBgColor(n.priority, n.isRead),
          borderBottom: "1px solid #eee"
        }}
      >
        <strong>{n.title}</strong>
        <p style={{ margin: "4px 0" }}>{n.message}</p>
      </div>
    ))}
  </>
)}

{earlierNotifications.length > 0 && (
  <>
    <div style={{ padding: "6px 10px", fontWeight: "bold" }}>
      Earlier
    </div>

    {earlierNotifications.map((n) => (
      <div
        key={n._id}
        onClick={() => handleRead(n._id)}
        style={{
          padding: 10,
          cursor: "pointer",
          background: getBgColor(n.priority, n.isRead),
          borderBottom: "1px solid #eee"
        }}
      >
        <strong>{n.title}</strong>
        <p style={{ margin: "4px 0" }}>{n.message}</p>
      </div>
    ))}
  </>
)}

        </div>
      )}
    </div>
  );
};

export default NotificationBell;
