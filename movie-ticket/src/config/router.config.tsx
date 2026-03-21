import { createBrowserRouter, RouterProvider } from "react-router";
import ErrorNotFound from "../pages/error-404";
import ActivateUser from "../pages/auth/ActivateUser";
import LoginForm from "../components/auth/LoginForm";
import AuthLayoutPage from "../pages/layout/AuthLayout";
import RegisterForm from "../components/auth/RegisterForm";
import ForgetPasswordForm from "../components/auth/ForgetPasswordForm";
import AdminLayoutPage from "../pages/layout/AdminLayout";
import { Toaster } from "sonner";
import AdminDashboard from "../pages/dashboards/AdminDashboard";
import BannerListPage from "../pages/banners/BannerListPage";
import BannerEditPage from "../pages/banners/BannerEditPage";
import BannerCreatePage from "../pages/banners/BannerCreatePage";
import MovieCreatePage from "../pages/movies/MovieCreatePage";
import MovieListPage from "../pages/movies/MovieListPage";
import UpComingMovieListPage from "../pages/upcomingmovie/UpComingMovieListPage";
import UpComingMovieCreatePage from "../pages/upcomingmovie/UpComingMovieCreatePage";
import UpComingMovieEditPage from "../pages/upcomingmovie/UpComingMovieEditPage";
import MovieEditPage from "../pages/movies/MovieEditPage";
import ShowTimeListPage from "../pages/showtime/ShowTimeListPage";
import ShowTimeCreatePage from "../pages/showtime/ShowTimeCreatePage";
import ShowTimeEditPage from "../pages/showtime/ShowTimeEditPage";

const routerConfig = createBrowserRouter([
  {
    path: "/",
    Component: AuthLayoutPage,
    children: [
      {
        index: true,
        Component: LoginForm,
      },
      {
        path: "register",
        Component: RegisterForm,
      },
      {
        path: "forget-password",
        Component: ForgetPasswordForm,
      },
      {
        path: "activate/:token",
        Component: ActivateUser,
      },
    ],
  },
  {
    path: "/admin",
    Component: AdminLayoutPage,
    children:[
      {index: true, Component:AdminDashboard},
      {path: "banner", Component: BannerListPage},
      {path: "banner/create", Component: BannerCreatePage},
      {path: "banner/:id", Component: BannerEditPage},
      {path: "movie",Component:MovieListPage},
      {path: "movie/create",Component:MovieCreatePage},
      {path: "movie/:id",Component:MovieEditPage},
      {path: "upcomingmovie",Component:UpComingMovieListPage},
      {path: "upcomingmovie/create",Component:UpComingMovieCreatePage},
      {path: "upcomingmovie/:id",Component:UpComingMovieEditPage},
      {path: "showtime",Component:ShowTimeListPage},
      {path: "showtime/create",Component:ShowTimeCreatePage},
      {path: "showtime/:id",Component:ShowTimeEditPage},
      {path: "*", Component: ErrorNotFound}
    ]
  },
  {
    path: "*",
    Component: ErrorNotFound,
  },
]);

const RouterConfig = () => {
  return (
    <>
        <Toaster richColors closeButton />
        <RouterProvider router={routerConfig} />
    </>
  );
};

export default RouterConfig;
