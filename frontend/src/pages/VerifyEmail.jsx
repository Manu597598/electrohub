import axios from "axios";
import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";

const VerifyEmail = () => {
  const { token } = useParams();
  const navigate = useNavigate();
  const [status, setStatus] = useState("Verifying...");

  useEffect(() => {
    const verify = async () => {
      try {
        const res = await axios.get(
          `http://localhost:8000/api/v1/user/verify/${token}`
        );

        if (res.data.success) {
          setStatus("✅ Email verified successfully");

          setTimeout(() => {
            navigate("/login");
          }, 2000);
        } else {
          setStatus("❌ Verification failed");
        }
      } catch (error) {
        setStatus("❌ Verification failed");
      }
    };

    if (token) verify();
  }, [token, navigate]);

  return (
    <div style={{ padding: "40px", textAlign: "center" }}>
      <h2>{status}</h2>
    </div>
  );
};

export default VerifyEmail;
