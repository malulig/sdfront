import { useEffect, useState } from "react";
import { useUserStore } from "../../store/useUserStore";
import { useNavigate } from "react-router-dom";
import { Spin } from "antd";
import { initUserFromSession } from "../../api/userApi";

export const Tasks = () => {
  const { access_token } = useUserStore();
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUser = async () => {
      try {
        await initUserFromSession();
      } catch {
        // Игнорируем ошибки
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, []);

  useEffect(() => {
    if (!access_token) {
      navigate("/auth");
    }
  }, [access_token]);

  if (loading) {
    return (
      <div style={{ textAlign: "center", marginTop: "20%" }}>
        <Spin size="large" />
      </div>
    );
  }

  return <div>Tasks</div>;
};
