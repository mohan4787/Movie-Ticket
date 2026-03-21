import {
  UserOutlined,
  VideoCameraOutlined,
  CalendarOutlined,
  ShoppingCartOutlined,
  LogoutOutlined,
  ClockCircleOutlined,
  HomeOutlined,
  FileImageOutlined,
  CreditCardOutlined,
} from "@ant-design/icons";
import { NavLink } from "react-router";

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
    label: "Movies",
  },
  {
    key: "4",
    icon: <ClockCircleOutlined />,
    label: "Showtimes",
  },
  {
    key: "5",
    icon: <CalendarOutlined />,
    label: "Upcoming Movies",
  },
  {
    key: "6",
    icon: <ShoppingCartOutlined />,
    label: "Bookings",
  },
  {
    key: "7",
    icon: <CreditCardOutlined />,
    label: "Payments",
  },
  {
    key: "8",
    icon: <UserOutlined />,
    label: "Users",
  },
  {
    key: "9",
    icon: <LogoutOutlined />,
    label: "Logout",
  },
];
