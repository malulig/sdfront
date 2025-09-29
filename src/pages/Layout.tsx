import React, { useMemo, useState } from "react";
import { DesktopOutlined, UserOutlined } from "@ant-design/icons";
import type { MenuProps } from "antd";
import { Layout, Menu, theme } from "antd";
import { Outlet, useLocation, useNavigate } from "react-router-dom";

const { Header, Content, Footer, Sider } = Layout;

type MenuItem = Required<MenuProps>["items"][number];
function getItem(
  label: React.ReactNode,
  key: React.Key,
  icon?: React.ReactNode,
  children?: MenuItem[]
): MenuItem {
  return { key, icon, children, label } as MenuItem;
}

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

  const activeKey = useMemo<string>(() => {
    const exact = Object.entries(MENU_ROUTE).find(
      ([, path]) => path === location.pathname
    );
    if (exact) return exact[0];

    const starts = Object.entries(MENU_ROUTE).find(
      ([, path]) => path !== "/" && location.pathname.startsWith(path)
    );
    return starts ? starts[0] : "1";
  }, [location.pathname]);

  const items: MenuItem[] = [
    getItem("Me", "3", <UserOutlined />),
    getItem("Tasks", "2", <DesktopOutlined />),
  ];

  const onMenuClick: MenuProps["onClick"] = (e) => {
    const path = MENU_ROUTE[e.key as string];
    if (path) navigate(path);
  };

  return (
    <Layout style={{ minHeight: "98vh" }}>
      <Sider
        collapsible
        collapsed={collapsed}
        onCollapse={(value) => setCollapsed(value)}
      >
        <div className="demo-logo-vertical" />
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
