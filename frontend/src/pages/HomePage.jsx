import Hero from '../components/home/Hero';
import HowItWorks from '../components/home/HowItWorks';
import ClientProof from '../components/home/ClientProof';
import TrustBadges from '../components/home/TrustBadges';
import PanelShowcase from '../components/home/PanelShowcase';
import ChiSiamo from '../components/home/ChiSiamo';
import FAQ from '../components/home/FAQ';

export default function HomePage() {
  return (
    <main>
      <Hero />
      <HowItWorks />
      <ClientProof />
      <TrustBadges />
      <PanelShowcase />
      <ChiSiamo />
      <FAQ />
    </main>
  );
}
