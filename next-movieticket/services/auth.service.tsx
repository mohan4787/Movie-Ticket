import type { IRegisterUser } from "../components/contract/contract";
import type { SuccessResponse } from "../config/axios.config";
import BaseService from "./base.service";

interface ICredentials {
  email: string;
  password: string;
}

class AuthService extends BaseService {
  async registerUser(data: IRegisterUser) {
    return (await this.postRequest("auth/register", data, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    })) as unknown as SuccessResponse;
  }
  async activateUserProfile(token:string){
    return await this.getRequest('auth/activate/'+token)
  }
  async loginUser(credentials:ICredentials){
    const response = await this.postRequest("auth/login",credentials) as unknown as SuccessResponse;
    console.log("i am here");
    
   console.log(response);
   
    
    localStorage.setItem("_at_movieticket", response.data.accessToken);
    localStorage.setItem("_rt_movieticket", response.data.refreshToken);
  }
  async getLoggedInUserProfile() {
    return await this.getRequest("/auth/me")
  }
}

const authSvc = new AuthService();
export default authSvc;