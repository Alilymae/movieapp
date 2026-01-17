import { Alert, Box, Button, CircularProgress, Stack, TextField } from "@mui/material";
import { useFormik } from "formik";
import { useState } from "react";
import { useDispatch } from "react-redux";
import { toast } from "react-toastify";
import * as Yup from "yup";
import userApi from "../../api/modules/user.api";
import { setAuthModalOpen } from "../../redux/features/authModalSlice";
import { setUser } from "../../redux/features/userSlice";

const SignupForm = ({ _switchAuthState }) => {
  const dispatch = useDispatch();

  const [isRequesting, setIsRequesting] = useState(false);
  const [errorMessage, setErrorMessage] = useState(null);

  // SIGNUP FORM VALIDATION
  const signupForm = useFormik({
    initialValues: {
      username: "",
      displayName: "",
      password: "",
      confirmPassword: ""
    },
    validationSchema: Yup.object({
      username: Yup.string()
        .min(8, "Username minimum 8 characters")
        .required("Username is required"),
      displayName: Yup.string()
        .min(4, "Display name minimum 4 characters")
        .required("Display name is required"),
      password: Yup.string()
        .min(8, "Password minimum 8 characters")
        .required("Password is required"),
      confirmPassword: Yup.string()
        .oneOf([Yup.ref("password")], "Passwords do not match")
        .required("Confirmation is required")
    }),
    onSubmit: async values => {
      setErrorMessage(null);
      setIsRequesting(true);

      try {
        const response = await userApi.signup({
          username: values.username,
          password: values.password,
          displayName: values.displayName
        });

        if (response && response.token) {
          localStorage.setItem("actkn", response.token);
        }

        signupForm.resetForm();
        dispatch(setUser(response));
        dispatch(setAuthModalOpen(false));
        toast.success("Sign up success!");
      } catch (err) {
        setErrorMessage(err.message || "Sign up failed");
      } finally {
        setIsRequesting(false);
      }
    }

  });

  return (
    <Box component="form" onSubmit={signupForm.handleSubmit}>
      <Stack spacing={3}>
        <TextField
          name="username"
          placeholder="Username"
          fullWidth
          value={signupForm.values.username}
          onChange={signupForm.handleChange}
          onBlur={signupForm.handleBlur}
          error={signupForm.touched.username && Boolean(signupForm.errors.username)}
          helperText={signupForm.touched.username && signupForm.errors.username}
        />

        <TextField
          name="displayName"
          placeholder="Display Name"
          fullWidth
          value={signupForm.values.displayName}
          onChange={signupForm.handleChange}
          onBlur={signupForm.handleBlur}
          error={
            signupForm.touched.displayName &&
            Boolean(signupForm.errors.displayName)
          }
          helperText={
            signupForm.touched.displayName && signupForm.errors.displayName
          }
        />

        <TextField
          type="password"
          name="password"
          placeholder="Password"
          fullWidth
          value={signupForm.values.password}
          onChange={signupForm.handleChange}
          onBlur={signupForm.handleBlur}
          error={signupForm.touched.password && Boolean(signupForm.errors.password)}
          helperText={signupForm.touched.password && signupForm.errors.password}
        />

        <TextField
          type="password"
          name="confirmPassword"
          placeholder="Confirm Password"
          fullWidth
          value={signupForm.values.confirmPassword}
          onChange={signupForm.handleChange}
          onBlur={signupForm.handleBlur}
          error={
            signupForm.touched.confirmPassword &&
            Boolean(signupForm.errors.confirmPassword)
          }
          helperText={
            signupForm.touched.confirmPassword &&
            signupForm.errors.confirmPassword
          }
        />
      </Stack>

      <Button
        type="submit"
        fullWidth
        size="large"
        variant="contained"
        sx={{ mt: 4 }}
        disabled={isRequesting}
        startIcon={isRequesting ? <CircularProgress size={20} color="inherit" /> : null}
      >
        Sign Up
      </Button>

      {errorMessage && (
        <Box sx={{ mt: 2 }}>
          <Alert severity="error" variant="outlined">
            {errorMessage}
          </Alert>
        </Box>
      )}
    </Box>
  );
};

export default SignupForm;
// DO THE SIGIN ONE TOMO