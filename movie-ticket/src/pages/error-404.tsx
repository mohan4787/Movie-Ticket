import { NavLink } from "react-router";

const ErrorNotFound = () => {
  return (
    <main className="grid h-screen place-items-center bg-linear-to-b from-gray-900 via-gray-800 to-black px-6 py-24 sm:py-32 lg:px-8">
      <div className="text-center">
        <p className="text-7xl sm:text-9xl font-extrabold text-red-600 animate-pulse">
          404
        </p>

        <h1 className="mt-4 text-4xl sm:text-6xl font-bold text-white tracking-tight">
          Page Not Found
        </h1>

        <p className="mt-6 text-lg sm:text-xl text-gray-400 max-w-md mx-auto">
          Sorry, we couldn’t find the page you’re looking for. It might have been removed, had its name changed, or is temporarily unavailable.
        </p>

        <div className="mt-10 flex items-center justify-center">
          <NavLink
            to="/"
            className="inline-block rounded-lg bg-red-600 px-6 py-3 text-sm font-semibold text-white shadow-lg hover:bg-red-500 hover:shadow-xl transition-all duration-300"
          >
            Go Back Home
          </NavLink>
        </div>

        <div className="mt-12 h-px w-1/2 bg-gray-700 mx-auto"></div>
      </div>
    </main>
  );
};

export default ErrorNotFound;