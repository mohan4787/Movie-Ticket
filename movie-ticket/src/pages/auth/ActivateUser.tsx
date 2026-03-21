
import { useNavigate, useParams } from "react-router";
import { Spinner } from "../../components/loading/Spinner";
import { toast } from "sonner";
import { useEffect } from "react";
import authSvc from "../../services/auth.service";
import type { SuccessResponse } from "../../config/axios.config";


const ActivateUser = () => {
  const params = useParams()
  const navigate = useNavigate()
  const activateUserProfile = async () => {
    try {
      const token = params.token
      const response = await authSvc.activateUserProfile(token as string) as unknown as SuccessResponse
      toast.success("Account Activated!!",{description:response.message});
      navigate("/")
    } catch (exception:any) {
      toast.error("Account Activated!!",{description:exception?.message})
      navigate("/")
    }
  }
  useEffect(() => {
    activateUserProfile()
  },[])
  return (
    <>
      <div className="flex w-full h-16 justify-center items-center"><Spinner/></div>
    </>
  );
};

export default ActivateUser;
