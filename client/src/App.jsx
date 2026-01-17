import { BrowserRouter, Routes, Route } from 'react-router-dom'
import React from 'react'
import "./stylesheets/App.css";
import { ThemeProvider } from '@mui/material/styles'
import { CssBaseline } from '@mui/material'
import { useSelector } from "react-redux"
import themeConfigs from './configs/theme.configs.js'
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Layout from "./components/Layout/Layout.jsx"
import PageWrapper from "./components/PageWrapper/PageWrapper.jsx"
import routes from './routes/routes.jsx'

const App = () => {
  const themeMode = useSelector((state) => state.themeMode.themeMode);

  return (
    <ThemeProvider theme={themeConfigs.custom({ mode: themeMode })}>

      <ToastContainer position="bottom-left"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        pauseOnFocusLoss
        pauseOnHover
        theme={themeMode} />

      <CssBaseline />

      <BrowserRouter future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
        <Routes>
          <Route path="/" element={<Layout />}>
            {routes.map((route, index) => (
              route.index ? (
                <Route
                  index
                  key={index}
                  element={route.state ? (
                    <PageWrapper state={route.state}>{route.element}</PageWrapper>
                  ) : route.element}
                />
              ) : (
                <Route
                  path={route.path}
                  key={index}
                  element={route.state ? (
                    <PageWrapper state={route.state}>{route.element}</PageWrapper>
                  ) : route.element}
                />
              )
            ))}
          </Route>
        </Routes>
      </BrowserRouter>
    </ThemeProvider>
  )
}

export default App