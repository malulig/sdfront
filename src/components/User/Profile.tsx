import { useUserStore } from "../../store/useUserStore";
import { Typography, Card } from "antd";
import { useEffect } from "react";
import { initUserFromSession } from "../../api/userApi";

export const Profile = () => {
  const { displayName, email, role, setUser } = useUserStore();

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

  return (
    <div style={{ textAlign: "center", marginTop: "20px" }}>
      <Typography.Title level={2}>Профиль пользователя</Typography.Title>
      <Card style={{ maxWidth: "400px", margin: "20px auto", textAlign: "left" }}>
        <p>
          <strong>Имя:</strong> {displayName || "Не указано"}
        </p>
        <p>
          <strong>Email:</strong> {email || "Не указано"}
        </p>
        <p>
          <strong>Роль:</strong> {role || "Не указано"}
        </p>
      </Card>
    </div>
  );
};
