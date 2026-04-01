import { LoginForm } from "@/components/loginForm/LoginForm";
import { Metadata } from "next";
export const generateMetaData = async () : Promise<Metadata> => {
    return{
        title: "Login Page || CineTic",
        description:"Welcome to CineTic, Please login from here",
        keywords: "",
        openGraph: {
            title: "Login Page || CineTic",
        description:"Welcome to CineTic, Please login from here",
        type: "website",
        }
    }
}
const LoginPage = () => {
    return (
        <>
        <LoginForm />
        </>
    )
}

export default LoginPage;