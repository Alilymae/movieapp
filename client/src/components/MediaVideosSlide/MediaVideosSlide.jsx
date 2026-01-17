import { Box } from "@mui/material";
import { useEffect, useRef } from "react";
import { SwiperSlide } from "swiper/react";
import tmdbConfigs from "../../api/configs/tmdb.configs";
import NavigationSwiper from "../NavigationSwiper/NavigationSwiper.jsx";

// MEDIA VIDEO
const MediaVideo = ({ video }) => {
    const iframeRef = useRef(null);

    useEffect(() => {
        if (!iframeRef.current) return;

        const height = (iframeRef.current.offsetWidth * 9) / 16 + "px";
        iframeRef.current.setAttribute("height", height);
    }, [video]);

    return (
        <Box sx={{ height: "max-content" }}>
            <iframe
                ref={iframeRef}
                src={tmdbConfigs.youtubePath(video.key)}
                width="100%"
                title={video.id}
                style={{ border: 0 }}
                allow="fullscreen"
            />
        </Box>
    );
};

const MediaVideosSlide = ({ videos = [] }) => {
    return (
        <NavigationSwiper>
            {videos.map((video, index) => (
                <SwiperSlide key={index}>
                    <MediaVideo video={video} />
                </SwiperSlide>
            ))}
        </NavigationSwiper>
    );
};

export default MediaVideosSlide;