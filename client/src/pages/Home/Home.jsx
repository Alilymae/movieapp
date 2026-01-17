import React from 'react'
import { Box } from '@mui/material'

import UserMenu from "../../components/UserMenu/UserMenu.jsx"
import MainSlider from "../../components/MainSlider/MainSlider.jsx"
import MediaSlider from "../../components/MediaSlider/MediaSlider.jsx"
import Container from "../../components/Container/Container.jsx"
import tmdbConfigs from "../../api/configs/tmdb.configs.js"

const styles = {
  mainContent: {
    paddingX: { xs: 2, md: 4 },
    paddingY: 2
  }
}

// HOME
const Home = () => {
  return (
    <>
      <MainSlider
        mediaType={tmdbConfigs.mediaType.movie}
        mediaCategory={tmdbConfigs.mediaCategory.popular}
      />

      <Box marginTop="-4rem" sx={styles.mainContent}>
        <Container header="popular movies">
          <MediaSlider
            mediaType={tmdbConfigs.mediaType.movie}
            mediaCategory={tmdbConfigs.mediaCategory.popular}
          />
        </Container>

        <Container header="popular series">
          <MediaSlider
            mediaType={tmdbConfigs.mediaType.tv}
            mediaCategory={tmdbConfigs.mediaCategory.popular}
          />
        </Container>

        <Container header="top rated movies">
          <MediaSlider
            mediaType={tmdbConfigs.mediaType.movie}
            mediaCategory={tmdbConfigs.mediaCategory.top_rated}
          />
        </Container>

        <Container header="top rated series">
          <MediaSlider
            mediaType={tmdbConfigs.mediaType.tv}
            mediaCategory={tmdbConfigs.mediaCategory.top_rated}
          />
        </Container>
      </Box>
    </>
  )
}

export default Home
