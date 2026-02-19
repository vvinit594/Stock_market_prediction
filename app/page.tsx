import { HeroSection } from "@/components/landing/HeroSection";
import { TrustStrip } from "@/components/landing/TrustStrip";
import { FeaturesSection } from "@/components/landing/FeaturesSection";
import { HowItWorksSection } from "@/components/landing/HowItWorksSection";
import { LivePreviewSection } from "@/components/landing/LivePreviewSection";
import { CTASection } from "@/components/landing/CTASection";
import { Footer } from "@/components/landing/Footer";

export default function Home() {
  return (
    <div className="min-h-screen bg-background">
      <HeroSection />
      <TrustStrip />
      <FeaturesSection />
      <HowItWorksSection />
      <LivePreviewSection />
      <CTASection />
      <Footer />
    </div>
  );
}
