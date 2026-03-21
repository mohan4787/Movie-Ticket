import { Navigate, Outlet } from "react-router";
import logo from "../../assets/images/logo.png";
import background from "../../assets/images/background.jpeg";
import { useAuth } from "../../context/auth.context";

const AuthLayoutPage = () => {
  
  const {loggedInUser} = useAuth()
  if(loggedInUser) {
    return <Navigate to={`/${loggedInUser.role}`}/>
  }

  return (
    <div className="relative min-h-screen flex items-center justify-center overflow-hidden">
      <div className="absolute inset-0">
        <img
          src={background}
          alt="movie background"
          className="w-full h-full object-cover"
        />
      </div>

      <div className="absolute inset-0 bg-black/70 backdrop-blur-sm"></div>

      <div className="absolute top-0 left-0 w-full h-full bg-linear-to-br from-red-900/40 via-transparent to-black/80"></div>

      <div className="relative z-10 w-full max-w-6xl grid grid-cols-1 lg:grid-cols-2 gap-12 items-center p-4">
        <div className="hidden lg:flex flex-col space-y-6 text-white p-8">
          <div className="inline-flex items-center space-x-2 bg-white/10 px-4 py-1.5 rounded-full border border-white/10">
            <span className="h-3 w-3 bg-yellow-400 rounded-full animate-pulse"></span>
            <span className="text-sm">Now showing in 100+ cinemas</span>
          </div>

          <h1 className="text-7xl font-bold">
            Cine<span className="text-red-500">Book</span>
          </h1>

          <p className="text-2xl text-gray-300">
            Book your favorite movies in seconds.
            <br />
            Experience the{" "}
            <span className="text-white font-semibold">magic of cinema</span>
          </p>

          <p className="text-sm text-gray-400">
            🎟️ Instant booking • 🍿 Best seats • 🎬 Latest releases
          </p>
        </div>

        <div className="w-full max-w-md mx-auto bg-white/10 backdrop-blur-xl border border-white/20 shadow-2xl rounded-2xl p-8 text-white">
          <div className="flex justify-center mb-6">
            <img src={logo} alt="Logo" className="h-24 object-contain" />
          </div>

          <Outlet />
        </div>
      </div>
    </div>
  );
};

export default AuthLayoutPage;
