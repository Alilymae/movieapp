import LogoutOutlinedIcon from "@mui/icons-material/LogoutOutlined";
import { ListItemButton, ListItemIcon, ListItemText, Menu, Typography } from "@mui/material";
import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { setUser } from "../../redux/features/userSlice";

// USER MENU
const UserMenu = () => {
  const { user } = useSelector((state) => state.user);
  const dispatch = useDispatch();

  const [anchorEl, setAnchorEl] = useState(null);

  const toggleMenu = (e) => setAnchorEl(e.currentTarget);

  return (
    <>
      {user && (
        <>
          <Typography
            variant="h6"
            sx={{ cursor: "pointer", userSelect: "none" }}
            onClick={toggleMenu}
          >
            {user.displayName}
          </Typography>

          <Menu
            open={Boolean(anchorEl)}
            anchorEl={anchorEl}
            onClose={() => setAnchorEl(null)}
            PaperProps={{ sx: { padding: 2 } }}
          >
            {/* HARDCODED USER MENU ITEMS */}
            <ListItemButton component={Link} to="/favorites" onClick={() => setAnchorEl(null)}>
              <ListItemText
                disableTypography
                primary={<Typography>Favorites</Typography>}
              />
            </ListItemButton>
            <ListItemButton component={Link} to="/reviews" onClick={() => setAnchorEl(null)}>
              <ListItemText
                disableTypography
                primary={<Typography>Reviews</Typography>}
              />
            </ListItemButton>
            <ListItemButton component={Link} to="/password-update" onClick={() => setAnchorEl(null)}>
              <ListItemText
                disableTypography
                primary={<Typography>Update Password</Typography>}
              />
            </ListItemButton>

            {/* SIGNING OUT FROM LIFE  :))) */}
            <ListItemButton sx={{ borderRadius: "10px" }} onClick={() => dispatch(setUser(null))}>
              <ListItemIcon>
                <LogoutOutlinedIcon />
              </ListItemIcon>
              <ListItemText
                disableTypography
                primary={<Typography>Sign Out</Typography>}
              />
            </ListItemButton>
          </Menu>
        </>
      )}
    </>
  );
};

export default UserMenu;