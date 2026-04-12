import { Layout } from "antd";
import { useState } from "react";
import { Navigate, Outlet } from "react-router";
import Sidebar from "../../components/sidebar/Sidebar";
import UserHeader from "../../components/header/UserHeader";
import { AdminMenu } from "../../config/menu-item";
import { useAuth } from "../../context/auth.context";
import { toast } from "sonner";

const { Content } = Layout;

const AdminLayoutPage = () => {
  const [collapsed, setCollapsed] = useState(false);
  const { loggedInUser } = useAuth();

  if (loggedInUser) {
    return (
      <Layout className="h-screen overflow-hidden">
        <Sidebar collapsed={collapsed} menu={AdminMenu} />

        <Layout className="flex flex-col h-full">
          <UserHeader collapsed={collapsed} setCollapsed={setCollapsed} />
          <Content
            className="bg-gray-300 rounded-md overflow-y-auto"
            style={{
              margin: "24px 16px",
              padding: 24,
              flex: 1, 
            }}
          >
            <Outlet />
          </Content>
        </Layout>
      </Layout>
    );
  } else {
    toast.error("Please login first");
    return <Navigate to={"/"} />;
  }
};

export default AdminLayoutPage;