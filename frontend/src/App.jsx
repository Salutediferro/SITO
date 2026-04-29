import { Routes, Route, useLocation } from 'react-router-dom';
import { useEffect } from 'react';
import Navbar from './components/layout/Navbar';
import Footer from './components/layout/Footer';
import ScrollProgress from './components/ui/ScrollProgress';
import HomePage from './pages/HomePage';
import PannelliPage from './pages/PannelliPage';
import ChiSiamoPage from './pages/ChiSiamoPage';
import MembershipPage from './pages/MembershipPage';
import PrivacyPage from './pages/PrivacyPage';
import TestPage from './pages/TestPage';
import PaymentSuccessPage from './pages/PaymentSuccessPage';
import ComingSoonPage from './pages/ComingSoonPage';
import useFerroHighlight from './hooks/useFerroHighlight';

function ScrollToTop() {
  const { pathname } = useLocation();
  useEffect(() => { window.scrollTo(0, 0); }, [pathname]);
  return null;
}

export default function App() {
  const { pathname } = useLocation();
  const isTest = pathname === '/test';

  // Highlight runtime: wrappa "ferro" in rosso accent SOLO sui testi bianchi
  useFerroHighlight();

  return (
    <>
      <ScrollToTop />
      {!isTest && <ScrollProgress />}
      {!isTest && <Navbar />}
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/pannelli" element={<PannelliPage />} />
        <Route path="/chi-siamo" element={<ChiSiamoPage />} />
        <Route path="/membership" element={<MembershipPage />} />
        <Route path="/privacy" element={<PrivacyPage />} />
        <Route path="/test" element={<TestPage />} />
        <Route path="/payment-success" element={<PaymentSuccessPage />} />
        <Route path="/coming-soon" element={<ComingSoonPage />} />
      </Routes>
      {!isTest && <Footer />}
    </>
  );
}
