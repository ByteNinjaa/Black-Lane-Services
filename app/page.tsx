import { SiteNav } from "@/components/SiteNav";
import { Hero } from "@/components/Hero";
import { Fleet } from "@/components/Fleet";
import { Occasions } from "@/components/Occasions";
import { Chauffeur } from "@/components/Chauffeur";
import { Faq } from "@/components/Faq";
import { Reserve } from "@/components/Reserve";
import { Footer } from "@/components/Footer";

export default function Home() {
  return (
    <>
      <a href="#main" className="skip">
        Skip to content
      </a>
      <div id="top" />
      <div id="top-sentinel" aria-hidden="true" className="pointer-events-none absolute left-0 top-0 h-24 w-px" />
      <SiteNav />
      <main id="main">
        <Hero />
        <Fleet />
        <Occasions />
        <Chauffeur />
        <Faq />
        <Reserve />
      </main>
      <Footer />
    </>
  );
}
