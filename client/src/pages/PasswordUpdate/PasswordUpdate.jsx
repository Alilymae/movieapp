import { Box, Stack, TextField, Button } from "@mui/material";
import { useFormik } from "formik";
import * as Yup from "yup";
import { useState } from "react";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";

import Container from "../../components/Container/Container.jsx";
import userApi from "../../api/modules/user.api";
import { setUser } from "../../redux/features/userSlice";
import { setAuthModalOpen } from "../../redux/features/authModalSlice";
import { setGlobalLoading } from "../../redux/features/globalLoadingSlice.js";

// PASSWORD UPDATE
/* =========================
   Password Update Component
========================= */
const PasswordUpdate = () => {
  const [onRequest, setOnRequest] = useState(false);

  const navigate = useNavigate();
  const dispatch = useDispatch();

  /* Formik configuration */
  const form = useFormik({
    initialValues: {
      password: "",
      newPassword: "",
      confirmNewPassword: ""
    },
    validationSchema: Yup.object({
      password: Yup.string()
        .min(8, "Password minimum 8 characters")
        .required("Password is required"),
      newPassword: Yup.string()
        .min(8, "New password minimum 8 characters")
        .required("New password is required"),
      confirmNewPassword: Yup.string()
        .oneOf([Yup.ref("newPassword")], "Passwords do not match")
        .required("Confirm password is required")
    }),
    onSubmit: values => onUpdate(values)
  });

  /* Submit handler */
  const onUpdate = async (values) => {
    if (onRequest) return;

    setOnRequest(true);
    dispatch(setGlobalLoading(true));

    try {
      await userApi.passwordUpdate(values);

      /* --- success flow --- */
      form.resetForm();
      dispatch(setUser(null));
      dispatch(setAuthModalOpen(true));
      navigate("/");
      toast.success("Password updated! Please re-login");
    } catch (err) {
      toast.error(err?.message || "Failed to update password");
    } finally {
      setOnRequest(false);
      dispatch(setGlobalLoading(false));
    }
  };

  return (
    <Box
      sx={{
        display: "grid",
        placeItems: "center",
        minHeight: "100vh",
        padding: 2
      }}
    >
      <Box
        sx={{
          width: "100%",
          maxWidth: "600px",
          paddingX: 4,
          paddingY: 2,
          borderRadius: 1,
          boxShadow: "0 8px 32px rgba(0, 0, 0, 0.12), 0 2px 8px rgba(0, 0, 0, 0.08)",
          backgroundColor: "background.paper",
          border: "1px solid #1A1A1A",
          backdropFilter: "blur(10px)"
        }}
      >
        <Container header="Update Password">
          <Box sx={{ marginTop: "-5rem" }}>
            <Box
              component="form"
              onSubmit={form.handleSubmit}
              sx={{
                width: "100%",
                display: "flex",
                justifyContent: "center"
              }}
            >
              <Stack
                spacing={2.5}
                sx={{
                  alignItems: "center",
                  width: "100%",
                  maxWidth: 450
                }}
              >
              {/* --- current password --- */}
              <TextField
                type="password"
                placeholder="Current password"
                name="password"
                fullWidth
                value={form.values.password}
                onChange={form.handleChange}
                error={Boolean(form.touched.password && form.errors.password)}
                helperText={form.touched.password && form.errors.password}
                sx={{
                  "& .MuiInputBase-input": { padding: "16px" }
                }}
              />

              {/* --- new password --- */}
              <TextField
                type="password"
                placeholder="New password"
                name="newPassword"
                fullWidth
                value={form.values.newPassword}
                onChange={form.handleChange}
                error={Boolean(form.touched.newPassword && form.errors.newPassword)}
                helperText={form.touched.newPassword && form.errors.newPassword}
              />

              {/* --- confirm new password --- */}
              <TextField
                type="password"
                placeholder="Confirm new password"
                name="confirmNewPassword"
                fullWidth
                value={form.values.confirmNewPassword}
                onChange={form.handleChange}
                error={Boolean(
                  form.touched.confirmNewPassword && form.errors.confirmNewPassword
                )}
                helperText={
                  form.touched.confirmNewPassword && form.errors.confirmNewPassword
                }
              />

              {/* --- submit button --- */}
              <Button
                type="submit"
                variant="contained"
                fullWidth
                disabled={onRequest}
                sx={{ marginTop: 3 }}
              >
                {onRequest ? "Updating..." : "Update Password"}
              </Button>
            </Stack>
            </Box>
          </Box>
        </Container>
      </Box>
    </Box>
  );
};

export default PasswordUpdate;
