import { Routes, Route } from "react-router-dom";
import Header from "./components/Header";
import LandingPage from "./pages/LandingPage";
import BillFeed from "./pages/BillFeed";
import BillDetails from "./pages/BillDetails";
import Profile from "./pages/Profile";

const App = () => {
  return (
    <div className="min-h-screen bg-slate-50 text-primary dark:bg-slate-900 dark:text-slate-100">
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-50 focus:inline-flex focus:items-center focus:rounded-full focus:bg-accent focus:px-5 focus:py-2 focus:text-slate-900"
      >
        Skip to content
      </a>
      <Header />
      <main id="main-content">
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/feed" element={<BillFeed />} />
          <Route path="/bill/:id" element={<BillDetails />} />
          <Route path="/profile" element={<Profile />} />
        </Routes>
      </main>
    </div>
  );
};

export default App;
