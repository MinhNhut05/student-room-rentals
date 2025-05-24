import React from "react";
import { useAuth } from "../context/authContext";

const DebugAuthInfo = () => {
  const { user } = useAuth();

  // Check localStorage
  const storedToken = localStorage.getItem("userToken");

  if (process.env.NODE_ENV !== "production") {
    return (
      <div
        style={{
          position: "fixed",
          bottom: "10px",
          right: "10px",
          zIndex: 9999,
          background: "#333",
          color: "#fff",
          padding: "5px",
          fontSize: "10px",
          maxWidth: "300px",
          opacity: 0.8,
        }}
      >
        <p>Auth Debug:</p>
        <p>Logged in: {user ? "Yes" : "No"}</p>
        {user && (
          <>
            <p>User: {user.name}</p>
            <p>ID: {user._id}</p>
            <p>
              Token: {user.token ? user.token.substring(0, 10) + "..." : "None"}
            </p>
          </>
        )}
        <p>localStorage token: {storedToken ? "Present" : "None"}</p>
      </div>
    );
  }

  return null; // Don't render in production
};

export default DebugAuthInfo;
