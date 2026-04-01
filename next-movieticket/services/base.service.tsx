import { axiosInstance, type SuccessResponse } from "@/config/axios.config";
import type { IConfigParams } from "@/services/service.contract";

abstract class BaseService {
  async getRequest(url: string, config: IConfigParams = {}): Promise<SuccessResponse> {
    return await axiosInstance.get(url, config);
  }

  async postRequest(url: string, data: any = null, config: IConfigParams = {}): Promise<SuccessResponse> {
    return await axiosInstance.post(url, data, config);
  }

  async putRequest(url: string, data: any = null, config: IConfigParams = {}): Promise<SuccessResponse> {
    return await axiosInstance.put(url, data, config);
  }

  async patchRequest(
    url: string,
    data: any = null,
    config: IConfigParams = {}
  ): Promise<SuccessResponse> {
    return await axiosInstance.patch(url, data, config);
  }

  async deleteRequest(url: string, config: IConfigParams = {}): Promise<SuccessResponse> {
    return await axiosInstance.delete(url, config);
  }
}

export default BaseService;
