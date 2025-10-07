import React, { useMemo, useState } from "react";
import { DesktopOutlined, UserOutlined, LogoutOutlined } from "@ant-design/icons";
import type { MenuProps } from "antd";
import { Layout, Menu, theme, Typography, Divider, message } from "antd";
import { Outlet, useLocation, useNavigate } from "react-router-dom";
import { useUserStore } from "../store/useUserStore";
import { logout } from "../api/userApi";
import { extractNameFromEmail } from "../helpers/userProfileActions";

const { Header, Content, Footer, Sider } = Layout;
const { Text } = Typography;

type MenuItem = Required<MenuProps>["items"][number];
const getItem = (
  label: React.ReactNode,
  key: React.Key,
  icon?: React.ReactNode,
  children?: MenuItem[]
): MenuItem => ({ key, icon, children, label } as MenuItem);

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

  // ===== селекторы под ПЛОСКИЙ стор =====
  const userstate = useUserStore((s) => s);
  
  const id = userstate.id || "";         
  const displayName = extractNameFromEmail(userstate.email);
  const accessToken = userstate.access_token;
  const isAuthorized = Boolean(accessToken.trim() || id);

  const activeKey = useMemo<string>(() => {
    const exact = Object.entries(MENU_ROUTE).find(([, path]) => path === location.pathname);
    if (exact) return exact[0];
    const starts = Object.entries(MENU_ROUTE).find(
      ([, path]) => path !== "/" && location.pathname.startsWith(path)
    );
    return starts ? starts[0] : "3";
  }, [location.pathname]);

  const items: MenuItem[] = [
    ...(isAuthorized ? [getItem("Logout", "logout", <LogoutOutlined />)] : []),
    getItem("Me", "3", <UserOutlined />),
    getItem("Tasks", "2", <DesktopOutlined />),
  ];

  const onMenuClick: MenuProps["onClick"] = async (e) => {
    if (e.key === "logout") {
      const ok = await logout();
      if (ok) {
        message.success("Вы вышли из системы");
        navigate("/auth");
      } else {
        message.error("Не удалось выйти. Попробуйте ещё раз.");
      }
      return;
    }
    const path = MENU_ROUTE[e.key as string];
    if (path) navigate(path);
  };

  return (
    <Layout style={{ minHeight: "98vh" }}>
      <Sider collapsible collapsed={collapsed} onCollapse={setCollapsed}>
        {/* Верхняя панель: имя или Unauthorized */}
        <div
          style={{
            padding: collapsed ? "12px 8px" : "16px 12px",
            textAlign: "center",
            color: "#fff",
            lineHeight: 1.2,
          }}
        >
          <Text style={{ color: "#fff", fontWeight: 600}}>
            {collapsed ? displayName.slice(0, 1) : displayName}
          </Text>
        </div>
        <Divider style={{ margin: "8px 0", borderColor: "rgba(255,255,255,0.25)" }} />

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
