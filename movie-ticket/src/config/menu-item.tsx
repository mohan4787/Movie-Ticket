import {
  UserOutlined,
  VideoCameraOutlined,
  CalendarOutlined,
  ShoppingCartOutlined,
  LogoutOutlined,
  ClockCircleOutlined,
  HomeOutlined,
  FileImageOutlined,
} from "@ant-design/icons";
import { NavLink } from "react-router";
import { toast } from "sonner";

const handleSidebarLogout = () => {
  localStorage.removeItem("_at_movieticket");
  localStorage.removeItem("_rt_movieticket");
  toast.success("Logged out successfully");
  window.location.href = "/"; 
};

export const AdminMenu = [
  {
    key: "1",
    icon: <HomeOutlined />,
    label: <NavLink to="/admin">Dashboard</NavLink>,
  },
  {
    key: "2",
    icon: <FileImageOutlined />,
    label: <NavLink to="/admin/banner">Banner</NavLink>,
  },
  {
    key: "3",
    icon: <VideoCameraOutlined />,
    label: <NavLink to="/admin/movie">Movies</NavLink>,
  },
  {
    key: "4",
    icon: <ClockCircleOutlined />,
    label: <NavLink to="/admin/showtime">Showtimes</NavLink>,
  },
  {
    key: "5",
    icon: <CalendarOutlined />,
    label: <NavLink to="/admin/upcomingmovie">Upcoming Movies</NavLink>,
  },
  {
    key: "6",
    icon: <ShoppingCartOutlined />,
    label: <NavLink to="/admin/booking">Bookings</NavLink>,
  },
  {
    key: "7",
    icon: <UserOutlined />,
    label: <NavLink to="/admin/users">Users</NavLink>,
  },
  {
    key: "8",
    icon: <LogoutOutlined />,
    label: <span onClick={handleSidebarLogout} className="block w-full">Logout</span>,
    danger: true, 
  },
];