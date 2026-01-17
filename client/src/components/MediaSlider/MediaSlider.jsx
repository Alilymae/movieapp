import { useEffect, useState } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { toast } from "react-toastify";

import mediaApi from "../../api/modules/media.api";
import MediaItem from "../MediaItem/MediaItem.jsx";

// MEDIA SLIDER
const MediaSlider = ({ mediaType, mediaCategory }) => {
  const [medias, setMedias] = useState([]);

  // LOAD MEDIA LIST
  useEffect(() => {
    const getMedias = async () => {
      try {
        const data = await mediaApi.getList({ mediaType, mediaCategory, page: 1 });
        setMedias(data?.results || []);
      } catch (err) {
        toast.error(err.message || "Failed to load media");
      }
    };

    getMedias();
  }, [mediaType, mediaCategory]);

  return (
    <Swiper
      style={{ width: "100%" }}
      spaceBetween={16}
      slidesPerView={2}
      breakpoints={{
        640: { slidesPerView: 3 },
        768: { slidesPerView: 4 },
        1024: { slidesPerView: 6 }
      }}
    >
      {medias.map((media) => (
        <SwiperSlide key={media.id}>
          <MediaItem media={media} mediaType={mediaType} />
        </SwiperSlide>
      ))}
    </Swiper>
  );
};

export default MediaSlider;
