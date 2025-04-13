import React, { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import axios from "axios";

function VerifyEmail() {
  const [searchParams] = useSearchParams();
  const token = searchParams.get("token");
  const [message, setMessage] = useState("Verifying...");

  useEffect(() => {
    const verifyEmail = async () => {
      try {
        const res = await axios.post("http://localhost:5000/api/auth/verify-email", { token });
        setMessage(res.data.msg);
      } catch (err) {
        setMessage(err.response?.data?.msg || "Verification failed.");
      }
    };

    if (token) verifyEmail();
  }, [token]);

  return (
    <div className="min-h-screen flex items-center justify-center">
      <h2 className="text-xl font-semibold">{message}</h2>
    </div>
  );
}

export default VerifyEmail;
