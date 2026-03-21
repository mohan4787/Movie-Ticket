import { NavLink } from "react-router";

const ForgetPasswordForm = () => {
  return (
    <>
      <div className="flex w-full flex-col border-b border-white/30 pb-3 mb-4">
        <h1 className="text-3xl font-semibold text-white text-center">
          Forgot Password
        </h1>
        <p className="text-sm text-gray-300 text-center">
          Enter your email to reset your password
        </p>
      </div>

      <form className="flex flex-col w-full gap-4">
        <div className="flex flex-col gap-1">
          <label className="text-sm text-gray-200">Email</label>
          <input
            type="email"
            placeholder="Enter your email"
            className="w-full px-4 py-2 rounded-lg bg-white/80 text-black outline-none focus:ring-2 focus:ring-red-500"
          />
        </div>

        <button className="bg-red-600 hover:bg-red-700 text-white py-2 rounded-lg transition">
          Send Reset Link
        </button>

        <button className="bg-gray-300 hover:bg-gray-400 text-black py-2 rounded-lg transition">
          Cancel
        </button>
      </form>

      <p className="text-center text-sm text-gray-300 mt-4">
        Remembered your password?{" "}
        <NavLink
          to="/login"
          className="text-red-400 hover:text-red-500 hover:underline"
        >
          Login now
        </NavLink>
      </p>
    </>
  );
};

export default ForgetPasswordForm;