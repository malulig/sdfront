import React, { useMemo, useState } from "react";
import {
  DesktopOutlined,
  UserOutlined,
  LogoutOutlined,
  LoginOutlined,
} from "@ant-design/icons";
import type { MenuProps } from "antd";
import { Layout, Menu, theme, Typography, Divider, Modal } from "antd";
import { Outlet, useLocation, useNavigate } from "react-router-dom";
import { useUserStore } from "../store/useUserStore";
import { logout } from "../api/userApi";
import { extractNameFromEmail } from "../helpers/userProfileActions";
import { useConfirmFactory } from "../components/UI/Confirm";

const { Header, Content, Footer, Sider } = Layout;
const { Text } = Typography;

const MENU_ROUTE: Record<string, string> = {
  "1": "/auth",
  "2": "/tasks",
  "3": "/me",
};

const AppLayout: React.FC = () => {
  const [collapsed, setCollapsed] = useState(false);
  const {
    token: { colorBgContainer },
  } = theme.useToken();

  const navigate = useNavigate();
  const location = useLocation();

  // 1) Инициализируем модалку и holder
  const [modal, contextHolder] = Modal.useModal();
  const showConfirm = useConfirmFactory(modal); // 2) Делаем функцию подтверждения

  // ===== селекторы стора =====
  const userstate = useUserStore((s) => s);

  const id = userstate.id || "";
  const accessToken = userstate.access_token || "";
  const isAuthorized = Boolean((accessToken && accessToken.trim()) || id);

  const rawEmail = userstate.email || "";
  const nameFromEmail = extractNameFromEmail(rawEmail);
  const displayName = isAuthorized
    ? (nameFromEmail && nameFromEmail.trim()) || "Me"
    : "Unauthorized";

  const activeKey = useMemo<string>(() => {
    const exact = Object.entries(MENU_ROUTE).find(
      ([, path]) => path === location.pathname
    );
    if (exact) return exact[0];
    const starts = Object.entries(MENU_ROUTE).find(
      ([, path]) => path !== "/" && location.pathname.startsWith(path)
    );
    if (starts) return starts[0];
    return isAuthorized ? "3" : "1";
  }, [location.pathname, isAuthorized]);

  const items: Required<MenuProps>["items"][number][] = [
    ...(isAuthorized
      ? [{ key: "logout", icon: <LogoutOutlined />, label: "Logout" }]
      : []),
    ...(isAuthorized
      ? [{ key: "3", icon: <UserOutlined />, label: "Me" }]
      : []),
    ...(!isAuthorized
      ? [{ key: "1", icon: <LoginOutlined />, label: "Login" }]
      : []),
    { key: "2", icon: <DesktopOutlined />, label: "Tasks" },
  ];

  const onMenuClick: MenuProps["onClick"] = async (e) => {
    if (e.key === "logout") {
      const confirmed = await showConfirm();
      if (confirmed) {
        await logout();
        navigate("/auth", { replace: true });
      }
      return;
    }
    const path = MENU_ROUTE[e.key as string];
    if (path) navigate(path);
  };

  return (
    <Layout style={{ minHeight: "98vh" }}>
      {/* 3) ВСТАВЬ contextHolder ОДИН РАЗ В ДЕРЕВЕ */}
      {contextHolder}

      <Sider collapsible collapsed={collapsed} onCollapse={setCollapsed}>
        <div
          style={{
            padding: collapsed ? "12px 8px" : "16px 12px",
            textAlign: "center",
            color: "#fff",
            lineHeight: 1.2,
          }}
        >
          <Text style={{ color: "#fff", fontWeight: 600 }}>
            {collapsed
              ? displayName && displayName.length
                ? displayName[0]
                : "•"
              : displayName}
          </Text>
        </div>
        <Divider
          style={{ margin: "8px 0", borderColor: "rgba(255,255,255,0.25)" }}
        />

        <Menu
          theme="dark"
          mode="inline"
          items={items}
          onClick={onMenuClick}
          selectedKeys={[activeKey]}
        />
      </Sider>

      <Layout>
        <Header style={{ padding: 0, background: colorBgContainer }} />
        <Content style={{ margin: "16px" }}>
          <Outlet />
        </Content>
        <Footer style={{ textAlign: "center" }}>
          Caravan Resources ©{new Date().getFullYear()}
        </Footer>
      </Layout>
    </Layout>
  );
};

export default AppLayout;
