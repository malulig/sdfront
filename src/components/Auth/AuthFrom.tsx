import { Typography } from "antd";

export type AuthFieldType = {
  username: string;
  password: string;
};

export function AuthForm() {

  return (
    <Typography.Title level={3} style={{ textAlign: "center" }}>Auth ! Form</Typography.Title>);
}
