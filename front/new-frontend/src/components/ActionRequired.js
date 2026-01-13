import React, { useEffect, useState } from "react";
import {
  fetchNotifications,
  markNotificationRead
} from "../api/notificationApi";

const ActionRequiredPopup = () => {
  const [alerts, setAlerts] = useState([]);
  const [open, setOpen] = useState(false);

  const loadAlerts = async () => {
    const res = await fetchNotifications();
    const highPriority = res.data.filter(
      n => n.priority === "HIGH" && !n.isRead
    );

    if (highPriority.length > 0) {
      setAlerts(highPriority);
      setOpen(true);
    }
  };

  useEffect(() => {
    loadAlerts();
  }, []);

  const clearAlert = async (id) => {
    await markNotificationRead(id);
    const remaining = alerts.filter(a => a._id !== id);
    setAlerts(remaining);

    if (remaining.length === 0) {
      setOpen(false);
    }
  };

  if (!open) return null;

  return (
    <div style={overlayStyle}>
      <div style={popupStyle}>
        <h3 style={{ marginBottom: 10 }}>🚨 Action Required</h3>

        {alerts.map(alert => (
          <div key={alert._id} style={alertStyle}>
            <strong>{alert.title}</strong>
            <p>{alert.message}</p>

            <button
              style={btnStyle}
              onClick={() => clearAlert(alert._id)}
            >
              Mark as Done
            </button>
          </div>
        ))}

        <button
          style={closeBtnStyle}
          onClick={() => setOpen(false)}
        >
          Close
        </button>
      </div>
    </div>
  );
};

export default ActionRequiredPopup;
const overlayStyle = {
  position: "fixed",
  top: 0,
  left: 0,
  width: "100vw",
  height: "100vh",
  background: "rgba(0,0,0,0.5)",
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  zIndex: 9999
};

const popupStyle = {
  background: "#fff",
  padding: 20,
  width: 400,
  borderRadius: 8,
  boxShadow: "0 4px 15px rgba(0,0,0,0.2)"
};

const alertStyle = {
  borderBottom: "1px solid #eee",
  paddingBottom: 10,
  marginBottom: 10
};

const btnStyle = {
  marginTop: 6,
  background: "#d9534f",
  color: "#fff",
  border: "none",
  padding: "6px 10px",
  borderRadius: 4,
  cursor: "pointer"
};

const closeBtnStyle = {
  marginTop: 10,
  background: "#6c757d",
  color: "#fff",
  border: "none",
  padding: "6px 10px",
  borderRadius: 4,
  cursor: "pointer"
};
