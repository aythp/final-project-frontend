import "./App.css";
import { Routes, Route } from "react-router-dom";

import HomePage from "./pages/HomePage";
import ProfilePage from "./pages/ProfilePage";
import SignupPage from "./pages/SignupPage";
import LoginPage from "./pages/LoginPage";
import Navbar from "./components/Navbar";
import IsPrivate from "./components/IsPrivate/IsPrivate";
import IsAnon from "./components/IsAnon/IsAnon";
import UserSettingsPage from "./pages/UserSettingsPage";

export default function App() {
  return (
    <>

      <Navbar />

      <Routes>
        <Route path="/" element={<HomePage />} />

        <Route
          path="/profile"
          element={
            <IsPrivate> {/* cambiar a isPrivate de nuevo!!!!!!!!!!!!!!!!!!! */}
              <ProfilePage />
            </IsPrivate>
          }
        />
        <Route path="/settings" element={
          <IsPrivate>
            <UserSettingsPage/>
            </IsPrivate>}/>

            <Route path="/likes" element={
          <IsPrivate>
            <UserSettingsPage/>
            </IsPrivate>}/>   

            <Route path="/viewed" element={
          <IsPrivate>
            <UserSettingsPage/>
            </IsPrivate>}/>

            <Route path="/pending" element={
          <IsPrivate>
            <UserSettingsPage/>
            </IsPrivate>}/>

        <Route
          path="/signup"
          element={
            <IsAnon>
              <SignupPage />
            </IsAnon>
          }
        />
        <Route
          path="/login"
          element={
            <IsAnon>
              <LoginPage />
            </IsAnon>
          }
        />
      </Routes>
    </>
  );
}
