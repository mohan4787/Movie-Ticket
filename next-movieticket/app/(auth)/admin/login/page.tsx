import LoginForm from "@/components/Form/LoginForm";
import background from "@/public/background.jpeg";

const LoginPage = () => {
  return (
    <div className="relative min-h-screen flex items-center justify-center overflow-hidden">
      <div className="absolute inset-0">
        <img
          src={background.src}
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
         <div className="flex items-center justify-center p-6">
        <div className="w-full max-w-md bg-black/50 backdrop-blur-lg border border-white/20 rounded-2xl p-8 shadow-2xl text-white">
          <LoginForm />
        </div>
      </div>
      </div>
    </div>
  );
};

export default LoginPage;
