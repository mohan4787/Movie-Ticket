
import {  Status } from "../../config/constants";
import * as Yup from "yup";

import { toast } from "sonner";
import bannerService from "../../services/banner.service";

import { useNavigate, useParams } from "react-router";
import type { IBannerCreateData } from "./BannerCreatePage";
import { useEffect, useState } from "react";
import { Spin } from "antd";
import BannerForm from "../../components/banner/BannerForm";
import type { IBannerData } from "./BannerListPage";
//import { useForm } from "react-hook-form";

const BannerEditDTO = Yup.object({
  title: Yup.string().min(3).max(100).required(),
  status: Yup.string()
    .matches(/^(active|inactive)$/)
    .default(Status.INACTIVE),
  link: Yup.string().nullable().optional(),
  image: Yup.mixed().nullable().optional(),
});

const BannerEditPage = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState<boolean>(true);
  const params = useParams();
  const [bannerDetail, setBannerDetail] = useState<IBannerData>();
 // const { setError } = useForm();
 
  const submitForm = async (data: IBannerCreateData) => {
    try {
       await bannerService.putRequest(`/banner/${params.id}`, data, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });

      toast.success("Congratulation", {
        description: "Banner updated Successfully",
      });
      navigate("/admin/banner");
    } catch (exception: any) {
      // if (exception.error) {
      //   Object.keys(exception.error).map((field) => {
      //     setError(field as keyof IBannerCreateData, {
      //       message: exception.error[field],
      //     });
      //   });
      // }
      toast.error("Sorry! cannot updated banner at this moment", {
        description:
          "Seems there are some issues while submitting form. Please try again.",
      });
    }
  };
  const getBannerDetail = async () => {
    try {
      const response = await bannerService.getRequest(`/banner/${params.id}`);
      setBannerDetail(response.data)
    } catch {
      toast.error("Error!!!", {
        description: "Error while fetching banner data...",
      });
      navigate("/admin/banner");
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    getBannerDetail();
  }, []);
  return (
    <>
      <div className="flex flex-col gap-5">
        <div className="flex justify-between border-b border-b-gray-400 pb-3">
          <h1 className="text-4xl font-semibold text-teal-900">Banner Edit</h1>
        </div>
        <div className="flex ">
          {loading ? (
              <div className="flex h-96 w-full justify-center items-center">
                <Spin />
              </div>
            ) : (
              <BannerForm 
              submitForm={submitForm}
              DTO={BannerEditDTO}
              bannerDetail={bannerDetail}
              />
            )}
        </div>
      </div>
    </>
  );
};

export default BannerEditPage;
