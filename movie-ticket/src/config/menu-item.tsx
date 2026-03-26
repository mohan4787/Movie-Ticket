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
  QrcodeOutlined,
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
    icon: <CreditCardOutlined />,
    label: <NavLink to="/admin/payments">Payments</NavLink>,
  },
  {
    key: "8",
    icon: <UserOutlined />,
    label: <NavLink to="/admin/users">Users</NavLink>,
  },
  {
    key: "9",
    icon: <QrcodeOutlined />,
    label: <NavLink to="/admin/tickets">Tickets</NavLink>,
  },
  {
    key: "10",
    icon: <QrcodeOutlined />,
    label: <NavLink to="/admin/tickets/scanner">Scanner</NavLink>,
  },
  {
    key: "11",
    icon: <LogoutOutlined />,
    label: <NavLink to="/logout">Logout</NavLink>,
  },
];






