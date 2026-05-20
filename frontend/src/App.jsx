import { Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { useEffect } from 'react';
import Navbar from './components/layout/Navbar';
import Footer from './components/layout/Footer';
import SkipLink from './components/layout/SkipLink';
import RouteHelmet from './components/layout/RouteHelmet';
import StickyCTA from './components/layout/StickyCTA';
import CookieBanner from './components/cookie/CookieBanner';
import ScrollProgress from './components/ui/ScrollProgress';
import HomePage from './pages/HomePage';
import PannelliPage from './pages/PannelliPage';
import ChiSiamoPage from './pages/ChiSiamoPage';
import MembershipPage from './pages/MembershipPage';
import PrivacyPage from './pages/PrivacyPage';
import ConsensoInformatoPage from './pages/ConsensoInformatoPage';
import TestPage from './pages/TestPage';
import PaymentSuccessPage from './pages/PaymentSuccessPage';
import ComingSoonPage from './pages/ComingSoonPage';
import DashboardPreviewPage from './pages/DashboardPreviewPage';
import useFerroHighlight from './hooks/useFerroHighlight';

// AgenteTestPage NON registrata pubblicamente (rischio costi Anthropic API).
// Per riabilitare in dev, aggiungere protezione (env flag VITE_ENABLE_AGENTE_TEST + check token).
// Vedi automation/email-templates/README.md per Agente di Ferro modulo locale (DASHBOARD repo).

function ScrollToTop() {
  const { pathname } = useLocation();
  useEffect(() => { window.scrollTo(0, 0); }, [pathname]);
  return null;
}

export default function App() {
  const { pathname } = useLocation();
  const isTest = pathname === '/test';
  const hideChrome = isTest;

  // Highlight runtime: wrappa "ferro" in rosso accent SOLO sui testi bianchi
  useFerroHighlight();

  return (
    <>
      <SkipLink />
      <RouteHelmet />
      <ScrollToTop />
      {!hideChrome && <ScrollProgress />}
      {!hideChrome && <Navbar />}
      <main id="main-content" tabIndex={-1}>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/pannelli" element={<PannelliPage />} />
          <Route path="/chi-siamo" element={<ChiSiamoPage />} />
          <Route path="/membership" element={<MembershipPage />} />
          <Route path="/privacy" element={<PrivacyPage />} />
          <Route path="/consenso-informato" element={<ConsensoInformatoPage />} />
          <Route path="/test" element={<TestPage />} />
          <Route path="/payment-success" element={<PaymentSuccessPage />} />
          <Route path="/coming-soon" element={<ComingSoonPage />} />
          <Route path="/dashboard-preview" element={<DashboardPreviewPage />} />
          {/* /agente-test disabilitata pubblicamente · 7 mag 2026 */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </main>
      {!hideChrome && <Footer />}
      {!hideChrome && <StickyCTA />}
      <CookieBanner />
    </>
  );
}
