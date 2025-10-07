import { useUserStore } from "../../store/useUserStore";
import { Typography, Card } from "antd";
import { useEffect } from "react";
import { initUserFromSession } from "../../api/userApi";
import { extractNameFromEmail } from "../../helpers/userProfileActions";
import { useNavigate } from "react-router-dom";

export const Profile = () => {
  const { access_token, email, role, setUser } = useUserStore();
  const navigate = useNavigate();
  useEffect(() => {
    const fetchUser = async () => {
      try {
        await initUserFromSession(); // Загружаем данные пользователя
      } catch (error) {
        console.error("Ошибка загрузки профиля:", error);
      }
    };

    fetchUser();
  }, [setUser]);
  useEffect(() => {
    if (!access_token) {
      navigate("/auth");8
    }
  }, [access_token]);
  return (
    <div style={{ textAlign: "center", marginTop: "20px" }}>
      <Typography.Title level={2}>Профиль пользователя</Typography.Title>
      <Card style={{ maxWidth: "400px", margin: "20px auto", textAlign: "left" }}>
        <p>
          <strong>Имя:</strong> {extractNameFromEmail(email)}
        </p>
        <p>
          <strong>Email:</strong> {email}
        </p>
        <p>
          <strong>Роль:</strong> {role}
        </p>
      </Card>
    </div>
  );
};
