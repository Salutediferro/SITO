import { Routes, Route, useLocation } from 'react-router-dom';
import { useEffect } from 'react';
import Navbar from './components/layout/Navbar';
import Footer from './components/layout/Footer';
import HomePage from './pages/HomePage';
import PannelliPage from './pages/PannelliPage';
import ChiSiamoPage from './pages/ChiSiamoPage';
import MembershipPage from './pages/MembershipPage';
import PrivacyPage from './pages/PrivacyPage';
import TestPage from './pages/TestPage';

function ScrollToTop() {
  const { pathname } = useLocation();
  useEffect(() => { window.scrollTo(0, 0); }, [pathname]);
  return null;
}

export default function App() {
  const { pathname } = useLocation();
  const isTest = pathname === '/test';

  return (
    <>
      <ScrollToTop />
      {!isTest && <Navbar />}
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/pannelli" element={<PannelliPage />} />
        <Route path="/chi-siamo" element={<ChiSiamoPage />} />
        <Route path="/membership" element={<MembershipPage />} />
        <Route path="/privacy" element={<PrivacyPage />} />
        <Route path="/test" element={<TestPage />} />
      </Routes>
      {!isTest && <Footer />}
    </>
  );
}
