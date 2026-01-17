import { createTheme } from "@mui/material/styles";
import { colors } from "@mui/material";

// BUTI PA LIFE MAY THEME
export const themeModes = {
  dark: "dark",
  light: "light",
};

const lightPalette = {
  primary: {
    main: "#c1121f",
    contrastText: "#ffffff",
  },
  secondary: {
    main: "#e5383b",
    contrastText: "#ffffff",
  },
  background: {
    default: colors.grey["100"],
    paper: "#f5f3f4",
  },
  text: {
    primary: "#000000",
  },
};

// DARK MODE
const darkPalette = {
  primary: {
    main: "#c1121f",
    contrastText: "#ffffff",
  },
  secondary: {
    main: "#e5383b",
    contrastText: "#ffffff",
  },
  background: {
    default: "#000000",
    paper: "#1a1a1a",
  },
  text: {
    primary: "#ffffff",
  },
};

// THEME CONFIGURATIONS
const themeConfigs = {
  custom: ({ mode }) => {
    const palette = mode === themeModes.dark ? darkPalette : lightPalette;

    return createTheme({
      palette: {
        mode,
        ...palette,
      },
      components: {
        MuiButton: {
          defaultProps: { disableElevation: true },
        },
      },
    });
  },
  palettes: {
    light: lightPalette,
    dark: darkPalette,
  },
};

export default themeConfigs;