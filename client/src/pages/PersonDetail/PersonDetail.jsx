import { Box, Toolbar, Typography, Stack } from "@mui/material";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useDispatch } from "react-redux";
import { toast } from "react-toastify";

import PersonMediaGrid from "../../components/PersonMediaGrid/PersonMediaGrid.jsx";
import personApi from "../../api/modules/person.api.js";
import tmdbConfigs from "../../api/configs/tmdb.configs.js";
import { setGlobalLoading } from "../../redux/features/globalLoadingSlice.js";

// PERSON DETAIL
const PersonDetail = () => {
  const { personId } = useParams();
  const dispatch = useDispatch();
  const [person, setPerson] = useState(null);

  useEffect(() => {
    const getPerson = async () => {
      dispatch(setGlobalLoading(true));

      const { response, err } = await personApi.detail({ personId });

      dispatch(setGlobalLoading(false));

      if (err) toast.error(err.message);
      if (response) setPerson(response);
    };

    getPerson();
  }, [personId, dispatch]);

  if (!person) return null;

  return (
    <>
      <Toolbar />

      <Box
        sx={{
          padding: { xs: "1rem", md: "2rem" },
          maxWidth: "1400px",
          margin: "0 auto"
        }}
      >
        {/* Person Info */}
        <Box
          sx={{
            display: "flex",
            flexDirection: { xs: "column", md: "row" },
            gap: 3
          }}
        >
          {/* Profile Image */}
          <Box
            sx={{
              width: { xs: "60%", md: "20%" },
              margin: { xs: "0 auto", md: "0" }
            }}
          >
            <Box
              sx={{
                paddingTop: "150%",
                backgroundImage: `url(${tmdbConfigs.posterPath(
                  person.profile_path
                )})`,
                backgroundSize: "cover",
                backgroundPosition: "center",
                borderRadius: "12px",
                backgroundColor: "grey.800"
              }}
            />
          </Box>

          {/* Person Details */}
          <Box
            sx={{
              width: { xs: "100%", md: "80%" }
            }}
          >
            <Stack spacing={2}>
              <Typography variant="h5" fontWeight="700">
                {person.name}
                {person.birthday && (
                  <> ({person.birthday.split("-")[0]}</>
                )}
                {person.deathday && (
                  <> - {person.deathday.split("-")[0]}</>
                )}
                {person.birthday && ")"}
              </Typography>

              <Typography
                sx={{
                  opacity: 0.8,
                  lineHeight: 1.6,
                  display: "-webkit-box",
                  WebkitLineClamp: 10,
                  WebkitBoxOrient: "vertical",
                  overflow: "hidden"
                }}
              >
                {person.biography || "No biography available."}
              </Typography>
            </Stack>
          </Box>
        </Box>

        {/* Person Medias */}
        <Box sx={{ marginTop: "3rem" }}>
          <Typography
            variant="h6"
            fontWeight="700"
            sx={{ marginBottom: "1rem" }}
          >
            Medias
          </Typography>

          <PersonMediaGrid personId={personId} />
        </Box>
      </Box>
    </>
  );
};

export default PersonDetail;
