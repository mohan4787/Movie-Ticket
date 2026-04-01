"use client";
import bannerService from "@/services/banner.service";
import { useEffect, useState } from "react";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import Slider from "react-slick";
import Image from "next/image";

export interface IBannerData {
  image?: string;
  link: string;
  status: string;
  title: string;
  _id: string;
}

const HomeBanner = () => {
  const [banners, setBanners] = useState<IBannerData[]>([]);

  const getBannerListForHome = async () => {
    try {
      const response = await bannerService.getRequest("/banner");
      setBanners(response.data || []);
    } catch (error) {
      console.log("Banner error:", error);
    }
  };

  useEffect(() => {
    getBannerListForHome();
  }, []);

  const settings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 3000,
  };

  return (
    <Slider {...settings}>
      {banners.map((banner, index) => (
        <div
          key={banner._id}
          className="w-full h-50 sm:h-75 md:h-10 lg:h-125 relative"
        >
          <Image
            src={banner.image?.replace("w_500", "w_2000") || "/fallback.jpg"}
            alt={banner.title || "banner"}
            fill
            className="object-cover"
            priority={index === 0}
          />
        </div>
      ))}
    </Slider>
  );
};

export default HomeBanner;