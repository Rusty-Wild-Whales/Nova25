import { Routes, Route } from "react-router-dom";
import Header from "./components/Header";
import LandingPage from "./pages/LandingPage";
import BillFeed from "./pages/BillFeed";
import BillDetails from "./pages/BillDetails";
import Profile from "./pages/Profile";

const App = () => {
  return (
    <div className="min-h-screen bg-slate-50 text-primary dark:bg-slate-900 dark:text-slate-100">
      <Header />
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/feed" element={<BillFeed />} />
        <Route path="/bill/:id" element={<BillDetails />} />
        <Route path="/profile" element={<Profile />} />
      </Routes>
    </div>
  );
};

export default App;
