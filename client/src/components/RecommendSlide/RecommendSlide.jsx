import React from "react";
import { SwiperSlide } from "swiper/react";
import AutoSwiper from "../AutoSwiper/AutoSwiper.jsx";
import MediaItem from "../MediaItem/MediaItem.jsx";

// RECOMMEND SLIDE
const RecommendSlide = ({ medias, mediaType }) => {
  return (
    <AutoSwiper>
      {medias.map((media, index) => (
        <SwiperSlide key={index}>
          <MediaItem media={media} mediaType={mediaType} />
        </SwiperSlide>
      ))}
    </AutoSwiper>
  );
};

export default RecommendSlide