import React from "react";
import { Box, Typography } from "@mui/material";
import { Link } from "react-router-dom";
import { Swiper, SwiperSlide } from "swiper/react";

import tmdbConfigs from "../../api/configs/tmdb.configs";
import { routesGen } from "../../routes/routes";
import "swiper/css";

// CAST SLIDER
const CastSlider = ({ casts = [] }) => {
  if (!casts.length) return null;

  return (
    <Box
      sx={{
        "& .swiper-slide": {
          width: { xs: "50%", md: "25%", lg: "20.5%" }
        }
      }}
    >
      <Swiper
        spaceBetween={10}
        slidesPerView="auto"
        grabCursor
        style={{ width: "100%", height: "max-content" }}
      >
        {casts.map((cast, index) => (
          <SwiperSlide key={index}>
            <Link to={routesGen.person(cast.id)}>
              <Box
                sx={{
                  position: "relative",
                  paddingTop: "120%",
                  borderRadius: "5px",
                  overflow: "hidden",
                  backgroundImage: `url(${tmdbConfigs.posterPath(
                    cast.profile_path
                  )})`,
                  backgroundSize: "cover",
                  backgroundPosition: "center"
                }}
              >
                {/* NAME OVERLAY */}
                <Box
                  sx={{
                    position: "absolute",
                    bottom: 0,
                    width: "100%",
                    padding: "8px",
                    backgroundColor: "rgba(0,0,0,0.6)"
                  }}
                >
                  <Typography
                    sx={{
                      color: "#fff",
                      fontSize: "0.9rem",
                      fontWeight: 500,
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                      whiteSpace: "nowrap"
                    }}
                  >
                    {cast.name}
                  </Typography>
                </Box>
              </Box>
            </Link>
          </SwiperSlide>
        ))}
      </Swiper>
    </Box>
  );
};

export default CastSlider;
