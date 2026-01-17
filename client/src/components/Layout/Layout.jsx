import React, { useEffect } from "react";
import { Box } from "@mui/material";
import { Outlet } from "react-router-dom";
import Footer from "../Footer/Footer.jsx";
import GlobalLoading from "../GlobalLoading/GlobalLoading.jsx";
import Navbar from "../Navbar/Navbar.jsx";
import AuthModal from "../AuthModal/AuthModal.jsx";

// LAYOUT
// APIs
import userApi from "../../api/modules/user.api";
import favoriteApi from "../../api/modules/favorite.api"; 

// REDUX
import { useDispatch, useSelector } from "react-redux";
import { setUser, setListFavorites } from "../../redux/features/userSlice"; 
// NOTIFICATIONS
import { toast } from "react-toastify"; 

const Layout = () => {
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.user);

  // CHECK USER AUTH ON PAGE LOAD 
  useEffect(() => {
    const authUser = async () => {
      const token = localStorage.getItem("actkn");

      if (!token) {
        dispatch(setUser(null));
        return;
      }

      try {
        const response = await userApi.getInfo();
        dispatch(setUser(response));
      } catch (_err) {
        dispatch(setUser(null));
      }
    };

    authUser();
  }, [dispatch]);

  // FETCH USER FAVORITES 
  useEffect(() => {
    const getFavorites = async () => {
      try {
        const response = await favoriteApi.getList();
        dispatch(setListFavorites(response));
      } catch (err) {
        toast.error(err.message || "Failed to load favorites");
      }
    };

    if (user) getFavorites();         
    if (!user) dispatch(setListFavorites([]));  
  }, [user, dispatch]);

  return (
    <>
      {/* LOADING */}
      <GlobalLoading />

      {/* LOGIN M */}
      <AuthModal />

      <Box display="flex" minHeight="100vh">
        {/* NAVBAR */}
        <Navbar />

        {/* MAIN */}
        <Box component="main" flexGrow={1} overflow="hidden" minHeight="100vh">
          <Outlet />
        </Box>
      </Box>

      {/* FOOTER */}
      <Footer />
    </>
  );
};

export default Layout;
