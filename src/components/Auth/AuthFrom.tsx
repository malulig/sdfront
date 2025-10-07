import { Button, Typography, Spin } from "antd";
import { useUserStore } from "../../store/useUserStore";
import { initUserFromSession, startAzureLogin } from "../../api/userApi";
import { useEffect, useState } from "react";

export function AuthForm() {
  const { access_token } = useUserStore();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        await initUserFromSession(); // Загружаем данные пользователя из cookies
      } catch {
        // Игнорируем ошибки
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, []);

  if (loading) {
    return (
      <div style={{ textAlign: "center", marginTop: "20%" }}>
        <Spin size="large" />
      </div>
    );
  }

  if (access_token) {
    return (
      <div style={{ textAlign: "center", marginTop: "20%" }}>
        <Typography.Title level={3}>Добро пожаловать!</Typography.Title>
      </div>
    );
  }

  return (
    <div style={{ textAlign: "center", marginTop: "20%" }}>
      <Typography.Title level={3}>Авторизация</Typography.Title>
      <Button type="primary" onClick={startAzureLogin}>
        Войти через Microsoft
      </Button>
    </div>
  );
}
