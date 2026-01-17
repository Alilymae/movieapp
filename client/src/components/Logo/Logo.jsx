import { Typography, useTheme } from '@mui/material'
import React from 'react'

// THIS IS SERIOUSLY SELF EXPLANATORY . COME ON ITS THE LOGO
const Logo = () => {
  const theme = useTheme()
  return (
    <Typography sx={{ fontWeight: 500, fontSize: "2.5rem", textAlign: "center", paddingBottom: "1.5rem" }}>
      <span style={{ color: theme.palette.primary.main, fontFamily: "Bebas Neue, sans-serif" }}>IMAGIX</span>
    </Typography>
  )
}

export default Logo