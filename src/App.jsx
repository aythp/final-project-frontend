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
import FeedPage from "./pages/FeedPage";
import DetailsPage from "./pages/DetailsPage";
import LikesPage from "./pages/LikesPage";
import ViewedPage from "./pages/ViewedPage";
import PendingPage from "./pages/PendingPage";
import NotFoundPage from "./pages/NotFoundPage";
import Footer from "./components/Footer";
import TopWeekMovie from "./pages/top-pages/TopWeekMovie";
import TopYearMovie from "./pages/top-pages/TopYearMovie";
import TopHistoryMovie from "./pages/top-pages/TopHistoryMovie";
import TopWeekSeries from "./pages/top-pages/TopWeekSeries";
import TopYearSeries from "./pages/top-pages/TopYearSeries";
import TopHistorySeries from "./pages/top-pages/TopHistorySeries";

export default function App() {
  return (
    <>
      <Navbar />
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/profile" element={<IsPrivate><ProfilePage /></IsPrivate>} />
        {/* <Route path="/settings" element={<IsPrivate><UserSettingsPage /></IsPrivate>} /> */}
        <Route path="/likes" element={<IsPrivate><LikesPage /></IsPrivate>} />
        <Route path="/viewed" element={<IsPrivate><ViewedPage /></IsPrivate>} />
        <Route path="/pending" element={<IsPrivate><PendingPage /></IsPrivate>} />

        <Route path="/movies/:id" element={<IsPrivate><DetailsPage /></IsPrivate>} />
        <Route path="/series/:id" element={<IsPrivate><DetailsPage /></IsPrivate>} />
        
        <Route path="/top-movies/week" element={<TopWeekMovie />} />
        <Route path="/top-movies/year" element={<TopYearMovie />} />
        <Route path="/top-movies/all" element={<TopHistoryMovie />} />
        <Route path="/top-series/week" element={<TopWeekSeries />} />
        <Route path="/top-series/year" element={<TopYearSeries />} />
        <Route path="/top-series/all" element={<TopHistorySeries />} />

        <Route path="/feed" element={<IsPrivate><FeedPage /></IsPrivate>} />
        <Route path="/signup" element={<IsAnon><SignupPage /></IsAnon>} />
        <Route path="/login" element={<IsAnon><LoginPage /></IsAnon>} />
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
      <Footer />
    </>
  );
}