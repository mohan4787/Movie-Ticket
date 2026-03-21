
import logo from "../assets/images/logo.png";
import LoginForm from "../components/auth/LoginForm";

export interface ICredentials{
  email: string,
  password: string
}
const HomePage = () => {
  
  return (
    <>
      <div className="flex w-full h-screen items-center justify-center bg-gray-300">
        <div className="flex flex-col gap-5 max-w-3xl mx-auto p-5 bg-gray-100 shadow-xl rounded-md">
          <div className="flex w-full my-4 items-center justify-center rounded-2xl h-25">
            <img src={logo} alt="Logo" />
          </div>
          <LoginForm/>
        </div>
      </div>
    </>
  );
};

export default HomePage;
