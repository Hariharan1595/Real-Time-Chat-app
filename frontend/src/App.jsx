import { Navigate, Route, Routes } from "react-router-dom";
import Navbar from "./components/Navbar";
import Signup from "./pages/Signup";
import Signin from "./pages/Signin";
import Home from "./pages/Home";
import Profile from "./pages/Profile";
import Settings from "./pages/Settings";
import { useAuthStore } from "./store/useAuthStore";
import { useEffect } from "react";
import Loader from "./components/Loader";
import { Toaster } from "react-hot-toast";
import { useThemeStore } from "./store/useThemeStore";

const App = () => {
  const { checkAuth, authUser, isCheckingAuth,onlineUsers } = useAuthStore();
  const {theme} = useThemeStore();

  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  if (isCheckingAuth && !authUser)
    return (
      <div className="flex justify-center items-center h-screen">
        <Loader />
      </div>
    );

  console.log(authUser); 
  console.log(onlineUsers)

  return (
    <div data-theme={theme} >
      <Navbar />
      <Routes>
        <Route
          path="/"
          element={authUser ? <Home /> : <Navigate to={"/sign-in"} />}
        />
        <Route
          path="/profile"
          element={authUser ? <Profile /> : <Navigate to={"/sign-in"} />}
        />
        <Route path="/settings" element={<Settings />} />
        <Route
          path="/sign-up"
          element={!authUser ? <Signup /> : <Navigate to={"/"} />}
        />
        <Route
          path="/sign-in"
          element={!authUser ? <Signin /> : <Navigate to={"/"} />}
        />
      </Routes>
      <Toaster/>
    </div>
  );
};

export default App;
