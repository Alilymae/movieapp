import { Box, Modal, Button } from "@mui/material";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setAuthModalOpen } from "../../redux/features/authModalSlice";
import Logo from "../Logo/Logo.jsx"
import SigninForm from "../SigninForm/SigninForm.jsx";
import SignupForm from "../SignupForm/SignupForm.jsx";

// AUTH MODAL
const actionState = {
  signin: "signin",
  signup: "signup",
};

const AuthModal = () => {
  const { authModalOpen } = useSelector((state) => state.authModal);
  const dispatch = useDispatch();
  const [action, setAction] = useState(actionState.signin);

  useEffect(() => {
    if (authModalOpen) setAction(actionState.signin);
  }, [authModalOpen]);

  const handleClose = () => dispatch(setAuthModalOpen(false));
  const switchAuthState = (state) => setAction(state);

  const switchButtonStyle = {
    marginTop: 1,
    textTransform: "none",
    fontSize: "0.95rem",
    color: "#fff",
    position: "relative",
    "&:hover": {
      opacity: 0.8,
      backgroundColor: "transparent",
    },
    "&::after": {
      content: '""',
      position: "absolute",
      bottom: 2,
      left: 0,
      width: "0%",
      height: "1px",
      backgroundColor: "primary.main",
      transition: "width 0.3s ease",
      borderRadius: "2px"
    },
    "&:hover::after": {
      width: "100%",
    }
  };

  return (
    <Modal open={authModalOpen} onClose={handleClose}>
      <Box
        sx={{
          position: "absolute",
          top: "55%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          width: "100%",
          maxWidth: "600px",
          padding: 4,
          outline: "none",
        }}
      >
        <Box sx={{
          padding: 4,
          borderRadius: 1,
          boxShadow: "0 8px 32px rgba(0, 0, 0, 0.12), 0 2px 8px rgba(0, 0, 0, 0.08)",
          backgroundColor: "background.paper",
          border: "1px solid #1A1A1A",
          backdropFilter: "blur(10px)"
        }}>
          <Logo />

          {action === actionState.signin && (
            <Box sx={{ textAlign: "center" }}>
              <SigninForm switchAuthState={switchAuthState} />
              <Button sx={switchButtonStyle} onClick={() => switchAuthState(actionState.signup)}>
                Don't have an account? Sign up 
              </Button>
            </Box>
          )}

          {action === actionState.signup && (
            <Box sx={{ textAlign: "center" }}>
              <SignupForm switchAuthState={switchAuthState} />
              <Button sx={switchButtonStyle} onClick={() => switchAuthState(actionState.signin)}>
                Already have an account? Sign in
              </Button>
            </Box>
          )}
        </Box>
      </Box>
    </Modal>
  );
};

export default AuthModal;
